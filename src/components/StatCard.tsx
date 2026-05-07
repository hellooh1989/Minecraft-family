interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
}

export const StatCard = ({ label, value, hint }: StatCardProps) => (
  <section className="stat-card">
    <span>{label}</span>
    <strong>{value}</strong>
    {hint ? <small>{hint}</small> : null}
  </section>
);
