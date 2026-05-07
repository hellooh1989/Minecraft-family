import type {
  BehaviorBonus,
  Chapter,
  ChapterId,
  Account,
  Member,
  MemberId,
  RewardItem,
  Task
} from "../types";

export const MEMBER_ORDER: MemberId[] = ["parent", "child7", "child5"];

export const ACTIVE_CHAPTER_IDS: ChapterId[] = [
  "chapter1",
  "chapter2",
  "chapter3",
  "chapter4",
  "chapter5",
  "chapter6"
];

export const TYPE_LABELS = {
  main: "主线任务 / Main Quest",
  daily: "日常任务 / Daily Quest",
  personal: "专属任务 / Personal Quest",
  team: "团队任务 / Team Quest",
  engineering: "工程任务 / Engineering Quest",
  exploration: "探险任务 / Exploration Quest",
  creative: "创作任务 / Creative Quest",
  technical: "技术任务 / Technical Quest",
  reflection: "复盘任务 / Reflection Quest",
  teaching: "教学任务 / Teaching Quest"
} as const;

export const DIFFICULTY_LABELS = {
  easy: "轻松 / Easy",
  normal: "标准 / Normal",
  hard: "挑战 / Hard",
  epic: "史诗 / Epic"
} as const;

export const SKILL_LABELS = {
  survival: "生存 / Survival",
  building: "建筑 / Building",
  creative: "创作 / Creative",
  engineering: "工程 / Engineering",
  farming: "农场 / Farming",
  exploration: "探索 / Exploration",
  combat: "战斗 / Combat",
  trading: "交易 / Trading",
  redstone: "红石 / Redstone",
  automation: "自动化 / Automation",
  storage: "仓储 / Storage",
  commands: "命令 / Commands",
  technical: "技术 / Technical",
  datapacks: "数据包 / Datapacks",
  resourcepacks: "资源包 / Resource Packs",
  server: "服务器 / Server",
  teaching: "教学 / Teaching",
  portfolio: "作品集 / Portfolio",
  communication: "沟通 / Communication",
  reflection: "复盘 / Reflection"
} as const;

export const AGE_BAND_LABELS = {
  "5-7": "5-7 岁 / Ages 5-7",
  "7-9": "7-9 岁 / Ages 7-9",
  "8-11": "8-11 岁 / Ages 8-11",
  "9-13": "9-13 岁 / Ages 9-13",
  "10-14": "10-14 岁 / Ages 10-14",
  "12-15": "12-15 岁 / Ages 12-15",
  "15-18": "15-18 岁 / Ages 15-18"
} as const;

export const REWARD_LEVELS = [
  { threshold: 10, icon: "⚫", name: "煤 / Coal" },
  { threshold: 30, icon: "🔩", name: "铁 / Iron" },
  { threshold: 80, icon: "🟡", name: "金 / Gold" },
  { threshold: 150, icon: "💎", name: "钻石 / Diamond" },
  { threshold: 300, icon: "🔥", name: "下界合金 / Netherite" }
] as const;

export const DEFAULT_MEMBERS: Record<MemberId, Member> = {
  parent: {
    id: "parent",
    name: "爸爸 / Dad",
    roleLabel: "Java 带队爸爸 / Java Team Dad",
    avatar: "👨",
    color: "#3b7c55",
    stars: 0,
    completedTasks: 0
  },
  child7: {
    id: "child7",
    name: "ZEO",
    roleLabel: "7 岁男孩 · 小小 Java 工程师 / Age 7 boy · Junior Java Builder",
    avatar: "👦",
    color: "#2f73b8",
    stars: 0,
    completedTasks: 0
  },
  child5: {
    id: "child5",
    name: "ZOE",
    roleLabel: "5 岁女孩 · 农场守护员 / Age 5 girl · Farm Helper",
    avatar: "👧",
    color: "#c2782f",
    stars: 0,
    completedTasks: 0
  }
};

export const DEFAULT_ACCOUNTS: Record<"daddy" | "zeo" | "zoe", Account> = {
  daddy: {
    id: "daddy",
    name: "Daddy",
    avatar: "👨",
    roleLabel: "后台管理员 · 管理奖品和价格 / Admin · Manages rewards and prices",
    memberId: "parent",
    isAdmin: true
  },
  zeo: {
    id: "zeo",
    name: "ZEO",
    avatar: "👦",
    roleLabel: "7 岁男孩账户 · 查看任务和成就 / Age 7 boy account · Checks quests and achievements",
    memberId: "child7",
    isAdmin: false
  },
  zoe: {
    id: "zoe",
    name: "ZOE",
    avatar: "👧",
    roleLabel: "独立儿童账户 · 查看任务和兑换 / Child account · Checks quests and rewards",
    memberId: "child5",
    isAdmin: false
  }
};

const chapter = (
  order: number,
  title: string,
  subtitle: string,
  description: string,
  ageBand: Chapter["ageBand"],
  skillTags: Chapter["skillTags"],
  javaFocus: string,
  parentGuide: string,
  unlockHint: string,
  unlock: Chapter["unlock"],
  isFuture = false
): Chapter => ({
  id: `chapter${order}` as ChapterId,
  title,
  subtitle,
  description,
  ageBand,
  skillTags,
  javaFocus,
  parentGuide,
  order,
  unlockHint,
  unlock,
  isFuture
});

