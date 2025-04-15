import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PageTransition from "../components/PageTransition";

function AccountSuccessAnimation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { entryData } = location.state || {};

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login", { state: { entryData } });
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate, entryData]);

  return (
    <PageTransition>
      <div className="flex items-center justify-center flex-col h-screen bg-white">
        <div className="success-checkmark mb-4">
          <motion.svg
            width="100"
            height="100"
            viewBox="0 0 100 100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#A7CFB8"
              strokeWidth="8"
            />
            <motion.path
              d="M30 50 L45 65 L70 35"
              fill="none"
              stroke="#A7CFB8"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            />
          </motion.svg>
        </div>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="text-xl text-[#4b755e]"
        >
          Account Created Successfully!
        </motion.h2>
      </div>
    </PageTransition>
  );
}

export default AccountSuccessAnimation;
