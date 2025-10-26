import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

interface ContributionHeatmapProps {
  commits: number;
  updatedAt: string;
  createdAt: string;
  commitsByDate?: Record<string, number>;
}

export function ContributionHeatmap({ commits, updatedAt, createdAt, commitsByDate }: ContributionHeatmapProps) {
  // Determinar anos disponíveis baseado na criação do repositório
  const currentYear = new Date().getFullYear();
  const createdYear = new Date(createdAt).getFullYear();
  const startYear = createdYear;

  const [selectedYear, setSelectedYear] = useState(currentYear);

  // Nomes dos dias e meses
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Gerar dados do heatmap para o ano selecionado
  const heatmapData = useMemo(() => {
    // Criar data inicial (1º de janeiro do ano selecionado)
    const startDate = new Date(selectedYear, 0, 1);
    const endDate = new Date(selectedYear, 11, 31);

    // Ajustar para começar no domingo da semana que contém 1º de janeiro
    const firstDayOfWeek = startDate.getDay();
    const adjustedStartDate = new Date(startDate);
    adjustedStartDate.setDate(startDate.getDate() - firstDayOfWeek);

    // Calcular número de semanas necessárias
    const totalDays = Math.ceil((endDate.getTime() - adjustedStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const totalWeeks = Math.ceil(totalDays / 7);

    // Criar estrutura de dados: array de semanas, cada semana tem 7 dias
    const weeks: Array<Array<{
      date: Date;
      count: number;
      isCurrentYear: boolean;
    }>> = [];

    let currentDate = new Date(adjustedStartDate);

    // Usar dados reais de commits por data (se disponíveis)
    const commitsPerDay: Record<string, number> = commitsByDate ? { ...commitsByDate } : {};

    // Agora criar a estrutura de semanas
    currentDate = new Date(adjustedStartDate);

    for (let week = 0; week < totalWeeks; week++) {
      const weekData = [];

      for (let day = 0; day < 7; day++) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const isCurrentYear = currentDate.getFullYear() === selectedYear;

        const count = commitsPerDay[dateStr] || 0;

        weekData.push({
          date: new Date(currentDate),
          count,
          isCurrentYear
        });

        currentDate.setDate(currentDate.getDate() + 1);
      }

      weeks.push(weekData);
    }

    return weeks;
  }, [selectedYear, commits, commitsByDate]);

  // Calcular posições dos meses
  const monthPositions = useMemo(() => {
    const positions: Array<{ month: string; weekIndex: number }> = [];
    let lastMonth = -1;

    heatmapData.forEach((week, weekIndex) => {
      const firstDayOfWeek = week.find(d => d.isCurrentYear);
      if (firstDayOfWeek) {
        const month = firstDayOfWeek.date.getMonth();
        if (month !== lastMonth) {
          positions.push({
            month: monthNames[month],
            weekIndex
          });
          lastMonth = month;
        }
      }
    });

    return positions;
  }, [heatmapData]);

  // Função para determinar a cor baseada no número de commits
  const getColor = (count: number) => {
    if (count === 0) return "bg-gray-900 border-gray-800";
    if (count <= 2) return "bg-blue-950 border-blue-900";
    if (count <= 5) return "bg-blue-800 border-blue-700";
    if (count <= 10) return "bg-blue-600 border-blue-500";
    return "bg-violet-500 border-violet-400";
  };

  // Calcular total de commits no ano
  const totalCommitsInYear = useMemo(() => {
    return heatmapData.flat().reduce((sum, day) => sum + day.count, 0);
  }, [heatmapData]);

  // Navegação entre anos
  const canGoPrev = selectedYear > startYear;
  const canGoNext = selectedYear < currentYear;

  const goToPrevYear = () => {
    if (canGoPrev) setSelectedYear(selectedYear - 1);
  };

  const goToNextYear = () => {
    if (canGoNext) setSelectedYear(selectedYear + 1);
  };

  return (
    <div className="mt-4">
      {/* Header com navegação de ano */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-gray-600 font-mono">activity</span>
          <span className="text-gray-500 font-mono">•</span>
          <span className="text-gray-500 font-mono">
            {totalCommitsInYear} commits in {selectedYear}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={goToPrevYear}
            disabled={!canGoPrev}
            className="p-1 rounded hover:bg-blue-500/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-blue-400" />
          </button>

          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-gray-900/50 min-w-[60px] justify-center">
            <Calendar className="w-3 h-3 text-violet-400" />
            <span className="font-mono text-gray-400">{selectedYear}</span>
          </div>

          <button
            onClick={goToNextYear}
            disabled={!canGoNext}
            className="p-1 rounded hover:bg-blue-500/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          >
            <ChevronRight className="w-3.5 h-3.5 text-blue-400" />
          </button>
        </div>
      </div>

      {/* Heatmap Container */}
      <div className="relative overflow-hidden rounded p-3 bg-gray-950/30 border border-blue-500/10">
        <div className="overflow-x-auto overflow-y-hidden">
          <div className="inline-block min-w-full">
            {/* Labels dos meses */}
            <div className="flex gap-[2px] mb-1 ml-11">
              {monthPositions.map((pos, index) => (
                <div
                  key={index}
                  style={{
                    marginLeft: index === 0 ? `${pos.weekIndex * 10}px` : `${(pos.weekIndex - monthPositions[index - 1].weekIndex) * 10 - 24}px`,
                    minWidth: '30.5px'
                  }}
                  className="text-gray-600 font-mono"
                >
                  {pos.month}
                </div>
              ))}
            </div>

            {/* Grid do heatmap */}
            <div className="flex gap-[2px]">
              {/* Labels dos dias da semana */}
              <div className="flex flex-col gap-[2px] mr-1">
                {dayNames.map((day, index) => (
                  <div
                    key={day}
                    className="w-5 h-[10px] flex items-center text-gray-600 font-mono"
                  >
                    {index % 2 === 1 ? day : ''}
                  </div>
                ))}
              </div>

              <div className="ml-2 mb-2 flex gap-[2px]">
                {/* Colunas de semanas */}
                {heatmapData.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-[2px]">
                    {week.map((day, dayIndex) => {
                      const dateStr = day.date.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      });

                      return (
                        <div
                          key={`${weekIndex}-${dayIndex}`}
                          className="relative"
                        >
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: day.isCurrentYear ? 1 : 0.3 }}
                            transition={{
                              delay: (weekIndex * 7 + dayIndex) * 0.002,
                              duration: 0.15
                            }}
                            whileHover={day.isCurrentYear ? {
                              scale: 1.8,
                              zIndex: 10,
                              transition: { duration: 0.1 }
                            } : {}}
                            className={`
                            w-[10px] h-[10px] rounded-[1px] border 
                            ${day.isCurrentYear ? getColor(day.count) : 'bg-gray-950 border-gray-900'} 
                            transition-all cursor-default peer
                          `}
                          />

                          {/* Tooltip - só aparece no hover individual */}
                          {day.isCurrentYear && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 peer-hover:opacity-100 transition-opacity pointer-events-none z-20">
                              <div className="bg-gray-900 border border-blue-500/30 rounded px-2 py-1 shadow-lg whitespace-nowrap">
                                <div className="text-blue-400 font-mono">
                                  {day.count} {day.count === 1 ? 'commit' : 'commits'}
                                </div>
                                <div className="text-gray-500 font-mono">
                                  {dateStr}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Legenda */}
        <div className="flex items-center gap-2 mt-3 justify-end">
          <span className="text-gray-600 font-mono">Less</span>
          <div className="flex gap-1">
            <div className="w-[10px] h-[10px] rounded-[1px] bg-gray-900 border border-gray-800"></div>
            <div className="w-[10px] h-[10px] rounded-[1px] bg-blue-950 border border-blue-900"></div>
            <div className="w-[10px] h-[10px] rounded-[1px] bg-blue-800 border border-blue-700"></div>
            <div className="w-[10px] h-[10px] rounded-[1px] bg-blue-600 border border-blue-500"></div>
            <div className="w-[10px] h-[10px] rounded-[1px] bg-violet-500 border border-violet-400"></div>
          </div>
          <span className="text-gray-600 font-mono">More</span>
        </div>
      </div>
    </div>
  );
}
