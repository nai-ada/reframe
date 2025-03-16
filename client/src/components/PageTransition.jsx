import { motion } from "framer-motion";

const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "-100%", opacity: 0 }}
      transition={{
        type: "tween",
        duration: 0.35,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
