import type { PageId } from "../pages/pageTypes";

interface NavBarProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
}

const navItems: { id: PageId; label: string }[] = [
  { id: "dashboard", label: "首页 / Home" },
  { id: "tasks", label: "任务中心 / Quests" },
  { id: "rewards", label: "奖励商店 / Rewards" },
  { id: "achievements", label: "成就 / Achievements" },
  { id: "data", label: "数据管理 / Data" }
];

export const NavBar = ({ activePage, onNavigate }: NavBarProps) => (
  <header className="topbar">
    <button
      className="brand"
      type="button"
      onClick={() => onNavigate("dashboard")}
      aria-label="回到首页 / Back home"
    >
      <span className="brand-cube" aria-hidden="true" />
      <span>
        <strong>Java 亲子任务中心 / Java Family Quest Center</strong>
        <small>Minecraft Java 长期成长 / Long-Term Growth</small>
      </span>
    </button>
    <nav className="nav-tabs" aria-label="主导航 / Main navigation">
      {navItems.map((item) => (
        <button
          key={item.id}
          className={activePage === item.id ? "active" : ""}
          type="button"
          onClick={() => onNavigate(item.id)}
        >
          {item.label}
        </button>
      ))}
    </nav>
  </header>
);
