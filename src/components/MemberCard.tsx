import type { CSSProperties } from "react";
import { getMemberTitle } from "../utils/progress";
import type { Member } from "../types";

interface MemberCardProps {
  member: Member;
  rank?: number;
}

export const MemberCard = ({ member, rank }: MemberCardProps) => (
  <article
    className="member-card"
    style={{ "--member-color": member.color } as CSSProperties}
  >
    <div className="member-avatar" aria-hidden="true">
      {member.avatar}
    </div>
    <div>
      <div className="member-topline">
        <h3>{member.name}</h3>
        {rank ? <span className="rank-badge">#{rank}</span> : null}
      </div>
      <p>{member.roleLabel}</p>
      <strong>{getMemberTitle(member.stars)}</strong>
    </div>
    <div className="member-stats">
      <span>
        <b>{member.stars}</b> 星 / stars
      </span>
      <span>
        <b>{member.completedTasks}</b> 任务 / quests
      </span>
    </div>
  </article>
);
