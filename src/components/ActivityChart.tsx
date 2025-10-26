import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { useMemo } from "react";

interface ActivityChartProps {
  repos: Array<{
    created_at: string;
    stargazers_count: number;
  }>;
}

export function ActivityChart({ repos }: ActivityChartProps) {
  const chartData = useMemo(() => {
    // Group repos by year
    const yearMap = new Map<number, number>();
    
    repos.forEach(repo => {
      const year = new Date(repo.created_at).getFullYear();
      yearMap.set(year, (yearMap.get(year) || 0) + 1);
    });

    // Convert to array and sort by year
    const data = Array.from(yearMap.entries())
      .map(([year, count]) => ({ year: year.toString(), repos: count }))
      .sort((a, b) => parseInt(a.year) - parseInt(b.year))
      .slice(-6); // Last 6 years

    return data;
  }, [repos]);

  if (chartData.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="relative"
    >
      <div className="mb-4">
        <h3 className="font-mono text-gray-400 mb-1">
          <span className="text-blue-400">$</span> repository activity
        </h3>
        <p className="text-gray-600 font-mono">repos created over time</p>
      </div>

      <div className="relative">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/10 to-violet-500/10 rounded blur-sm"></div>
        <div className="relative bg-gray-950/50 border border-blue-500/20 rounded p-6 backdrop-blur-sm">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRepos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a8a" opacity={0.1} />
              <XAxis 
                dataKey="year" 
                stroke="#6b7280" 
                style={{ fontSize: '12px', fontFamily: 'monospace' }}
              />
              <YAxis 
                stroke="#6b7280" 
                style={{ fontSize: '12px', fontFamily: 'monospace' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0a0a0a',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: '6px',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                }}
                labelStyle={{ color: '#9ca3af' }}
              />
              <Area 
                type="monotone" 
                dataKey="repos" 
                stroke="#3b82f6" 
                strokeWidth={2}
                fill="url(#colorRepos)"
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}
