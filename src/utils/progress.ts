import {
  ACTIVE_CHAPTER_IDS,
  CHAPTERS,
  DEFAULT_TASKS,
  MEMBER_ORDER,
  REWARD_LEVELS
} from "../data/defaultData";
import type { AppState, Chapter, ChapterId, MemberId, Task } from "../types";

export const getTask = (taskId: string): Task | undefined =>
  DEFAULT_TASKS.find((task) => task.id === taskId);

export const isTaskCompleted = (state: AppState, taskId: string): boolean =>
  state.taskProgress[taskId]?.completed ?? false;

export const getCompletedTasks = (state: AppState): Task[] =>
  DEFAULT_TASKS.filter((task) => isTaskCompleted(state, task.id));

export const getChapterTasks = (chapterId: ChapterId): Task[] =>
  DEFAULT_TASKS.filter((task) => task.chapterId === chapterId);

export const getChapterProgress = (state: AppState, chapterId: ChapterId) => {
  const tasks = getChapterTasks(chapterId);
  const completed = tasks.filter((task) => isTaskCompleted(state, task.id));

  return {
    total: tasks.length,
    completed: completed.length,
    percent: tasks.length === 0 ? 0 : Math.round((completed.length / tasks.length) * 100)
  };
};

const previousChapterId = (chapter: Chapter): ChapterId | null => {
  const activeChapters = CHAPTERS.filter((item) =>
    ACTIVE_CHAPTER_IDS.includes(item.id)
  );
  const previous = activeChapters.find((item) => item.order === chapter.order - 1);
  return previous?.id ?? null;
};

export const getUnlockedChapterIds = (state: AppState): ChapterId[] => {
  const unlocked: ChapterId[] = ["chapter1"];
  const activeChapters = CHAPTERS.filter((chapter) =>
    ACTIVE_CHAPTER_IDS.includes(chapter.id)
  );

  activeChapters.slice(1).forEach((chapter) => {
    const previousId = previousChapterId(chapter);
    if (!previousId) return;

    const previousProgress = getChapterProgress(state, previousId);
    const countUnlocked =
      previousProgress.completed >= chapter.unlock.requiredCompletedCount;
    const milestoneUnlocked =
      chapter.unlock.requiredTaskIds?.every((taskId) =>
        isTaskCompleted(state, taskId)
      ) ?? false;

    if (countUnlocked || milestoneUnlocked) {
      unlocked.push(chapter.id);
    }
  });

  return unlocked;
};

export const getCurrentChapter = (state: AppState): Chapter => {
  const unlocked = getUnlockedChapterIds(state);
  const openChapters = CHAPTERS.filter(
    (chapter) => unlocked.includes(chapter.id) && !chapter.isFuture
  );
  const latest = openChapters[openChapters.length - 1];
  return latest ?? CHAPTERS[0];
};

export const getActiveChapters = (): Chapter[] =>
  CHAPTERS.filter((chapter) => ACTIVE_CHAPTER_IDS.includes(chapter.id));

export const getFutureChapters = (): Chapter[] =>
  CHAPTERS.filter((chapter) => chapter.isFuture);

export const getFamilyStars = (state: AppState): number =>
  MEMBER_ORDER.reduce((sum, memberId) => sum + state.members[memberId].stars, 0);

export const getMemberTitle = (stars: number): string => {
  const currentLevel = [...REWARD_LEVELS]
    .reverse()
    .find((level) => stars >= level.threshold);
  return currentLevel
    ? `${currentLevel.icon} ${currentLevel.name}`
    : "🌱 新手 / Starter";
};

export const getRewardLevelProgress = (stars: number) => {
  const currentLevel = [...REWARD_LEVELS]
    .reverse()
    .find((level) => stars >= level.threshold);
  const nextLevel = REWARD_LEVELS.find((level) => stars < level.threshold);

  return {
    currentLevel,
    nextLevel,
    starsToNext: nextLevel ? nextLevel.threshold - stars : 0
  };
};

export const getRecentLogs = (state: AppState, limit = 6) =>
  [...state.activityLog]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);

export const getTodayRecommendedTasks = (state: AppState): Task[] => {
  const current = getCurrentChapter(state);
  const currentTasks = DEFAULT_TASKS.filter(
    (task) => task.chapterId === current.id && !isTaskCompleted(state, task.id)
  );
  const priority = currentTasks.filter((task) => task.isTodayRecommended);
  return (priority.length > 0 ? priority : currentTasks).slice(0, 3);
};

