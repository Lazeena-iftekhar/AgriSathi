import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";

const data = [
  { feature: "Speed", Traditional: 1, ML: 3, AgriSathi: 5 },
  { feature: "Cost", Traditional: 1, ML: 4, AgriSathi: 5 },
  { feature: "Accuracy", Traditional: 3, ML: 3, AgriSathi: 5 },
  { feature: "Ease", Traditional: 1, ML: 3, AgriSathi: 5 },
];

export default function ComparisonChart() {
  return (
    <BarChart width={350} height={250} data={data} radius={[6,6,0,0]}>
      <XAxis dataKey="feature" />
      <YAxis />
      <Tooltip />
      <Legend />
      <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
      <Bar dataKey="Traditional" fill="#e0d5c9" radius={[6,6,0,0]} />
<Bar dataKey="ML" fill="#c49a6c" radius={[6,6,0,0]} />
<Bar dataKey="AgriSathi" fill="#8b5e3c" radius={[6,6,0,0]} />
    </BarChart>
  );
}
