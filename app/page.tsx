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

  const row1 = SILKS.filter((s) => s.photo).slice(0, 3);
  const row2 = SILKS.filter((s) => s.photo).slice(3);

  return (
    <main className="min-h-screen" style={{ background: "linear-gradient(160deg, #0f1f4a 0%, #1b357a 50%, #0f1f4a 100%)" }}>

      {/* Header */}
      <header className="px-6 py-5 flex items-center justify-between border-b border-white/10">
        <Image
          src="/36family-logo.png"
          alt="36 Family"
          width={120}
          height={36}
          className="h-8 w-auto"
        />
        <span className="text-white/30 text-xs uppercase tracking-widest hidden sm:block">
          Family Seminar 2027
        </span>
      </header>

      {/* Hero */}
      <div className="text-center px-6 pt-14 pb-10">
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-family/40 bg-family/10 text-family text-xs font-semibold uppercase tracking-widest">
          2027 36 Family Seminar
        </div>
        <h1 className="text-5xl sm:text-7xl font-bold text-white mb-4 tracking-tight">
          Ask the Silk
        </h1>
        <p className="text-white/50 text-lg max-w-md mx-auto">
          Scan. Choose. Ask. Discover what a KC really thinks.{" "}
          <span className="text-white/30 italic text-sm">(Probably.)</span>
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-16">

        {/* Disclaimer */}
        <div className="mb-10 flex items-start gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white/60">
          <span className="text-family mt-0.5 shrink-0">⚠</span>
          <span>
            <strong className="text-white/80">Not legal advice. Not even close.</strong>{" "}
            Each KC has been given a tongue-in-cheek persona for comedy purposes.
            Nothing here reflects their actual views. Please do not make life
            decisions based on what Dexter thinks.
          </span>
        </div>

        {/* Photo selector */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-6 text-center">
            Choose your silk
          </p>

          {/* Row 1 — 3 people */}
          <div className="flex justify-center gap-4 sm:gap-8 mb-4 sm:mb-6">
            {row1.map((silk) => (
              <SilkCard
                key={silk.id}
                silk={silk}
                selected={selectedId === silk.id}
                onSelect={() => { setSelectedId(silk.id); setResponse(""); setError(""); }}
              />
            ))}
          </div>

          {/* Row 2 — 2 people centred */}
          <div className="flex justify-center gap-4 sm:gap-8">
            {row2.map((silk) => (
              <SilkCard
                key={silk.id}
                silk={silk}
                selected={selectedId === silk.id}
                onSelect={() => { setSelectedId(silk.id); setResponse(""); setError(""); }}
              />
            ))}
          </div>

          {/* Persona */}
          {selectedSilk && (
            <div className="mt-6 bg-white/5 border border-family/20 rounded-xl px-5 py-3 text-sm text-white/60 italic text-center">
              <strong className="not-italic text-family">{selectedSilk.name}:</strong>{" "}
              {selectedSilk.persona}
            </div>
          )}
        </div>

        {/* Question form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-white/30 mb-2">
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
              className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-family focus:border-transparent resize-none transition disabled:opacity-30 disabled:cursor-not-allowed"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !selectedId || !question.trim()}
            className="w-full font-semibold py-4 px-6 rounded-xl transition-all duration-150 tracking-wide text-sm disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: loading || !selectedId || !question.trim()
                ? "rgba(255,255,255,0.1)"
                : "linear-gradient(135deg, #76cbd6, #4aa8b5)",
              color: loading || !selectedId || !question.trim() ? "rgba(255,255,255,0.3)" : "#0f1f4a",
            }}
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
          <div className="mt-6 p-4 bg-red-900/30 border border-red-500/30 rounded-xl text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Response */}
        {response && (
          <div className="mt-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-family text-xs font-semibold uppercase tracking-widest">
                {respondentName} responds
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-7">
              <div className="prose text-white/85 leading-relaxed">
                <ReactMarkdown>{response}</ReactMarkdown>
              </div>
            </div>
            <p className="mt-4 text-center text-xs text-white/25 italic">
              AI-generated in a fictional persona. Not the actual views of {respondentName} or 36 Family.
            </p>
          </div>
        )}
      </div>

      <footer className="border-t border-white/10 py-6 text-center text-xs text-white/20">
        <Image src="/36family-logo.png" alt="36 Family" width={80} height={24} className="h-5 w-auto mx-auto mb-2 opacity-30" />
        AI-generated responses · Not legal advice · Please do not sue us
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
      className={`group relative flex flex-col items-center rounded-2xl p-3 sm:p-4 border-2 transition-all duration-200 cursor-pointer w-28 sm:w-36 ${
        selected
          ? "border-family bg-family/15 shadow-lg shadow-family/20"
          : "border-white/10 bg-white/5 hover:border-family/50 hover:bg-white/10"
      }`}
    >
      <div
        className={`relative w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden mb-3 ring-2 transition-all duration-200 ${
          selected ? "ring-family" : "ring-white/10 group-hover:ring-family/50"
        }`}
      >
        <Image
          src={silk.photo}
          alt={silk.name}
          fill
          className="object-cover object-top"
          sizes="112px"
        />
      </div>
      <span className="text-xs font-semibold text-white/80 text-center leading-tight">
        {silk.name}
      </span>
      {selected && (
        <span className="absolute top-2 right-2 w-5 h-5 bg-family rounded-full flex items-center justify-center">
          <svg className="w-3 h-3 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
      )}
    </button>
  );
}
