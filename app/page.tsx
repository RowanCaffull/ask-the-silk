"use client";

import { useState } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
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

  // Split into rows: 3 then 2
  const row1 = SILKS.filter((s) => s.photo).slice(0, 3);
  const row2 = SILKS.filter((s) => s.photo).slice(3);

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-navy px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-white font-bold text-xl tracking-tight">
            36 <span className="text-family">Family</span>
          </span>
        </div>
        <span className="text-white/40 text-xs uppercase tracking-widest hidden sm:block">
          Ask the Silk
        </span>
      </header>

      {/* Hero banner */}
      <div className="bg-gradient-to-br from-navy via-navy-light to-family py-12 px-6 text-center">
        <h1 className="text-5xl sm:text-6xl font-bold text-white mb-3 tracking-tight">
          Ask the Silk
        </h1>
        <p className="text-white/70 text-lg max-w-lg mx-auto">
          Got a question? Our KCs are standing by.{" "}
          <span className="italic">Sort of.</span>
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Disclaimer */}
        <div className="mb-10 flex items-start gap-3 bg-family/10 border border-family/30 rounded-2xl px-5 py-4 text-sm text-navy/80">
          <span className="text-lg mt-0.5">⚠️</span>
          <span>
            <strong>Not legal advice. Not even close.</strong> This is a bit of
            fun for our family seminar — each KC has been given a tongue-in-cheek
            persona for comedy purposes. Nothing here reflects their actual views,
            and none of it should influence any decision more important than what
            to have for lunch.
          </span>
        </div>

        {/* Photo selector — 3 then 2 */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-stone-400 mb-5 text-center">
            Choose your silk
          </p>

          {/* Row 1 — 3 people */}
          <div className="flex justify-center gap-4 sm:gap-6 mb-4 sm:mb-6">
            {row1.map((silk) => (
              <SilkCard
                key={silk.id}
                silk={silk}
                selected={selectedId === silk.id}
                onSelect={() => {
                  setSelectedId(silk.id);
                  setResponse("");
                  setError("");
                }}
              />
            ))}
          </div>

          {/* Row 2 — 2 people, centred */}
          <div className="flex justify-center gap-4 sm:gap-6">
            {row2.map((silk) => (
              <SilkCard
                key={silk.id}
                silk={silk}
                selected={selectedId === silk.id}
                onSelect={() => {
                  setSelectedId(silk.id);
                  setResponse("");
                  setError("");
                }}
              />
            ))}
          </div>

          {/* Persona description */}
          {selectedSilk && (
            <div className="mt-5 bg-navy/5 border border-navy/10 rounded-xl px-5 py-3 text-sm text-navy/70 italic text-center">
              <strong className="not-italic text-navy">
                {selectedSilk.name}:
              </strong>{" "}
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
            <div className="bg-navy/[0.03] border border-navy/10 rounded-2xl p-7">
              <div className="prose prose-navy max-w-none text-navy/90 prose-p:leading-relaxed prose-strong:text-navy prose-em:text-navy/80">
                <ReactMarkdown>{response}</ReactMarkdown>
              </div>
            </div>
            <p className="mt-4 text-center text-xs text-stone-400 italic">
              AI-generated in a fictional persona. Not the actual views of{" "}
              {respondentName} or 36 Family.
            </p>
          </div>
        )}
      </div>

      <footer className="mt-8 border-t border-stone-100 py-6 text-center text-xs text-stone-400">
        <span className="font-semibold text-navy">
          36 <span className="text-family">Family</span>
        </span>{" "}
        · AI-generated responses · Not legal advice · Please do not sue us
      </footer>
    </main>
  );
}

function SilkCard({
  silk,
  selected,
  onSelect,
}: {
  silk: { id: string; name: string; photo: string };
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`group relative flex flex-col items-center rounded-2xl p-3 sm:p-4 border-2 transition-all duration-150 cursor-pointer w-28 sm:w-36 ${
        selected
          ? "border-family bg-family/10 shadow-lg shadow-family/20"
          : "border-transparent bg-stone-50 hover:border-family/50 hover:bg-family/5 hover:shadow-md"
      }`}
    >
      <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden mb-3 ring-2 ring-transparent group-hover:ring-family/50 transition-all">
        <Image
          src={silk.photo}
          alt={silk.name}
          fill
          className="object-cover object-top"
          sizes="112px"
        />
      </div>
      <span className="text-xs font-semibold text-navy text-center leading-tight">
        {silk.name}
      </span>
      {selected && (
        <span className="absolute top-2 right-2 w-5 h-5 bg-family rounded-full flex items-center justify-center">
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </span>
      )}
    </button>
  );
}
