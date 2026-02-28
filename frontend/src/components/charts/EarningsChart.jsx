import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// sample data; you can replace with real earnings data later
const data = [
  { month: "Jan", earnings: 75 },
  { month: "Feb", earnings: 80 },
  { month: "Mar", earnings: 65 },
  { month: "Apr", earnings: 90 },
  { month: "May", earnings: 70 },
  { month: "Jun", earnings: 85 },
  { month: "Jul", earnings: 75 },
  { month: "Aug", earnings: 88 },
  { month: "Sep", earnings: 72 },
  { month: "Oct", earnings: 80 },
  { month: "Nov", earnings: 78 },
  { month: "Dec", earnings: 85 },
];

export default function EarningsChart() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-lg font-semibold mb-4">Earnings by Month</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="earnings"
            stroke="#0d9488"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
