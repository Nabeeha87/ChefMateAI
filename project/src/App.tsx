import { useCallback, useRef, useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { InputCard } from './components/InputCard';
import { LoadingState } from './components/LoadingState';
import { OutputCard } from './components/OutputCard';
import { ErrorDisplay } from './components/ErrorDisplay';
import { HowItWorks } from './components/HowItWorks';
import { Features } from './components/Features';
import { Footer } from './components/Footer';
import { useTheme } from './hooks/useTheme';
import { streamRecipe } from './lib/api';
import { getDemoRecipe } from './lib/demoRecipe';
import type { GenerationStatus, Recipe, RecipeRequest } from './types';

function App() {
  const { theme, toggleTheme } = useTheme();
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [streamingText, setStreamingText] = useState('');
  const [error, setError] = useState('');
  const [lastRequest, setLastRequest] = useState<RecipeRequest | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const scrollToGenerator = useCallback(() => {
    document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleNavClick = useCallback((id: string) => {
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleGenerate = useCallback(
    async (request: RecipeRequest) => {
      // Cancel any in-flight request
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLastRequest(request);
      setError('');
      setRecipe(null);
      setStreamingText('');
      setStatus('loading');

      let hasFirstChunk = false;

      try {
        const result = await streamRecipe(
          request,
          (_chunk, accumulated) => {
            if (!hasFirstChunk) {
              hasFirstChunk = true;
              setStatus('streaming');
            }
            setStreamingText(accumulated);
          },
          controller.signal,
        );

        setRecipe(result);
        setStreamingText('');
        setStatus('success');
        // Scroll to output
        setTimeout(() => {
          document.getElementById('output')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        const message =
          err instanceof Error
            ? err.message
            : 'An unexpected error occurred. Please try again.';
        setError(message);
        setStatus('error');
      }
    },
    [],
  );

  const handleRegenerate = useCallback(() => {
    if (lastRequest) {
      handleGenerate(lastRequest);
    }
  }, [lastRequest, handleGenerate]);

  const handleRetry = useCallback(() => {
    if (lastRequest) {
      handleGenerate(lastRequest);
    } else {
      setStatus('idle');
      setError('');
    }
  }, [lastRequest, handleGenerate]);

  const handleDemo = useCallback(() => {
    if (!lastRequest) return;
    const demo = getDemoRecipe(lastRequest);
    setRecipe(demo);
    setStreamingText('');
    setError('');
    setStatus('success');
    setTimeout(() => {
      document.getElementById('output')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, [lastRequest]);

  return (
    <div id="top" className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <Header theme={theme} onToggleTheme={toggleTheme} onNavClick={handleNavClick} />

      <main>
        <Hero />

        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <InputCard onGenerate={handleGenerate} isLoading={status === 'loading' || status === 'streaming'} />

          {/* Output area */}
          <div id="output" className="scroll-mt-20 mt-6">
            {status === 'loading' && <LoadingState />}

            {status === 'streaming' && (
              <OutputCard
                recipe={recipe ?? emptyRecipe}
                onRegenerate={handleRegenerate}
                streamingText={streamingText}
              />
            )}

            {status === 'success' && recipe && (
              <OutputCard recipe={recipe} onRegenerate={handleRegenerate} />
            )}

            {status === 'error' && (
              <ErrorDisplay
                message={error}
                onRetry={handleRetry}
                onDemo={lastRequest ? handleDemo : undefined}
              />
            )}
          </div>

          {/* Prompt to scroll when idle */}
          {status === 'idle' && !recipe && (
            <div className="mt-6 text-center">
              <button
                onClick={scrollToGenerator}
                className="text-sm text-slate-500 dark:text-slate-400 transition-colors hover:text-primary-500"
              >
                Fill in your ingredients above to get started
              </button>
            </div>
          )}
        </div>

        <HowItWorks />
        <Features />
      </main>

      <Footer />
    </div>
  );
}

const emptyRecipe: Recipe = {
  recipeName: '',
  description: '',
  preparationTime: '',
  cookingTime: '',
  servingSize: '',
  estimatedCalories: '',
  ingredients: [],
  instructions: [],
  chefTips: [],
  substitutions: [],
  nutritionalHighlights: [],
};

export default App;
