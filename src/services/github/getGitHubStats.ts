import { githubConfig } from "@/config/github";

export type ContributionDay = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

export type GitHubStats = {
  username: string;
  avatarUrl: string;
  profileUrl: string;
  contributionsLastYear: number;
  contributions: ContributionDay[];
};

type GitHubUserResponse = {
  avatar_url?: string;
};

type ContributionsApiResponse = {
  total?: {
    lastYear?: number;
  };
  contributions?: Array<{
    date?: string;
    count?: number;
    level?: number;
  }>;
};

function toLevel(value: number | undefined): 0 | 1 | 2 | 3 | 4 {
  if (value === 1 || value === 2 || value === 3 || value === 4) {
    return value;
  }
  return 0;
}

async function fetchContributionCalendar(
  username: string,
): Promise<{ total: number; contributions: ContributionDay[] } | null> {
  try {
    const response = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
      { next: { revalidate: 3600 } },
    );

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as ContributionsApiResponse;
    const contributions = (payload.contributions ?? [])
      .filter(
        (day): day is { date: string; count: number; level: number } =>
          typeof day.date === "string" &&
          typeof day.count === "number" &&
          typeof day.level === "number",
      )
      .map((day) => ({
        date: day.date,
        count: day.count,
        level: toLevel(day.level),
      }));

    return {
      total:
        typeof payload.total?.lastYear === "number"
          ? payload.total.lastYear
          : contributions.reduce((sum, day) => sum + day.count, 0),
      contributions,
    };
  } catch {
    return null;
  }
}

export async function getGitHubStats(): Promise<GitHubStats> {
  const { username, profileUrl } = githubConfig;
  const fallbackAvatarUrl = `https://github.com/${username}.png`;

  const [userResponse, calendar] = await Promise.all([
    fetch(`https://api.github.com/users/${username}`, {
      next: { revalidate: 86400 },
      headers: { Accept: "application/vnd.github+json" },
    }),
    fetchContributionCalendar(username),
  ]);

  let avatarUrl = fallbackAvatarUrl;

  if (userResponse.ok) {
    const user = (await userResponse.json()) as GitHubUserResponse;

    if (typeof user.avatar_url === "string") {
      avatarUrl = user.avatar_url;
    }
  }

  return {
    username,
    avatarUrl,
    profileUrl,
    contributionsLastYear: calendar?.total ?? 0,
    contributions: calendar?.contributions ?? [],
  };
}
