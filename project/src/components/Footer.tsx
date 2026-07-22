import { ChefHat, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200/10 py-8">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-600">
              <ChefHat className="h-4 w-4 text-white" />
            </div>
            <span className="font-display text-sm font-bold">
              ChefMate <span className="gradient-text"></span>
            </span>
          </div>
          <p className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
            Made with <Heart className="h-3.5 w-3.5 text-primary-500 fill-primary-500" /> for home chefs
          </p>
        </div>
      </div>
    </footer>
  );
}
