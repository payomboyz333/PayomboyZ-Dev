const PETALS = Array.from({ length: 16 }, (_, i) => {
  const seed = (i * 37) % 100;
  return {
    left: `${(i * 61) % 100}%`,
    size: 6 + (seed % 7),
    duration: 14 + (seed % 12),
    delay: -((i * 23) % 26),
    drift: `${((seed % 9) - 4) * 18}px`,
    color: i % 3 === 0 ? "#00FF66" : "#FF3C5A",
  };
});

export function SakuraBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#0F172A_0%,#080D14_45%,#05080A_100%)]" />
      <div className="hex-grid absolute inset-x-0 bottom-0 h-[55%] [mask-image:linear-gradient(to_top,black,transparent)]" />
      <div className="scanlines absolute inset-0" />
      {PETALS.map((p, i) => (
        <span
          key={i}
          className="sakura-petal"
          style={
            {
              left: p.left,
              width: p.size,
              height: p.size,
              background: p.color,
              boxShadow: `0 0 8px ${p.color}`,
              opacity: 0.6,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              "--drift": p.drift,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
