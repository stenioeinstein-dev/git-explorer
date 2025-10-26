import { motion } from "framer-motion";
import { useMemo } from "react";

interface ContributionHeatmapProps {
  commits: number;
  updatedAt: string;
}

export function ContributionHeatmap({ commits, updatedAt }: ContributionHeatmapProps) {
  const weeks = 12; // Show 12 weeks
  const days = 7;

  // Generate mock contribution data based on total commits
  const contributionData = useMemo(() => {
    const data: number[][] = [];
    const totalCells = weeks * days;
    const avgPerCell = commits / totalCells;
    
    for (let week = 0; week < weeks; week++) {
      const weekData: number[] = [];
      for (let day = 0; day < days; day++) {
        // Random distribution with some clustering
        const random = Math.random();
        let value = 0;
        
        if (random > 0.7) {
          value = Math.floor(avgPerCell * (1 + Math.random() * 2));
        } else if (random > 0.4) {
          value = Math.floor(avgPerCell * Math.random());
        }
        
        weekData.push(Math.min(value, Math.max(1, Math.floor(commits / 10))));
      }
      data.push(weekData);
    }
    
    return data;
  }, [commits, weeks, days]);

  const getColor = (value: number) => {
    if (value === 0) return "bg-gray-900 border-gray-800";
    if (value <= 2) return "bg-blue-950 border-blue-900";
    if (value <= 4) return "bg-blue-800 border-blue-700";
    if (value <= 6) return "bg-blue-600 border-blue-500";
    return "bg-blue-400 border-blue-300";
  };

  const maxValue = Math.max(...contributionData.flat());

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-600 font-mono">activity</span>
        <span className="text-gray-500 font-mono">
          {commits} commits
        </span>
      </div>

      <div className="relative overflow-hidden rounded p-3 bg-gray-950/30 border border-blue-500/10">
        <div className="flex gap-[2px]">
          {contributionData.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-[2px]">
              {week.map((value, dayIndex) => (
                <motion.div
                  key={`${weekIndex}-${dayIndex}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    delay: (weekIndex * days + dayIndex) * 0.005,
                    duration: 0.2 
                  }}
                  whileHover={{ 
                    scale: 1.5, 
                    zIndex: 10,
                    transition: { duration: 0.1 }
                  }}
                  className={`w-2 h-2 rounded-[1px] border ${getColor(value)} transition-all cursor-default`}
                  title={`${value} commits`}
                />
              ))}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 mt-3 justify-end">
          <span className="text-gray-600 font-mono">less</span>
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-[1px] bg-gray-900 border border-gray-800"></div>
            <div className="w-2 h-2 rounded-[1px] bg-blue-950 border border-blue-900"></div>
            <div className="w-2 h-2 rounded-[1px] bg-blue-800 border border-blue-700"></div>
            <div className="w-2 h-2 rounded-[1px] bg-blue-600 border border-blue-500"></div>
            <div className="w-2 h-2 rounded-[1px] bg-blue-400 border border-blue-300"></div>
          </div>
          <span className="text-gray-600 font-mono">more</span>
        </div>
      </div>
    </div>
  );
}