export const CHAPTERS: Chapter[] = [
  chapter(
    1,
    "第一章：Java 生存新手村 / Chapter 1: Java Survival Village",
    "安全、食物、第一座家 / Safety, food, and the first home",
    "从 Java 版生存模式开始，学会白天黑夜、安全屋、食物和基本操作。/ Start Java survival with day-night rhythm, shelter, food, and basic controls.",
    "5-7",
    ["survival", "building", "communication"],
    "Java 单人世界、键盘鼠标、物品栏和基础合成 / Java single-player world, keyboard, inventory, and crafting",
    "爸爸负责读任务卡和安全边界，ZEO 与 ZOE 负责尝试与表达。/ Dad reads cards and keeps boundaries; ZEO and ZOE try and speak.",
    "默认开启 / Open by default",
    { requiredCompletedCount: 0 }
  ),
  chapter(
    2,
    "第二章：家庭基地 / Chapter 2: Family Base",
    "家庭大厅、公共箱子、路标 / Family hall, shared chests, and signs",
    "从临时房子升级为可长期使用的家庭基地。/ Turn the first shelter into a long-term family base.",
    "5-7",
    ["building", "storage", "communication"],
    "Java 存档意识、截图纪念、坐标记录 / Java world habits, screenshots, and coordinates",
    "让孩子参与命名、选择颜色和决定房间用途。/ Let kids name places, choose colors, and decide room purpose.",
    "完成第一章 5 个任务 / Finish 5 Chapter 1 quests",
    { requiredCompletedCount: 5, requiredTaskIds: ["survive-first-night", "build-safe-home"] }
  ),
  chapter(
    3,
    "第三章：农场与食物 / Chapter 3: Food and Farm",
    "农作物、动物、稳定食物 / Crops, animals, and steady food",
    "建立食物系统，让家庭基地不再为饥饿发愁。/ Build a food system so the family base stays fed.",
    "5-7",
    ["farming", "survival", "communication"],
    "Java 农田、动物繁殖、剪羊毛和基础资源循环 / Java farming, breeding, shearing, and resource loops",
    "ZOE 可以负责命名动物，ZEO 负责补种。/ ZOE names animals; ZEO replants crops.",
    "完成第二章 4 个任务 / Finish 4 Chapter 2 quests",
    { requiredCompletedCount: 4, requiredTaskIds: ["shared-chest", "light-up-base"] }
  ),
  chapter(
    4,
    "第四章：工具时代 / Chapter 4: Tool Age",
    "木、石、铁工具升级 / Wood, stone, and iron tools",
    "理解工具升级、安全挖矿和基础装备。/ Learn tool progression, safe mining, and basic gear.",
    "7-9",
    ["survival", "combat", "exploration"],
    "Java 矿洞安全、盾牌、F3 坐标启蒙 / Java mine safety, shield, and F3 coordinate intro",
    "爸爸做矿洞安全观察员，不急着替 ZEO 操作。/ Dad watches mine safety without taking over for ZEO.",
    "完成第三章 4 个任务 / Finish 4 Chapter 3 quests",
    { requiredCompletedCount: 4, requiredTaskIds: ["store-thirty-food", "animal-pen"] }
  ),
  chapter(
    5,
    "第五章：道路与地图 / Chapter 5: Roads and Maps",
    "坐标、路牌、地图和回家路 / Coordinates, signs, maps, and roads home",
    "把“别迷路”变成可学习的空间能力。/ Turn not getting lost into a spatial skill.",
    "7-9",
    ["exploration", "building", "reflection"],
    "Java 坐标、地图物品、路标系统 / Java coordinates, map items, and sign systems",
    "鼓励孩子口头描述方向，再用路牌验证。/ Ask kids to describe direction, then verify with signs.",
    "完成第四章 4 个任务 / Finish 4 Chapter 4 quests",
    { requiredCompletedCount: 4, requiredTaskIds: ["mine-iron", "craft-shield"] }
  ),
  chapter(
    6,
    "第六章：小镇计划 / Chapter 6: Small Town Plan",
    "规划、分工、复盘 / Planning, roles, and review",
    "从随手建造进入项目规划，开始用家庭会议决定下一步。/ Move from random building into planned family projects.",
    "7-9",
    ["building", "creative", "communication", "reflection"],
    "Java 建筑规划、截图对比、项目复盘 / Java build planning, screenshot comparison, and project review",
    "爸爸主持简短会议，让 ZEO 和 ZOE 说出下一栋建筑的理由。/ Dad hosts short meetings and asks ZEO and ZOE to explain choices.",
    "完成第五章 4 个任务 / Finish 4 Chapter 5 quests",
    { requiredCompletedCount: 4, requiredTaskIds: ["record-home-coordinates", "build-road-home"] }
  ),
  chapter(
    7,
    "第七章：安全探险 / Chapter 7: Safe Exploration",
    "准备、路线、撤退 / Preparation, routes, and retreat",
    "学会带着计划冒险，而不是冲动乱跑。/ Explore with a plan instead of rushing out.",
    "8-11",
    ["exploration", "survival", "reflection"],
    "Java 洞穴、临时营地、路线记录 / Java caves, camps, and route records",
    "未来章节，等孩子能稳定复述安全规则后开启。/ Future chapter, open when kids can repeat safety rules.",
    "未来章节 / Future chapter",
    { requiredCompletedCount: 0 },
    true
  ),
  chapter(
    8,
    "第八章：战斗训练 / Chapter 8: Combat Training",
    "盾牌、距离、补血 / Shield, distance, and healing",
    "把战斗训练成判断力，而不是冲动。/ Train combat as judgment, not impulse.",
    "8-11",
    ["combat", "survival", "reflection"],
    "Java 盾牌节奏、弓箭、怪物距离 / Java shield timing, bow, and mob distance",
    "未来章节，先练撤退再练击败。/ Future chapter: practice retreat before victory.",
    "未来章节 / Future chapter",
    { requiredCompletedCount: 0 },
    true
  ),
  chapter(
    9,
    "第九章：村庄与交易 / Chapter 9: Villages and Trading",
    "村民、安全和交换 / Villagers, safety, and exchange",
    "理解保护村庄、职业方块和公平交易。/ Learn village protection, job blocks, and fair trade.",
    "8-11",
    ["trading", "building", "communication"],
    "Java 村民职业、交易大厅、村庄保护 / Java villager jobs, trading hall, and village safety",
    "未来章节，引导孩子尊重村庄结构。/ Future chapter: guide respect for villages.",
    "未来章节 / Future chapter",
    { requiredCompletedCount: 0 },
    true
  ),
  chapter(
    10,
    "第十章：红石入门 / Chapter 10: Redstone Basics",
    "信号、开关、因果关系 / Signals, switches, and cause-effect",
    "用红石学习逻辑和工程思维。/ Use redstone to learn logic and engineering.",
    "9-13",
    ["redstone", "engineering", "reflection"],
    "Java 红石信号、拉杆、按钮、压力板 / Java redstone signal, levers, buttons, pressure plates",
    "未来章节，先让孩子画电路，再调试。/ Future chapter: draw circuits before debugging.",
    "未来章节 / Future chapter",
    { requiredCompletedCount: 0 },
    true
  ),
  chapter(
    11,
    "第十一章：自动农场 / Chapter 11: Automatic Farms",
    "漏斗、产量、维护 / Hoppers, output, and maintenance",
    "从重复劳动进入自动化系统。/ Move from repeated labor into automation.",
    "9-13",
    ["automation", "redstone", "farming"],
    "Java 自动甘蔗、竹子、漏斗收集 / Java auto sugar cane, bamboo, and hopper collection",
    "未来章节，要求 ZEO 或 ZOE 说明机器输入和输出。/ Future chapter: ZEO or ZOE explains machine input and output.",
    "未来章节 / Future chapter",
    { requiredCompletedCount: 0 },
    true
  ),
  chapter(
    12,
    "第十二章：仓储与分拣 / Chapter 12: Storage and Sorting",
    "分类、规则、系统维护 / Categories, rules, and maintenance",
    "把物品整理成可长期维护的系统。/ Turn storage into a maintainable system.",
    "9-13",
    ["storage", "automation", "reflection"],
    "Java 漏斗线、物品分拣、仓库规则 / Java hopper lines, item sorting, and storage rules",
    "未来章节，强调维护规则比机器更重要。/ Future chapter: rules matter more than machines.",
    "未来章节 / Future chapter",
    { requiredCompletedCount: 0 },
    true
  ),
  chapter(
    13,
    "第十三章：下界远征 / Chapter 13: Nether Expedition",
    "高风险环境和安全返程 / High risk and safe return",
    "在高风险环境中练习准备、冷静和撤退。/ Practice preparation, calm, and retreat in high risk.",
    "10-14",
    ["exploration", "combat", "reflection"],
    "Java 下界门、堡垒、坐标换算 / Java Nether portal, fortress, and coordinate scaling",
    "未来章节，爸爸先确认安全规则和备份。/ Future chapter: Dad confirms rules and backup first.",
    "未来章节 / Future chapter",
    { requiredCompletedCount: 0 },
    true
  ),
  chapter(
    14,
    "第十四章：末地挑战 / Chapter 14: The End Challenge",
    "计划、练习、最终挑战 / Plan, practice, and final challenge",
    "把长期准备汇总到一次团队挑战。/ Combine long preparation into one team challenge.",
    "10-14",
    ["combat", "exploration", "communication"],
    "Java 要塞、末影龙、装备清单 / Java stronghold, Ender Dragon, and gear checklist",
    "未来章节，把胜负看成项目复盘材料。/ Future chapter: treat win or loss as review material.",
    "未来章节 / Future chapter",
    { requiredCompletedCount: 0 },
    true
  ),
  chapter(
    15,
    "第十五章：鞘翅与天空工程 / Chapter 15: Elytra and Sky Projects",
    "飞行、路线、天空基地 / Flight, routes, and sky base",
    "学习高机动后的安全规则和大型建设。/ Learn safety rules after high mobility.",
    "10-14",
    ["exploration", "building", "reflection"],
    "Java 鞘翅、烟花、天空路线 / Java Elytra, rockets, and sky routes",
    "未来章节，先练安全着陆再远行。/ Future chapter: land safely before long flights.",
    "未来章节 / Future chapter",
    { requiredCompletedCount: 0 },
    true
  ),
  chapter(
    16,
    "第十六章：命令与规则系统 / Chapter 16: Commands and Rules",
    "命令、计分、规则意识 / Commands, scoreboards, and rules",
    "从玩家开始理解游戏系统和权限边界。/ Move from player to understanding systems and permissions.",
    "12-15",
    ["commands", "technical", "communication"],
    "Java /tp、/give、/scoreboard、/execute 基础 / Java command basics",
    "未来章节，命令必须服务规则，不用来破坏挑战。/ Future chapter: commands serve rules, not shortcuts.",
    "未来章节 / Future chapter",
    { requiredCompletedCount: 0 },
    true
  ),
  chapter(
    17,
    "第十七章：数据包与资源包 / Chapter 17: Datapacks and Resource Packs",
    "自定义配方、进度、贴图 / Recipes, advancements, and textures",
    "从玩内容进入创作内容。/ Move from playing content to creating content.",
    "12-15",
    ["datapacks", "resourcepacks", "portfolio"],
    "Java datapacks、resourcepacks、语言文件 / Java datapacks, resourcepacks, and language files",
    "未来章节，先备份世界，再动文件。/ Future chapter: backup before editing files.",
    "未来章节 / Future chapter",
    { requiredCompletedCount: 0 },
    true
  ),
  chapter(
    18,
    "第十八章：服务器与作品集 / Chapter 18: Server and Portfolio",
    "服务器、规则、教学输出 / Server, rules, and teaching output",
    "把 Minecraft 项目沉淀成作品集和带队经验。/ Turn Minecraft projects into portfolio and leadership experience.",
    "15-18",
    ["server", "portfolio", "teaching", "communication"],
    "Java server.properties、whitelist、备份、README / Java server settings, whitelist, backup, and README",
    "未来章节，重点是安全、记录、协作和表达。/ Future chapter: safety, records, collaboration, and expression.",
    "未来章节 / Future chapter",
    { requiredCompletedCount: 0 },
    true
  )
];

