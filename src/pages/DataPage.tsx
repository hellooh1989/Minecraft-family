import { useMemo, useRef, useState } from "react";
import { useApp } from "../context/AppContext";
import type { ImportPayload, RewardItem, RewardScope } from "../types";
import { createId } from "../utils/id";

const emptyReward = (): RewardItem => ({
  id: createId(),
  title: "",
  description: "",
  cost: 10,
  scope: "personal",
  active: true
});

export const DataPage = () => {
  const {
    state,
    exportData,
    importData,
    resetAll,
    setTheme,
    toggleMusic,
    upsertRewardItem,
    disableRewardItem,
    deleteRewardItem
  } = useApp();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [rewardDraft, setRewardDraft] = useState<RewardItem>(() => emptyReward());
  const activeAccount = state.accounts[state.activeAccountId];
  const rewardRows = useMemo(
    () => state.rewardItems,
    [state.rewardItems]
  );

  const handleImport = async (file: File | undefined) => {
    if (!file) return;
    const text = await file.text();
    const payload = JSON.parse(text) as ImportPayload;
    importData(payload);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const confirmReset = () => {
    const first = window.confirm("确定要重置全部数据吗？任务完成记录、星星和兑换历史都会清空。/ Reset all data? Quest records, stars, and reward history will be cleared.");
    if (!first) return;
    const second = window.confirm("再确认一次：这会回到初始状态。是否继续？/ Confirm again: this returns everything to the starting state. Continue?");
    if (second) resetAll();
  };

  const saveReward = () => {
    if (!rewardDraft.title.trim()) {
      window.alert("请输入奖品名称。/ Please enter a reward title.");
      return;
    }
    const isEditing = state.rewardItems.some((reward) => reward.id === rewardDraft.id);
    if (isEditing) {
      const confirmed = window.confirm(
        "确认保存这次奖品编辑吗？/ Confirm saving this reward edit?"
      );
      if (!confirmed) return;
    }
    upsertRewardItem({
      ...rewardDraft,
      title: rewardDraft.title.trim(),
      description: rewardDraft.description.trim() || "后台自定义奖品 / Admin custom reward",
      cost: Math.max(1, Math.round(rewardDraft.cost))
    });
    setRewardDraft(emptyReward());
  };

  return (
    <main className="page-shell">
      <section className="page-title">
        <span className="eyebrow">本地数据 / Local Data</span>
        <h1>数据管理 / Data Manager</h1>
        <p>所有数据保存在当前浏览器的 localStorage 中。定期导出 JSON，换电脑或清浏览器前先备份。/ All data stays in this browser’s localStorage. Export JSON before changing devices or clearing browser data.</p>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <span className="eyebrow">后台 / Admin</span>
            <h2>兑换奖品后台 / Reward Admin</h2>
          </div>
          <strong>{activeAccount.name}</strong>
        </div>
        {activeAccount.isAdmin ? (
          <>
            <div className="reward-admin-form">
              <label>
                <span>奖品名称 / Reward title</span>
                <input
                  value={rewardDraft.title}
                  onChange={(event) =>
                    setRewardDraft((previous) => ({
                      ...previous,
                      title: event.target.value
                    }))
                  }
                  placeholder="例如：多玩 15 分钟 / Example: 15 more minutes"
                />
              </label>
              <label>
                <span>说明 / Description</span>
                <input
                  value={rewardDraft.description}
                  onChange={(event) =>
                    setRewardDraft((previous) => ({
                      ...previous,
                      description: event.target.value
                    }))
                  }
                  placeholder="兑换规则或爸爸审核条件 / Rules or Dad approval"
                />
              </label>
              <label>
                <span>价格 / Cost</span>
                <input
                  type="number"
                  min="1"
                  value={rewardDraft.cost}
                  onChange={(event) =>
                    setRewardDraft((previous) => ({
                      ...previous,
                      cost: Number(event.target.value)
                    }))
                  }
                />
              </label>
              <label>
                <span>类别 / Scope</span>
                <select
                  value={rewardDraft.scope}
                  onChange={(event) =>
                    setRewardDraft((previous) => ({
                      ...previous,
                      scope: event.target.value as RewardScope
                    }))
                  }
                >
                  <option value="personal">个人兑换 / Personal</option>
                  <option value="family">家庭兑换 / Family</option>
                </select>
              </label>
              <label>
                <span>状态 / Status</span>
                <select
                  value={rewardDraft.active === false ? "disabled" : "active"}
                  onChange={(event) =>
                    setRewardDraft((previous) => ({
                      ...previous,
                      active: event.target.value === "active"
                    }))
                  }
                >
                  <option value="active">可用 / Active</option>
                  <option value="disabled">停用 / Disabled</option>
                </select>
              </label>
              <button className="button button-primary" type="button" onClick={saveReward}>
                保存奖品 / Save Reward
              </button>
              <button
                className="button button-ghost"
                type="button"
                onClick={() => setRewardDraft(emptyReward())}
              >
                清空表单 / Clear
              </button>
            </div>

            <div className="admin-reward-list">
              {rewardRows.map((reward) => (
                <article
                  key={reward.id}
                  className={
                    reward.active === false
                      ? "admin-reward-row disabled-reward-row"
                      : "admin-reward-row"
                  }
                >
                  <div>
                    <strong>{reward.title}</strong>
                    <p>{reward.description}</p>
                    <small>
                      {reward.cost} 星 / stars ·{" "}
                      {reward.scope === "family" ? "家庭兑换 / Family" : "个人兑换 / Personal"}
                      {" · "}
                      {reward.active === false ? "已停用 / Disabled" : "可用 / Active"}
                    </small>
                  </div>
                  <div className="reward-actions">
                    <button
                      className="button button-ghost"
                      type="button"
                      onClick={() => setRewardDraft({ ...reward })}
                    >
                      编辑 / Edit
                    </button>
                    <button
                      className="button button-danger"
                      type="button"
                      onClick={() => {
                        const confirmed = window.confirm(
                          "确认停用这个奖品吗？停用后不会出现在兑换商店，但仍保留在后台清单。/ Disable this reward? It will be hidden from the shop but kept in the admin list."
                        );
                        if (confirmed) disableRewardItem(reward.id);
                      }}
                    >
                      停用 / Disable
                    </button>
                    <button
                      className="button button-danger"
                      type="button"
                      onClick={() => {
                        const confirmed = window.confirm(
                          "确认删除这个奖品吗？删除后会从后台清单移除。/ Delete this reward? It will be removed from the admin list."
                        );
                        if (confirmed) deleteRewardItem(reward.id);
                      }}
                    >
                      删除 / Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : (
          <p className="empty-state">
            只有爸爸后台可以修改奖品和价格。/ Only Dad Admin can change rewards and prices.
          </p>
        )}
      </section>

      <section className="section-grid two-columns">
        <div className="panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">备份 / Backup</span>
              <h2>备份与恢复 / Backup & Restore</h2>
            </div>
          </div>
          <div className="data-actions">
            <button className="button button-primary" type="button" onClick={exportData}>
              导出 JSON / Export JSON
            </button>
            <label className="file-button">
              导入 JSON / Import JSON
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json"
                onChange={(event) => {
                  handleImport(event.target.files?.[0]).catch(() => {
                    window.alert("导入失败：请确认文件是有效的备份 JSON。/ Import failed. Please choose a valid backup JSON file.");
                  });
                }}
              />
            </label>
            <button className="button button-danger" type="button" onClick={confirmReset}>
              重置全部数据 / Reset All
            </button>
          </div>
        </div>

        <div className="panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">设置 / Settings</span>
              <h2>设置 / Settings</h2>
            </div>
          </div>
          <div className="settings-list">
            <label className="setting-row">
              <span>
                <strong>界面模式 / Theme</strong>
                <small>适合白天或晚上使用 / Good for day or night</small>
              </span>
              <select
                value={state.settings.theme}
                onChange={(event) => setTheme(event.target.value === "dark" ? "dark" : "light")}
              >
                <option value="light">浅色模式 / Light</option>
                <option value="dark">深色模式 / Dark</option>
              </select>
            </label>
            <label className="setting-row">
              <span>
                <strong>背景音乐 / Background Music</strong>
                <small>默认关闭，仅保存偏好 / Off by default; preference only</small>
              </span>
              <button className="button button-ghost" type="button" onClick={toggleMusic}>
                {state.settings.musicEnabled ? "关闭 / Off" : "开启 / On"}
              </button>
            </label>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <span className="eyebrow">存储 / Storage</span>
            <h2>当前数据概览 / Current Data Snapshot</h2>
          </div>
        </div>
        <pre className="json-preview">
{JSON.stringify(
  {
    schemaVersion: state.schemaVersion,
    members: state.members,
    completedTaskIds: Object.keys(state.taskProgress),
    redemptionCount: state.redemptionHistory.length,
    rewardCount: state.rewardItems.length,
    activeAccount: state.activeAccountId
  },
  null,
  2
)}
        </pre>
      </section>
    </main>
  );
};
