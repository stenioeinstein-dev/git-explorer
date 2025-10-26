import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function ParallaxBackground() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const y3 = useTransform(scrollYProgress, [0, 1], ["0%", "70%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0]);

  return (
    <div ref={ref} className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      
      {/* Floating orbs with parallax */}
      <motion.div
        style={{ y: y1, opacity }}
        className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
      ></motion.div>
      
      <motion.div
        style={{ y: y2, opacity }}
        className="absolute top-40 right-1/4 w-[500px] h-[500px] bg-violet-600/15 rounded-full blur-3xl"
      ></motion.div>
      
      <motion.div
        style={{ y: y3, opacity }}
        className="absolute top-60 left-1/2 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
      ></motion.div>

      {/* Scanline effect */}
      <motion.div
        animate={{
          y: [0, 1000],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"
      ></motion.div>
    </div>
  );
}
