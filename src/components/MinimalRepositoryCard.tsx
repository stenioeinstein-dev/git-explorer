import { motion } from "framer-motion";
import { Star, GitFork, Circle, GitCommit } from "lucide-react";
import { ContributionHeatmap } from "./ContributionHeatmap";
import { useState } from "react";

interface MinimalRepositoryCardProps {
  repo: {
    id: number;
    name: string;
    description: string;
    html_url: string;
    language: string;
    stargazers_count: number;
    forks_count: number;
    updated_at: string;
    created_at: string;
    commits_count?: number;
    commits_by_date?: Record<string, number>;
  };
  index: number;
}

const languageColors: { [key: string]: string } = {
  JavaScript: "text-yellow-400",
  TypeScript: "text-blue-400",
  Python: "text-blue-500",
  Java: "text-orange-500",
  Go: "text-cyan-400",
  Rust: "text-orange-600",
  Ruby: "text-red-500",
  PHP: "text-purple-500",
  CSS: "text-pink-500",
  HTML: "text-orange-400",
  default: "text-gray-400",
};

export function MinimalRepositoryCard({ repo, index }: MinimalRepositoryCardProps) {
  const languageColor = languageColors[repo.language] || languageColors.default;
  const [showHeatmap, setShowHeatmap] = useState(false);
  const commits = repo.commits_count !== undefined ? repo.commits_count : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-violet-500/5 to-purple-500/0 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative border border-blue-500/10 group-hover:border-violet-500/30 rounded p-5 bg-gray-950/30 backdrop-blur-sm transition-all duration-300">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-blue-400 hover:text-violet-400 transition-colors duration-300 break-all"
          >
            {repo.name}
          </a>
          {repo.language && (
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <Circle className={`w-2 h-2 ${languageColor} fill-current`} />
              <span className={`font-mono ${languageColor}`}>
                {repo.language}
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-500 mb-4 line-clamp-2 min-h-[2.5rem]">
          {repo.description || (
            <span className="italic text-gray-600">no description provided</span>
          )}
        </p>

        {/* Footer */}
        <div className="flex items-center gap-4 text-gray-600 font-mono mb-4">
          <div className="flex items-center gap-1.5 hover:text-yellow-400 transition-colors">
            <Star className="w-3.5 h-3.5" />
            <span>{repo.stargazers_count}</span>
          </div>
          <div className="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
            <GitFork className="w-3.5 h-3.5" />
            <span>{repo.forks_count}</span>
          </div>
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className="ml-auto flex items-center gap-1.5 hover:text-violet-400 transition-colors"
          >
            <GitCommit className="w-3.5 h-3.5" />
            <span>{commits > 0 ? commits : '...'}</span>
          </button>
        </div>

        {/* Contribution Heatmap */}
        {showHeatmap && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ContributionHeatmap 
              commits={commits} 
              updatedAt={repo.updated_at}
              createdAt={repo.created_at}
              commitsByDate={repo.commits_by_date}
            />
          </motion.div>
        )}
      </div>

      {/* Decorative corner */}
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-blue-500/0 group-hover:border-violet-500/50 transition-colors duration-300"></div>
    </motion.div>
  );
}
