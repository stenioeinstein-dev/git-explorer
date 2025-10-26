"use client"
import { useState } from "react";
import { motion } from "framer-motion";
import { ParallaxBackground } from "@/components/ParallaxBackground";
import { MinimalSearchHeader } from "@/components/MinimalSearchHeader";
import { MinimalUserCard } from "@/components/MinimalUserCard";
import { MinimalRepositoryCard } from "@/components/MinimalRepositoryCard";
import { ActivityTimeline } from "@/components/ActivityTimeline";
import { CodeBlock, Syntax } from "@/components/CodeBlock";
import { AlertCircle, Loader2, Terminal } from "lucide-react";

interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  bio: string;
  location: string;
  followers: number;
  following: number;
  public_repos: number;
  html_url: string;
  blog: string;
  created_at: string;
}

interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  updated_at: string;
  created_at: string;
  commits_count?: number;
}

export default function App() {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGitHubData = async (username: string) => {
    setIsLoading(true);
    setError(null);
    setUser(null);
    setRepos([]);

    try {
      const userResponse = await fetch(`https://api.github.com/users/${username}`);
      
      if (!userResponse.ok) {
        if (userResponse.status === 404) {
          throw new Error("User not found");
        }
        throw new Error("Failed to fetch user data");
      }

      const userData = await userResponse.json();
      setUser(userData);

      const reposResponse = await fetch(
        `https://api.github.com/users/${username}/repos?sort=updated&per_page=12`
      );

      if (reposResponse.ok) {
        const reposData = await reposResponse.json();
        
        // Buscar commits para cada repositório
        const reposWithCommits = await Promise.all(
          reposData.map(async (repo: GitHubRepo) => {
            try {
              // Buscar o número total de commits
              const commitsResponse = await fetch(
                `https://api.github.com/repos/${username}/${repo.name}/commits?per_page=1`
              );
              
              if (commitsResponse.ok) {
                // GitHub retorna o total de commits no header Link
                const linkHeader = commitsResponse.headers.get('Link');
                let commitsCount = 1;
                
                if (linkHeader) {
                  // Extrair o número total de páginas do header Link
                  const match = linkHeader.match(/page=(\d+)>; rel="last"/);
                  if (match) {
                    commitsCount = parseInt(match[1], 10);
                  }
                } else {
                  // Se não houver header Link, contar os commits manualmente
                  const commits = await commitsResponse.json();
                  commitsCount = commits.length;
                }
                
                return { ...repo, commits_count: commitsCount };
              }
            } catch (error) {
              console.error(`Error fetching commits for ${repo.name}:`, error);
            }
            
            return { ...repo, commits_count: 0 };
          })
        );
        
        setRepos(reposWithCommits);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setUser(null);
    setRepos([]);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 overflow-x-hidden">
      <ParallaxBackground />

      <MinimalSearchHeader 
        onSearch={fetchGitHubData} 
        onReset={handleReset}
        isLoading={isLoading}
        hasResults={!!user || !!error}
      />

      <main className="relative container mx-auto px-4 pt-32 pb-20">
        {/* Hero Section */}
        {!user && !isLoading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="mb-12">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 mb-6"
              >
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="font-mono text-blue-400">beta v1.0</span>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="mb-6 bg-gradient-to-r from-blue-400 via-violet-500 to-purple-600 bg-clip-text text-transparent"
              >
                GitHub Profile Explorer
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-gray-400 mb-8 max-w-2xl"
              >
                A minimalist interface to explore GitHub profiles, repositories, and developer activity.
                Built with modern web technologies.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <CodeBlock className="max-w-2xl">
                <Syntax comment>// Example usage</Syntax>{'\n'}
                <Syntax keyword>const</Syntax> <Syntax variable>user</Syntax> = <Syntax keyword>await</Syntax> <Syntax function>fetchGitHubProfile</Syntax>(<Syntax string>'username'</Syntax>);{'\n'}
                <Syntax keyword>console</Syntax>.<Syntax function>log</Syntax>(<Syntax variable>user</Syntax>.<Syntax variable>repositories</Syntax>);{'\n'}
                {'\n'}
                <Syntax comment>// Search above to get started →</Syntax>
              </CodeBlock>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-12 flex items-center gap-4 text-gray-600 font-mono"
            >
              <Terminal className="w-4 h-4 text-blue-400" />
              <span>Type a GitHub username to begin</span>
            </motion.div>
          </motion.div>
        )}

        {/* Loading State */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-xl animate-pulse"></div>
              <Loader2 className="relative w-12 h-12 text-blue-400 animate-spin" />
            </div>
            <p className="mt-6 text-gray-500 font-mono">fetching data...</p>
            <div className="mt-4 flex gap-1">
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                className="w-1.5 h-1.5 bg-blue-400 rounded-full"
              ></motion.div>
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                className="w-1.5 h-1.5 bg-violet-400 rounded-full"
              ></motion.div>
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                className="w-1.5 h-1.5 bg-purple-400 rounded-full"
              ></motion.div>
            </div>
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto"
          >
            <div className="border border-red-500/20 bg-red-500/5 rounded p-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-red-400 font-mono mb-1">Error</h3>
                  <p className="text-gray-400">{error}</p>
                  <p className="text-gray-600 font-mono mt-2">
                    // Try searching for another username
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* User Results */}
        {user && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-12"
          >
            <MinimalUserCard user={user} />

            {repos.length > 0 && (
              <>
                <ActivityTimeline repos={repos} />

                <div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mb-8"
                  >
                    <div className="flex items-center gap-4 mb-2">
                      <h2 className="font-mono text-gray-400">
                        <span className="text-blue-400">$</span> repositories
                      </h2>
                      <div className="flex-1 h-px bg-gradient-to-r from-blue-500/20 to-transparent"></div>
                      <span className="text-gray-600 font-mono">
                        {repos.length}
                      </span>
                    </div>
                  </motion.div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {repos.map((repo, index) => (
                      <MinimalRepositoryCard key={repo.id} repo={repo} index={index} />
                    ))}
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative border-t border-blue-500/10 mt-20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-gray-600 font-mono">
            <span>// built with Next.js + TypeScript</span>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
              <span>online</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
