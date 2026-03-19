export default function Home() {
  return (
    <main className="relative px-6 pt-4 pb-32 max-w-2xl mx-auto flex flex-col gap-8">
      {/* Hero Section: Habitat */}
      <section className="relative aspect-square w-full flex flex-col items-center justify-center">
        <div className="absolute inset-0 habitat-glow rounded-full scale-125 pointer-events-none"></div>
        {/* Floating Platform */}
        <div className="absolute bottom-12 w-64 h-16 bg-gradient-to-t from-primary/20 to-transparent rounded-[100%] blur-xl opacity-50"></div>
        {/* Central Pet */}
        <div className="relative z-10 w-64 h-64 flex flex-col items-center justify-center">
          <img
            alt="Celestial Fox"
            className="w-full h-full object-contain drop-shadow-[0_0_32px_rgba(202,152,255,0.4)]"
            data-alt="A magical neon-glowing fox floating in space"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC03Wv9WX346vmxfxyzySbjgdX8fz07B8zva6rFgoJ5YNgaDTZ4PFGEY3p8ze4ssPXCcBuYghSi2qV06vcyVzTf9tv5qX36-5wCii-rmVmUzAYWiXtw_LuIBBr4gtRWm6MEElOFzK8Akizl3Nv7A7_sqDBKboyRkj_7J28hsWwTRHmvVRxeq427SYzq6O6pBS95DJSucHbFhJaigHG09N5oHOk5cagDzpQmpym-srVg3Kqlx208SLmAXCITIn1GIh-GgXti9iQseks"
          />
          {/* Happiness Meter */}
          <div className="absolute -bottom-4 glass-card px-4 py-2 rounded-full border border-primary/20 flex items-center gap-3 min-w-[180px]">
            <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
            <div className="flex-1 h-1.5 bg-surface-container-lowest rounded-full overflow-hidden">
              <div className="h-full bg-secondary-dim shadow-[0_0_8px_#2ff801] w-[85%]"></div>
            </div>
            <span className="text-[10px] font-bold text-on-surface-variant">HAPPY</span>
          </div>
        </div>

        {/* Floating Quick Actions */}
        <div className="absolute top-1/4 right-0 flex flex-col gap-4">
          <button className="group flex items-center gap-2 glass-card p-3 rounded-xl border border-tertiary/20 hover:scale-105 transition-all">
            <div className="w-10 h-10 rounded-lg signature-gradient flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>card_giftcard</span>
            </div>
            <div className="flex flex-col items-start pr-2">
              <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Reward</span>
              <span className="text-xs font-bold text-tertiary">Claim Daily</span>
            </div>
          </button>

          <button className="group flex items-center gap-2 glass-card p-3 rounded-xl border border-primary/20 hover:scale-105 transition-all">
            <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center border border-primary/30">
              <span className="material-symbols-outlined text-primary">swords</span>
            </div>
            <div className="flex flex-col items-start pr-2">
              <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Battle</span>
              <span className="text-xs font-bold">Quick Duel</span>
            </div>
          </button>
        </div>
      </section>

      {/* Bento Stats Section */}
      <section className="grid grid-cols-2 gap-4">
        {/* Steps Card */}
        <div className="glass-card p-5 rounded-lg border border-outline-variant/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="material-symbols-outlined text-6xl">footprint</span>
          </div>
          <div className="flex flex-col gap-4 relative z-10">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>directions_run</span>
              <span className="font-headline font-bold text-sm">Steps</span>
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-on-surface">4,500</span>
                <span className="text-xs text-on-surface-variant">/ 10k</span>
              </div>
              <div className="mt-3 w-full h-2 bg-surface-container-lowest rounded-full overflow-hidden">
                <div className="h-full bg-secondary-dim shadow-[0_0_12px_rgba(43,232,0,0.5)] w-[45%]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Sleep Card */}
        <div className="glass-card p-5 rounded-lg border border-outline-variant/10 relative overflow-hidden">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>bedtime</span>
              <span className="font-headline font-bold text-sm">Sleep</span>
            </div>
            <div className="py-1">
              <span className="block text-xl font-bold text-primary">Resting...</span>
              <span className="text-xs text-on-surface-variant mt-1">Goal: 8h 30m</span>
            </div>
            <div className="flex -space-x-2">
              <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-[10px] text-primary">ZZ</div>
              <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] text-primary/60">Z</div>
            </div>
          </div>
        </div>
      </section>

      {/* Active Quest CTA */}
      <section className="mt-4">
        <button className="w-full signature-gradient p-6 rounded-xl relative overflow-hidden group hover:opacity-90 transition-all active:scale-[0.98]">
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex justify-between items-center relative z-10">
            <div className="text-left">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-on-primary-fixed-variant">Current Mission 🎯</span>
              <h3 className="text-xl font-headline font-extrabold text-on-primary-fixed mt-1">Slayer of the Blue Screen</h3>
              <p className="text-sm text-on-primary-fixed-variant/80 font-medium mt-1">No phone 30 mins before bed (Good luck!)</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
              <span className="material-symbols-outlined text-on-primary-fixed text-2xl">arrow_forward_ios</span>
            </div>
          </div>
        </button>
      </section>
    </main>
  );
}