export const getWeeklyTasks = (state: AppState): Task[] => {
  const unlocked = getUnlockedChapterIds(state);
  return DEFAULT_TASKS.filter(
    (task) => unlocked.includes(task.chapterId) && !isTaskCompleted(state, task.id)
  ).slice(0, 7);
};

export const formatMembers = (memberIds: MemberId[]): string =>
  memberIds.map((memberId) => {
    if (memberId === "parent") return "爸爸 / Dad";
    if (memberId === "child7") return "ZEO";
    return "ZOE";
  }).join("、");

export const getAchievementBadges = (state: AppState) => {
  const completedCount = getCompletedTasks(state).length;
  const unlockedChapters = getUnlockedChapterIds(state).length;
  const familyStars = getFamilyStars(state);

  return [
    {
      id: "first-task",
      title: "第一颗星 / First Star",
      unlocked: completedCount >= 1,
      detail: "完成任意 1 个任务 / Finish any 1 quest"
    },
    {
      id: "safe-home",
      title: "安全小屋 / Safe Home",
      unlocked: isTaskCompleted(state, "build-safe-home"),
      detail: "建成一个安全的家 / Build a safe home"
    },
    {
      id: "chapter-two",
      title: "小镇启程 / Town Begins",
      unlocked: unlockedChapters >= 2,
      detail: "解锁第二章 / Unlock Chapter 2"
    },
    {
      id: "family-30",
      title: "星星小队 / Star Team",
      unlocked: familyStars >= 30,
      detail: "家庭总星星达到 30 / Reach 30 family stars"
    }
  ];
};

export const getRewardEconomyAssessment = (state: AppState) => {
  const activeRewards = state.rewardItems.filter((reward) => reward.active !== false);
  const avgTaskStars =
    DEFAULT_TASKS.reduce((sum, task) => sum + task.rewardStars, 0) /
    Math.max(1, DEFAULT_TASKS.length);
  const cheapestReward = activeRewards.reduce(
    (lowest, reward) => (reward.cost < lowest.cost ? reward : lowest),
    activeRewards[0] ?? {
      id: "none",
      title: "暂无奖品 / No reward",
      description: "",
      cost: 0,
      scope: "personal" as const
    }
  );
  const avgRewardCost =
    activeRewards.reduce((sum, reward) => sum + reward.cost, 0) /
    Math.max(1, activeRewards.length);
  const tasksForCheapest =
    cheapestReward.cost === 0
      ? 0
      : Math.ceil(cheapestReward.cost / Math.max(1, avgTaskStars));
  const tasksForAverage =
    avgRewardCost === 0
      ? 0
      : Math.ceil(avgRewardCost / Math.max(1, avgTaskStars));

  const earningEase =
    avgTaskStars >= 4
      ? "偏容易 / Easy to earn"
      : avgTaskStars >= 2.5
        ? "适中 / Balanced"
        : "偏慢 / Slow to earn";
  const redemptionEase =
    tasksForCheapest <= 3
      ? "容易兑换 / Easy to redeem"
      : tasksForCheapest <= 6
        ? "适中 / Balanced"
        : "偏难兑换 / Hard to redeem";

  return {
    avgTaskStars,
    activeRewardCount: activeRewards.length,
    cheapestReward,
    avgRewardCost,
    tasksForCheapest,
    tasksForAverage,
    earningEase,
    redemptionEase
  };
};

export const getPersonalTaskAchievements = (
  state: AppState,
  memberId: MemberId
) =>
  DEFAULT_TASKS.filter((task) =>
    state.taskProgress[task.id]?.completedBy?.includes(memberId)
  ).map((task) => ({
    id: task.id,
    title: task.title,
    description: task.description,
    rewardStars: state.taskProgress[task.id]?.awardedStars ?? task.rewardStars,
    completedAt: state.taskProgress[task.id]?.completedAt,
    type: task.type,
    isTeamAchievement:
      (state.taskProgress[task.id]?.completedBy?.length ?? 0) > 1
  }));

export const getTeamTaskAchievements = (state: AppState) =>
  DEFAULT_TASKS.filter((task) => {
    const progress = state.taskProgress[task.id];
    return progress?.completed && (progress.completedBy?.length ?? 0) > 1;
  }).map((task) => ({
    id: task.id,
    title: task.title,
    completedBy: state.taskProgress[task.id]?.completedBy ?? [],
    completedAt: state.taskProgress[task.id]?.completedAt,
    rewardStars: state.taskProgress[task.id]?.awardedStars ?? task.rewardStars
  }));
