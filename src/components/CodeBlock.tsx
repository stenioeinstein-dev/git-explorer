import { motion } from "framer-motion";
import { ReactNode } from "react";

interface CodeBlockProps {
  children: ReactNode;
  lineNumbers?: boolean;
  className?: string;
}

export function CodeBlock({ children, lineNumbers = true, className = "" }: CodeBlockProps) {
  const lines = String(children).split('\n');

  return (
    <div className={`relative ${className}`}>
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-violet-500/20 rounded blur-sm opacity-50"></div>
      <div className="relative bg-gray-950/90 rounded border border-blue-500/20 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2 border-b border-blue-500/20 bg-gray-900/50">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
          </div>
          <span className="text-gray-500 font-mono">search.tsx</span>
        </div>
        <div className="p-4 font-mono overflow-x-auto">
          {lineNumbers ? (
            <div className="flex">
              <div className="select-none text-gray-600 pr-4 border-r border-blue-500/10">
                {lines.map((_, i) => (
                  <div key={i} className="text-right">
                    {i + 1}
                  </div>
                ))}
              </div>
              <div className="pl-4 flex-1">
                {children}
              </div>
            </div>
          ) : (
            <div>{children}</div>
          )}
        </div>
      </div>
    </div>
  );
}

interface SyntaxProps {
  keyword?: boolean;
  string?: boolean;
  function?: boolean;
  variable?: boolean;
  comment?: boolean;
  children: ReactNode;
}

export function Syntax({ keyword, string, function: func, variable, comment, children }: SyntaxProps) {
  let className = "";
  
  if (keyword) className = "text-purple-400";
  else if (string) className = "text-green-400";
  else if (func) className = "text-blue-400";
  else if (variable) className = "text-violet-300";
  else if (comment) className = "text-gray-500";
  else className = "text-gray-300";

  return <span className={className}>{children}</span>;
}
