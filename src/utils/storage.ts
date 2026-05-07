import {
  DEFAULT_ACCOUNTS,
  DEFAULT_MEMBERS,
  REWARD_ITEMS
} from "../data/defaultData";
import type { AppState, ImportPayload } from "../types";
import { createId } from "./id";

const STORAGE_KEY = "minecraft-family-quest-center:v1";
const SCHEMA_VERSION = 1;

export const createInitialState = (): AppState => ({
  schemaVersion: SCHEMA_VERSION,
  accounts: {
    daddy: { ...DEFAULT_ACCOUNTS.daddy },
    zeo: { ...DEFAULT_ACCOUNTS.zeo },
    zoe: { ...DEFAULT_ACCOUNTS.zoe }
  },
  activeAccountId: "daddy",
  members: {
    parent: { ...DEFAULT_MEMBERS.parent },
    child7: { ...DEFAULT_MEMBERS.child7 },
    child5: { ...DEFAULT_MEMBERS.child5 }
  },
  taskProgress: {},
  rewardItems: REWARD_ITEMS.map((reward) => ({ ...reward })),
  activityLog: [
    {
      id: createId(),
      type: "system",
      title: "Java 任务中心已创建 / Java quest center created",
      detail: "从第一章开始，慢慢把家庭基地建起来，再走向 Java 技术创作。/ Start from Chapter 1, build the family base, then grow toward Java technical creation.",
      createdAt: new Date().toISOString()
    }
  ],
  redemptionHistory: [],
  settings: {
    theme: "light",
    musicEnabled: false
  }
});

export const loadState = (): AppState => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return createInitialState();
  }

  try {
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return normalizeState(parsed);
  } catch {
    return createInitialState();
  }
};

export const saveState = (state: AppState): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const clearState = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

export const normalizeState = (payload: Partial<ImportPayload>): AppState => {
  const initial = createInitialState();
  const normalizeMember = (id: keyof AppState["members"]) => {
    const saved = payload.members?.[id];
    return {
      ...initial.members[id],
      stars: saved?.stars ?? initial.members[id].stars,
      completedTasks: saved?.completedTasks ?? initial.members[id].completedTasks
    };
  };

  return {
    schemaVersion: SCHEMA_VERSION,
    accounts: {
      daddy: { ...DEFAULT_ACCOUNTS.daddy, ...payload.accounts?.daddy },
      zeo: { ...DEFAULT_ACCOUNTS.zeo, ...payload.accounts?.zeo },
      zoe: { ...DEFAULT_ACCOUNTS.zoe, ...payload.accounts?.zoe }
    },
    activeAccountId:
      payload.activeAccountId === "daddy" ||
      payload.activeAccountId === "zeo" ||
      payload.activeAccountId === "zoe"
        ? payload.activeAccountId
        : "daddy",
    members: {
      parent: normalizeMember("parent"),
      child7: normalizeMember("child7"),
      child5: normalizeMember("child5")
    },
    taskProgress: payload.taskProgress ?? {},
    rewardItems: Array.isArray(payload.rewardItems)
      ? payload.rewardItems.map((reward) => ({
          ...reward,
          active: reward.active ?? true
        }))
      : REWARD_ITEMS.map((reward) => ({ ...reward })),
    activityLog: Array.isArray(payload.activityLog)
      ? payload.activityLog
      : initial.activityLog,
    redemptionHistory: Array.isArray(payload.redemptionHistory)
      ? payload.redemptionHistory
      : [],
    settings: {
      ...initial.settings,
      ...payload.settings
    }
  };
};

export const downloadJson = (state: AppState): void => {
  const blob = new Blob([JSON.stringify(state, null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  const date = new Date().toISOString().slice(0, 10);
  anchor.href = url;
  anchor.download = `minecraft-family-backup-${date}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
};
