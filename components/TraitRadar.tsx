import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';

interface RadarDataPoint {
  dimension: string;
  value: number;
  fullMark?: number;
}

interface Props {
  data: RadarDataPoint[];
  title?: string;
  color?: string;
  secondaryData?: RadarDataPoint[];
  secondaryColor?: string;
  labels?: [string, string];
}

export default function TraitRadar({ data, title, color = '#8b5cf6', secondaryData, secondaryColor = '#0891b2', labels }: Props) {
  // Merge data for dual overlay
  const merged = data.map((d, i) => ({
    dimension: d.dimension,
    A: d.value,
    B: secondaryData?.[i]?.value ?? 0,
  }));

  return (
    <div className="bg-surface rounded-2xl p-6 border border-surface-light">
      {title && <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>}
      <ResponsiveContainer width="100%" height={350}>
        <RadarChart data={secondaryData ? merged : data.map(d => ({ dimension: d.dimension, A: d.value }))}>
          <PolarGrid stroke="#25253d" />
          <PolarAngleAxis dataKey="dimension" tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
          <Radar name={labels?.[0] || 'Score'} dataKey="A" stroke={color} fill={color} fillOpacity={0.3} />
          {secondaryData && (
            <Radar name={labels?.[1] || 'Partner'} dataKey="B" stroke={secondaryColor} fill={secondaryColor} fillOpacity={0.2} />
          )}
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