const task = (item: Task): Task => item;

export const DEFAULT_TASKS: Task[] = [
  task({
    id: "survive-first-night",
    title: "活过第一晚 / Survive the First Night",
    description: "找到临时藏身处，点亮周围，安全等到天亮。/ Find shelter, light the area, and stay safe until morning.",
    type: "team",
    difficulty: "easy",
    rewardStars: 2,
    applicableRoles: MEMBER_ORDER,
    chapterId: "chapter1",
    ageBand: "5-7",
    skillTags: ["survival", "communication"],
    javaFocus: "Java 生存模式第一晚、物品栏、合成台 / First Java survival night, inventory, crafting table",
    parentGuide: "把危险说成可观察规则：天黑、怪物声、血量低。/ Turn danger into observable rules: dark, mob sounds, low health.",
    isMainMilestone: true,
    isTodayRecommended: true
  }),
  task({
    id: "build-safe-home",
    title: "建一个安全的家 / Build a Safe Home",
    description: "有门、墙、屋顶和照明，晚上怪物进不来。/ Add doors, walls, a roof, and lights so monsters stay out.",
    type: "team",
    difficulty: "normal",
    rewardStars: 3,
    applicableRoles: MEMBER_ORDER,
    chapterId: "chapter1",
    ageBand: "5-7",
    skillTags: ["building", "survival"],
    javaFocus: "Java 方块放置、门、火把照明 / Java block placement, doors, torches",
    parentGuide: "让孩子判断哪里还不安全，再补墙或补光。/ Ask kids to find unsafe spots and fix walls or light.",
    guide: {
      title: "安全屋建造提示 / Safe Home Guide",
      materials: [
        "木头 20-30 个原木 / 20-30 logs",
        "圆石或泥土 40-60 个方块 / 40-60 cobblestone or dirt blocks",
        "木门 1-2 个 / 1-2 wooden doors",
        "火把 8-12 支 / 8-12 torches",
        "床 1 张 / 1 bed",
        "箱子 1 个 / 1 chest"
      ],
      crafting: [
        "木板：把原木放进背包合成格，1 个原木可变 4 个木板。/ Planks: put logs in the inventory crafting grid; 1 log makes 4 planks.",
        "合成台：用 4 个木板填满 2x2 合成格。/ Crafting table: fill the 2x2 grid with 4 planks.",
        "木门：在合成台里用 6 个木板摆成两列，可获得木门。/ Door: place 6 planks in two vertical columns on a crafting table.",
        "木棍：两个木板上下摆放，获得木棍。/ Sticks: place 2 planks vertically.",
        "火把：煤炭或木炭放在木棍上方。/ Torch: place coal or charcoal above a stick.",
        "箱子：8 个木板围一圈，中间留空。/ Chest: place 8 planks around the crafting grid, leaving the center empty."
      ],
      steps: [
        "第一步：选位置。找一块平地，离出生点不要太远，附近最好有树和食物。/ Step 1: Choose a flat spot near spawn, with trees and food nearby.",
        "第二步：做临时外墙。先用泥土、圆石或木板围出 5x5 或 6x6 的空间。/ Step 2: Build temporary walls, about 5x5 or 6x6 blocks.",
        "第三步：封顶和留门。屋顶补上，正面留 1 个门洞并装上木门。/ Step 3: Add a roof, leave one doorway, and place a wooden door.",
        "第四步：点亮里面和门口。屋内四角、门口两侧都插火把。/ Step 4: Light the corners inside and both sides of the door.",
        "第五步：放床和箱子。床靠墙放，箱子放在不挡门的位置。/ Step 5: Place the bed by a wall and the chest away from the doorway.",
        "第六步：检查安全。晚上从屋里看，怪物不能进来，屋内没有黑暗角落。/ Step 6: Safety check at night: mobs cannot enter and no dark corners remain."
      ],
      tips: [
        "如果天快黑了，先做泥土小屋也可以，第二天再美化。/ If night is coming, a dirt hut is fine; decorate tomorrow.",
        "ZOE 可以负责数火把，ZEO 可以负责检查门有没有装好。/ ZOE can count torches; ZEO can check the door.",
        "爸爸只提醒安全点，不急着替孩子建完整房子。/ Dad gives safety hints without taking over the full build."
      ]
    },
    isMainMilestone: true,
    isTodayRecommended: true
  }),
  task({
    id: "make-first-bed",
    title: "做一张床 / Make a Bed",
    description: "收集羊毛和木板，完成第一张可以睡觉的床。/ Collect wool and planks to make the first sleeping bed.",
    type: "personal",
    difficulty: "easy",
    rewardStars: 1,
    applicableRoles: MEMBER_ORDER,
    chapterId: "chapter1",
    ageBand: "5-7",
    skillTags: ["survival"],
    javaFocus: "Java 合成配方和睡觉跳过夜晚 / Java recipe and sleeping through night",
    parentGuide: "ZOE 可以选床的颜色。/ ZOE can choose bed color."
  }),
  task({
    id: "chest-and-torch",
    title: "做箱子和火把 / Make a Chest and Torches",
    description: "做出 1 个箱子和至少 8 支火把，整理基地物资。/ Make 1 chest and at least 8 torches to organize supplies.",
    type: "team",
    difficulty: "easy",
    rewardStars: 2,
    applicableRoles: MEMBER_ORDER,
    chapterId: "chapter1",
    ageBand: "5-7",
    skillTags: ["storage", "survival"],
    javaFocus: "Java 箱子、煤炭、木棍、火把 / Java chest, coal, sticks, torches",
    parentGuide: "把整理说成“给物品找家”。/ Describe sorting as giving items a home."
  }),
  task({
    id: "stock-ten-food",
    title: "储备 10 个食物 / Store 10 Food Items",
    description: "苹果、面包、熟肉或胡萝卜都可以，放进家庭箱子。/ Store apples, bread, cooked meat, or carrots in the family chest.",
    type: "team",
    difficulty: "normal",
    rewardStars: 3,
    applicableRoles: MEMBER_ORDER,
    chapterId: "chapter1",
    ageBand: "5-7",
    skillTags: ["survival", "farming"],
    javaFocus: "Java 饥饿值和食物恢复 / Java hunger and food recovery",
    parentGuide: "让孩子数到 10，顺便练数量感。/ Let kids count to 10 and practice number sense.",
    isMainMilestone: true
  }),
  task({
    id: "java-control-practice",
    title: "Java 操作练习 5 分钟 / Practice Java Controls for 5 Minutes",
    description: "练习走、跳、打开物品栏、切换物品，不急着完成大目标。/ Practice moving, jumping, inventory, and hotbar before big goals.",
    type: "daily",
    difficulty: "easy",
    rewardStars: 1,
    applicableRoles: ["child7", "child5"],
    chapterId: "chapter1",
    ageBand: "5-7",
    skillTags: ["survival"],
    javaFocus: "Java 键盘鼠标和快捷栏 / Java keyboard, mouse, and hotbar",
    parentGuide: "如果孩子卡住，先口头提示，再示范一次。/ If stuck, give a verbal hint before demonstrating."
  }),

  task({
    id: "name-the-base",
    title: "给基地起名字 / Name the Base",
    description: "全家一起给基地起一个名字，并用告示牌写在门口。/ Name the base together and write it on a sign.",
    type: "creative",
    difficulty: "easy",
    rewardStars: 2,
    applicableRoles: MEMBER_ORDER,
    chapterId: "chapter2",
    ageBand: "5-7",
    skillTags: ["building", "communication"],
    javaFocus: "Java 告示牌输入和中文/英文命名 / Java sign text and bilingual naming",
    parentGuide: "让两个孩子都给出一个候选名字。/ Let both kids suggest one name.",
    isTodayRecommended: true
  }),
  task({
    id: "family-hall",
    title: "建家庭大厅 / Build a Family Hall",
    description: "做一个大家集合、放地图和任务牌的房间。/ Build a room for gathering, maps, and quest signs.",
    type: "team",
    difficulty: "normal",
    rewardStars: 3,
    applicableRoles: MEMBER_ORDER,
    chapterId: "chapter2",
    ageBand: "5-7",
    skillTags: ["building", "communication"],
    javaFocus: "Java 室内空间、照明和功能区 / Java rooms, lighting, and functional areas",
    parentGuide: "先画一个简单平面，再开工。/ Sketch a simple plan before building.",
    isMainMilestone: true
  }),
  task({
    id: "shared-chest",
    title: "做家庭公共箱子 / Make a Shared Family Chest",
    description: "设定哪些物品可以放公共箱子，哪些要放个人箱子。/ Decide what belongs in shared chests and personal chests.",
    type: "team",
    difficulty: "easy",
    rewardStars: 2,
    applicableRoles: MEMBER_ORDER,
    chapterId: "chapter2",
    ageBand: "5-7",
    skillTags: ["storage", "communication"],
    javaFocus: "Java 箱子分类和告示牌标签 / Java chest sorting and sign labels",
    parentGuide: "用“公共”和“个人”解释边界。/ Use shared and personal to explain boundaries.",
    isMainMilestone: true
  }),
  task({
    id: "light-up-base",
    title: "点亮基地 / Light Up the Base",
    description: "检查基地周围暗处，用火把或灯补亮。/ Check dark spots around the base and add torches or lamps.",
    type: "team",
    difficulty: "normal",
    rewardStars: 3,
    applicableRoles: MEMBER_ORDER,
    chapterId: "chapter2",
    ageBand: "5-7",
    skillTags: ["survival", "building"],
    javaFocus: "Java 怪物生成安全意识 / Java mob spawning safety awareness",
    parentGuide: "让孩子找“黑黑的地方”。/ Ask kids to find dark spots.",
    isMainMilestone: true
  }),
  task({
    id: "base-screenshot",
    title: "拍一张基地纪念照 / Take a Base Screenshot",
    description: "用截图记录基地现在的样子，之后可以对比成长。/ Take a screenshot to compare the base later.",
    type: "reflection",
    difficulty: "easy",
    rewardStars: 1,
    applicableRoles: ["parent", "child7"],
    chapterId: "chapter2",
    ageBand: "5-7",
    skillTags: ["reflection", "portfolio"],
    javaFocus: "Java 截图和文件记录 / Java screenshots and file records",
    parentGuide: "爸爸帮忙保存截图，ZEO 和 ZOE 说出最喜欢的部分。/ Dad saves it; ZEO and ZOE name a favorite part."
  }),

  task({
    id: "first-farm",
    title: "种下第一块农田 / Plant the First Farm Plot",
    description: "开垦土地并种下种子，ZOE 可以负责播种或浇水口令。/ Hoe soil and plant seeds; ZOE can help with planting or water reminders.",
    type: "personal",
    difficulty: "easy",
    rewardStars: 2,
    applicableRoles: ["child5", "parent"],
    chapterId: "chapter3",
    ageBand: "5-7",
    skillTags: ["farming"],
    javaFocus: "Java 锄头、湿润耕地和种子 / Java hoe, hydrated farmland, and seeds",
    parentGuide: "让孩子观察哪里能种、哪里不能种。/ Let kids observe where crops can grow.",
    isTodayRecommended: true
  }),
  task({
    id: "animal-pen",
    title: "建动物围栏 / Build an Animal Pen",
    description: "围出安全空间，留好门，避免动物跑走。/ Fence a safe space with a gate so animals do not run away.",
    type: "team",
    difficulty: "normal",
    rewardStars: 3,
    applicableRoles: MEMBER_ORDER,
    chapterId: "chapter3",
    ageBand: "5-7",
    skillTags: ["farming", "building"],
    javaFocus: "Java 栅栏、栅栏门和动物 AI / Java fences, gates, and animal behavior",
    parentGuide: "ZOE 负责检查门有没有关。/ ZOE checks whether the gate is closed.",
    isMainMilestone: true
  }),
  task({
    id: "raise-sheep-or-cow",
    title: "养一只羊或牛 / Keep a Sheep or Cow",
    description: "把动物引进围栏，ZOE 可以负责取名字。/ Lead an animal into the pen; ZOE can name it.",
    type: "personal",
    difficulty: "easy",
    rewardStars: 2,
    applicableRoles: ["child5", "parent"],
    chapterId: "chapter3",
    ageBand: "5-7",
    skillTags: ["farming", "communication"],
    javaFocus: "Java 小麦引动物和命名习惯 / Java wheat luring and naming habits",
    parentGuide: "让孩子给动物讲一个小故事。/ Ask the child to tell a tiny animal story."
  }),
  task({
    id: "store-thirty-food",
    title: "储备 30 个食物 / Store 30 Food Items",
    description: "把食物放进家庭箱子，并说出哪种食物最稳定。/ Store food and name the most reliable source.",
    type: "team",
    difficulty: "normal",
    rewardStars: 4,
    applicableRoles: MEMBER_ORDER,
    chapterId: "chapter3",
    ageBand: "5-7",
    skillTags: ["farming", "survival"],
    javaFocus: "Java 食物循环和稳定补给 / Java food loop and stable supply",
    parentGuide: "引导孩子比较打猎和种植。/ Guide kids to compare hunting and farming.",
    isMainMilestone: true
  }),
  task({
    id: "farm-review",
    title: "农场复盘 / Farm Review",
    description: "说出农场哪里好用、哪里容易忘记。/ Say what works well and what is easy to forget.",
    type: "reflection",
    difficulty: "easy",
    rewardStars: 1,
    applicableRoles: MEMBER_ORDER,
    chapterId: "chapter3",
    ageBand: "5-7",
    skillTags: ["reflection", "communication"],
    javaFocus: "Java 项目复盘习惯 / Java project review habit",
    parentGuide: "只问三个问题：完成了什么、卡在哪里、下次改什么。/ Ask only three questions: done, stuck, improve."
  }),

  task({
    id: "stone-tool-set",
    title: "做全套石工具 / Craft a Stone Tool Set",
    description: "做石镐、石斧、石铲和石剑，理解工具用途。/ Craft stone pickaxe, axe, shovel, and sword, then explain uses.",
    type: "personal",
    difficulty: "easy",
    rewardStars: 2,
    applicableRoles: ["child7", "parent"],
    chapterId: "chapter4",
    ageBand: "7-9",
    skillTags: ["survival"],
    javaFocus: "Java 工具升级路径 / Java tool progression",
    parentGuide: "让 7 岁孩子解释每个工具用来做什么。/ Ask age 7 to explain each tool."
  }),
  task({
    id: "mine-iron",
    title: "挖到铁矿 / Mine Iron Ore",
    description: "带足火把并标记回家路，安全挖到铁矿。/ Bring torches, mark the way home, and mine iron safely.",
    type: "exploration",
    difficulty: "hard",
    rewardStars: 3,
    applicableRoles: ["parent", "child7"],
    chapterId: "chapter4",
    ageBand: "7-9",
    skillTags: ["exploration", "survival"],
    javaFocus: "Java 挖矿安全和坐标启蒙 / Java mine safety and coordinate intro",
    parentGuide: "遇到怪物时先撤退再讨论。/ Retreat first, discuss after danger.",
    isMainMilestone: true
  }),
  task({
    id: "craft-shield",
    title: "做盾牌 / Craft a Shield",
    description: "做出盾牌并练习举盾、后退、补血。/ Craft a shield and practice blocking, stepping back, and healing.",
    type: "personal",
    difficulty: "normal",
    rewardStars: 3,
    applicableRoles: ["parent", "child7"],
    chapterId: "chapter4",
    ageBand: "7-9",
    skillTags: ["combat", "survival"],
    javaFocus: "Java 盾牌和副手 / Java shield and offhand",
    parentGuide: "强调盾牌是冷静工具，不是冲锋许可。/ Shield means calm, not charging in.",
    isMainMilestone: true
  }),
  task({
    id: "furnace-zone",
    title: "建熔炉区 / Build a Furnace Zone",
    description: "把熔炉、燃料、矿物箱放在同一区域。/ Put furnaces, fuel, and ore chests in one area.",
    type: "engineering",
    difficulty: "normal",
    rewardStars: 2,
    applicableRoles: MEMBER_ORDER,
    chapterId: "chapter4",
    ageBand: "7-9",
    skillTags: ["storage", "survival"],
    javaFocus: "Java 熔炼流程和功能区 / Java smelting flow and functional zone",
    parentGuide: "引导孩子说出输入、加工、输出。/ Ask kids to name input, process, output."
  }),

  task({
    id: "record-home-coordinates",
    title: "记录家的坐标 / Record Home Coordinates",
    description: "打开 F3 或由爸爸读取坐标，把家的位置写到任务本。/ Open F3 or let Dad read coordinates and write home position.",
    type: "technical",
    difficulty: "normal",
    rewardStars: 2,
    applicableRoles: ["parent", "child7"],
    chapterId: "chapter5",
    ageBand: "7-9",
    skillTags: ["exploration", "reflection"],
    javaFocus: "Java F3 坐标和方向 / Java F3 coordinates and direction",
    parentGuide: "不要一次讲太多 F3 信息，只看 XYZ。/ Do not explain all F3 info; focus on XYZ.",
    isMainMilestone: true
  }),
  task({
    id: "build-road-home",
    title: "修一条回家小路 / Build a Road Home",
    description: "从基地到常去地点铺出清楚道路，并放上路标或火把。/ Build a clear road with signs or torches.",
    type: "team",
    difficulty: "normal",
    rewardStars: 2,
    applicableRoles: MEMBER_ORDER,
    chapterId: "chapter5",
    ageBand: "7-9",
    skillTags: ["building", "exploration"],
    javaFocus: "Java 路标、火把路线和坐标意识 / Java signs, torch paths, and coordinate awareness",
    parentGuide: "让孩子测试：能不能自己走回家。/ Let kids test whether they can return alone.",
    isMainMilestone: true
  }),
  task({
    id: "make-first-map",
    title: "做第一张地图 / Make the First Map",
    description: "制作地图并找出基地大概位置。/ Make a map and locate the base area.",
    type: "exploration",
    difficulty: "normal",
    rewardStars: 3,
    applicableRoles: ["parent", "child7"],
    chapterId: "chapter5",
    ageBand: "7-9",
    skillTags: ["exploration"],
    javaFocus: "Java 地图物品和空间关系 / Java map item and spatial relation",
    parentGuide: "先让孩子猜方向，再看地图验证。/ Let kids guess direction before checking map."
  }),
  task({
    id: "paper-base-map",
    title: "画一张纸上基地地图 / Draw a Paper Base Map",
    description: "在纸上画基地、农场、道路和危险区域。/ Draw base, farm, roads, and danger areas on paper.",
    type: "reflection",
    difficulty: "easy",
    rewardStars: 2,
    applicableRoles: ["child7", "child5"],
    chapterId: "chapter5",
    ageBand: "7-9",
    skillTags: ["reflection", "communication"],
    javaFocus: "Java 世界信息转化为现实图示 / Turn Java world info into real-world diagram",
    parentGuide: "不追求画得像，只追求能说明。/ Accuracy matters less than explanation."
  }),

  task({
    id: "plan-town-center",
    title: "规划小镇中心 / Plan the Town Center",
    description: "开工前先决定广场、道路和第一栋建筑位置。/ Decide square, roads, and first building before building.",
    type: "creative",
    difficulty: "normal",
    rewardStars: 3,
    applicableRoles: MEMBER_ORDER,
    chapterId: "chapter6",
    ageBand: "7-9",
    skillTags: ["building", "communication"],
    javaFocus: "Java 建筑布局和项目计划 / Java build layout and project planning",
    parentGuide: "先问“为什么建在这里”。/ Ask why build it here.",
    isMainMilestone: true,
    isTodayRecommended: true
  }),
  task({
    id: "build-warehouse",
    title: "建仓库 / Build a Warehouse",
    description: "仓库要有入口、标签和至少 6 个分类箱。/ Warehouse needs entrance, labels, and at least 6 sorted chests.",
    type: "engineering",
    difficulty: "normal",
    rewardStars: 4,
    applicableRoles: MEMBER_ORDER,
    chapterId: "chapter6",
    ageBand: "7-9",
    skillTags: ["storage", "building"],
    javaFocus: "Java 仓库分类和长期维护 / Java storage categories and maintenance",
    parentGuide: "让孩子决定分类，不替他们完美整理。/ Let kids choose categories; do not perfect it for them.",
    isMainMilestone: true
  }),
  task({
    id: "build-watchtower",
    title: "建瞭望塔 / Build a Watchtower",
    description: "建一座能看清基地周围的塔，并加上安全楼梯。/ Build a tower with safe stairs and a good view.",
    type: "team",
    difficulty: "normal",
    rewardStars: 3,
    applicableRoles: MEMBER_ORDER,
    chapterId: "chapter6",
    ageBand: "7-9",
    skillTags: ["building", "survival"],
    javaFocus: "Java 高处安全和视野规划 / Java height safety and visibility planning",
    parentGuide: "提醒围栏和安全落点。/ Remind rails and safe landing spots."
  }),
  task({
    id: "town-review-meeting",
    title: "小镇复盘会议 / Town Review Meeting",
    description: "每人说一个最有用建筑和一个想改进的地方。/ Everyone names one useful building and one thing to improve.",
    type: "reflection",
    difficulty: "easy",
    rewardStars: 2,
    applicableRoles: MEMBER_ORDER,
    chapterId: "chapter6",
    ageBand: "7-9",
    skillTags: ["reflection", "communication"],
    javaFocus: "Java 项目复盘和下一步规划 / Java project review and next-step planning",
    parentGuide: "只记录，不评价孩子想法对错。/ Record ideas without judging right or wrong."
  })
];

