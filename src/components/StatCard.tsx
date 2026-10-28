interface StatCardProps {
  title: string;
  value: string | number;
   icon: string;
  description: string;
}

export default function StatCard({
  title,
  value,
  icon,
  description,
}: StatCardProps) {
  return (
    <article className="stat-card">
      
      <span className="stat-icon">{icon}</span>
      <p>{title}</p>
      <h2>{value}</h2>
      <span>{description}</span>
    </article>
  );
}