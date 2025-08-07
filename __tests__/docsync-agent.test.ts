import { formatMarkdown, updateWikiPage, syncLogRecord, CodexLog } from "../scripts/docsync-agent";

describe("formatMarkdown", () => {
  it("formats markdown with commit link and tags", () => {
    const log: CodexLog = {
      id: "1",
      prompt: "Add feature",
      completion: "Implements new feature",
      commit_id: "abc123",
      wiki_target: "Roadmap",
      components_modified: ["ui/Button.tsx", "infra/setup.ts"],
      timestamp: "2025-01-01T00:00:00Z",
    };
    const md = formatMarkdown(log, { owner: "me", repo: "repo", wikiBranch: "main" });
    expect(md).toContain("https://github.com/me/repo/commit/abc123");
    expect(md).toContain("#ui");
    expect(md).toContain("#infra");
  });
});

describe("updateWikiPage", () => {
  it("inserts content after anchor", async () => {
    const getContent = jest.fn().mockResolvedValue({
      data: { content: Buffer.from("Heading\n<!-- DOCSYNC INSERTS BELOW -->\nOld\n").toString("base64"), sha: "1" },
    });
    const createOrUpdateFileContents = jest.fn().mockResolvedValue({});
    const octokit: any = { repos: { getContent, createOrUpdateFileContents } };
    await updateWikiPage(
      octokit,
      { owner: "me", repo: "repo", wikiBranch: "main" },
      "Test",
      "New Section",
      "msg"
    );
    const encoded = createOrUpdateFileContents.mock.calls[0][0].content;
    const decoded = Buffer.from(encoded, "base64").toString("utf8");
    expect(decoded).toContain("Old\nNew Section");
    expect(createOrUpdateFileContents).toHaveBeenCalled();
  });
});

describe("syncLogRecord", () => {
  it("updates wiki and marks log as synced", async () => {
    const getContent = jest.fn().mockResolvedValue({ data: { content: Buffer.from("<!-- DOCSYNC INSERTS BELOW -->\n").toString("base64"), sha: "1" } });
    const createOrUpdateFileContents = jest.fn().mockResolvedValue({});
    const octokit: any = { repos: { getContent, createOrUpdateFileContents } };
    const eq = jest.fn();
    const update = jest.fn(() => ({ eq }));
    const from = jest.fn(() => ({ update }));
    const supabase: any = { from };
    const log: CodexLog = {
      id: "2",
      prompt: "UI change",
      completion: "Adds button",
      commit_id: "def456",
      wiki_target: null,
      components_modified: ["Button.tsx"],
      timestamp: "2025-01-02T00:00:00Z",
    };
    await syncLogRecord(
      octokit,
      supabase,
      { owner: "me", repo: "repo", wikiBranch: "main" },
      log
    );
    expect(createOrUpdateFileContents).toHaveBeenCalled();
    expect(from).toHaveBeenCalledWith("codex_logs");
    expect(eq).toHaveBeenCalledWith("id", "2");
    const paths = createOrUpdateFileContents.mock.calls.map((c) => c[0].path);
    expect(paths).toContain("ui-components-guide.md");
  });
});
