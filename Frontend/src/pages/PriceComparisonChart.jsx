import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const data = [
  { feature: "Speed", Traditional: 2, ML: 4, CNN: 3, AgriSathi: 5 },
  { feature: "Cost Effective", Traditional: 2, ML: 3, CNN: 1, AgriSathi: 4 },
  { feature: "Accuracy", Traditional: 2, ML: 4, CNN: 5, AgriSathi: 4 },
  { feature: "Scalability", Traditional: 1, ML: 3, CNN: 4, AgriSathi: 5 },
];

export default function PriceComparisonChart() {
  return (
    <div className="chart-card">


      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="feature" />
          <YAxis label={{ value: "Performance Score (1-5)", angle: -90 }} />
          <Tooltip />
          <Legend />
          <CartesianGrid strokeDasharray="3 3" />

          <Bar dataKey="Traditional" fill="#9fffa5" />
          <Bar dataKey="ML" fill="#2fa237" />
          <Bar dataKey="CNN" fill="#1b5e20" />
          <Bar dataKey="AgriSathi" fill="#e5e22c" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}