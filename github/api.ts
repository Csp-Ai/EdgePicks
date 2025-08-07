import { Octokit } from "@octokit/rest";

export async function createIssue(
  token: string,
  owner: string,
  repo: string,
  title: string,
  body: string
): Promise<string> {
  const octokit = new Octokit({ auth: token });
  const { data } = await octokit.issues.create({ owner, repo, title, body });
  return data.html_url;
}