export const FUTURE_CHAPTER_TASK_IDEAS: Partial<Record<ChapterId, string[]>> = {
  chapter7: [
    "出门前安全检查 / Adventure safety checklist",
    "第一次洞穴探险 / First cave adventure",
    "建临时营地 / Build a temporary camp",
    "记录探险路线 / Record the route"
  ],
  chapter8: [
    "练习举盾 / Practice shield use",
    "建安全训练场 / Build a safe training arena",
    "击败第一只怪物 / Defeat the first monster",
    "讨论什么时候不战斗 / Discuss when not to fight"
  ],
  chapter9: [
    "找到一个村庄 / Find a village",
    "点亮村庄 / Light up the village",
    "第一次交易 / First trade",
    "建村民市场 / Build a villager market"
  ],
  chapter10: [
    "做拉杆门 / Build a lever door",
    "做压力板门 / Build a pressure plate door",
    "做红石灯 / Build a redstone lamp",
    "画一张电路图 / Draw a circuit diagram"
  ],
  chapter11: [
    "做自动甘蔗农场 / Build an auto sugar cane farm",
    "做漏斗收集系统 / Build a hopper collector",
    "观察 10 分钟产量 / Measure 10-minute output",
    "给机器写说明牌 / Add instruction signs"
  ],
  chapter12: [
    "建大型仓库 / Build a large warehouse",
    "设计分类标签 / Design storage labels",
    "做基础物品分拣 / Build a basic item sorter",
    "制定家庭仓库规则 / Write family storage rules"
  ],
  chapter13: [
    "建下界门 / Build a Nether portal",
    "建安全入口 / Secure the portal",
    "寻找下界堡垒 / Find a Nether fortress",
    "完成安全返程 / Return safely"
  ],
  chapter14: [
    "收集末影之眼 / Collect eyes of ender",
    "找到要塞 / Find the stronghold",
    "准备装备清单 / Prepare gear checklist",
    "击败末影龙 / Defeat the Ender Dragon"
  ],
  chapter15: [
    "找到末地城 / Find an End City",
    "获得鞘翅 / Get Elytra",
    "练习安全飞行 / Practice safe flight",
    "建天空基地 / Build a sky base"
  ],
  chapter16: [
    "学习 /tp / Learn /tp",
    "学习 /give / Learn /give",
    "做传送点 / Make teleport points",
    "做计分小游戏 / Make a scoreboard mini-game"
  ],
  chapter17: [
    "备份世界文件 / Back up the world",
    "安装安全数据包 / Install a safe datapack",
    "做自定义配方 / Make a custom recipe",
    "修改一个贴图 / Edit one texture"
  ],
  chapter18: [
    "搭建本地 Java 服务器 / Run a local Java server",
    "设置白名单 / Set up whitelist",
    "制定服务器规则 / Write server rules",
    "录制作品演示 / Record a portfolio demo"
  ]
};

