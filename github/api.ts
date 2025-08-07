export async function createIssue({
  repo,
  title,
  body,
  labels = [],
}: {
  repo?: string;
  title: string;
  body: string;
  labels?: string[];
}) {
  const repository = repo || process.env.GITHUB_REPOSITORY;
  if (!repository) {
    throw new Error("No repo provided. Set --repo or GITHUB_REPOSITORY");
  }
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error("GITHUB_TOKEN is required to create issues");
  }
  const [owner, name] = repository.split("/");
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${name}/issues`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, body, labels }),
    }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub createIssue failed: ${res.status} ${text}`);
  }
  const json = await res.json();
  return { html_url: json.html_url as string };
}
