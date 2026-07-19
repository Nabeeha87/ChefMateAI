import { Search, Wand2, UtensilsCrossed } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'List Your Ingredients',
    desc: 'Tell us what you have in your kitchen — even random leftovers work.',
  },
  {
    icon: Wand2,
    title: 'AI Generates a Recipe',
    desc: 'Our AI chef crafts a personalized recipe using your ingredients and preferences.',
  },
  {
    icon: UtensilsCrossed,
    title: 'Cook & Enjoy',
    desc: 'Follow beginner-friendly steps with tips, substitutions, and nutrition info.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 py-16">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400">
            Three simple steps from pantry to plate.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="glass glass-hover relative rounded-2xl p-6 text-center"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 px-3 py-0.5 text-xs font-bold text-white shadow-lg">
                Step {i + 1}
              </div>
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-500/10">
                <step.icon className="h-7 w-7 text-primary-500" />
              </div>
              <h3 className="mb-2 font-display text-lg font-bold">{step.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