export const BEHAVIOR_BONUSES: BehaviorBonus[] = [
  {
    id: "help-sibling",
    title: "帮助 ZOE / Help ZOE",
    description: "主动帮 ZOE 找东西、回家或躲避危险。/ Help ZOE find items, get home, or avoid danger.",
    stars: 2,
    appliesTo: ["child7"]
  },
  {
    id: "stay-calm",
    title: "不发脾气 / Stay Calm",
    description: "遇到迷路、死亡或物品丢失时，愿意暂停并好好说。/ Pause and speak calmly when lost, defeated, or missing items.",
    stars: 2,
    appliesTo: MEMBER_ORDER
  },
  {
    id: "team-work",
    title: "团队合作 / Teamwork",
    description: "全家分工清楚，没有抢任务，完成一次共同目标。/ Everyone has a role and finishes one shared goal together.",
    stars: 3,
    appliesTo: "all"
  },
  {
    id: "parent-guide",
    title: "爸爸耐心带队 / Patient Dad Guide",
    description: "爸爸给出清晰提示，让 ZEO 和 ZOE 自己尝试，不急着包办。/ Dad gives clear hints and lets ZEO and ZOE try first.",
    stars: 2,
    appliesTo: ["parent"]
  },
  {
    id: "java-backup-habit",
    title: "Java 存档备份 / Java World Backup",
    description: "重要进度后主动提醒备份存档。/ Remind the family to back up the world after major progress.",
    stars: 3,
    appliesTo: ["parent", "child7"]
  }
];

