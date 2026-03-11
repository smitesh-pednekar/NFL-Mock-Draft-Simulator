"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface Props {
  message: string;
  onDismiss: () => void;
}

export function ErrorBanner({ message, onDismiss }: Props) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-lg w-full mx-4"
      >
        <div className="bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
          <span className="flex-1 text-sm font-medium">{message}</span>
          <button onClick={onDismiss} aria-label="Dismiss error">
            <X size={16} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
