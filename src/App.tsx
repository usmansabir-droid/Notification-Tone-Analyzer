/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, AlertCircle, CheckCircle2, Heart, Sparkles, Loader2, MessageSquare, Copy, Check } from 'lucide-react';
import { analyzeNotification, UXAnalysis } from './services/uxService';

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1.5 hover:bg-black/5 rounded-md transition-colors text-black/20 hover:text-emerald-600"
      title="Copy to clipboard"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );
}

function SkeletonLoader() {
  return (
    <div className="grid gap-10 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-black/5"></div>
        <div className="h-2 w-24 bg-stone-200 rounded-full"></div>
        <div className="h-px flex-1 bg-black/5"></div>
      </div>

      <div className="grid gap-8">
        <div className="bg-white border border-black/5 rounded-3xl p-8 shadow-sm">
          <div className="h-2 w-32 bg-stone-100 rounded-full mb-4"></div>
          <div className="h-8 w-3/4 bg-stone-100 rounded-lg"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1 bg-white p-8 rounded-3xl border border-black/5 shadow-sm flex flex-col items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-stone-50 mb-6"></div>
            <div className="h-4 w-24 bg-stone-100 rounded-full mb-2"></div>
            <div className="h-3 w-32 bg-stone-50 rounded-full"></div>
          </div>
          <div className="md:col-span-2 bg-stone-50 p-10 rounded-3xl border border-black/5">
            <div className="h-2 w-24 bg-stone-200 rounded-full mb-6"></div>
            <div className="h-6 w-full bg-stone-200/50 rounded-lg mb-4"></div>
            <div className="h-6 w-2/3 bg-stone-200/50 rounded-lg mb-8"></div>
            <div className="flex gap-2">
              <div className="h-8 w-16 bg-white rounded-xl"></div>
              <div className="h-8 w-20 bg-white rounded-xl"></div>
              <div className="h-8 w-14 bg-white rounded-xl"></div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="h-6 w-48 bg-stone-100 rounded-full"></div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm space-y-5">
                <div className="flex justify-between">
                  <div className="h-3 w-16 bg-stone-100 rounded-full"></div>
                  <div className="h-6 w-6 bg-stone-50 rounded-md"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-stone-50 rounded-full"></div>
                  <div className="h-4 w-5/6 bg-stone-50 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<UXAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastAnalyzedInput, setLastAnalyzedInput] = useState('');

  const handleAnalyze = async (textToAnalyze?: string) => {
    const targetText = textToAnalyze || input;
    if (!targetText.trim()) return;
    
    if (textToAnalyze) setInput(textToAnalyze);
    setLoading(true);
    setError(null);
    setLastAnalyzedInput(targetText);
    try {
      const data = await analyzeNotification(targetText);
      setResult(data);
    } catch (err) {
      console.error(err);
      setError('Failed to analyze the notification. Please try again.');
    } finally {
      setLoading(false);
      // Scroll to results
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  };

  const examples = [
    { 
      label: 'Payment', 
      icon: <AlertCircle size={14} />,
      text: 'Credit card declined. Update payment method immediately or lose access.',
      context: 'High Stress'
    },
    { 
      label: 'Email', 
      icon: <MessageSquare size={14} />,
      text: 'Invalid email format. You must enter a real email.',
      context: 'Frustration'
    },
    { 
      label: 'Search', 
      icon: <CheckCircle2 size={14} />,
      text: 'No results found. Try again.',
      context: 'Disappointment'
    },
    { 
      label: 'Session', 
      icon: <Loader2 size={14} />,
      text: 'Session expired due to inactivity. Log in again.',
      context: 'Confusion'
    },
    { 
      label: 'Paywall', 
      icon: <Sparkles size={14} />,
      text: 'Action forbidden. Upgrade your plan to access this feature.',
      context: 'Annoyance'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1A1A1A] font-sans selection:bg-emerald-100">
      {/* Header */}
      <header className="border-b border-black/5 py-6 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
              <Sparkles size={18} />
            </div>
            <h1 className="text-xl font-semibold tracking-tight">Notification Tone Analyzer</h1>
          </div>
          <p className="text-sm text-black/40 font-medium uppercase tracking-widest hidden sm:block">
            Expert UX Writing Assistant
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12 sm:py-20">
        <div className="grid gap-12">
          {/* Input Section */}
          <section className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-5xl font-medium tracking-tight">
                Analyze your notification.
              </h2>
              <p className="text-black/60 text-lg max-w-2xl">
                Paste a message that sounds a bit too harsh, and we'll help you soften it using expert UX writing principles.
              </p>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-[25px] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="e.g., 'Error: Invalid input. Try again.'"
                  className="w-full min-h-[180px] p-8 rounded-3xl bg-white border border-black/10 shadow-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-xl resize-none font-serif"
                />
                <button
                  onClick={() => handleAnalyze()}
                  disabled={loading || !input.trim()}
                  className="absolute bottom-6 right-6 bg-emerald-600 hover:bg-emerald-700 disabled:bg-black/10 disabled:cursor-not-allowed text-white px-8 py-4 rounded-2xl font-medium flex items-center gap-3 transition-all shadow-xl shadow-emerald-600/20 active:scale-95"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={22} />
                  ) : (
                    <Send size={22} />
                  )}
                  {loading ? 'Analyzing...' : 'Analyze Tone'}
                </button>
              </div>
            </div>
          </section>

          {/* Results Section */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-6 rounded-2xl bg-red-50 border border-red-100 text-red-600 flex items-center gap-4"
              >
                <AlertCircle size={24} />
                <p className="font-medium">{error}</p>
              </motion.div>
            )}

            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <SkeletonLoader />
              </motion.div>
            )}

            {result && !loading && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid gap-10"
              >
                {/* Input vs Output Header */}
                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-black/5"></div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/30">Analysis Results</span>
                  <div className="h-px flex-1 bg-black/5"></div>
                </div>

                <div className="grid gap-8">
                  {/* Original Input Display */}
                  <div className="bg-white border border-black/5 rounded-3xl p-8 shadow-sm">
                    <div className="flex items-center gap-2 mb-4 text-red-500/60">
                      <AlertCircle size={14} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Original Input (Harsh)</span>
                    </div>
                    <p className="text-2xl font-serif text-stone-400 line-through decoration-red-500/20">
                      "{lastAnalyzedInput}"
                    </p>
                  </div>

                  {/* Visualization Row */}
                  <div className="grid md:grid-cols-3 gap-8">
                    {/* Harshness Meter */}
                    <div className="md:col-span-1 bg-white p-8 rounded-3xl border border-black/5 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-stone-100">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${result.harshnessScore}%` }}
                          className={`h-full ${
                            result.harshnessScore > 70 ? "bg-red-500" :
                            result.harshnessScore > 40 ? "bg-amber-500" :
                            "bg-emerald-500"
                          }`}
                        />
                      </div>
                      <div className="relative w-32 h-32 mb-6">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle
                            cx="64"
                            cy="64"
                            r="58"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-stone-50"
                          />
                          <motion.circle
                            cx="64"
                            cy="64"
                            r="58"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={364.4}
                            initial={{ strokeDashoffset: 364.4 }}
                            animate={{ strokeDashoffset: 364.4 - (364.4 * result.harshnessScore) / 100 }}
                            transition={{ duration: 1.5, ease: "circOut" }}
                            className={
                              result.harshnessScore > 70 ? "text-red-500" :
                              result.harshnessScore > 40 ? "text-amber-500" :
                              "text-emerald-500"
                            }
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-4xl font-bold tracking-tighter">{result.harshnessScore}</span>
                          <span className="text-[9px] font-bold uppercase tracking-widest text-stone-400">Severity</span>
                        </div>
                      </div>
                      <h3 className="font-semibold text-stone-800 text-lg">Harshness Level</h3>
                      <p className="text-sm text-stone-500 mt-2 leading-relaxed">
                        {result.harshnessScore > 70 ? "Critical: This message likely causes user anxiety or frustration." :
                         result.harshnessScore > 40 ? "Moderate: The tone is robotic and could be more supportive." :
                         "Low: The message is clear but has room for more warmth."}
                      </p>
                    </div>

                    {/* Trigger Words & Explanation */}
                    <div className="md:col-span-2 bg-stone-50 p-10 rounded-3xl border border-black/5 flex flex-col justify-center relative">
                      <div className="absolute top-8 right-8 text-stone-200">
                        <MessageSquare size={40} />
                      </div>
                      <div className="flex items-center gap-2 mb-6 text-stone-400">
                        <AlertCircle size={16} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Expert Analysis</span>
                      </div>
                      <p className="text-2xl leading-relaxed text-stone-800 italic font-serif mb-8">
                        "{result.harshnessExplanation}"
                      </p>
                      <div className="space-y-3">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-stone-400 block">Trigger Points</span>
                        <div className="flex flex-wrap gap-2">
                          {result.triggerWords.map((word, i) => (
                            <span key={i} className="px-4 py-2 bg-white text-red-600 text-xs font-semibold rounded-xl border border-red-100 shadow-sm">
                              {word}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Alternatives Section */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <Sparkles size={16} />
                      </div>
                      <h3 className="text-xl font-medium tracking-tight">Softened Alternatives</h3>
                    </div>
                    
                    <div className="grid sm:grid-cols-3 gap-6">
                      {/* Direct */}
                      <div className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm space-y-5 relative group/card hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-blue-600">
                            <CheckCircle2 size={18} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Direct</span>
                          </div>
                          <CopyButton text={result.alternatives.direct} />
                        </div>
                        <p className="text-stone-700 text-lg leading-relaxed">{result.alternatives.direct}</p>
                      </div>

                      {/* Empathetic */}
                      <div className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm space-y-5 relative group/card hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-rose-500">
                            <Heart size={18} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Empathetic</span>
                          </div>
                          <CopyButton text={result.alternatives.empathetic} />
                        </div>
                        <p className="text-stone-700 text-lg leading-relaxed">{result.alternatives.empathetic}</p>
                      </div>

                      {/* Encouraging */}
                      <div className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm space-y-5 relative group/card hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-emerald-600">
                            <Sparkles size={18} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Encouraging</span>
                          </div>
                          <CopyButton text={result.alternatives.encouraging} />
                        </div>
                        <p className="text-stone-700 text-lg leading-relaxed">{result.alternatives.encouraging}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Scenario Library */}
          <section className="space-y-8 pt-12 border-t border-black/5">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-2">
                <h3 className="text-2xl font-medium tracking-tight">Scenario Library</h3>
                <p className="text-black/40">Common notifications that often benefit from a tone check.</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {examples.map((example) => (
                <button
                  key={example.label}
                  onClick={() => handleAnalyze(example.text)}
                  className="group text-left bg-white p-8 rounded-[32px] border border-black/5 shadow-sm hover:shadow-xl hover:border-emerald-500/20 transition-all duration-500 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-6 text-stone-100 group-hover:text-emerald-500/10 transition-colors">
                    {React.cloneElement(example.icon as React.ReactElement, { size: 80 })}
                  </div>
                  <div className="relative space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                        {example.label}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                        {example.context}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-stone-300 block">Harsh Input</span>
                      <p className="text-stone-800 font-serif text-lg leading-snug group-hover:text-emerald-900 transition-colors">
                        "{example.text}"
                      </p>
                    </div>
                    <div className="pt-4 flex items-center gap-2 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-xs font-bold uppercase tracking-widest">Try this scenario</span>
                      <Send size={12} />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-4 py-12 border-t border-black/5 mt-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-black/40 text-sm">
            <span>Built for UX Writers</span>
            <span className="w-1 h-1 bg-black/20 rounded-full" />
            <span>Powered by Gemini</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-black/40 hover:text-emerald-600 transition-colors">
              <MessageSquare size={20} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
