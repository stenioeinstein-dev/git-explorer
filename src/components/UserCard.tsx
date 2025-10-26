import { MapPin, Users, BookOpen, Link as LinkIcon } from "lucide-react";

interface UserCardProps {
  user: {
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
  };
}

export function UserCard({ user }: UserCardProps) {
  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-violet-500 to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
      
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl p-8 border border-blue-500/20 hover:border-violet-500/40 transition-all duration-300">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-violet-600 rounded-full blur-sm opacity-50"></div>
            <img
              src={user.avatar_url}
              alt={user.name}
              className="relative w-32 h-32 rounded-full border-2 border-blue-500/50 shadow-xl"
            />
          </div>
          
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-gray-100 mb-1">{user.name}</h2>
              <a 
                href={user.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-violet-400 transition-colors duration-300"
              >
                @{user.login}
              </a>
            </div>
            
            {user.bio && (
              <p className="text-gray-400 max-w-2xl">{user.bio}</p>
            )}
            
            <div className="flex flex-wrap gap-6">
              {user.location && (
                <div className="flex items-center gap-2 text-gray-400">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span>{user.location}</span>
                </div>
              )}
              {user.blog && (
                <a 
                  href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-400 hover:text-violet-400 transition-colors duration-300"
                >
                  <LinkIcon className="w-4 h-4 text-blue-400" />
                  <span>Website</span>
                </a>
              )}
            </div>
            
            <div className="flex gap-8 pt-4">
              <div className="text-center">
                <div className="text-blue-400">{user.public_repos}</div>
                <div className="text-gray-500 flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  <span>Repos</span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-violet-400">{user.followers}</div>
                <div className="text-gray-500 flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>Followers</span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-purple-400">{user.following}</div>
                <div className="text-gray-500">Following</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
