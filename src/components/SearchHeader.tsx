import { Search } from "lucide-react";

interface SearchHeaderProps {
  onSearch: (username: string) => void;
  isLoading: boolean;
}

export function SearchHeader({ onSearch, isLoading }: SearchHeaderProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    if (username.trim()) {
      onSearch(username.trim());
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-gray-950/80 border-b border-blue-500/20">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="bg-gradient-to-r from-blue-400 via-violet-500 to-purple-600 bg-clip-text text-transparent">
            GitHub Explorer
          </h1>
          <nav className="flex gap-6">
            <a 
              href="#search" 
              className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
            >
              Search
            </a>
            <a 
              href="#results" 
              className="text-gray-400 hover:text-violet-400 transition-colors duration-300"
            >
              Results
            </a>
          </nav>
        </div>
        
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-violet-500 to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
            <div className="relative flex items-center">
              <input
                type="text"
                name="username"
                placeholder="Enter GitHub username..."
                disabled={isLoading}
                className="flex-1 bg-gray-900 text-gray-100 px-6 py-4 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder:text-gray-500 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-500 to-violet-600 px-8 py-4 rounded-r-lg hover:from-blue-400 hover:to-violet-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </header>
  );
}
