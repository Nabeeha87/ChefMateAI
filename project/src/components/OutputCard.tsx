import { useState } from 'react';
import {
  Copy,
  Check,
  RefreshCw,
  Clock,
  Users,
  Flame,
  ChefHat,
  Lightbulb,
  Repeat,
  Sparkles,
  Timer,
  ListChecks,
  CheckCircle2,
} from 'lucide-react';
import type { Recipe } from '../types';

interface OutputCardProps {
  recipe: Recipe;
  onRegenerate: () => void;
  streamingText?: string;
}

export function OutputCard({ recipe, onRegenerate, streamingText }: OutputCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = formatRecipeAsText(recipe);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isStreaming = Boolean(streamingText);

  return (
    <div className="animate-fade-in-up glass-strong rounded-3xl p-6 sm:p-8 shadow-xl overflow-hidden">
      {/* Header row */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/30">
            <ChefHat className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold leading-tight">
              {isStreaming ? 'Your Recipe' : recipe.recipeName}
            </h2>
            {isStreaming && (
              <p className="text-xs text-primary-500 flex items-center gap-1">
                <Sparkles className="h-3 w-3 animate-pulse-soft" />
                Streaming...
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            disabled={isStreaming}
            className="btn-ghost flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 disabled:opacity-50"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-success-500" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy
              </>
            )}
          </button>
          <button
            onClick={onRegenerate}
            disabled={isStreaming}
            className="btn-ghost flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 disabled:opacity-50"
          >
            <RefreshCw className="h-4 w-4" />
            New Recipe
          </button>
        </div>
      </div>

      {isStreaming ? (
        /* While streaming, show raw text arriving progressively */
        <div className="min-h-[200px] rounded-xl bg-slate-500/5 p-4">
          <pre className="whitespace-pre-wrap font-sans text-sm text-slate-600 dark:text-slate-300">
            {streamingText}
            <span className="inline-block w-2 animate-pulse-soft">▋</span>
          </pre>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Description */}
          {recipe.description && (
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              {recipe.description}
            </p>
          )}

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard icon={Timer} label="Prep Time" value={recipe.preparationTime} />
            <StatCard icon={Clock} label="Cook Time" value={recipe.cookingTime} />
            <StatCard icon={Users} label="Serves" value={recipe.servingSize} />
            <StatCard icon={Flame} label="Calories" value={recipe.estimatedCalories} />
          </div>

          {/* Ingredients */}
          {recipe.ingredients.length > 0 && (
            <Section icon={ListChecks} title="Ingredients">
              <ul className="grid gap-2 sm:grid-cols-2">
                {recipe.ingredients.map((ing, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 rounded-lg bg-slate-500/5 px-3 py-2 text-sm"
                  >
                    <CheckCircle2
                      className={`mt-0.5 h-4 w-4 shrink-0 ${
                        ing.available ? 'text-success-500' : 'text-slate-400'
                      }`}
                    />
                    <span>
                      <span className="font-medium text-slate-800 dark:text-slate-100">
                        {ing.name}
                      </span>
                      {ing.amount && (
                        <span className="text-slate-500 dark:text-slate-400"> — {ing.amount}</span>
                      )}
                      {ing.available && (
                        <span className="ml-1.5 inline-block rounded bg-success-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-success-600 dark:text-success-400">
                          yours
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* Instructions */}
          {recipe.instructions.length > 0 && (
            <Section icon={ChefHat} title="Instructions">
              <ol className="space-y-3">
                {recipe.instructions.map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-xs font-bold text-white shadow-sm">
                      {i + 1}
                    </span>
                    <p className="pt-0.5 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                      {step}
                    </p>
                  </li>
                ))}
              </ol>
            </Section>
          )}

          {/* Chef Tips */}
          {recipe.chefTips.length > 0 && (
            <Section icon={Lightbulb} title="Chef Tips" accent="accent">
              <ul className="space-y-2">
                {recipe.chefTips.map((tip, i) => (
                  <li key={i} className="flex gap-2.5 text-sm text-slate-700 dark:text-slate-200">
                    <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" />
                    {tip}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* Substitutions */}
          {recipe.substitutions.length > 0 && (
            <Section icon={Repeat} title="Substitutions">
              <ul className="space-y-2">
                {recipe.substitutions.map((sub, i) => (
                  <li key={i} className="flex gap-2.5 text-sm text-slate-700 dark:text-slate-200">
                    <Repeat className="mt-0.5 h-4 w-4 shrink-0 text-secondary-500" />
                    {sub}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* Nutritional Highlights */}
          {recipe.nutritionalHighlights.length > 0 && (
            <Section icon={Sparkles} title="Nutritional Highlights" accent="success">
              <div className="flex flex-wrap gap-2">
                {recipe.nutritionalHighlights.map((n, i) => (
                  <span
                    key={i}
                    className="rounded-full bg-success-500/10 px-3 py-1.5 text-sm font-medium text-success-700 dark:text-success-400"
                  >
                    {n}
                  </span>
                ))}
              </div>
            </Section>
          )}
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="glass rounded-xl p-3 text-center">
      <Icon className="mx-auto mb-1.5 h-5 w-5 text-primary-500" />
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{value}</p>
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  children,
  accent = 'primary',
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
  accent?: 'primary' | 'accent' | 'success';
}) {
  const colors = {
    primary: 'text-primary-500',
    accent: 'text-accent-500',
    success: 'text-success-500',
  };
  return (
    <div>
      <h3 className="mb-3 flex items-center gap-2 font-display text-base font-bold text-slate-800 dark:text-slate-100">
        <Icon className={`h-4 w-4 ${colors[accent]}`} />
        {title}
      </h3>
      {children}
    </div>
  );
}

function formatRecipeAsText(r: Recipe): string {
  const lines: string[] = [
    `Recipe: ${r.recipeName}`,
    '',
    r.description,
    '',
    `Prep Time: ${r.preparationTime}`,
    `Cook Time: ${r.cookingTime}`,
    `Servings: ${r.servingSize}`,
    `Calories: ${r.estimatedCalories}`,
    '',
    'Ingredients:',
    ...r.ingredients.map((i) => `  - ${i.name}${i.amount ? ` (${i.amount})` : ''}`),
    '',
    'Instructions:',
    ...r.instructions.map((s, i) => `  ${i + 1}. ${s}`),
    '',
    'Chef Tips:',
    ...r.chefTips.map((t) => `  - ${t}`),
    '',
    'Substitutions:',
    ...r.substitutions.map((s) => `  - ${s}`),
    '',
    'Nutritional Highlights:',
    ...r.nutritionalHighlights.map((n) => `  - ${n}`),
  ];
  return lines.join('\n');
}
