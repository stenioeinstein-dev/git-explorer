import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { useState, useMemo, useRef, useEffect } from "react";

interface ActivityTimelineProps {
  repos: Array<{
    id: number;
    name: string;
    created_at: string;
    stargazers_count: number;
  }>;
}

export function ActivityTimeline({ repos }: ActivityTimelineProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Get all years with repos
  const yearsWithRepos = useMemo(() => {
    const years = new Set<number>();
    repos.forEach(repo => {
      const year = new Date(repo.created_at).getFullYear();
      years.add(year);
    });
    return Array.from(years).sort((a, b) => a - b);
  }, [repos]);

  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(
    yearsWithRepos.includes(currentYear) ? currentYear : yearsWithRepos[yearsWithRepos.length - 1] || currentYear
  );

  // Get repos by month for selected year
  const monthlyData = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => ({
      month: i,
      monthName: new Date(selectedYear, i).toLocaleString('en', { month: 'short' }),
      repos: [] as typeof repos,
      count: 0,
    }));

    repos.forEach(repo => {
      const date = new Date(repo.created_at);
      if (date.getFullYear() === selectedYear) {
        const month = date.getMonth();
        months[month].repos.push(repo);
        months[month].count++;
      }
    });

    return months;
  }, [repos, selectedYear]);

  const maxCount = Math.max(...monthlyData.map(m => m.count), 1);

  const canGoPrev = yearsWithRepos.indexOf(selectedYear) > 0;
  const canGoNext = yearsWithRepos.indexOf(selectedYear) < yearsWithRepos.length - 1;

  const goToPrevYear = () => {
    const currentIndex = yearsWithRepos.indexOf(selectedYear);
    if (currentIndex > 0) {
      setSelectedYear(yearsWithRepos[currentIndex - 1]);
    }
  };

  const goToNextYear = () => {
    const currentIndex = yearsWithRepos.indexOf(selectedYear);
    if (currentIndex < yearsWithRepos.length - 1) {
      setSelectedYear(yearsWithRepos[currentIndex + 1]);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 0;
    }
  }, [selectedYear]);

  const totalReposInYear = monthlyData.reduce((sum, m) => sum + m.count, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="relative"
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="font-mono text-gray-400 mb-1">
            <span className="text-blue-400">$</span> repository timeline
          </h3>
          <p className="text-gray-600 font-mono">
            {totalReposInYear} {totalReposInYear === 1 ? 'repository' : 'repositories'} created in {selectedYear}
          </p>
        </div>

        {/* Year Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrevYear}
            disabled={!canGoPrev}
            className="p-2 rounded border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 hover:border-violet-500/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-blue-500/5 disabled:hover:border-blue-500/20"
          >
            <ChevronLeft className="w-4 h-4 text-blue-400" />
          </button>

          <div className="flex items-center gap-2 px-4 py-2 rounded border border-blue-500/20 bg-gray-950/50 min-w-[120px] justify-center">
            <Calendar className="w-4 h-4 text-violet-400" />
            <span className="font-mono text-gray-300">{selectedYear}</span>
          </div>

          <button
            onClick={goToNextYear}
            disabled={!canGoNext}
            className="p-2 rounded border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 hover:border-violet-500/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-blue-500/5 disabled:hover:border-blue-500/20"
          >
            <ChevronRight className="w-4 h-4 text-blue-400" />
          </button>
        </div>
      </div>

      {/* Timeline Container */}
      <div className="relative">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/10 to-violet-500/10 rounded blur-sm"></div>
        <div className="relative bg-gray-950/50 border border-blue-500/20 rounded backdrop-blur-sm overflow-hidden">
          
          {/* Scrollable Timeline */}
          <div 
            ref={scrollRef}
            className="overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-blue-500/30 scrollbar-track-gray-900/50"
            style={{ scrollbarWidth: 'thin' }}
          >
            <div className="p-6 min-w-max">
              {/* Chart */}
              <div className="flex items-end gap-4 h-48 mb-4">
                {monthlyData.map((data, index) => {
                  const height = data.count > 0 ? (data.count / maxCount) * 100 : 0;
                  const hasRepos = data.count > 0;

                  return (
                    <div key={data.month} className="flex flex-col items-center gap-2 min-w-[60px] group">
                      {/* Bar Container */}
                      <div className="relative flex-1 w-full flex items-end">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ delay: index * 0.05, duration: 0.5, ease: "easeOut" }}
                          className={`w-full rounded-t ${
                            hasRepos 
                              ? 'bg-gradient-to-t from-blue-500/80 to-violet-500/80 hover:from-blue-400 hover:to-violet-400' 
                              : 'bg-gray-800/30'
                          } transition-all cursor-pointer relative`}
                        >
                          {/* Repos Count Badge */}
                          {hasRepos && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 + 0.3 }}
                              className="absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-blue-500/20 border border-blue-500/30 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                            >
                              <span className="text-blue-400 font-mono">
                                {data.count}
                              </span>
                            </motion.div>
                          )}

                          {/* Tooltip */}
                          {hasRepos && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                              <div className="bg-gray-900 border border-blue-500/30 rounded p-2 shadow-lg min-w-[150px]">
                                <div className="text-gray-400 font-mono mb-1">
                                  {data.monthName} {selectedYear}
                                </div>
                                <div className="space-y-0.5">
                                  {data.repos.slice(0, 3).map(repo => (
                                    <div key={repo.id} className="text-blue-400 font-mono truncate">
                                      • {repo.name}
                                    </div>
                                  ))}
                                  {data.repos.length > 3 && (
                                    <div className="text-gray-500 font-mono">
                                      +{data.repos.length - 3} more
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      </div>

                      {/* Month Label */}
                      <div className="text-center">
                        <div className={`font-mono ${hasRepos ? 'text-gray-400' : 'text-gray-600'}`}>
                          {data.monthName}
                        </div>
                        {hasRepos && (
                          <div className="w-1 h-1 bg-blue-400 rounded-full mx-auto mt-1"></div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Timeline Base */}
              <div className="h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
            </div>
          </div>

          {/* Scroll Indicators */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-950 to-transparent pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-950 to-transparent pointer-events-none"></div>
        </div>
      </div>

      {/* Year Pills */}
      {yearsWithRepos.length > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-4 flex gap-2 flex-wrap"
        >
          <span className="text-gray-600 font-mono">quick jump:</span>
          {yearsWithRepos.map(year => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-3 py-1 rounded font-mono transition-all ${
                year === selectedYear
                  ? 'bg-blue-500/20 border border-blue-500/40 text-blue-400'
                  : 'bg-gray-900/50 border border-blue-500/10 text-gray-500 hover:text-gray-400 hover:border-blue-500/20'
              }`}
            >
              {year}
            </button>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
