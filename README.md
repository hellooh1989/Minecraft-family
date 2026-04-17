# Minecraft Java 亲子任务中心 / Minecraft Java Family Quest Center

一个纯前端、本地运行的 Minecraft Java 版亲子任务卡 + 奖励星星 + 5-18 岁长期成长路线图项目。  
A local-only frontend app for Minecraft Java family quests, star rewards, and an ages 5-18 long-term growth roadmap.

适用家庭成员 / Family members:

- 爸爸 / Dad
- ZEO：7 岁男孩 / ZEO: age 7 boy
- ZOE：5 岁女孩 / ZOE: age 5 girl

数据全部保存在浏览器 `localStorage` 中，不依赖后端、数据库服务器或联网服务。  
All data is saved in browser `localStorage`; no backend, database server, or network service is required.

## 项目目录 / Project Structure

```text
.
├── public/
│   ├── pixel-badge.svg
│   └── pixel-family.svg
├── src/
│   ├── components/
│   │   ├── FamilyIconStats.tsx
│   │   ├── MemberCard.tsx
│   │   ├── NavBar.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── StatCard.tsx
│   │   ├── TaskCard.tsx
│   │   └── Toast.tsx
│   ├── context/
│   │   └── AppContext.tsx
│   ├── data/
│   │   └── defaultData.ts
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── DataPage.tsx
│   │   ├── RewardsPage.tsx
│   │   ├── TasksPage.tsx
│   │   └── pageTypes.ts
│   ├── utils/
│   │   ├── progress.ts
│   │   └── storage.ts
│   ├── App.tsx
│   ├── main.tsx
│   ├── styles.css
│   └── types.ts
├── index.html
├── package.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## 本地启动 / Run Locally

```bash
npm install
npm run dev
```

默认本机地址 / Default local URL:

```text
http://localhost:5173
```

同一 Wi-Fi / 内网访问地址会在 `npm run dev` 后由 Vite 显示，例如：  
Vite also prints a network URL for devices on the same Wi-Fi, for example:

```text
http://192.168.x.x:5173
```

## 打包 / Build

```bash
npm run build
```

打包产物会生成在 `dist/` 目录。  
The production build is generated in `dist/`.

本地预览打包结果 / Preview the build:

```bash
npm run preview
```

## 功能说明 / Features

- 首页仪表盘：今日推荐任务、家庭总星星、成员星星、当前章节、最近记录、成就徽章、每周任务视图。  
  Dashboard: today’s picks, family stars, member stars, current chapter, recent activity, badges, and weekly quest view.
- 图标排行榜：用星星图标和任务方块图标显示星星与任务数，孩子不用读复杂表格也能看懂。  
  Icon leaderboard: star icons and quest block icons show stars and finished quests for children.
- 家庭成员系统：固定爸爸、ZEO、ZOE，分别统计星星和完成任务数。  
  Family members: Dad, ZEO, and ZOE with separate stars and quest counts.
- 任务卡系统：支持主线、日常、专属、团队任务，支持完成与取消完成。  
  Quest cards: main, daily, personal, and team quests with finish and undo actions.
- Java 长期路线图：共 18 章，前 6 章当前可执行，后 12 章作为未来章节展示。  
  Java roadmap: 18 chapters total; first 6 are playable now, next 12 are future chapters.
- 未来章节预告：后 12 章每章都有小任务预告，但不会进入当前任务筛选。  
  Future quest previews: each of the next 12 chapters has quest previews, but they stay outside current filters.
- Java 任务字段：任务支持年龄段、技能标签、Java 重点和爸爸引导。  
  Java quest fields: quests include age band, skill tags, Java focus, and Dad guide.
- 奖励系统：完成任务自动加星，团队任务全员加星，支持行为加分和奖励兑换。  
  Rewards: quest stars, team-wide rewards, behavior bonuses, and reward redemption.
- 奖励等级：⭐10 煤、⭐30 铁、⭐80 金、⭐150 钻石、⭐300 下界合金。  
  Reward levels: ⭐10 Coal, ⭐30 Iron, ⭐80 Gold, ⭐150 Diamond, ⭐300 Netherite.
- 闯关计划：完成指定数量任务或关键任务后自动解锁下一章。  
  Chapter plan: unlock the next chapter by finishing enough quests or key milestone quests.
- 数据管理：支持导出 JSON、导入 JSON、二次确认重置全部数据。  
  Data manager: export JSON, import JSON, and reset with double confirmation.
- 双语界面：主要界面、任务、提示、奖励和 README 均为中文 / English 同屏显示。  
  Bilingual UI: main screens, quests, messages, rewards, and README display Chinese / English together.

## 后续如何新增任务 / Add New Quests

编辑 `src/data/defaultData.ts` 中的 `DEFAULT_TASKS` 数组，新增一个任务对象即可。  
Edit the `DEFAULT_TASKS` array in `src/data/defaultData.ts` and add a new quest object.

示例 / Example:

```ts
{
  id: "build-watchtower",
  title: "建一座瞭望塔 / Build a Watchtower",
  description: "在基地附近建一座可以看清周围地形的塔。/ Build a tower near the base to see the area clearly.",
  type: "team",
  difficulty: "normal",
  rewardStars: 3,
  applicableRoles: MEMBER_ORDER,
  chapterId: "chapter6",
  ageBand: "7-9",
  skillTags: ["building", "survival"],
  javaFocus: "Java 高处安全和视野规划 / Java height safety and visibility planning",
  parentGuide: "提醒围栏和安全落点。/ Remind rails and safe landing spots.",
  isMainMilestone: false
}
```

注意 / Notes:

- `id` 必须唯一。/ `id` must be unique.
- `type` 可选：`main`、`daily`、`personal`、`team`、`engineering`、`exploration`、`creative`、`technical`、`reflection`、`teaching`。/ `type` can be `main`, `daily`, `personal`, `team`, `engineering`, `exploration`, `creative`, `technical`, `reflection`, or `teaching`.
- `difficulty` 可选：`easy`、`normal`、`hard`、`epic`。/ `difficulty` can be `easy`, `normal`, `hard`, or `epic`.
- `chapterId` 当前可执行任务建议使用 `chapter1` 到 `chapter6`。/ For playable quests, use `chapter1` through `chapter6`.
- `applicableRoles` 使用 `parent`、`child7`、`child5`，界面会显示为爸爸、ZEO、ZOE。/ Use `parent`, `child7`, and `child5` for `applicableRoles`; the UI displays them as Dad, ZEO, and ZOE.
- `ageBand` 使用 `5-7`、`7-9`、`8-11`、`9-13`、`10-14`、`12-15`、`15-18`。/ Use age bands like `5-7`, `7-9`, `8-11`, `9-13`, `10-14`, `12-15`, `15-18`.
- `skillTags` 使用 `survival`、`building`、`redstone`、`commands`、`server` 等技能标签。/ Use skill tags such as `survival`, `building`, `redstone`, `commands`, and `server`.

## 后续如何调整奖励规则 / Adjust Reward Rules

奖励相关配置集中在 `src/data/defaultData.ts`。  
Reward-related configuration is centralized in `src/data/defaultData.ts`.

- 修改任务奖励：调整 `DEFAULT_TASKS` 中任务的 `rewardStars`。  
  Change quest rewards by editing `rewardStars` in `DEFAULT_TASKS`.
- 修改行为加分：调整 `BEHAVIOR_BONUSES`。  
  Change behavior bonuses by editing `BEHAVIOR_BONUSES`.
- 修改兑换奖励：调整 `REWARD_ITEMS`。  
  Change reward shop items by editing `REWARD_ITEMS`.
- 修改奖励等级：调整 `REWARD_LEVELS`。  
  Change reward levels by editing `REWARD_LEVELS`.
- 修改章节解锁规则：调整 `CHAPTERS` 中每章的 `unlock.requiredCompletedCount` 和 `unlock.requiredTaskIds`。  
  Change chapter unlock rules by editing `unlock.requiredCompletedCount` and `unlock.requiredTaskIds` in `CHAPTERS`.
- 修改当前可执行章节：调整 `ACTIVE_CHAPTER_IDS`。  
  Change currently playable chapters by editing `ACTIVE_CHAPTER_IDS`.
- 修改未来章节小任务预告：调整 `FUTURE_CHAPTER_TASK_IDEAS`。  
  Change future quest previews by editing `FUTURE_CHAPTER_TASK_IDEAS`.

个人兑换会从指定成员星星中扣除。家庭兑换会从家庭总星星中扣除，系统优先从当前星星最多的成员开始分摊扣星。  
Personal rewards subtract stars from the selected member. Family rewards subtract from the family total, starting with the member who has the most stars.

## 数据备份建议 / Backup Advice

这个项目的数据只存在当前浏览器里。建议每周或每次大进度后，在“数据管理 / Data Manager”页面点击“导出 JSON / Export JSON”保存备份。  
Data lives only in the current browser. Export a JSON backup weekly or after major progress from the “Data Manager” page.

换浏览器、清理浏览器数据或换电脑之前，请先导出 JSON。  
Export JSON before switching browsers, clearing browser data, or moving to another computer.
# Minecraft-family
