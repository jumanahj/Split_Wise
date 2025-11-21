import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Card from './ui/Card';

interface SpendingChartProps {
  data: { name: string; amount: number }[];
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-700/80 p-2 border border-gray-600 rounded-md shadow-lg">
        <p className="label text-white">{`${label}`}</p>
        <p className="intro text-teal-300">{`$${payload[0].value.toFixed(2)}`}</p>
      </div>
    );
  }
  return null;
};

const SpendingChart: React.FC<SpendingChartProps> = ({ data }) => {
  return (
    <Card className="h-full">
        <h2 className="text-xl font-bold mb-4 text-white">Monthly Spending</h2>
        <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6B21A8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#1E40AF" stopOpacity={0.8}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis dataKey="name" stroke="rgba(255, 255, 255, 0.7)" />
                <YAxis stroke="rgba(255, 255, 255, 0.7)" />
                <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255, 255, 255, 0.1)'}}/>
                <Bar dataKey="amount" fill="url(#colorUv)" radius={[4, 4, 0, 0]} />
            </BarChart>
            </ResponsiveContainer>
        </div>
    </Card>
  );
};

export default SpendingChart;