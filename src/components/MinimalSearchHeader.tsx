import { motion } from "framer-motion";
import { Search, Terminal, Home } from "lucide-react";
import { useState } from "react";

interface MinimalSearchHeaderProps {
  onSearch: (username: string) => void;
  onReset: () => void;
  isLoading: boolean;
  hasResults: boolean;
}

export function MinimalSearchHeader({ onSearch, onReset, isLoading, hasResults }: MinimalSearchHeaderProps) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearch(inputValue.trim());
    }
  };

  const handleReset = () => {
    setInputValue("");
    onReset();
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-gray-950/50 border-b border-blue-500/10"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <motion.button
            onClick={handleReset}
            className="flex items-center gap-2 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Terminal className="w-5 h-5 text-blue-400 group-hover:text-violet-400 transition-colors" />
            <span className="font-mono text-gray-400 group-hover:text-gray-300 transition-colors">
              <span className="text-blue-400 group-hover:text-violet-400 transition-colors">git</span>
              <span className="text-gray-600">::</span>
              <span className="text-violet-400 group-hover:text-purple-400 transition-colors">explorer</span>
            </span>
          </motion.button>

          <form onSubmit={handleSubmit} className="flex-1 max-w-md mx-8">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="search user..."
                disabled={isLoading}
                className="w-full bg-gray-900/50 text-gray-300 font-mono pl-10 pr-4 py-2 rounded border border-blue-500/20 focus:border-violet-500/40 focus:outline-none focus:ring-1 focus:ring-violet-500/20 placeholder:text-gray-600 transition-all disabled:opacity-50"
              />
              {inputValue && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"
                ></motion.div>
              )}
            </div>
          </form>

          <div className="flex items-center gap-4">
            {hasResults && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={handleReset}
                className="flex items-center gap-2 px-3 py-1.5 rounded border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 hover:border-violet-500/30 transition-all group"
              >
                <Home className="w-3.5 h-3.5 text-blue-400 group-hover:text-violet-400 transition-colors" />
                <span className="font-mono text-gray-400 group-hover:text-gray-300 transition-colors hidden sm:inline">
                  home
                </span>
              </motion.button>
            )}
            <div className="font-mono text-gray-600 flex items-center gap-2">
              <span className="hidden sm:inline">v1.0.0</span>
              <div className="w-px h-4 bg-blue-500/20"></div>
              <span className="text-blue-400">//</span>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
