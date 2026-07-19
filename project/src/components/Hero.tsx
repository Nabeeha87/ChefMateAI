import { Sparkles, ChefHat, Clock, Leaf } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-8 sm:pt-20 sm:pb-12">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-br from-primary-500/20 to-secondary-500/10 blur-3xl" />
        <div className="absolute right-1/4 top-20 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-accent-400/10 to-primary-500/5 blur-3xl animate-pulse-soft" />
      </div>

      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex animate-fade-in-down items-center gap-2 rounded-full glass px-4 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300">
            <Sparkles className="h-4 w-4 text-primary-500" />
            <span>AI-Powered Recipe Generation</span>
          </div>

          {/* Headline */}
          <h1 className="animate-fade-in-up font-display text-4xl font-extrabold leading-tight tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Turn your ingredients into
            <br />
            <span className="gradient-text">delicious meals</span> with AI.
          </h1>

          {/* Subtext */}
          <p className="mt-6 max-w-2xl animate-fade-in-up text-lg text-slate-600 dark:text-slate-400 text-balance">
            Got random ingredients in your kitchen? Let our AI chef craft the perfect recipe —
            tailored to your cuisine, diet, and cooking time.
          </p>

          {/* Feature pills */}
          <div className="mt-8 flex flex-wrap animate-fade-in-up items-center justify-center gap-3">
            {[
              { icon: ChefHat, label: 'Personalized recipes' },
              { icon: Leaf, label: 'Dietary aware' },
              { icon: Clock, label: 'Time optimized' },
            ].map((f, i) => (
              <div
                key={f.label}
                className="glass flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <f.icon className="h-4 w-4 text-primary-500" />
                {f.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
