import { useState } from 'react';
import { Sparkles, Loader2, Salad, Globe, HeartPulse, Clock, BarChart3 } from 'lucide-react';
import type {
  Cuisine,
  DietaryPreference,
  CookingTime,
  Difficulty,
  RecipeRequest,
} from '../types';

interface InputCardProps {
  onGenerate: (request: RecipeRequest) => void;
  isLoading: boolean;
}

const cuisines: Cuisine[] = ['Indian', 'Italian', 'Chinese', 'Mexican', 'Middle Eastern', 'Any'];
const diets: DietaryPreference[] = ['Vegetarian', 'Vegan', 'Non-Vegetarian', 'High Protein', 'Low Carb'];
const cookingTimes: CookingTime[] = ['15 minutes', '30 minutes', '45 minutes', '60+ minutes'];
const difficulties: Difficulty[] = ['Beginner', 'Intermediate', 'Advanced'];

const quickSuggestions = [
  'chicken, rice, garlic',
  'pasta, tomato, basil',
  'eggs, cheese, bread',
  'tofu, broccoli, soy sauce',
];

export function InputCard({ onGenerate, isLoading }: InputCardProps) {
  const [ingredients, setIngredients] = useState('');
  const [cuisine, setCuisine] = useState<Cuisine>('Any');
  const [diet, setDiet] = useState<DietaryPreference>('Vegetarian');
  const [cookingTime, setCookingTime] = useState<CookingTime>('30 minutes');
  const [difficulty, setDifficulty] = useState<Difficulty>('Beginner');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ingredients.trim() || isLoading) return;
    onGenerate({ ingredients, cuisine, dietaryPreference: diet, cookingTime, difficulty });
  };

  return (
    <section id="generator" className="scroll-mt-20">
      <form onSubmit={handleSubmit} className="glass-strong glass-hover rounded-3xl p-6 sm:p-8 shadow-xl">
        {/* Ingredients */}
        <div className="mb-6">
          <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            <Salad className="h-4 w-4 text-primary-500" />
            Your Ingredients
          </label>
          <textarea
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="e.g. chicken, rice, onion, garlic, ginger..."
            rows={3}
            className="input-field w-full rounded-xl px-4 py-3 text-sm resize-none scrollbar-thin"
            disabled={isLoading}
          />
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">Quick try:</span>
            {quickSuggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setIngredients(s)}
                disabled={isLoading}
                className="rounded-full border border-slate-300/30 px-2.5 py-1 text-xs text-slate-600 transition-all hover:border-primary-500/40 hover:bg-primary-500/10 hover:text-primary-600 disabled:opacity-50 dark:border-slate-600/40 dark:text-slate-300"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {/* Cuisine */}
          <SelectorGroup
            icon={Globe}
            label="Cuisine Preference"
            options={cuisines}
            value={cuisine}
            onChange={(v) => setCuisine(v as Cuisine)}
            disabled={isLoading}
          />
          {/* Dietary */}
          <SelectorGroup
            icon={HeartPulse}
            label="Dietary Preference"
            options={diets}
            value={diet}
            onChange={(v) => setDiet(v as DietaryPreference)}
            disabled={isLoading}
          />
          {/* Cooking Time */}
          <SelectorGroup
            icon={Clock}
            label="Cooking Time"
            options={cookingTimes}
            value={cookingTime}
            onChange={(v) => setCookingTime(v as CookingTime)}
            disabled={isLoading}
          />
          {/* Difficulty */}
          <SelectorGroup
            icon={BarChart3}
            label="Difficulty"
            options={difficulties}
            value={difficulty}
            onChange={(v) => setDifficulty(v as Difficulty)}
            disabled={isLoading}
          />
        </div>

        {/* Generate Button */}
        <button
          type="submit"
          disabled={isLoading || !ingredients.trim()}
          className="btn-primary mt-7 flex w-full items-center justify-center gap-2.5 rounded-xl px-6 py-4 text-base"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Cooking your recipe...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              Generate Recipe
            </>
          )}
        </button>
      </form>
    </section>
  );
}

interface SelectorGroupProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
}

function SelectorGroup({ icon: Icon, label, options, value, onChange, disabled }: SelectorGroupProps) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
        <Icon className="h-4 w-4 text-primary-500" />
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            disabled={disabled}
            onClick={() => onChange(opt)}
            className={`option-chip rounded-lg border px-3 py-1.5 text-sm font-medium ${
              value === opt
                ? 'active'
                : 'border-slate-300/30 text-slate-600 hover:border-slate-400/40 dark:border-slate-600/40 dark:text-slate-300'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
