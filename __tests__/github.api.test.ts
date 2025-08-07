import { createIssue } from "../github/api";

describe("createIssue", () => {
  afterEach(() => {
    // @ts-ignore
    delete global.fetch;
    delete process.env.GITHUB_TOKEN;
  });

  it("calls fetch with correct params", async () => {
    process.env.GITHUB_TOKEN = "t";
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ html_url: "https://github.com/o/r/issues/1" }),
    } as any);
    (global as any).fetch = fetchMock;
    await createIssue({ repo: "o/r", title: "t", body: "b", labels: ["l"] });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.github.com/repos/o/r/issues",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer t",
        }),
      })
    );
  });

  it("throws without token", async () => {
    await expect(
      createIssue({ repo: "o/r", title: "t", body: "b" })
    ).rejects.toThrow("GITHUB_TOKEN is required to create issues");
  });
});
