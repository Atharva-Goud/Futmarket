/**
 * AnimatedBackground Component
 * ==============================
 * Decorative floating gradient orbs and grid overlay.
 */
export default function AnimatedBackground() {
  return (
    <>
      {/* Grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(148,163,184,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Floating glow orbs */}
      <div className="fixed top-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full bg-accent-green opacity-12 blur-[120px] pointer-events-none z-0 animate-[float-anim_20s_ease-in-out_infinite]" />
      <div className="fixed bottom-[-150px] left-[-150px] w-[500px] h-[500px] rounded-full bg-accent-cyan opacity-12 blur-[120px] pointer-events-none z-0 animate-[float-anim_20s_ease-in-out_infinite_-7s]" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-accent-purple opacity-8 blur-[120px] pointer-events-none z-0 animate-[float-anim_20s_ease-in-out_infinite_-14s]" />
    </>
  );
}
