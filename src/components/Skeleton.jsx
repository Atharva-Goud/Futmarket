/**
 * Skeleton Loading Component
 * Displays animated placeholder lines while data loads
 */
export default function Skeleton({ lines = 3, className = '' }) {
  return (
    <div className={`flex flex-col gap-3 py-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`skeleton h-3.5 ${i % 2 === 1 ? 'w-3/5' : 'w-full'}`}
        />
      ))}
    </div>
  );
}
