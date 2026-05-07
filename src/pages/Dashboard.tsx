import { CHAPTERS, DEFAULT_TASKS, MEMBER_ORDER } from "../data/defaultData";
import { useApp } from "../context/AppContext";
import { FamilyIconStats } from "../components/FamilyIconStats";
import { MemberCard } from "../components/MemberCard";
import { ProgressBar } from "../components/ProgressBar";
import { StatCard } from "../components/StatCard";
import { TaskCard } from "../components/TaskCard";
import {
  getAchievementBadges,
  getActiveChapters,
  getChapterProgress,
  getCompletedTasks,
  getCurrentChapter,
  getFamilyStars,
  getFutureChapters,
  getRecentLogs,
  getTodayRecommendedTasks,
  getUnlockedChapterIds,
  getWeeklyTasks
} from "../utils/progress";
import type { PageId } from "./pageTypes";

interface DashboardProps {
  onNavigate: (page: PageId) => void;
}

const formatTime = (iso: string) =>
  new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(iso));

const TASK_PROGRESS_CELLS = 20;

export const Dashboard = ({ onNavigate }: DashboardProps) => {
  const { state } = useApp();
  const currentChapter = getCurrentChapter(state);
  const currentProgress = getChapterProgress(state, currentChapter.id);
  const familyStars = getFamilyStars(state);
  const completedTasks = getCompletedTasks(state);
  const allTaskPercent =
    DEFAULT_TASKS.length === 0
      ? 0
      : Math.round((completedTasks.length / DEFAULT_TASKS.length) * 100);
  const completedTaskCells =
    DEFAULT_TASKS.length === 0
      ? 0
      : Math.round((completedTasks.length / DEFAULT_TASKS.length) * TASK_PROGRESS_CELLS);
  const recommendedTasks = getTodayRecommendedTasks(state);
  const recentLogs = getRecentLogs(state, 6);
  const weeklyTasks = getWeeklyTasks(state);
  const unlockedChapters = getUnlockedChapterIds(state);
  const activeChapters = getActiveChapters();
  const futureChapters = getFutureChapters();
  const rankedMembers = MEMBER_ORDER.map((memberId) => state.members[memberId]).sort(
    (a, b) => b.stars - a.stars
  );
  const badges = getAchievementBadges(state);

  return (
    <main className="page-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">Java 家庭生存 / Java Family Survival</span>
          <h1>从小基地到 Java 作品集。/ From a little base to a Java portfolio.</h1>
          <p>
            前 6 章陪 5-9 岁孩子稳稳起步，后 12 章一路延伸到 15-18 岁的命令、数据包、服务器和作品集。/ The first 6 chapters support ages 5-9 now; the next 12 extend toward commands, datapacks, servers, and portfolios for ages 15-18.
          </p>
          <div className="hero-actions">
            <button className="button button-primary" type="button" onClick={() => onNavigate("tasks")}>
              去完成任务 / Do Quests
            </button>
            <button className="button button-ghost" type="button" onClick={() => onNavigate("rewards")}>
              看奖励商店 / Rewards
            </button>
          </div>
        </div>
        <img src="/pixel-family.svg" alt="像素家庭基地 / Pixel family base" className="hero-image" />
      </section>

      <section className="stats-grid">
        <StatCard label="家庭总星星 / Family Stars" value={familyStars} hint="可用于家庭兑换 / For family rewards" />
        <StatCard label="已完成任务 / Finished Quests" value={`${completedTasks.length}/${DEFAULT_TASKS.length}`} hint="长期累计 / All-time" />
        <StatCard label="当前章节 / Current Chapter" value={currentChapter.order} hint={currentChapter.title} />
        <StatCard label="当前可玩章节 / Playable Chapters" value={`${unlockedChapters.length}/${activeChapters.length}`} hint={`${futureChapters.length} 章未来路线图 / future chapters`} />
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <span className="eyebrow">整体进度 / Overall Progress</span>
            <h2>章节进度与所有任务 / Chapter Progress and All Quests</h2>
          </div>
          <button
            className="text-button"
            type="button"
            onClick={() => onNavigate("tasks")}
          >
            去任务中心 / Quest Center
          </button>
        </div>
        <div className="square-progress-stack">
          <div className="square-progress-row">
            <div className="square-progress-copy">
              <strong>章节进度 / Chapters</strong>
              <span>
                当前第 {currentChapter.order} 章，已开启 {unlockedChapters.length}/{activeChapters.length} 章 / Current Chapter {currentChapter.order}, {unlockedChapters.length}/{activeChapters.length} open
              </span>
            </div>
            <div className="square-progress-track chapter-square-track" aria-label="章节进度 / Chapter progress">
              {activeChapters.map((chapter) => {
                const progress = getChapterProgress(state, chapter.id);
                const unlocked = unlockedChapters.includes(chapter.id);
                const done = progress.total > 0 && progress.completed === progress.total;
                const current = currentChapter.id === chapter.id;
                const className = [
                  "progress-square",
                  "chapter-square",
                  done ? "done" : unlocked ? "open" : "locked",
                  current ? "current" : ""
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <span
                    key={chapter.id}
                    className={className}
                    title={`${chapter.title} · ${progress.completed}/${progress.total}`}
                    aria-label={`${chapter.title}: ${progress.completed}/${progress.total}`}
                  >
                    <b>{done ? "✓" : current ? "▶" : unlocked ? "◆" : "🔒"}</b>
                    <small>{chapter.order}</small>
                  </span>
                );
              })}
            </div>
          </div>

          <div className="square-progress-row">
            <div className="square-progress-copy">
              <strong>我所有任务 / All Quests</strong>
              <span>
                已完成 {completedTasks.length}/{DEFAULT_TASKS.length} 个任务，完成率 {allTaskPercent}% / {completedTasks.length}/{DEFAULT_TASKS.length} done, {allTaskPercent}%
              </span>
            </div>
            <div className="square-progress-track task-square-track" aria-label="所有任务进度 / All quest progress">
              {Array.from({ length: TASK_PROGRESS_CELLS }, (_, index) => {
                const filled = index < completedTaskCells;
                return (
                  <span
                    key={index}
                    className={filled ? "progress-square task-square done" : "progress-square task-square"}
                    aria-label={filled ? "已完成进度格 / Completed cell" : "未完成进度格 / Empty cell"}
                  >
                    {filled ? "⭐" : ""}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="section-grid two-columns">
        <div className="panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">章节 / Chapter</span>
              <h2>{currentChapter.title}</h2>
            </div>
            <strong>{currentProgress.percent}%</strong>
          </div>
          <p>{currentChapter.description}</p>
          <ProgressBar
            value={currentProgress.percent}
            label={`${currentProgress.completed}/${currentProgress.total} 个任务完成 / quests done`}
          />
          <div className="chapter-strip">
            {activeChapters.map((chapter) => {
              const progress = getChapterProgress(state, chapter.id);
              const unlocked = unlockedChapters.includes(chapter.id);
              return (
                <article key={chapter.id} className={unlocked ? "chapter-chip open" : "chapter-chip"}>
                  <span>{unlocked ? "已开启 / Open" : "未解锁 / Locked"}</span>
                  <strong>{chapter.title}</strong>
                  <small>{progress.completed}/{progress.total}</small>
                </article>
              );
            })}
          </div>
          <p className="roadmap-hint">
            长期路线图共有 {CHAPTERS.length} 章，当前任务中心先开放前 {activeChapters.length} 章。/ The long-term roadmap has {CHAPTERS.length} chapters; the quest center opens the first {activeChapters.length} for now.
          </p>
        </div>

        <div className="panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">排行榜 / Leaderboard</span>
              <h2>星星排行榜 / Star Leaderboard</h2>
            </div>
          </div>
          <FamilyIconStats members={rankedMembers} />
          <div className="member-list compact-list">
            {rankedMembers.map((member, index) => (
              <MemberCard key={member.id} member={member} rank={index + 1} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-grid two-columns">
        <div className="panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">今日 / Today</span>
              <h2>今日推荐任务 / Today’s Picks</h2>
            </div>
            <button className="text-button" type="button" onClick={() => onNavigate("tasks")}>
              全部任务 / All Quests
            </button>
          </div>
          <div className="task-list">
            {recommendedTasks.map((task) => (
              <TaskCard key={task.id} task={task} compact />
            ))}
            {recommendedTasks.length === 0 ? (
              <p className="empty-state">当前章节任务都完成了，去看看奖励商店吧。/ This chapter is done. Time to visit rewards.</p>
            ) : null}
          </div>
        </div>

        <div className="panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">本周 / Week</span>
              <h2>本周任务视图 / Weekly Quest View</h2>
            </div>
          </div>
          <div className="weekly-list">
            {weeklyTasks.map((task, index) => (
              <div key={task.id} className="weekly-item">
                <span>第 {index + 1} 天 / Day {index + 1}</span>
                <strong>{task.title}</strong>
                <small>+{task.rewardStars} 星 / stars</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-grid two-columns">
        <div className="panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">家庭 / Family</span>
              <h2>家庭成员 / Family Members</h2>
            </div>
          </div>
          <div className="member-list">
            {MEMBER_ORDER.map((memberId) => (
              <MemberCard key={memberId} member={state.members[memberId]} />
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">徽章 / Badges</span>
              <h2>家庭成就徽章 / Family Badges</h2>
            </div>
          </div>
          <div className="badge-grid">
            {badges.map((badge) => (
              <article key={badge.id} className={badge.unlocked ? "badge-card unlocked" : "badge-card"}>
                <img src="/pixel-badge.svg" alt="" aria-hidden="true" />
                <strong>{badge.title}</strong>
                <span>{badge.detail}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <span className="eyebrow">记录 / Log</span>
            <h2>最近完成记录 / Recent Activity</h2>
          </div>
        </div>
        <div className="timeline">
          {recentLogs.map((log) => (
            <article key={log.id} className="timeline-item">
              <time>{formatTime(log.createdAt)}</time>
              <div>
                <strong>{log.title}</strong>
                <p>{log.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};
