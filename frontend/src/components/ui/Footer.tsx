import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";

const SOCIAL_LINKS = [
  {
    href: "https://www.facebook.com/essentiallysports",
    label: "Facebook",
    icon: Facebook,
  },
  {
    href: "https://x.com/es_sportsnews/",
    label: "X (Twitter)",
    icon: Twitter,
  },
  {
    href: "https://www.instagram.com/essentiallysportsmedia",
    label: "Instagram",
    icon: Instagram,
  },
  {
    href: "https://www.linkedin.com/company/essentially-sports/",
    label: "LinkedIn",
    icon: Linkedin,
  },
  {
    href: "https://www.youtube.com/@EssentiallySportsMedia",
    label: "YouTube",
    icon: Youtube,
  },
] as const;

export function Footer() {
  return (
    <footer className="w-full bg-gray-100 dark:bg-[#1877F2] text-gray-800 dark:text-white transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-6 py-6 flex flex-col items-center gap-3 text-center">

        {/* Logo / Brand name */}
        <div className="border-2 border-[#1877F2] dark:border-white px-1 py-px">
          <span className="text-xl sm:text-2xl font-black tracking-widest uppercase text-[#1877F2] dark:text-white">
            EssentiallySports
          </span>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-gray-600 dark:text-white/90 max-w-2xl leading-relaxed">
          EssentiallySports is a U.S.-based sports media platform built for modern fandom. We go beyond
          headlines to create storylines powered by athletes, fans, data, and culture, giving equal energy to
          the mainstream and the overlooked.
        </p>

        {/* Social icons */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-[#1877F2]/70 dark:border-white/80 text-[#1877F2] dark:text-white hover:bg-[#1877F2] hover:text-white dark:hover:bg-white dark:hover:text-[#1877F2] transition-colors duration-200"
            >
              <Icon size={14} />
            </a>
          ))}
        </div>

        {/* Copyright */}
        <p className="text-xs text-gray-500 dark:text-white/75 pt-1.5 border-t border-gray-300 dark:border-white/20 w-full">
          EssentiallySports Media, Inc. &copy; 2026 | All Rights Reserved
        </p>
      </div>
    </footer>
  );
}
