/**
 * FunFact Component
 * ==================
 * Displays a random football fun fact with highlighted keywords.
 */
export default function FunFact({ fact, onRefresh }) {
  if (!fact) return null;

  // Highlight the specified keyword in the text
  const renderText = () => {
    if (!fact.highlight) return fact.text;

    const parts = fact.text.split(new RegExp(`(${fact.highlight})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === fact.highlight.toLowerCase() ? (
        <span key={i} className="text-accent-orange font-bold">{part}</span>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  return (
    <div className="text-center py-4 px-2">
      <p className="text-base text-text-secondary leading-relaxed">
        {renderText()}
      </p>
      {onRefresh && (
        <button
          onClick={onRefresh}
          className="mt-4 text-xs text-text-muted hover:text-accent-orange transition-colors cursor-pointer"
        >
          🎲 Another fact
        </button>
      )}
    </div>
  );
}
