import type { Member } from "../types";

interface FamilyIconStatsProps {
  members: Member[];
}

const renderIcons = (
  count: number,
  icon: string,
  emptyIcon: string,
  maxVisible: number
) => {
  const visibleCount = Math.min(count, maxVisible);
  const icons = Array.from({ length: visibleCount }, (_, index) => (
    <span key={index} className="filled-icon" aria-hidden="true">
      {icon}
    </span>
  ));

  if (count === 0) {
    return [
      <span key="empty" className="empty-icon" aria-hidden="true">
        {emptyIcon}
      </span>
    ];
  }

  if (count > maxVisible) {
    icons.push(
      <strong key="more" className="more-icons">
        +{count - maxVisible}
      </strong>
    );
  }

  return icons;
};

export const FamilyIconStats = ({ members }: FamilyIconStatsProps) => (
  <div className="icon-stat-stack" aria-label="星星和任务图标 / Star and quest icons">
    <section className="icon-stat-panel">
      <div className="mini-heading">
        <strong>星星图标 / Star Icons</strong>
        <span>⭐ 表示奖励星星 / ⭐ means reward stars</span>
      </div>
      {members.map((member) => (
        <article key={member.id} className="icon-stat-row">
          <div className="icon-member-name">
            <span className="icon-member-avatar">{member.avatar}</span>
            <strong>{member.name}</strong>
          </div>
          <div className="icon-tray" aria-label={`${member.name} ${member.stars} stars`}>
            {renderIcons(member.stars, "⭐", "☆", 12)}
          </div>
          <b>{member.stars} 星 / stars</b>
        </article>
      ))}
    </section>

    <section className="icon-stat-panel">
      <div className="mini-heading">
        <strong>任务图标 / Quest Icons</strong>
        <span>■ 表示完成任务 / ■ means finished quests</span>
      </div>
      {members.map((member) => (
        <article key={member.id} className="icon-stat-row">
          <div className="icon-member-name">
            <span className="icon-member-avatar">{member.avatar}</span>
            <strong>{member.name}</strong>
          </div>
          <div className="icon-tray quest-icons" aria-label={`${member.name} ${member.completedTasks} quests`}>
            {renderIcons(member.completedTasks, "■", "□", 10)}
          </div>
          <b>{member.completedTasks} 任务 / quests</b>
        </article>
      ))}
    </section>
  </div>
);
