import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import {
  BEHAVIOR_BONUSES,
  CHAPTERS,
  DEFAULT_TASKS,
  MEMBER_ORDER
} from "../data/defaultData";
import type {
  AccountId,
  AppState,
  BehaviorBonus,
  ImportPayload,
  MemberId,
  RewardItem,
  ThemeMode
} from "../types";
import {
  createInitialState,
  downloadJson,
  loadState,
  normalizeState,
  saveState
} from "../utils/storage";
import {
  getFamilyStars,
  getTask,
  getUnlockedChapterIds,
  isTaskCompleted
} from "../utils/progress";
import { createId } from "../utils/id";

interface Feedback {
  id: string;
  title: string;
  detail: string;
  tone: "success" | "info" | "warning";
}

interface AppContextValue {
  state: AppState;
  feedback: Feedback | null;
  completeTask: (taskId: string, assigneeId?: MemberId) => void;
  cancelTask: (taskId: string) => void;
  applyBonus: (bonusId: string, assigneeId?: MemberId) => void;
  redeemReward: (rewardId: string, memberId?: MemberId) => void;
  switchAccount: (accountId: AccountId) => void;
  upsertRewardItem: (reward: RewardItem) => void;
  disableRewardItem: (rewardId: string) => void;
  deleteRewardItem: (rewardId: string) => void;
  exportData: () => void;
  importData: (payload: ImportPayload) => void;
  resetAll: () => void;
  setTheme: (theme: ThemeMode) => void;
  toggleMusic: () => void;
  dismissFeedback: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const nowIso = () => new Date().toISOString();

const makeLog = (
  type: AppState["activityLog"][number]["type"],
  title: string,
  detail: string,
  memberIds?: MemberId[],
  starsDelta?: number
) => ({
  id: createId(),
  type,
  title,
  detail,
  createdAt: nowIso(),
  memberIds,
  starsDelta
});

const isAllHandsTask = (taskId: string): boolean => {
  const task = getTask(taskId);
  if (!task) return false;

  return (
    task.type === "team" ||
    (task.applicableRoles.length === MEMBER_ORDER.length &&
      task.type !== "personal" &&
      task.type !== "daily")
  );
};

const getBonusRecipients = (
  bonus: BehaviorBonus,
  assigneeId?: MemberId
): MemberId[] => {
  if (bonus.appliesTo === "all") return MEMBER_ORDER;
  if (assigneeId && bonus.appliesTo.includes(assigneeId)) return [assigneeId];
  return [bonus.appliesTo[0]];
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AppState>(() => loadState());
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  useEffect(() => {
    saveState(state);
    document.documentElement.dataset.theme = state.settings.theme;
  }, [state]);

  const pushFeedback = (
    title: string,
    detail: string,
    tone: Feedback["tone"] = "success"
  ) => {
    setFeedback({
      id: createId(),
      title,
      detail,
      tone
    });
  };

  const completeTask = (taskId: string, assigneeId?: MemberId) => {
    const task = getTask(taskId);
    if (!task) return;

    setState((previous) => {
      if (isTaskCompleted(previous, taskId)) {
        pushFeedback("任务已经完成 / Quest already done", "这张任务卡已经结算过星星。/ Stars were already awarded for this card.", "info");
        return previous;
      }

      const unlockedBefore = getUnlockedChapterIds(previous);
      const recipients = isAllHandsTask(taskId)
        ? MEMBER_ORDER
        : [assigneeId ?? task.applicableRoles[0]];

      const next: AppState = {
        ...previous,
        members: { ...previous.members },
        taskProgress: {
          ...previous.taskProgress,
          [taskId]: {
            completed: true,
            completedAt: nowIso(),
            completedBy: recipients,
            awardedStars: task.rewardStars
          }
        },
        activityLog: [
          makeLog(
            "task",
            `完成任务 / Finished quest: ${task.title}`,
            `${recipients.length === 3 ? "全员 / Everyone" : "指定成员 / Selected member"}获得 / earns ${
              task.rewardStars
            } 星 / stars.`,
            recipients,
            task.rewardStars
          ),
          ...previous.activityLog
        ]
      };

      recipients.forEach((memberId) => {
        next.members[memberId] = {
          ...next.members[memberId],
          stars: next.members[memberId].stars + task.rewardStars,
          completedTasks: next.members[memberId].completedTasks + 1
        };
      });

      const unlockedAfter = getUnlockedChapterIds(next);
      const newlyUnlocked = unlockedAfter.filter(
        (chapterId) => !unlockedBefore.includes(chapterId)
      );

      newlyUnlocked.forEach((chapterId) => {
        const chapter = CHAPTERS.find((item) => item.id === chapterId);
        if (!chapter) return;
        next.activityLog = [
          makeLog("chapter", `解锁章节 / Chapter unlocked: ${chapter.title}`, chapter.description),
          ...next.activityLog
        ];
      });

      if (newlyUnlocked.length > 0) {
        const newestChapterId = newlyUnlocked[newlyUnlocked.length - 1];
        const chapter = CHAPTERS.find((item) => item.id === newestChapterId);
        pushFeedback(
          "新章节解锁！/ New chapter unlocked!",
          chapter ? `${chapter.title} 已开启 / is open.` : "新的冒险阶段已开启。/ A new adventure stage is open."
        );
      } else {
        pushFeedback(
          "任务完成！/ Quest finished!",
          `获得 ${task.rewardStars} 星，家庭基地又前进了一步。/ Earned ${task.rewardStars} stars. The family base moved forward.`
        );
      }

      return next;
    });
  };

  const cancelTask = (taskId: string) => {
    const task = getTask(taskId);
    if (!task) return;

    setState((previous) => {
      const progress = previous.taskProgress[taskId];
      if (!progress?.completed) {
        pushFeedback("任务还没完成 / Quest not done yet", "没有可撤销的结算。/ There is no reward to undo.", "info");
        return previous;
      }

      const recipients = progress.completedBy ?? [];
      const stars = progress.awardedStars ?? task.rewardStars;
      const nextProgress = { ...previous.taskProgress };
      delete nextProgress[taskId];

      const next: AppState = {
        ...previous,
        members: { ...previous.members },
        taskProgress: nextProgress,
        activityLog: [
          makeLog(
            "task",
            `撤销任务 / Quest undone: ${task.title}`,
            `已扣回本次任务结算的 ${stars} 星。/ Removed ${stars} stars from this quest.`,
            recipients,
            -stars
          ),
          ...previous.activityLog
        ]
      };

      recipients.forEach((memberId) => {
        next.members[memberId] = {
          ...next.members[memberId],
          stars: Math.max(0, next.members[memberId].stars - stars),
          completedTasks: Math.max(0, next.members[memberId].completedTasks - 1)
        };
      });

      pushFeedback("已撤销完成 / Completion undone", "星星和完成数已经同步回退。/ Stars and quest counts were rolled back.", "warning");
      return next;
    });
  };

  const applyBonus = (bonusId: string, assigneeId?: MemberId) => {
    const bonus = BEHAVIOR_BONUSES.find((item) => item.id === bonusId);
    if (!bonus) return;

    setState((previous) => {
      const recipients = getBonusRecipients(bonus, assigneeId);
      const next: AppState = {
        ...previous,
        members: { ...previous.members },
        activityLog: [
          makeLog(
            "bonus",
            `行为加分 / Behavior bonus: ${bonus.title}`,
            `${bonus.description} +${bonus.stars} 星 / stars.`,
            recipients,
            bonus.stars
          ),
          ...previous.activityLog
        ]
      };

      recipients.forEach((memberId) => {
        next.members[memberId] = {
          ...next.members[memberId],
          stars: next.members[memberId].stars + bonus.stars
        };
      });

      pushFeedback("行为加分成功 / Bonus added", `${bonus.title}, +${bonus.stars} 星 / stars.`);
      return next;
    });
  };

  const redeemReward = (rewardId: string, memberId?: MemberId) => {
    setState((previous) => {
      const reward = previous.rewardItems.find((item) => item.id === rewardId);
      if (!reward || reward.active === false) {
        pushFeedback("奖品不可用 / Reward unavailable", "这个奖品已被后台停用或删除。/ This reward was disabled or removed by admin.", "warning");
        return previous;
      }

      if (reward.scope === "personal") {
        const selected = memberId ?? "child5";
        const member = previous.members[selected];
        if (member.stars < reward.cost) {
          pushFeedback("星星还不够 / Not enough stars", `${member.name} 还需要再攒一攒。/ needs more stars.`, "warning");
          return previous;
        }

        const next: AppState = {
          ...previous,
          members: {
            ...previous.members,
            [selected]: {
              ...member,
              stars: member.stars - reward.cost
            }
          },
          redemptionHistory: [
            {
              id: createId(),
              rewardId: reward.id,
              rewardTitle: reward.title,
              scope: reward.scope,
              cost: reward.cost,
              redeemedBy: selected,
              createdAt: nowIso()
            },
            ...previous.redemptionHistory
          ],
          activityLog: [
            makeLog(
              "redeem",
              `兑换奖励 / Reward redeemed: ${reward.title}`,
              `${member.name} 使用 ${reward.cost} 星兑换。/ spent ${reward.cost} stars.`,
              [selected],
              -reward.cost
            ),
            ...previous.activityLog
          ]
        };

        pushFeedback("兑换成功 / Reward redeemed", `${member.name} 兑换了 / redeemed: ${reward.title}`);
        return next;
      }

      if (getFamilyStars(previous) < reward.cost) {
        pushFeedback("家庭星星还不够 / Not enough family stars", "先完成更多团队任务再来兑换。/ Finish more team quests first.", "warning");
        return previous;
      }

      let remaining = reward.cost;
      const contributors: Partial<Record<MemberId, number>> = {};
      const nextMembers = { ...previous.members };
      const byBalance = [...MEMBER_ORDER].sort(
        (a, b) => previous.members[b].stars - previous.members[a].stars
      );

      byBalance.forEach((candidate) => {
        if (remaining <= 0) return;
        const spend = Math.min(nextMembers[candidate].stars, remaining);
        if (spend <= 0) return;
        contributors[candidate] = spend;
        remaining -= spend;
        nextMembers[candidate] = {
          ...nextMembers[candidate],
          stars: nextMembers[candidate].stars - spend
        };
      });

      const next: AppState = {
        ...previous,
        members: nextMembers,
        redemptionHistory: [
          {
            id: createId(),
            rewardId: reward.id,
            rewardTitle: reward.title,
            scope: reward.scope,
            cost: reward.cost,
            contributors,
            createdAt: nowIso()
          },
          ...previous.redemptionHistory
        ],
        activityLog: [
          makeLog(
            "redeem",
            `家庭兑换 / Family reward: ${reward.title}`,
            `从家庭总星星中扣除 ${reward.cost} 星。/ Removed ${reward.cost} stars from family total.`,
            MEMBER_ORDER,
            -reward.cost
          ),
          ...previous.activityLog
        ]
      };

      pushFeedback("家庭奖励已兑换 / Family reward redeemed", reward.title);
      return next;
    });
  };

  const switchAccount = (accountId: AccountId) => {
    setState((previous) => ({
      ...previous,
      activeAccountId: accountId
    }));
  };

  const upsertRewardItem = (reward: RewardItem) => {
    setState((previous) => {
      const exists = previous.rewardItems.some((item) => item.id === reward.id);
      const normalizedReward = {
        ...reward,
        id: reward.id || createId(),
        active: reward.active ?? true
      };

      return {
        ...previous,
        rewardItems: exists
          ? previous.rewardItems.map((item) =>
              item.id === reward.id ? normalizedReward : item
            )
          : [normalizedReward, ...previous.rewardItems],
        activityLog: [
          makeLog(
            "system",
            exists
              ? `后台更新奖品 / Admin updated reward: ${normalizedReward.title}`
              : `后台新增奖品 / Admin added reward: ${normalizedReward.title}`,
            `${normalizedReward.cost} 星 / stars · ${
              normalizedReward.scope === "family"
                ? "家庭兑换 / Family"
                : "个人兑换 / Personal"
            }`
          ),
          ...previous.activityLog
        ]
      };
    });
    pushFeedback("奖品已保存 / Reward saved", `${reward.title} · ${reward.cost} 星 / stars`);
  };

  const disableRewardItem = (rewardId: string) => {
    setState((previous) => {
      const reward = previous.rewardItems.find((item) => item.id === rewardId);
      if (!reward) return previous;

      return {
        ...previous,
        rewardItems: previous.rewardItems.map((item) =>
          item.id === rewardId ? { ...item, active: false } : item
        ),
        activityLog: [
          makeLog(
            "system",
            `后台停用奖品 / Admin disabled reward: ${reward.title}`,
            "奖品不再显示在兑换商店。/ Reward no longer appears in the shop."
          ),
          ...previous.activityLog
        ]
      };
    });
    pushFeedback("奖品已停用 / Reward disabled", "兑换商店不会再显示它。/ It is hidden from the shop.", "warning");
  };

  const deleteRewardItem = (rewardId: string) => {
    setState((previous) => {
      const reward = previous.rewardItems.find((item) => item.id === rewardId);
      if (!reward) return previous;

      return {
        ...previous,
        rewardItems: previous.rewardItems.filter((item) => item.id !== rewardId),
        activityLog: [
          makeLog(
            "system",
            `后台删除奖品 / Admin deleted reward: ${reward.title}`,
            "奖品已从后台清单中删除。/ Reward was removed from the admin list."
          ),
          ...previous.activityLog
        ]
      };
    });
    pushFeedback("奖品已删除 / Reward deleted", "后台清单中已移除。/ Removed from the admin list.", "warning");
  };

  const exportData = () => {
    downloadJson(state);
    pushFeedback("备份已导出 / Backup exported", "JSON 文件已经下载到浏览器默认下载目录。/ The JSON file was downloaded by the browser.", "info");
  };

  const importData = (payload: ImportPayload) => {
    setState(normalizeState(payload));
    pushFeedback("导入完成 / Import complete", "本地数据已经替换为备份内容。/ Local data was replaced by the backup.");
  };

  const resetAll = () => {
    setState(createInitialState());
    pushFeedback("已重置 / Reset complete", "所有任务、星星和兑换记录都回到初始状态。/ Quests, stars, and rewards returned to the starting state.", "warning");
  };

  const setTheme = (theme: ThemeMode) => {
    setState((previous) => ({
      ...previous,
      settings: {
        ...previous.settings,
        theme
      }
    }));
  };

  const toggleMusic = () => {
    setState((previous) => ({
      ...previous,
      settings: {
        ...previous.settings,
        musicEnabled: !previous.settings.musicEnabled
      }
    }));
    pushFeedback("背景音乐开关已更新 / Music setting updated", "这里只记录偏好，不会自动播放外部音频。/ This only saves the preference; no external audio plays.", "info");
  };

  const value = useMemo<AppContextValue>(
    () => ({
      state,
      feedback,
      completeTask,
      cancelTask,
      applyBonus,
      redeemReward,
      switchAccount,
      upsertRewardItem,
      disableRewardItem,
      deleteRewardItem,
      exportData,
      importData,
      resetAll,
      setTheme,
      toggleMusic,
      dismissFeedback: () => setFeedback(null)
    }),
    [feedback, state]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used inside AppProvider");
  }

  return context;
};
