import { ShieldCheck, Zap, Heart, Leaf, Clock, Sparkles } from 'lucide-react';

const features = [
  { icon: Zap, title: 'Lightning Fast', desc: 'Streaming responses mean your recipe appears in seconds.' },
  { icon: Leaf, title: 'Dietary Aware', desc: 'Vegetarian, vegan, high-protein — we respect your diet.' },
  { icon: ShieldCheck, title: 'Safe & Smart', desc: 'Beginner-friendly steps with no unsafe cooking advice.' },
  { icon: Heart, title: 'Health Focused', desc: 'Nutritional highlights and calorie estimates included.' },
  { icon: Clock, title: 'Time Optimized', desc: 'Filter by cooking time to fit your schedule.' },
  { icon: Sparkles, title: 'Pantry First', desc: 'Prioritizes ingredients you already have at home.' },
];

export function Features() {
  return (
    <section id="features" className="scroll-mt-20 py-16">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Why Chefs Love ChefMate
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400">
            Everything you need to turn random ingredients into a great meal.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="glass glass-hover group rounded-2xl p-5"
            >
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-500/10 transition-transform group-hover:scale-110">
                <f.icon className="h-5 w-5 text-primary-500" />
              </div>
              <h3 className="mb-1.5 font-display text-base font-bold">{f.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
