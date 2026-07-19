import { ChefHat, Sparkles } from 'lucide-react';

export function LoadingState() {
  return (
    <div className="animate-fade-in glass-strong rounded-3xl p-8 shadow-xl">
      <div className="flex flex-col items-center justify-center py-12">
        {/* Animated chef hat */}
        <div className="relative mb-6">
          <div className="absolute inset-0 animate-ping rounded-full bg-primary-500/20" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/40">
            <ChefHat className="h-10 w-10 text-white animate-bounce-in" />
          </div>
        </div>

        {/* Spinner ring */}
        <div className="relative mb-5 h-8 w-8">
          <div className="absolute inset-0 rounded-full border-2 border-slate-200 dark:border-slate-700" />
          <div className="absolute inset-0 animate-spin-slow rounded-full border-2 border-transparent border-t-primary-500" />
        </div>

        <p className="font-display text-lg font-semibold text-slate-800 dark:text-slate-100">
          Cooking your recipe...
        </p>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
          <Sparkles className="h-3.5 w-3.5 text-primary-500 animate-pulse-soft" />
          Our AI chef is crafting something delicious
        </p>

        {/* Progress dots */}
        <div className="mt-6 flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-2 w-2 rounded-full bg-primary-500/60"
              style={{
                animation: `pulseSoft 1.4s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
