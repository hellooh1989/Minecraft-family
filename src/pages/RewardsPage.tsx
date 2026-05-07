import { useState } from "react";
import {
  BEHAVIOR_BONUSES,
  MEMBER_ORDER,
  REWARD_LEVELS
} from "../data/defaultData";
import { useApp } from "../context/AppContext";
import type { MemberId } from "../types";
import {
  getFamilyStars,
  getRewardEconomyAssessment,
  getRewardLevelProgress
} from "../utils/progress";

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(iso));

export const RewardsPage = () => {
  const { state, applyBonus, redeemReward } = useApp();
  const [bonusAssignees, setBonusAssignees] = useState<Record<string, MemberId>>({});
  const [rewardAssignees, setRewardAssignees] = useState<Record<string, MemberId>>({});
  const familyStars = getFamilyStars(state);
  const economy = getRewardEconomyAssessment(state);
  const activeRewards = state.rewardItems.filter((reward) => reward.active !== false);

  return (
    <main className="page-shell">
      <section className="page-title">
        <span className="eyebrow">奖励 / Rewards</span>
        <h1>奖励商店 / Reward Shop</h1>
        <p>星星不是为了卷进度，而是把合作、耐心和完成感变成看得见的回馈。/ Stars turn teamwork, patience, and progress into visible rewards.</p>
      </section>

      <section className="section-grid two-columns">
        <div className="panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">加分 / Bonus</span>
              <h2>行为加分 / Behavior Bonus</h2>
            </div>
          </div>
          <div className="reward-list">
            {BEHAVIOR_BONUSES.map((bonus) => {
              const appliesTo = bonus.appliesTo === "all" ? MEMBER_ORDER : bonus.appliesTo;
              const selected = bonusAssignees[bonus.id] ?? appliesTo[0];
              return (
                <article key={bonus.id} className="reward-card">
                  <div>
                    <span className="pill pill-bonus">+{bonus.stars} 星 / stars</span>
                    <h3>{bonus.title}</h3>
                    <p>{bonus.description}</p>
                  </div>
                  <div className="reward-actions">
                    {bonus.appliesTo !== "all" ? (
                      <label className="inline-field">
                        <span>给谁 / Who</span>
                        <select
                          value={selected}
                          onChange={(event) =>
                            setBonusAssignees((previous) => ({
                              ...previous,
                              [bonus.id]: event.target.value as MemberId
                            }))
                          }
                        >
                          {appliesTo.map((memberId) => (
                            <option key={memberId} value={memberId}>
                              {state.members[memberId].name}
                            </option>
                          ))}
                        </select>
                      </label>
                    ) : (
                      <span className="reward-scope">全员加分 / Everyone earns it</span>
                    )}
                    <button
                      className="button button-primary"
                      type="button"
                      onClick={() => applyBonus(bonus.id, selected)}
                    >
                      记录加分 / Add Bonus
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">星星 / Stars</span>
              <h2>当前星星 / Star Wallets</h2>
            </div>
            <strong>{familyStars} 家庭总星 / family stars</strong>
          </div>
          <div className="star-wallets">
            {MEMBER_ORDER.map((memberId) => {
              const member = state.members[memberId];
              const levelProgress = getRewardLevelProgress(member.stars);
              return (
                <div key={memberId} className="wallet-row level-wallet-row">
                  <span>{member.avatar}</span>
                  <strong>{member.name}</strong>
                  <b>{member.stars} 星 / stars</b>
                  <small>
                    当前等级 / Current level:{" "}
                    {levelProgress.currentLevel
                      ? `${levelProgress.currentLevel.icon} ${levelProgress.currentLevel.name}`
                      : "🌱 新手 / Starter"}
                  </small>
                  <small>
                    {levelProgress.nextLevel
                      ? `距离 ${levelProgress.nextLevel.icon} ${levelProgress.nextLevel.name} 还差 ${levelProgress.starsToNext} 星 / ${levelProgress.starsToNext} stars to next level`
                      : "已达到最高等级 / Top level reached"}
                  </small>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <span className="eyebrow">等级 / Levels</span>
            <h2>奖励系统等级 / Reward Level Ladder</h2>
          </div>
        </div>
        <div className="level-ladder">
          {REWARD_LEVELS.map((level) => (
            <article key={level.threshold} className="level-card">
              <span className="level-icon" aria-hidden="true">
                {level.icon}
              </span>
              <strong>⭐{level.threshold}</strong>
              <b>{level.name}</b>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <span className="eyebrow">商店 / Shop</span>
            <h2>可兑换奖励 / Rewards to Redeem</h2>
          </div>
        </div>
        <div className="economy-box">
          <strong>奖励系统评估 / Reward Economy Check</strong>
          <p>
            任务平均奖励约 {economy.avgTaskStars.toFixed(1)} 星，最低奖品是 {economy.cheapestReward.title}
            （{economy.cheapestReward.cost} 星），大约需要 {economy.tasksForCheapest} 个普通任务。
            / Average quest reward is {economy.avgTaskStars.toFixed(1)} stars. Cheapest reward is {economy.cheapestReward.title}
            ({economy.cheapestReward.cost} stars), about {economy.tasksForCheapest} average quests.
          </p>
          <div className="economy-tags">
            <span>{economy.earningEase}</span>
            <span>{economy.redemptionEase}</span>
            <span>{economy.activeRewardCount} 个可用奖品 / active rewards</span>
          </div>
        </div>
        <div className="reward-grid">
          {activeRewards.map((reward) => {
            const selected = rewardAssignees[reward.id] ?? "child5";
            return (
              <article key={reward.id} className="shop-card">
                <div>
                  <span className={reward.scope === "family" ? "pill pill-team" : "pill pill-personal"}>
                    {reward.scope === "family" ? "家庭兑换 / Family" : "个人兑换 / Personal"}
                  </span>
                  <h3>{reward.title}</h3>
                  <p>{reward.description}</p>
                </div>
                <strong className="cost">{reward.cost} 星 / stars</strong>
                <div className="reward-actions">
                  {reward.scope === "personal" ? (
                    <label className="inline-field">
                      <span>兑换者 / Redeemer</span>
                      <select
                        value={selected}
                        onChange={(event) =>
                          setRewardAssignees((previous) => ({
                            ...previous,
                            [reward.id]: event.target.value as MemberId
                          }))
                        }
                      >
                        {MEMBER_ORDER.map((memberId) => (
                          <option key={memberId} value={memberId}>
                            {state.members[memberId].name}
                          </option>
                        ))}
                      </select>
                    </label>
                  ) : (
                    <span className="reward-scope">从家庭总星扣除 / Use family stars</span>
                  )}
                  <button
                    className="button button-primary"
                    type="button"
                    onClick={() => redeemReward(reward.id, selected)}
                  >
                    兑换 / Redeem
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <span className="eyebrow">历史 / History</span>
            <h2>兑换历史 / Redemption History</h2>
          </div>
        </div>
        <div className="timeline">
          {state.redemptionHistory.map((record) => (
            <article key={record.id} className="timeline-item">
              <time>{formatDate(record.createdAt)}</time>
              <div>
                <strong>{record.rewardTitle}</strong>
                <p>
                  {record.scope === "family"
                    ? `家庭兑换，消耗 ${record.cost} 星 / Family reward, spent ${record.cost} stars`
                    : `${record.redeemedBy ? state.members[record.redeemedBy].name : "成员 / Member"}兑换，消耗 ${record.cost} 星 / spent ${record.cost} stars`}
                </p>
              </div>
            </article>
          ))}
          {state.redemptionHistory.length === 0 ? (
            <p className="empty-state">还没有兑换记录。/ No rewards redeemed yet.</p>
          ) : null}
        </div>
      </section>
    </main>
  );
};
