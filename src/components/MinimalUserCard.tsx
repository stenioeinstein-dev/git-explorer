import { motion } from "framer-motion";
import { MapPin, Link as LinkIcon, Calendar } from "lucide-react";

interface MinimalUserCardProps {
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
    created_at: string;
  };
}

export function MinimalUserCard({ user }: MinimalUserCardProps) {
  const joinedDate = new Date(user.created_at).getFullYear();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative"
    >
      {/* Header with avatar */}
      <motion.div variants={itemVariants} className="flex items-start gap-6 mb-8">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-violet-600 rounded opacity-50 blur group-hover:opacity-75 transition-opacity"></div>
          <img
            src={user.avatar_url}
            alt={user.name}
            className="relative w-24 h-24 rounded border border-blue-500/30 shadow-lg"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-3 mb-2">
            <h1 className="text-gray-100 truncate">{user.name}</h1>
            <span className="font-mono text-gray-500">@{user.login}</span>
          </div>
          
          {user.bio && (
            <p className="text-gray-400 mb-4 max-w-2xl">{user.bio}</p>
          )}

          <div className="flex flex-wrap gap-4">
            {user.location && (
              <div className="flex items-center gap-1.5 text-gray-500 font-mono group">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span className="group-hover:text-gray-400 transition-colors">{user.location}</span>
              </div>
            )}
            {user.blog && (
              <a
                href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-gray-500 font-mono hover:text-violet-400 transition-colors group"
              >
                <LinkIcon className="w-3.5 h-3.5 text-blue-400 group-hover:text-violet-400 transition-colors" />
                <span>website</span>
              </a>
            )}
            <div className="flex items-center gap-1.5 text-gray-500 font-mono">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span>joined {joinedDate}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4">
        <StatsCard
          label="repositories"
          value={user.public_repos}
          color="blue"
          delay={0}
        />
        <StatsCard
          label="followers"
          value={user.followers}
          color="violet"
          delay={0.1}
        />
        <StatsCard
          label="following"
          value={user.following}
          color="purple"
          delay={0.2}
        />
      </motion.div>

      {/* Decorative line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent mt-8 origin-left"
      ></motion.div>
    </motion.div>
  );
}

interface StatsCardProps {
  label: string;
  value: number;
  color: "blue" | "violet" | "purple";
  delay: number;
}

function StatsCard({ label, value, color, delay }: StatsCardProps) {
  const colorClasses = {
    blue: "from-blue-500/10 to-blue-600/5 border-blue-500/20 text-blue-400",
    violet: "from-violet-500/10 to-violet-600/5 border-violet-500/20 text-violet-400",
    purple: "from-purple-500/10 to-purple-600/5 border-purple-500/20 text-purple-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ scale: 1.05, borderColor: "rgba(139, 92, 246, 0.4)" }}
      className={`relative group cursor-default`}
    >
      <div className={`bg-gradient-to-br ${colorClasses[color].split(' ').slice(0, 2).join(' ')} border ${colorClasses[color].split(' ')[2]} rounded p-4 transition-all`}>
        <div className="font-mono mb-1 text-gray-500">{label}</div>
        <div className={`${colorClasses[color].split(' ')[3]}`}>
          {value.toLocaleString()}
        </div>
      </div>
    </motion.div>
  );
}
