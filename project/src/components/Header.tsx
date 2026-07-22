import { ChefHat, Moon, Sun, Github } from 'lucide-react';

interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onNavClick: (id: string) => void;
}

const navLinks = [
  { label: 'Generate', id: 'generator' },
  { label: 'How it Works', id: 'how-it-works' },
  { label: 'Features', id: 'features' },
];

export function Header({ theme, onToggleTheme, onNavClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 glass-strong">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => onNavClick('top')}
            className="flex items-center gap-2.5 transition-transform hover:scale-105"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/30">
              <ChefHat className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display text-lg font-bold tracking-tight">
              ChefMate <span className="gradient-text"></span>
            </span>
          </button>

          {/* Nav links */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => onNavClick(link.id)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-primary-500/10 hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-400"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-500/10 dark:text-slate-300 sm:flex"
              aria-label="GitHub repository"
            >
              <Github className="h-5 w-5" />
            </a>
            <button
              onClick={onToggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition-all hover:bg-slate-500/10 hover:rotate-12 dark:text-slate-300"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5 text-amber-400" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
