export function Footer() {
  return (
    <footer className="w-full bg-gray-100 dark:bg-[#1877F2] text-gray-800 dark:text-white transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-6 py-6 flex flex-col items-center gap-3 text-center">

        {/* Logo / Brand name */}
        <div className="border-2 border-[#1877F2] dark:border-white px-1 py-px">
          <span className="text-xl sm:text-2xl font-black tracking-widest uppercase text-[#1877F2] dark:text-white">
            NFL Mock Draft
          </span>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-gray-600 dark:text-white/90 max-w-2xl leading-relaxed">
          Build your 2026 NFL Mock Draft, simulate every pick, and share your results with fellow fans.
        </p>

        {/* Copyright */}
        <p className="text-xs text-gray-500 dark:text-white/75 pt-1.5 border-t border-gray-300 dark:border-white/20 w-full">
          NFL Mock Draft Simulator &copy; 2026 | All Rights Reserved
        </p>
      </div>
    </footer>
  );
}
