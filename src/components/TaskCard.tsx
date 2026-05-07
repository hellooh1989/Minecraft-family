import { useMemo, useState } from "react";
import {
  CHAPTERS,
  DIFFICULTY_LABELS,
  AGE_BAND_LABELS,
  MEMBER_ORDER,
  SKILL_LABELS,
  TYPE_LABELS
} from "../data/defaultData";
import { useApp } from "../context/AppContext";
import type { MemberId, Task } from "../types";
import { formatMembers, isTaskCompleted } from "../utils/progress";

interface TaskCardProps {
  task: Task;
  locked?: boolean;
  compact?: boolean;
}

const isAllHandsTask = (task: Task) =>
  task.type === "team" ||
  (task.applicableRoles.length === MEMBER_ORDER.length &&
    task.type !== "personal" &&
    task.type !== "daily");

export const TaskCard = ({ task, locked = false, compact = false }: TaskCardProps) => {
  const { state, completeTask, cancelTask } = useApp();
  const [assignee, setAssignee] = useState<MemberId>(task.applicableRoles[0]);
  const [showGuide, setShowGuide] = useState(false);
  const completed = isTaskCompleted(state, task.id);
  const progress = state.taskProgress[task.id];
  const chapter = CHAPTERS.find((item) => item.id === task.chapterId);
  const shouldPickAssignee = !isAllHandsTask(task) && task.applicableRoles.length > 1;

  const completedBy = useMemo(() => {
    if (!progress?.completedBy) return "";
    return formatMembers(progress.completedBy);
  }, [progress]);

  return (
    <article className={`task-card ${completed ? "completed" : ""} ${locked ? "locked" : ""}`}>
      <button
        className="guide-corner-button"
        type="button"
        onClick={() => setShowGuide(true)}
        aria-label={`打开提示 / Open hint: ${task.title}`}
      >
        ? 提示 / Hint
      </button>
      <div className="task-card-header">
        <div>
          <span className={`pill pill-${task.type}`}>{TYPE_LABELS[task.type]}</span>
          {task.isMainMilestone ? <span className="pill pill-milestone">解锁关键 / Unlock Key</span> : null}
        </div>
        <strong className="star-reward">+{task.rewardStars} 星 / stars</strong>
      </div>

      <h3>{task.title}</h3>
      <p>{task.description}</p>

      {!compact ? (
        <>
          <dl className="task-meta">
            <div>
              <dt>难度 / Difficulty</dt>
              <dd>{DIFFICULTY_LABELS[task.difficulty]}</dd>
            </div>
            <div>
              <dt>角色 / Roles</dt>
              <dd>{isAllHandsTask(task) ? "全员 / Everyone" : formatMembers(task.applicableRoles)}</dd>
            </div>
            <div>
              <dt>年龄 / Age</dt>
              <dd>
                {AGE_BAND_LABELS[task.ageBand ?? chapter?.ageBand ?? "5-7"]}
              </dd>
            </div>
          </dl>
          {task.skillTags?.length ? (
            <div className="skill-row">
              {task.skillTags.slice(0, 4).map((tag) => (
                <span key={tag}>{SKILL_LABELS[tag]}</span>
              ))}
            </div>
          ) : null}
          {task.javaFocus || task.parentGuide ? (
            <div className="task-guidance">
              {task.javaFocus ? (
                <p>
                  <b>Java 重点 / Java Focus:</b> {task.javaFocus}
                </p>
              ) : null}
              {task.parentGuide ? (
                <p>
                  <b>爸爸引导 / Dad Guide:</b> {task.parentGuide}
                </p>
              ) : null}
            </div>
          ) : null}
        </>
      ) : null}

      {completed ? (
        <div className="task-complete-note">
          已完成 / Done{completedBy ? `: ${completedBy}` : ""}
        </div>
      ) : null}

      <div className="task-actions">
        {shouldPickAssignee && !completed ? (
          <label className="inline-field">
            <span>结算给 / Award to</span>
            <select
              value={assignee}
              onChange={(event) => setAssignee(event.target.value as MemberId)}
              disabled={locked}
            >
              {task.applicableRoles.map((memberId) => (
                <option key={memberId} value={memberId}>
                  {state.members[memberId].name}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        {completed ? (
          <button className="button button-ghost" type="button" onClick={() => cancelTask(task.id)}>
            取消完成 / Undo
          </button>
        ) : (
          <button
            className="button button-primary"
            type="button"
            disabled={locked}
            onClick={() => completeTask(task.id, assignee)}
          >
            {locked ? "章节未解锁 / Locked" : "完成任务 / Finish"}
          </button>
        )}
      </div>

      {showGuide ? (
        <TaskGuideModal task={task} onClose={() => setShowGuide(false)} />
      ) : null}
    </article>
  );
};

interface TaskGuideModalProps {
  task: Task;
  onClose: () => void;
}

const TaskGuideModal = ({ task, onClose }: TaskGuideModalProps) => {
  const guide = task.guide;
  const materials = guide?.materials ?? [
    "先阅读任务描述，准备任务里提到的主要物品。/ Read the quest description and prepare the main items mentioned.",
    "带上食物、工具和火把，避免任务中途卡住。/ Bring food, tools, and torches so the quest does not stall."
  ];
  const crafting = guide?.crafting ?? [
    "如果任务需要合成，先做合成台，再根据物品配方准备材料。/ If crafting is needed, make a crafting table first and prepare recipe materials.",
    "不确定配方时，可以先问爸爸，或在 Java 版配方书里搜索物品。/ If unsure, ask Dad or search the item in the Java recipe book."
  ];
  const steps = guide?.steps ?? [
    "第一步：确认任务目标。/ Step 1: Confirm the quest goal.",
    "第二步：分配角色，决定爸爸、ZEO、ZOE 各做什么。/ Step 2: Assign roles for Dad, ZEO, and ZOE.",
    "第三步：准备物资和工具。/ Step 3: Prepare materials and tools.",
    "第四步：完成后一起检查是否符合任务描述。/ Step 4: Check together whether the quest is finished."
  ];
  const tips = guide?.tips ?? [
    task.javaFocus ?? "关注 Java 版里的操作习惯。/ Watch the Java Edition control habit.",
    task.parentGuide ?? "爸爸给提示，让孩子先尝试。/ Dad gives hints and lets kids try first."
  ];

  return (
    <div className="guide-modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="guide-modal"
        role="dialog"
        aria-modal="true"
        aria-label={guide?.title ?? `任务提示 / Quest hint: ${task.title}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="guide-modal-header">
          <div>
            <span className="eyebrow">任务提示 / Quest Hint</span>
            <h2>{guide?.title ?? task.title}</h2>
          </div>
          <button type="button" className="guide-close" onClick={onClose} aria-label="关闭 / Close">
            ×
          </button>
        </div>

        <p className="guide-summary">{task.description}</p>

        <div className="guide-sections">
          <GuideSection title="需要物资 / Materials" items={materials} />
          <GuideSection title="相关合成 / Related Crafting" items={crafting} />
          <GuideSection title="具体步骤 / Steps" items={steps} ordered />
          <GuideSection title="小提示 / Tips" items={tips} />
        </div>
      </section>
    </div>
  );
};

const GuideSection = ({
  title,
  items,
  ordered = false
}: {
  title: string;
  items: string[];
  ordered?: boolean;
}) => {
  const ListTag = ordered ? "ol" : "ul";

  return (
    <section className="guide-section">
      <h3>{title}</h3>
      <ListTag>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ListTag>
    </section>
  );
};
