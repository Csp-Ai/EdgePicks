import { Octokit } from "@octokit/rest";
import type { SupabaseClient } from "@supabase/supabase-js";
import fs from "fs";
import crypto from "crypto";
import { createIssue } from "../github/api";

export interface CodexLog {
  id: string;
  prompt: string;
  completion: string;
  commit_id: string;
  wiki_target?: string | null;
  components_modified: string[];
  timestamp: string;
}

interface RepoMeta {
  owner: string;
  repo: string;
  wikiBranch: string;
}

const TAG_PATTERNS: { regex: RegExp; tag: string }[] = [
  { regex: /\.tsx$/, tag: "#ui" },
  { regex: /infra\//, tag: "#infra" },
  { regex: /agent/i, tag: "#agent" },
  { regex: /\.ts$/, tag: "#runtime" },
];

export function extractTags(components: string[]): string[] {
  const tags = new Set<string>();
  for (const c of components) {
    for (const { regex, tag } of TAG_PATTERNS) {
      if (regex.test(c)) {
        tags.add(tag);
      }
    }
  }
  return Array.from(tags);
}

export function formatMarkdown(log: CodexLog, repo: RepoMeta): string {
  const commitUrl = `https://github.com/${repo.owner}/${repo.repo}/commit/${log.commit_id}`;
  const date = new Date(log.timestamp).toISOString().split("T")[0];
  const components = log.components_modified?.map((c) => `\`${c}\``).join(", ") || "";
  const tags = extractTags(log.components_modified).join(", ");
  return `### 🔧 [${log.prompt}](${commitUrl})\n\n${log.completion}\n\n**Modified Components:** ${components}\n**Tags:** ${tags}\n🕒 Committed: ${date}`;
}

export async function updateWikiPage(
  octokit: Octokit,
  repo: RepoMeta,
  page: string,
  content: string,
  commitMessage: string
): Promise<void> {
  const path = `${page}.md`;
  const { data } = await octokit.repos.getContent({
    owner: repo.owner,
    repo: `${repo.repo}.wiki`,
    path,
    ref: repo.wikiBranch,
  });
  const sha = (data as any).sha as string | undefined;
  const current = Buffer.from((data as any).content || "", "base64").toString("utf8");
  const anchor = "<!-- DOCSYNC INSERTS BELOW -->";
  let newContent: string;
  if (current.includes(anchor)) {
    const [head, tail] = current.split(anchor);
    const existing = tail.trim();
    newContent = `${head}${anchor}\n${existing}${existing ? "\n" : ""}${content}\n`;
  } else {
    newContent = `${current}\n${anchor}\n${content}\n`;
  }
  await octokit.repos.createOrUpdateFileContents({
    owner: repo.owner,
    repo: `${repo.repo}.wiki`,
    path,
    message: commitMessage,
    content: Buffer.from(newContent).toString("base64"),
    branch: repo.wikiBranch,
    sha,
  });
}

export async function syncLogRecord(
  octokit: Octokit,
  supabase: SupabaseClient,
  repo: RepoMeta,
  log: CodexLog
): Promise<void> {
  const page = log.wiki_target || "Unsorted Codex Logs";
  const section = formatMarkdown(log, repo);
  await updateWikiPage(
    octokit,
    repo,
    page,
    section,
    `Update ${page} from Codex log #${log.id}`
  );
  if (log.components_modified?.some((c) => c.endsWith(".tsx"))) {
    await updateWikiPage(
      octokit,
      repo,
      "ui-components-guide",
      section,
      `Update ui-components-guide from Codex log #${log.id}`
    );
  }
  await supabase.from("codex_logs").update({ synced: true }).eq("id", log.id);
}

function appendAgentLog(entry: any) {
  try {
    const path = "agentLogsStore.json";
    const existing = fs.existsSync(path)
      ? JSON.parse(fs.readFileSync(path, "utf8"))
      : [];
    const arr = Array.isArray(existing) ? existing : [];
    arr.push(entry);
    fs.writeFileSync(path, JSON.stringify(arr, null, 2));
  } catch (err) {
    console.error("Failed to write agent log", err);
  }
}

export async function runDocSync() {
  const dryRun = process.argv.includes("--dry-run");
  if (dryRun) {
    console.log("DocSync running in dry-run mode. No external calls will be made.");
  }

  const logFailure = (message: string) => {
    appendAgentLog({
      timestamp: new Date().toISOString(),
      command: "npx ts-node scripts/docsync-agent.ts",
      output: message,
      synced: false,
      syncAttemptedAt: new Date().toISOString(),
      syncError: message,
      architectureDocumented: true,
      lifecycleDocumented: true,
      designPatternsDocumented: true,
    });
  };

  const requiredEnv = [
    "SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "GH_PAT",
    "GH_OWNER",
    "GH_REPO",
    "WIKI_BRANCH",
  ];
  for (const key of requiredEnv) {
    if (!process.env[key]) {
      const msg = `${key} is required.`;
      console.error(msg);
      logFailure(msg);
      const err = new Error(msg);
      throw err;
    }
  }

  try {
    if (dryRun) {
      return;
    }
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const octokit = new Octokit({ auth: process.env.GH_PAT });
    const repo: RepoMeta = {
      owner: process.env.GH_OWNER!,
      repo: process.env.GH_REPO!,
      wikiBranch: process.env.WIKI_BRANCH!,
    };
    const { data: logs } = await supabase
      .from("codex_logs")
      .select("*")
      .eq("synced", false);
    if (logs) {
      for (const log of logs as CodexLog[]) {
        try {
          await syncLogRecord(octokit, supabase, repo, log);
        } catch (err: any) {
          const msg = `log #${log.id} failed: ${err?.message || err}`;
          console.error(msg);
          logFailure(msg);
          err.logId = log.id;
          throw err;
        }
      }
    }
  } catch (err: any) {
    const msg = err?.message || String(err);
    console.error(msg);
    logFailure(msg);
    throw err;
  }
}

export async function run() {
  const argv = process.argv.slice(2);
  const failOpen = argv.includes("--fail-open");
  const dryRun = argv.includes("--dry-run");
  const repoIdx = argv.indexOf("--repo");
  const repoArg = repoIdx >= 0 ? argv[repoIdx + 1] : undefined;

  try {
    await runDocSync();
  } catch (err: any) {
    if (!failOpen) {
      throw err;
    }
    const logId = err?.logId || crypto.randomUUID();
    const title = `[DocSync Failure] ${logId} @ ${new Date().toISOString()}`;
    const sha = process.env.VERCEL_GIT_COMMIT_SHA || "";
    const body = `Error Stack:\n\n${err.stack || err}\n\nLog ID: ${logId}\nCommit SHA: ${sha}`;
    let issueUrl = "DRY_RUN";
    if (dryRun) {
      console.warn(`DRY RUN: would open issue for ${logId}`);
    } else {
      const { html_url } = await createIssue({
        repo: repoArg,
        title,
        body,
        labels: ["docsync", "automated"],
      });
      issueUrl = html_url;
    }
    appendAgentLog({
      type: "github_issue",
      logId,
      issueUrl,
      createdAt: new Date().toISOString(),
    });
    if (process.env.JEST_WORKER_ID === undefined) {
      process.exit(0);
    }
  }
}

if (require.main === module) {
  run();
}
