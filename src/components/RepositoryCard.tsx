import { Star, GitFork, Eye, Circle } from "lucide-react";

interface RepositoryCardProps {
  repo: {
    id: number;
    name: string;
    description: string;
    html_url: string;
    language: string;
    stargazers_count: number;
    forks_count: number;
    watchers_count: number;
    updated_at: string;
  };
}

const languageColors: { [key: string]: string } = {
  JavaScript: "bg-yellow-400",
  TypeScript: "bg-blue-400",
  Python: "bg-blue-500",
  Java: "bg-orange-500",
  Go: "bg-cyan-400",
  Rust: "bg-orange-600",
  Ruby: "bg-red-500",
  PHP: "bg-purple-500",
  CSS: "bg-pink-500",
  HTML: "bg-orange-400",
};

export function RepositoryCard({ repo }: RepositoryCardProps) {
  const formattedDate = new Date(repo.updated_at).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="block group relative"
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-violet-600 rounded-lg blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
      
      <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-950 rounded-lg p-6 border border-blue-500/10 hover:border-violet-500/30 transition-all duration-300 h-full flex flex-col shadow-xl ring-1 ring-white/5 hover:ring-violet-500/20">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-blue-400 group-hover:text-violet-400 transition-colors duration-300">
            {repo.name}
          </h3>
          {repo.language && (
            <div className="flex items-center gap-2 text-gray-400">
              <Circle className={`w-3 h-3 ${languageColors[repo.language] || 'bg-gray-400'} rounded-full`} />
              <span>{repo.language}</span>
            </div>
          )}
        </div>
        
        <p className="text-gray-400 mb-4 flex-1 line-clamp-2">
          {repo.description || "No description available"}
        </p>
        
        <div className="flex items-center gap-6 text-gray-500">
          <div className="flex items-center gap-1.5 hover:text-yellow-400 transition-colors">
            <Star className="w-4 h-4" />
            <span>{repo.stargazers_count}</span>
          </div>
          <div className="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
            <GitFork className="w-4 h-4" />
            <span>{repo.forks_count}</span>
          </div>
          <div className="flex items-center gap-1.5 hover:text-violet-400 transition-colors">
            <Eye className="w-4 h-4" />
            <span>{repo.watchers_count}</span>
          </div>
          <div className="ml-auto">
            {formattedDate}
          </div>
        </div>
      </div>
    </a>
  );
}
