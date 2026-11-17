"use client";

import { useState } from "react";
import Image from "next/image";
import { SILKS } from "@/lib/silks";

export default function Home() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [respondentName, setRespondentName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedSilk = SILKS.find((s) => s.id === selectedId);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedId || !question.trim() || loading) return;

    setLoading(true);
    setError("");
    setResponse("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ silkId: selectedId, question }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        setResponse(data.response);
        setRespondentName(data.name);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-navy text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold tracking-widest uppercase text-family">
            36 Group
          </span>
          <span className="text-white/30">|</span>
          <span className="text-sm text-white/70">Family Team</span>
        </div>
        <span className="text-xs text-white/40 uppercase tracking-widest hidden sm:block">
          Ask the Silk
        </span>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-navy mb-3">
            Ask the Silk
          </h1>
          <p className="text-stone-500 text-lg max-w-xl mx-auto leading-relaxed">
            Got a question? Our KCs are standing by. Sort of.
          </p>

          {/* Disclaimer banner */}
          <div className="mt-6 inline-flex items-start gap-2 bg-family/15 border border-family/40 rounded-xl px-5 py-3 text-sm text-navy/80 max-w-xl text-left">
            <span className="text-family mt-0.5 text-base">⚠️</span>
            <span>
              <strong>Not legal advice. Not even close.</strong> This is a bit of fun for our
              family seminar — each KC has been given a tongue-in-cheek persona
              for comedy purposes. Nothing here reflects their actual views, and
              none of it should influence any decision more important than what
              to have for lunch.
            </span>
          </div>
        </div>

        {/* Photo selector */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-stone-400 mb-4 text-center">
            Choose your silk
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {SILKS.filter((s) => s.photo).map((silk) => (
              <button
                key={silk.id}
                onClick={() => {
                  setSelectedId(silk.id);
                  setResponse("");
                  setError("");
                }}
                className={`group relative flex flex-col items-center rounded-2xl p-3 border-2 transition-all duration-150 cursor-pointer ${
                  selectedId === silk.id
                    ? "border-family bg-family/10 shadow-md"
                    : "border-transparent bg-stone-50 hover:border-family/50 hover:bg-family/5"
                }`}
              >
                {/* Photo */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-2 ring-2 ring-transparent group-hover:ring-family/50 transition-all">
                  <Image
                    src={silk.photo}
                    alt={silk.name}
                    fill
                    className="object-cover object-top"
                    sizes="96px"
                  />
                </div>

                {/* Name */}
                <span className="text-xs font-semibold text-navy text-center leading-tight">
                  {silk.name}
                </span>

                {/* Selected tick */}
                {selectedId === silk.id && (
                  <span className="absolute top-2 right-2 w-5 h-5 bg-family rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Persona description */}
          {selectedSilk && (
            <div className="mt-4 bg-navy/5 border border-navy/10 rounded-xl px-5 py-3 text-sm text-navy/70 italic text-center">
              <strong className="not-italic text-navy">{selectedSilk.name}:</strong>{" "}
              {selectedSilk.persona}
            </div>
          )}
        </div>

        {/* Question form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold uppercase tracking-widest text-stone-400 mb-1.5">
              Your question
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={
                selectedSilk
                  ? `Ask ${selectedSilk.name.split(" ")[0]} anything…`
                  : "Select a silk above, then ask your question…"
              }
              rows={4}
              disabled={!selectedId}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-navy placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-family focus:border-transparent resize-none transition disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !selectedId || !question.trim()}
            className="w-full bg-navy hover:bg-navy-light disabled:bg-stone-200 disabled:text-stone-400 text-white font-semibold py-3.5 px-6 rounded-xl transition-colors duration-150 tracking-wide text-sm"
          >
            {loading
              ? "Consulting the brief…"
              : selectedSilk
              ? `Ask ${selectedSilk.name.split(" ")[0]}`
              : "Select a silk to continue"}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Response */}
        {response && (
          <div className="mt-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px flex-1 bg-stone-200" />
              <span className="text-stone-400 text-xs font-semibold uppercase tracking-widest">
                {respondentName} responds
              </span>
              <div className="h-px flex-1 bg-stone-200" />
            </div>
            <div className="bg-navy/3 border border-navy/10 rounded-2xl p-7">
              <p className="text-navy/90 leading-relaxed whitespace-pre-wrap text-[1.05rem]">
                {response}
              </p>
            </div>

            {/* Second disclaimer at bottom of response */}
            <p className="mt-4 text-center text-xs text-stone-400 italic">
              This response was generated by AI in a fictional persona. It is not legal advice and does not represent the views of {respondentName} or 36 Group.
            </p>
          </div>
        )}
      </div>

      <footer className="mt-8 border-t border-stone-100 py-6 text-center text-xs text-stone-400">
        <span className="text-family font-semibold">36 Group</span> Family Team Seminar ·{" "}
        AI-generated responses · Not legal advice · Please do not sue us
      </footer>
    </main>
  );
}
