export default function Header() {
  return (
    <header className="flex justify-between items-center px-6 py-4 w-full z-50 bg-[#0a0e1a]/80 backdrop-blur-xl font-['Plus_Jakarta_Sans'] font-bold tracking-tight docked full-width top-0 sticky no-line tonal-layering via bg-[#161b2e] shadow-[0_0_48px_rgba(202,152,255,0.15)]">
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-primary to-secondary">
          <img
            alt="User avatar"
            className="w-full h-full rounded-full bg-surface-container"
            data-alt="User avatar with glowing level ring"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGgwbpTRbvBLkvEDxcVFo2PBqandMHOkuDAKrxVANsDE5bICkPXAKvs0ruNzdtHpZtDw07Y2EyFku1uI7_EYbr5oZoImYz4Ykxf1jvk7zGCL9ZE-YloAu72URb_bKnbz_3FP8cC9ofc4ZSZSMK85KQpWE0aT20KO6Lg7WzBUK-IAK1BFq1hN8ufDHWM0AZ5FsR_oxxvV07-lEvbYhiyaqpSF4nm5jyH71wIfxRdzVl2GVUdA39aWb88HzZW0ViiBGIhXGuP8RhRho"
          />
          <div className="absolute -bottom-1 -right-1 bg-primary text-on-primary-fixed text-[10px] px-1.5 rounded-full border-2 border-background">7</div>
        </div>
        <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#ca98ff] to-[#9c42f4] font-black text-xl">The Quest</span>
      </div>
      <div className="flex items-center gap-4 bg-surface-container-high/50 px-4 py-2 rounded-full border border-outline-variant/15">
        <div className="flex items-center gap-1.5">
          <span className="text-error">🔥</span>
          <span className="text-sm">14 days</span>
        </div>
        <div className="w-[1px] h-4 bg-outline-variant/30"></div>
        <div className="flex items-center gap-1.5 text-tertiary">
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>diamond</span>
          <span className="text-sm">500</span>
        </div>
      </div>
    </header>
  );
}