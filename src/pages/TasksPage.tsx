import { useMemo, useState } from "react";
import {
  AGE_BAND_LABELS,
  DEFAULT_TASKS,
  FUTURE_CHAPTER_TASK_IDEAS,
  MEMBER_ORDER,
  SKILL_LABELS,
  TYPE_LABELS
} from "../data/defaultData";
import { useApp } from "../context/AppContext";
import { TaskCard } from "../components/TaskCard";
import type { ChapterId, MemberId, TaskType } from "../types";
import {
  getActiveChapters,
  getFutureChapters,
  getUnlockedChapterIds,
  isTaskCompleted
} from "../utils/progress";

type ChapterFilter = "all" | ChapterId;
type RoleFilter = "all" | MemberId;
type TypeFilter = "all" | TaskType;
type StatusFilter = "all" | "open" | "done";

export const TasksPage = () => {
  const { state } = useApp();
  const [chapter, setChapter] = useState<ChapterFilter>("all");
  const [role, setRole] = useState<RoleFilter>("all");
  const [type, setType] = useState<TypeFilter>("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [query, setQuery] = useState("");
  const unlockedChapters = getUnlockedChapterIds(state);
  const activeChapters = getActiveChapters();
  const futureChapters = getFutureChapters();

  const filteredTasks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return DEFAULT_TASKS.filter((task) => {
      const matchesChapter = chapter === "all" || task.chapterId === chapter;
      const matchesRole = role === "all" || task.applicableRoles.includes(role);
      const matchesType = type === "all" || task.type === type;
      const completed = isTaskCompleted(state, task.id);
      const matchesStatus =
        status === "all" || (status === "done" ? completed : !completed);
      const matchesQuery =
        !normalizedQuery ||
        `${task.title} ${task.description}`.toLowerCase().includes(normalizedQuery);

      return matchesChapter && matchesRole && matchesType && matchesStatus && matchesQuery;
    });
  }, [chapter, query, role, state, status, type]);

  return (
    <main className="page-shell">
      <section className="page-title">
        <span className="eyebrow">任务卡 / Quest Cards</span>
        <h1>任务中心 / Quest Center</h1>
        <p>前 6 章是当前可执行任务，后 12 章作为 Java 长期成长路线图保留。/ The first 6 chapters are playable now; the next 12 are kept as the long-term Java growth roadmap.</p>
      </section>

      <section className="filter-bar">
        <label>
          <span>章节 / Chapter</span>
          <select value={chapter} onChange={(event) => setChapter(event.target.value as ChapterFilter)}>
            <option value="all">全部章节 / All Chapters</option>
            {activeChapters.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>角色 / Role</span>
          <select value={role} onChange={(event) => setRole(event.target.value as RoleFilter)}>
            <option value="all">全部角色 / All Roles</option>
            {MEMBER_ORDER.map((memberId) => (
              <option key={memberId} value={memberId}>
                {state.members[memberId].name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>类型 / Type</span>
          <select value={type} onChange={(event) => setType(event.target.value as TypeFilter)}>
            <option value="all">全部类型 / All Types</option>
            {Object.entries(TYPE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>状态 / Status</span>
          <select value={status} onChange={(event) => setStatus(event.target.value as StatusFilter)}>
            <option value="all">全部状态 / All</option>
            <option value="open">未完成 / Open</option>
            <option value="done">已完成 / Done</option>
          </select>
        </label>
        <label className="search-field">
          <span>搜索 / Search</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="输入任务关键词 / Search quests"
          />
        </label>
      </section>

      <section className="task-grid">
        {filteredTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            locked={!unlockedChapters.includes(task.chapterId)}
          />
        ))}
      </section>

      {filteredTasks.length === 0 ? (
        <section className="panel empty-state">没有符合条件的任务，换个筛选试试。/ No matching quests. Try another filter.</section>
      ) : null}

      <section className="panel future-roadmap">
        <div className="section-heading">
          <div>
            <span className="eyebrow">未来章节 / Future Chapters</span>
            <h2>Java 长期成长路线图 / Java Long-Term Growth Roadmap</h2>
          </div>
        </div>
        <div className="future-grid">
          {futureChapters.map((chapter) => (
            <article key={chapter.id} className="future-card">
              <span className="pill pill-milestone">
                {AGE_BAND_LABELS[chapter.ageBand]}
              </span>
              <h3>{chapter.title}</h3>
              <p>{chapter.description}</p>
              <dl className="future-meta">
                <div>
                  <dt>Java 重点 / Java Focus</dt>
                  <dd>{chapter.javaFocus}</dd>
                </div>
                <div>
                  <dt>爸爸引导 / Dad Guide</dt>
                  <dd>{chapter.parentGuide}</dd>
                </div>
              </dl>
              <div className="skill-row">
                {chapter.skillTags.slice(0, 4).map((tag) => (
                  <span key={tag}>{SKILL_LABELS[tag]}</span>
                ))}
              </div>
              <div className="future-task-preview">
                <strong>小任务预告 / Quest Preview</strong>
                <ul>
                  {(FUTURE_CHAPTER_TASK_IDEAS[chapter.id] ?? []).map((idea) => (
                    <li key={idea}>{idea}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};
