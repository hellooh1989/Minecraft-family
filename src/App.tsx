import { useState } from "react";
import { NavBar } from "./components/NavBar";
import { Toast } from "./components/Toast";
import { Dashboard } from "./pages/Dashboard";
import { AchievementsPage } from "./pages/AchievementsPage";
import { DataPage } from "./pages/DataPage";
import type { PageId } from "./pages/pageTypes";
import { RewardsPage } from "./pages/RewardsPage";
import { TasksPage } from "./pages/TasksPage";

export const App = () => {
  const [activePage, setActivePage] = useState<PageId>("dashboard");

  return (
    <>
      <NavBar activePage={activePage} onNavigate={setActivePage} />
      {activePage === "dashboard" ? <Dashboard onNavigate={setActivePage} /> : null}
      {activePage === "tasks" ? <TasksPage /> : null}
      {activePage === "rewards" ? <RewardsPage /> : null}
      {activePage === "achievements" ? <AchievementsPage /> : null}
      {activePage === "data" ? <DataPage /> : null}
      <Toast />
    </>
  );
};
