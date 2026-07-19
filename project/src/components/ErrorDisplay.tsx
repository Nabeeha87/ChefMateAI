import { AlertTriangle, RefreshCw, KeyRound, UtensilsCrossed } from 'lucide-react';

interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
  /** When true, show a "try demo recipe" button alongside retry. */
  onDemo?: () => void;
}

export function ErrorDisplay({ message, onRetry, onDemo }: ErrorDisplayProps) {
  const isMissingKey = message.includes('OPENAI_API_KEY') || message.includes('not configured');

  return (
    <div className="animate-fade-in-up glass-strong rounded-3xl p-8 shadow-xl border border-error-500/20">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-error-500/10">
          {isMissingKey ? (
            <KeyRound className="h-7 w-7 text-error-500" />
          ) : (
            <AlertTriangle className="h-7 w-7 text-error-500" />
          )}
        </div>
        <h3 className="font-display text-lg font-bold text-slate-800 dark:text-slate-100">
          {isMissingKey ? 'AI API Key Required' : 'Oops! Something went wrong'}
        </h3>
        <p className="mt-2 max-w-md text-sm text-slate-600 dark:text-slate-400">
          {message}
        </p>

        {isMissingKey && (
          <div className="mt-4 w-full max-w-md rounded-xl bg-slate-500/5 p-4 text-left text-xs text-slate-600 dark:text-slate-400">
            <p className="mb-2 font-semibold text-slate-700 dark:text-slate-200">
              How to fix:
            </p>
            <ol className="list-decimal space-y-1 pl-4">
              <li>Open your Supabase project dashboard</li>
              <li>Go to <span className="font-medium">Edge Functions → Secrets</span></li>
              <li>Click <span className="font-medium">Add secret</span></li>
              <li>Name: <code className="rounded bg-slate-500/10 px-1">OPENAI_API_KEY</code></li>
              <li>Value: your OpenAI API key</li>
              <li>Save, then click "Try Again" below</li>
            </ol>
          </div>
        )}

        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onRetry}
            className="btn-ghost flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
          {onDemo && (
            <button
              onClick={onDemo}
              className="btn-primary flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm"
            >
              <UtensilsCrossed className="h-4 w-4" />
              Try Demo Recipe
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
