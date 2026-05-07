import { useMemo, useState } from "react";
import { MEMBER_ORDER, TYPE_LABELS } from "../data/defaultData";
import { useApp } from "../context/AppContext";
import type { MemberId } from "../types";
import {
  formatMembers,
  getMemberTitle,
  getPersonalTaskAchievements,
  getRewardLevelProgress,
  getTeamTaskAchievements
} from "../utils/progress";

const USER_ORDER: { id: MemberId; label: string }[] = [
  { id: "parent", label: "Daddy" },
  { id: "child7", label: "ZEO" },
  { id: "child5", label: "ZOE" }
];

const formatDate = (iso?: string) =>
  iso
    ? new Intl.DateTimeFormat("zh-CN", {
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      }).format(new Date(iso))
    : "未记录 / No time";

export const AchievementsPage = () => {
  const { state } = useApp();
  const [selectedMemberId, setSelectedMemberId] = useState<MemberId | null>(null);
  const teamAchievements = getTeamTaskAchievements(state);

  const selectedMember = selectedMemberId
    ? state.members[selectedMemberId]
    : null;
  const selectedAchievements = useMemo(
    () =>
      selectedMemberId
        ? getPersonalTaskAchievements(state, selectedMemberId)
        : [],
    [selectedMemberId, state]
  );

  if (selectedMember) {
    const levelProgress = getRewardLevelProgress(selectedMember.stars);

    return (
      <main className="page-shell">
        <section className="page-title">
          <button
            className="button button-ghost"
            type="button"
            onClick={() => setSelectedMemberId(null)}
          >
            返回用户卡片 / Back to Users
          </button>
          <h1>{selectedMember.name} 成就页 / Achievement Page</h1>
          <p>
            每个完成任务都会在这里生成个人任务成就；团队任务也会复制到参与者个人成就里。
            / Every finished quest creates a personal achievement here; team quests also appear for each participant.
          </p>
        </section>

        <section className="achievement-profile">
          <div className="achievement-avatar">{selectedMember.avatar}</div>
          <div>
            <span className="eyebrow">用户状态 / User Status</span>
            <h2>{selectedMember.name}</h2>
            <p>{selectedMember.roleLabel}</p>
          </div>
          <div className="achievement-score">
            <strong>{selectedMember.stars} 星 / stars</strong>
            <span>{getMemberTitle(selectedMember.stars)}</span>
            <small>
              {levelProgress.nextLevel
                ? `距离 ${levelProgress.nextLevel.icon} ${levelProgress.nextLevel.name} 还差 ${levelProgress.starsToNext} 星 / ${levelProgress.starsToNext} stars to next level`
                : "已达到最高等级 / Top level reached"}
            </small>
          </div>
        </section>

        <section className="panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">个人任务成就 / Personal Quest Achievements</span>
              <h2>{selectedAchievements.length} 个任务成就 / quest achievements</h2>
            </div>
          </div>
          <div className="achievement-grid">
            {selectedAchievements.map((achievement) => (
              <article key={achievement.id} className="achievement-badge-card">
                <span className="achievement-badge-icon">
                  {achievement.isTeamAchievement ? "🤝" : "🏅"}
                </span>
                <div>
                  <strong>{achievement.title}</strong>
                  <p>{achievement.description}</p>
                  <small>
                    {TYPE_LABELS[achievement.type]} · +{achievement.rewardStars} 星 / stars ·{" "}
                    {formatDate(achievement.completedAt)}
                  </small>
                </div>
              </article>
            ))}
            {selectedAchievements.length === 0 ? (
              <p className="empty-state">
                还没有个人任务成就。完成任意任务后会出现在这里。
                / No personal quest achievements yet. Finish any quest to create one.
              </p>
            ) : null}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <section className="page-title">
        <span className="eyebrow">成就 / Achievements</span>
        <h1>用户星星与成就 / User Stars and Achievements</h1>
        <p>
          Daddy、ZEO、ZOE 各自拥有个人任务成就。点击卡片进入对应页面。
          / Daddy, ZEO, and ZOE each have personal quest achievements. Click a card to open a user page.
        </p>
      </section>

      <section className="user-achievement-grid">
        {USER_ORDER.map((user) => {
          const member = state.members[user.id];
          const achievements = getPersonalTaskAchievements(state, user.id);
          return (
            <button
              key={user.id}
              type="button"
              className="user-achievement-card"
              onClick={() => setSelectedMemberId(user.id)}
            >
              <span className="achievement-avatar">{member.avatar}</span>
              <strong>{user.label}</strong>
              <small>{member.roleLabel}</small>
              <b>{member.stars} 星 / stars</b>
              <span>{achievements.length} 个成就 / achievements</span>
            </button>
          );
        })}
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <span className="eyebrow">团队徽章 / Team Badges</span>
            <h2>团队任务完成成就 / Team Quest Achievements</h2>
          </div>
        </div>
        <div className="achievement-grid">
          {teamAchievements.map((achievement) => (
            <article key={achievement.id} className="achievement-badge-card team-achievement">
              <span className="achievement-badge-icon">🤝</span>
              <div>
                <strong>{achievement.title}</strong>
                <p>
                  参与者 / Participants: {formatMembers(achievement.completedBy)}
                </p>
                <small>
                  +{achievement.rewardStars} 星 / stars · {formatDate(achievement.completedAt)}
                </small>
              </div>
            </article>
          ))}
          {teamAchievements.length === 0 ? (
            <p className="empty-state">
              还没有团队徽章。完成团队任务后会显示在这里，并同步生成个人任务成就。
              / No team badges yet. Team quests will appear here and also create personal achievements.
            </p>
          ) : null}
        </div>
      </section>
    </main>
  );
};
