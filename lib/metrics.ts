export interface Issue {
  id: string;
  status: string;
  priority: string;
  category: string;
  line: string;
  date: string;
  content: string;
  createdAt?: Date;
  resolvedAt?: Date;
  assignedAt?: Date;
  shift?: string;
  downtimeCause?: string;
  responseTime?: number;
}

export interface MetricsData {
  mttr: number;
  totalIssues: number;
  resolvedIssues: number;
  openIssues: number;
  avgResolutionTime: number;
}

export const calculateMTTR = (issues: Issue[]): number => {
  const resolvedIssues = issues.filter((i) => i.status === "Resolved");
  if (resolvedIssues.length === 0) return 0;

  const totalTime = resolvedIssues.reduce((sum, issue) => {
    if (issue.createdAt && issue.resolvedAt) {
      const timeDiff = issue.resolvedAt.getTime() - issue.createdAt.getTime();
      return sum + timeDiff;
    }
    return sum;
  }, 0);

  const averageTime = totalTime / resolvedIssues.length;
  return Math.round(averageTime / (1000 * 60 * 60));
};

export const calculateResolutionTimes = (
  issues: Issue[]
): { date: string; avgTime: number }[] => {
  const issuesByDate: { [key: string]: number[] } = {};

  issues.forEach((issue) => {
    if (issue.createdAt && issue.resolvedAt && issue.status === "Resolved") {
      const dateKey = new Date(issue.createdAt).toLocaleDateString();
      const timeDiff = issue.resolvedAt.getTime() - issue.createdAt.getTime();
      const hours = Math.round(timeDiff / (1000 * 60 * 60));

      if (!issuesByDate[dateKey]) {
        issuesByDate[dateKey] = [];
      }
      issuesByDate[dateKey].push(hours);
    }
  });

  return Object.entries(issuesByDate)
    .map(([date, times]) => ({
      date,
      avgTime: Math.round(
        times.reduce((a, b) => a + b, 0) / times.length
      ),
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const calculateIssuesByShift = (
  issues: Issue[]
): { shift: string; count: number }[] => {
  const shiftCounts: { [key: string]: number } = {
    Morning: 0,
    Evening: 0,
    Night: 0,
  };

  issues.forEach((issue) => {
    const shift = issue.shift || "Morning";
    if (issue.status === "Open" || issue.status === "In progress") {
      shiftCounts[shift] = (shiftCounts[shift] || 0) + 1;
    }
  });

  return Object.entries(shiftCounts).map(([shift, count]) => ({
    shift,
    count,
  }));
};

export const calculateRepeatIssues = (
  issues: Issue[]
): { category: string; frequency: number }[] => {
  const categoryCount: { [key: string]: number } = {};

  issues.forEach((issue) => {
    categoryCount[issue.category] = (categoryCount[issue.category] || 0) + 1;
  });

  return Object.entries(categoryCount)
    .filter(([_, count]) => count > 1)
    .map(([category, frequency]) => ({
      category,
      frequency,
    }))
    .sort((a, b) => b.frequency - a.frequency);
};

export const calculateDowntimeByCause = (
  issues: Issue[]
): { cause: string; duration: number }[] => {
  const causeDuration: { [key: string]: number } = {};

  issues.forEach((issue) => {
    const cause = issue.downtimeCause || issue.category;
    if (issue.createdAt && issue.resolvedAt) {
      const timeDiff = issue.resolvedAt.getTime() - issue.createdAt.getTime();
      const hours = timeDiff / (1000 * 60 * 60);
      causeDuration[cause] = (causeDuration[cause] || 0) + hours;
    }
  });

  return Object.entries(causeDuration)
    .map(([cause, duration]) => ({
      cause,
      duration: Math.round(duration * 10) / 10,
    }))
    .sort((a, b) => b.duration - a.duration)
    .slice(0, 6);
};

export const calculateResponseTime = (
  issues: Issue[]
): { team: string; avgResponseTime: number }[] => {
  const teamResponse: { [key: string]: number[] } = {
    "Team A": [],
    "Team B": [],
    "Team C": [],
  };

  issues.forEach((issue) => {
    const team = issue.line || "Team A";
    if (issue.assignedAt && issue.createdAt) {
      const timeDiff = issue.assignedAt.getTime() - issue.createdAt.getTime();
      const minutes = Math.round(timeDiff / (1000 * 60));
      if (teamResponse[team]) {
        teamResponse[team].push(minutes);
      }
    }
  });

  return Object.entries(teamResponse)
    .map(([team, times]) => ({
      team,
      avgResponseTime:
        times.length > 0
          ? Math.round(times.reduce((a, b) => a + b, 0) / times.length)
          : 0,
    }))
    .filter((item) => item.avgResponseTime > 0);
};

export const calculateShiftHandoffRate = (
  issues: Issue[]
): { shift: string; completionRate: number }[] => {
  const shiftMetrics: {
    [key: string]: { total: number; completed: number };
  } = {
    Morning: { total: 0, completed: 0 },
    Evening: { total: 0, completed: 0 },
    Night: { total: 0, completed: 0 },
  };

  issues.forEach((issue) => {
    const shift = issue.shift || "Morning";
    shiftMetrics[shift].total += 1;
    if (issue.status === "Resolved") {
      shiftMetrics[shift].completed += 1;
    }
  });

  return Object.entries(shiftMetrics)
    .map(([shift, metrics]) => ({
      shift,
      completionRate:
        metrics.total > 0
          ? Math.round((metrics.completed / metrics.total) * 100)
          : 0,
    }))
    .filter((item) => item.completionRate > 0);
};
