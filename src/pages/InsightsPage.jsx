/**
 * Insights Page
 * ==============
 * General football analysis patterns + fun facts.
 *
 * DATA ACCURACY RULES:
 *  - Insights are clearly labeled as "general analysis patterns"
 *  - No specific fabricated match stats or player numbers
 *  - Fun facts are historically verified football trivia
 *  - All content is educational, not predictive or match-specific
 */
import { useState } from 'react';
import { getRandomInsights, getRandomFact, AI_INSIGHTS } from '../utils/funFacts';
import InsightCard from '../components/InsightCard';
import FunFact from '../components/FunFact';

export default function InsightsPage() {
  const [insights, setInsights] = useState(AI_INSIGHTS);
  const [fact, setFact] = useState(getRandomFact());

  return (
    <div className="animate-[fade-in_0.4s_ease]">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold">🧠 Football Analysis</h1>
        <button
          onClick={() => setInsights([...AI_INSIGHTS].sort(() => 0.5 - Math.random()))}
          className="text-sm text-text-secondary hover:text-accent-purple transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <span className="animate-[spin-slow_3s_linear_infinite] inline-block">↻</span>
          Shuffle
        </button>
      </div>

      {/* Disclaimer */}
      <div className="mb-8 px-4 py-3 rounded-xl border border-accent-purple/20 bg-accent-purple/5">
        <p className="text-xs text-text-muted leading-relaxed">
          ℹ️ These are <strong className="text-text-secondary">general football analysis patterns</strong> based on
          widely known tactical trends. They are <strong className="text-text-secondary">not predictions</strong> and
          do not reference specific real-time match data. For live stats, visit the{' '}
          <a href="/standings" className="text-accent-cyan hover:underline">Standings</a> or{' '}
          <a href="/players" className="text-accent-cyan hover:underline">Players</a> page.
        </p>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {insights.map((insight, i) => (
          <InsightCard key={i} insight={insight} variant="full" />
        ))}
      </div>

      {/* Tactical Concepts Section */}
      <div className="mb-10">
        <h2 className="font-display text-xl font-bold mb-6 gradient-text-ai">📊 Tactical Concepts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ConceptTile
            title="High Press Systems"
            icon="🏃"
            text="Teams employing a high-intensity press within 5 seconds of losing possession (gegenpressing) aim to win back the ball in dangerous areas. This approach demands exceptional fitness levels and coordinated team pressing triggers."
          />
          <ConceptTile
            title="Counter-Attack Principles"
            icon="⚡"
            text="Effective counter-attacks rely on speed of transition, vertical passing, and players who can cover ground quickly. The best counter-attacking teams typically have pacey forwards who excel in 1v1 situations."
          />
          <ConceptTile
            title="Set-Piece Design"
            icon="🎯"
            text="Modern set pieces involve rehearsed routines, decoy runners, and off-the-ball movement patterns. Short corner routines have become increasingly popular as an alternative to traditional deliveries into the box."
          />
          <ConceptTile
            title="Passing Networks"
            icon="🔗"
            text="Progressive passing — passes that move the ball significantly closer to the opponent's goal — is one of the strongest indicators of a team's creative quality. Teams that dominate progressive passing metrics tend to correlate with higher league positions."
          />
        </div>
      </div>

      {/* Fun Fact Section */}
      <div className="glass-card rounded-2xl p-8 border-accent-orange/20">
        <h2 className="font-display text-xl font-bold mb-2 text-center gradient-text-fire">🎯 Football Trivia</h2>
        <p className="text-xs text-text-muted text-center mb-4">Verified historical football facts</p>
        <FunFact fact={fact} onRefresh={() => setFact(getRandomFact())} />
      </div>
    </div>
  );
}

/**
 * ConceptTile – educational tactical concept (no fabricated stats)
 */
function ConceptTile({ title, icon, text }) {
  return (
    <div className="glass-card rounded-2xl p-6 transition-all duration-400 hover:border-white/15 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">{icon}</span>
        <h3 className="font-display font-bold text-base">{title}</h3>
      </div>
      <p className="text-sm text-text-secondary leading-relaxed">{text}</p>
    </div>
  );
}
