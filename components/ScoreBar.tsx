interface Props {
  label: string;
  score: number;
  description?: string;
  colorClass?: string;
}

export default function ScoreBar({ label, score, description, colorClass }: Props) {
  const color = colorClass || (score >= 70 ? 'bg-success' : score >= 40 ? 'bg-accent' : 'bg-danger');

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm text-text-muted">{score}%</span>
      </div>
      <div className="w-full h-2 bg-surface-light rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${score}%` }} />
      </div>
      {description && <p className="text-xs text-text-muted">{description}</p>}
    </div>
  );
}
