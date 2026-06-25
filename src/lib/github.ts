import type { DevCardStats } from "@/types/github";

const GITHUB_API = "https://api.github.com";

function getHeaders() {
  const token = process.env.GITHUB_TOKEN;
  return {
    Accept: "application/vnd.github.v3+json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

const FALLBACK: DevCardStats = {
  stars: 32,
  forks: 109,
  openIssues: 12,
  contributors: 50,
  latestRelease: "v0.3.0",
  latestReleaseDate: "2026-04-10",
};

export async function getDevCardStats(): Promise<DevCardStats> {
  try {
    const headers = getHeaders();

    const [repoRes, contributorsRes, releaseRes] = await Promise.all([
      fetch(`${GITHUB_API}/repos/Dev-Card/DevCard`, {
        headers,
        next: { revalidate: 21600 },
      }),
      fetch(`${GITHUB_API}/repos/Dev-Card/DevCard/contributors?per_page=100`, {
        headers,
        next: { revalidate: 21600 },
      }),
      fetch(`${GITHUB_API}/repos/Dev-Card/DevCard/releases/latest`, {
        headers,
        next: { revalidate: 21600 },
      }),
    ]);

    if (!repoRes.ok) return FALLBACK;

    const repo = await repoRes.json() as {
      stargazers_count: number;
      forks_count: number;
      open_issues_count: number;
    };

    let contributors = 50;
    if (contributorsRes.ok) {
      const contribData = await contributorsRes.json() as unknown[];
      contributors = Array.isArray(contribData) ? contribData.length : 50;
    }

    let latestRelease: string | undefined;
    let latestReleaseDate: string | undefined;
    if (releaseRes.ok) {
      const releaseData = await releaseRes.json() as {
        tag_name?: string;
        published_at?: string;
      };
      latestRelease = releaseData.tag_name;
      latestReleaseDate = releaseData.published_at;
    }

    return {
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      openIssues: repo.open_issues_count,
      contributors,
      latestRelease,
      latestReleaseDate,
    };
  } catch {
    return FALLBACK;
  }
}
