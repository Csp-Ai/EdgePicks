import { createIssue } from '../github/api';

describe('createIssue', () => {
  afterEach(() => {
    delete process.env.GITHUB_TOKEN;
  });

  it('returns issue url from GitHub', async () => {
    process.env.GITHUB_TOKEN = 't';
    const res = await createIssue({ repo: 'o/r', title: 't', body: 'b', labels: ['l'] });
    expect(res).toEqual({ html_url: 'https://github.com/o/r/issues/1' });
  });

  it('throws without token', async () => {
    await expect(createIssue({ repo: 'o/r', title: 't', body: 'b' })).rejects.toThrow(
      'GITHUB_TOKEN is required to create issues',
    );
  });
});
