import fs from "fs";
import os from "os";
import path from "path";
import { run } from "../scripts/docsync-agent";

jest.mock("../github/api", () => ({
  createIssue: jest.fn().mockResolvedValue({
    html_url: "https://github.com/o/r/issues/1",
  }),
}));

const { createIssue } = require("../github/api");

describe("docsync fail-open", () => {
  let cwd: string;
  beforeEach(() => {
    cwd = process.cwd();
  });
  afterEach(() => {
    process.chdir(cwd);
    jest.clearAllMocks();
  });

  it("dry run skips API call and logs DRY RUN", async () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "docsync-"));
    fs.writeFileSync(path.join(tmp, "agentLogsStore.json"), "[]");
    process.chdir(tmp);
    process.argv = ["node", "scripts/docsync-agent.ts", "--fail-open", "--dry-run"];
    await run();
    expect(createIssue).not.toHaveBeenCalled();
    const logs = JSON.parse(fs.readFileSync("agentLogsStore.json", "utf8"));
    const entry = logs.find((l: any) => l.type === "github_issue");
    expect(entry.issueUrl).toBe("DRY_RUN");
  });

  it("opens issue when fail-open", async () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "docsync-"));
    fs.writeFileSync(path.join(tmp, "agentLogsStore.json"), "[]");
    process.chdir(tmp);
    process.argv = ["node", "scripts/docsync-agent.ts", "--fail-open"];
    await run();
    expect(createIssue).toHaveBeenCalledTimes(1);
    const logs = JSON.parse(fs.readFileSync("agentLogsStore.json", "utf8"));
    const entry = logs.find((l: any) => l.type === "github_issue");
    expect(entry.issueUrl).toBe("https://github.com/o/r/issues/1");
  });

  it("throws when fail-open not provided", async () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "docsync-"));
    fs.writeFileSync(path.join(tmp, "agentLogsStore.json"), "[]");
    process.chdir(tmp);
    process.argv = ["node", "scripts/docsync-agent.ts"];
    await expect(run()).rejects.toThrow();
  });
});