export const REWARD_ITEMS: RewardItem[] = [
  {
    id: "snack-or-ten-min",
    title: "小零食 / 多玩 10 分钟 / Snack or 10 More Minutes",
    description: "适合当天兑现的小奖励。/ A small same-day reward.",
    cost: 10,
    scope: "personal",
    active: true
  },
  {
    id: "family-movie-choice",
    title: "家庭电影选择权 / Family Movie Pick",
    description: "由兑换者选择一次家庭电影。/ The redeemer chooses one family movie.",
    cost: 30,
    scope: "personal",
    active: true
  },
  {
    id: "choose-next-build",
    title: "选择下一栋建筑 / Choose the Next Build",
    description: "兑换者决定下一次家庭建筑主题。/ The redeemer chooses the next family build theme.",
    cost: 40,
    scope: "personal",
    active: true
  },
  {
    id: "choose-family-dessert",
    title: "选择家庭甜点 / Choose Family Dessert",
    description: "由兑换者选择一次家庭甜点。/ The redeemer chooses one family dessert.",
    cost: 25,
    scope: "personal",
    active: true
  },
  {
    id: "minecraft-skin-choice",
    title: "选择一次皮肤主题 / Choose One Skin Theme",
    description: "由爸爸审核安全来源后执行。/ Dad checks the source before using it.",
    cost: 45,
    scope: "personal",
    active: true
  },
  {
    id: "server-admin-night",
    title: "一晚服务器管理员 / Server Admin for One Night",
    description: "适合未来 Java 服务器阶段，由爸爸监督。/ For future Java server stage with Dad supervision.",
    cost: 80,
    scope: "personal",
    active: true
  },
  {
    id: "family-pizza-night",
    title: "家庭披萨夜 / Family Pizza Night",
    description: "全家一起兑换，星星从家庭总数中扣除。/ Redeem together using the family star total.",
    cost: 60,
    scope: "family",
    active: true
  },
  {
    id: "weekend-outing-vote",
    title: "周末出行投票权 / Weekend Outing Vote",
    description: "兑换后可以提出一个周末家庭活动候选。/ Redeemer proposes one weekend family activity.",
    cost: 90,
    scope: "family",
    active: true
  }
];
