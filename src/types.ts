export type MemberId = "parent" | "child7" | "child5";

export type TaskType =
  | "main"
  | "daily"
  | "personal"
  | "team"
  | "engineering"
  | "exploration"
  | "creative"
  | "technical"
  | "reflection"
  | "teaching";

export type Difficulty = "easy" | "normal" | "hard" | "epic";

export type ChapterId = `chapter${number}`;

export type AgeBand =
  | "5-7"
  | "7-9"
  | "8-11"
  | "9-13"
  | "10-14"
  | "12-15"
  | "15-18";

export type SkillTag =
  | "survival"
  | "building"
  | "creative"
  | "engineering"
  | "farming"
  | "exploration"
  | "combat"
  | "trading"
  | "redstone"
  | "automation"
  | "storage"
  | "commands"
  | "technical"
  | "datapacks"
  | "resourcepacks"
  | "server"
  | "teaching"
  | "portfolio"
  | "communication"
  | "reflection";

export type RewardScope = "personal" | "family";

export type ThemeMode = "light" | "dark";

export type AccountId = "daddy" | "zeo" | "zoe";

export interface Member {
  id: MemberId;
  name: string;
  roleLabel: string;
  avatar: string;
  color: string;
  stars: number;
  completedTasks: number;
}

export interface Chapter {
  id: ChapterId;
  title: string;
  subtitle: string;
  description: string;
  ageBand: AgeBand;
  skillTags: SkillTag[];
  javaFocus: string;
  parentGuide: string;
  order: number;
  unlockHint: string;
  isFuture?: boolean;
  unlock: {
    requiredCompletedCount: number;
    requiredTaskIds?: string[];
  };
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  difficulty: Difficulty;
  rewardStars: number;
  applicableRoles: MemberId[];
  chapterId: ChapterId;
  ageBand?: AgeBand;
  skillTags?: SkillTag[];
  javaFocus?: string;
  parentGuide?: string;
  guide?: {
    title: string;
    materials: string[];
    crafting: string[];
    steps: string[];
    tips?: string[];
  };
  isMainMilestone?: boolean;
  isTodayRecommended?: boolean;
}

export interface TaskProgress {
  completed: boolean;
  completedAt?: string;
  completedBy?: MemberId[];
  awardedStars?: number;
}

export interface BehaviorBonus {
  id: string;
  title: string;
  description: string;
  stars: number;
  appliesTo: MemberId[] | "all";
}

export interface RewardItem {
  id: string;
  title: string;
  description: string;
  cost: number;
  scope: RewardScope;
  active?: boolean;
}

export interface Account {
  id: AccountId;
  name: string;
  avatar: string;
  roleLabel: string;
  memberId?: MemberId;
  isAdmin: boolean;
}

export interface ActivityLogItem {
  id: string;
  type: "task" | "bonus" | "redeem" | "chapter" | "system";
  title: string;
  detail: string;
  createdAt: string;
  memberIds?: MemberId[];
  starsDelta?: number;
}

export interface RedemptionRecord {
  id: string;
  rewardId: string;
  rewardTitle: string;
  scope: RewardScope;
  cost: number;
  redeemedBy?: MemberId;
  contributors?: Partial<Record<MemberId, number>>;
  createdAt: string;
}

export interface AppSettings {
  theme: ThemeMode;
  musicEnabled: boolean;
}

export interface AppState {
  schemaVersion: number;
  accounts: Record<AccountId, Account>;
  activeAccountId: AccountId;
  members: Record<MemberId, Member>;
  taskProgress: Record<string, TaskProgress>;
  rewardItems: RewardItem[];
  activityLog: ActivityLogItem[];
  redemptionHistory: RedemptionRecord[];
  settings: AppSettings;
}

export interface ImportPayload {
  schemaVersion: number;
  accounts?: Record<AccountId, Account>;
  activeAccountId?: AccountId;
  members: Record<MemberId, Member>;
  taskProgress: Record<string, TaskProgress>;
  rewardItems?: RewardItem[];
  activityLog: ActivityLogItem[];
  redemptionHistory: RedemptionRecord[];
  settings: AppSettings;
}
