import { useUser } from '../context/UserContext';

export default function Stats() {
  const { user } = useUser();
  const stepHabit = user?.habits.find(h => h.type === 'step');

  return (
    <main className="px-6 pt-8 space-y-10 max-w-4xl mx-auto pb-32">
      {/* Week at a Glance */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-headline text-2xl font-extrabold tracking-tight">Week at a Glance</h2>
          <span className="text-on-surface-variant text-sm font-label uppercase tracking-widest">Level {user?.level || 1} Ranger</span>
        </div>
        <div className="flex justify-between items-center overflow-x-auto pb-4 gap-4 no-scrollbar">
          {/* Day Node */}
          <div className="flex flex-col items-center gap-3 min-w-[64px]">
            <span className="text-xs font-label text-on-surface-variant">MON</span>
            <div className="w-14 h-14 rounded-full border-4 border-secondary flex items-center justify-center bg-surface-container-high shadow-[0_0_12px_rgba(47,248,1,0.3)]">
              <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
          </div>
          {/* Day Node */}
          <div className="flex flex-col items-center gap-3 min-w-[64px]">
            <span className="text-xs font-label text-on-surface-variant">TUE</span>
            <div className="w-14 h-14 rounded-full border-4 border-secondary flex items-center justify-center bg-surface-container-high shadow-[0_0_12px_rgba(47,248,1,0.3)]">
              <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
          </div>
          {/* Day Node (Today) */}
          <div className="flex flex-col items-center gap-3 min-w-[64px]">
            <span className="text-xs font-label text-primary font-bold">WED</span>
            <div className="w-16 h-16 rounded-full border-4 border-primary p-1 bg-surface-container-highest flex items-center justify-center ring-4 ring-primary/10">
              <div className="w-full h-full rounded-full bg-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-background font-bold">bolt</span>
              </div>
            </div>
          </div>
          {/* Day Node */}
          <div className="flex flex-col items-center gap-3 min-w-[64px]">
            <span className="text-xs font-label text-on-surface-variant">THU</span>
            <div className="w-14 h-14 rounded-full border-4 border-outline-variant flex items-center justify-center bg-surface-container-low opacity-50">
              <span className="text-on-surface-variant text-xs font-bold">0%</span>
            </div>
          </div>
          {/* Day Node */}
          <div className="flex flex-col items-center gap-3 min-w-[64px]">
            <span className="text-xs font-label text-on-surface-variant">FRI</span>
            <div className="w-14 h-14 rounded-full border-4 border-outline-variant flex items-center justify-center bg-surface-container-low opacity-50">
              <span className="text-on-surface-variant text-xs font-bold">0%</span>
            </div>
          </div>
          {/* Day Node */}
          <div className="flex flex-col items-center gap-3 min-w-[64px]">
            <span className="text-xs font-label text-on-surface-variant">SAT</span>
            <div className="w-14 h-14 rounded-full border-4 border-outline-variant flex items-center justify-center bg-surface-container-low opacity-50">
              <span className="text-on-surface-variant text-xs font-bold">0%</span>
            </div>
          </div>
          {/* Day Node */}
          <div className="flex flex-col items-center gap-3 min-w-[64px]">
            <span className="text-xs font-label text-on-surface-variant">SUN</span>
            <div className="w-14 h-14 rounded-full border-4 border-outline-variant flex items-center justify-center bg-surface-container-low opacity-50">
              <span className="text-on-surface-variant text-xs font-bold">0%</span>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Chart */}
      <section className="glass-card rounded-lg p-6 border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <span className="material-symbols-outlined text-[120px]">directions_walk</span>
        </div>
        <div className="flex items-end justify-between mb-8">
          <div>
            <h3 className="text-on-surface-variant uppercase text-xs font-bold tracking-[0.2em] mb-1">Step Mastery</h3>
            <p className="text-3xl font-headline font-black text-on-surface">12,402 <span className="text-lg font-medium text-secondary">/ {stepHabit ? Math.floor(stepHabit.goal/1000) + 'k' : '10k'}</span></p>
          </div>
          <div className="flex gap-2">
            <button className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
            <button className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="flex items-end justify-between h-48 gap-3">
          <div className="flex-1 flex flex-col items-center gap-3 h-full justify-end group">
            <div className="w-full bg-surface-container-highest rounded-t-lg relative overflow-hidden h-[60%]">
              <div className="absolute bottom-0 w-full bg-primary-dim h-full"></div>
            </div>
            <span className="text-[10px] font-label font-bold text-on-surface-variant">M</span>
          </div>
          <div className="flex-1 flex flex-col items-center gap-3 h-full justify-end group">
            <div className="w-full bg-surface-container-highest rounded-t-lg relative overflow-hidden h-[85%]">
              <div className="absolute bottom-0 w-full bg-primary-dim h-full"></div>
            </div>
            <span className="text-[10px] font-label font-bold text-on-surface-variant">T</span>
          </div>
          <div className="flex-1 flex flex-col items-center gap-3 h-full justify-end group">
            <div className="w-full bg-surface-container-highest rounded-t-lg relative overflow-hidden h-[100%] shadow-[0_0_20px_rgba(47,248,1,0.4)]">
              <div className="absolute bottom-0 w-full bg-secondary h-full"></div>
            </div>
            <span className="text-[10px] font-label font-bold text-primary">W</span>
          </div>
          <div className="flex-1 flex flex-col items-center gap-3 h-full justify-end group">
            <div className="w-full bg-surface-container-highest rounded-t-lg relative overflow-hidden h-[40%] opacity-40">
              <div className="absolute bottom-0 w-full bg-outline-variant h-full"></div>
            </div>
            <span className="text-[10px] font-label font-bold text-on-surface-variant">T</span>
          </div>
          <div className="flex-1 flex flex-col items-center gap-3 h-full justify-end group">
            <div className="w-full bg-surface-container-highest rounded-t-lg relative overflow-hidden h-[0%]"></div>
            <span className="text-[10px] font-label font-bold text-on-surface-variant">F</span>
          </div>
          <div className="flex-1 flex flex-col items-center gap-3 h-full justify-end group">
            <div className="w-full bg-surface-container-highest rounded-t-lg relative overflow-hidden h-[0%]"></div>
            <span className="text-[10px] font-label font-bold text-on-surface-variant">S</span>
          </div>
          <div className="flex-1 flex flex-col items-center gap-3 h-full justify-end group">
            <div className="w-full bg-surface-container-highest rounded-t-lg relative overflow-hidden h-[0%]"></div>
            <span className="text-[10px] font-label font-bold text-on-surface-variant">S</span>
          </div>
        </div>
      </section>

      {/* Streak History & Bento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Streak History Scroll */}
        <section className="bg-surface-container-low rounded-lg p-6 border border-outline-variant/10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-headline font-bold text-lg">Streak History</h3>
            <div className="bg-tertiary/10 text-tertiary px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
              BEST: 42
            </div>
          </div>
          <div className="space-y-4 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
            <div className="flex items-center justify-between p-4 bg-surface-container-high rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                </div>
                <div>
                  <p className="text-sm font-bold">Current Streak</p>
                  <p className="text-xs text-on-surface-variant">Started Mar 12, 2024</p>
                </div>
              </div>
              <span className="text-2xl font-black font-headline">{stepHabit?.streak || user?.fire || 7}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-surface-container rounded-xl opacity-70">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-outline-variant/20 flex items-center justify-center text-on-surface-variant">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>history</span>
                </div>
                <div>
                  <p className="text-sm font-bold">Previous Best</p>
                  <p className="text-xs text-on-surface-variant">Feb 1 - Mar 10</p>
                </div>
              </div>
              <span className="text-xl font-black font-headline text-on-surface-variant">38</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-surface-container rounded-xl opacity-50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-outline-variant/20 flex items-center justify-center text-on-surface-variant">
                  <span className="material-symbols-outlined">event_busy</span>
                </div>
                <div>
                  <p className="text-sm font-bold">Winter Grind</p>
                  <p className="text-xs text-on-surface-variant">Jan 5 - Jan 22</p>
                </div>
              </div>
              <span className="text-xl font-black font-headline text-on-surface-variant">17</span>
            </div>
          </div>
        </section>

        {/* Integrations Section */}
        <section className="space-y-6">
          <div className="bg-surface-container-low rounded-lg p-6 border border-outline-variant/10 h-full">
            <h3 className="font-headline font-bold text-lg mb-6">Forge Connections</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-surface-container-highest rounded-xl border border-secondary/20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                    <img
                      alt="Apple Health"
                      className="w-8 h-8"
                      data-alt="Apple Health Icon"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQNvgz2mxw5UjoZWmkRkkt69h_NbMwxPdnQjjWdHF_71nx8iYHnQVOdcROeP6wIU7sYza5SiFR3ZkievGwQBBSVa3WO38pV9mbNEsl4BuPLOSV8a7xNszcgu-m0t7SHb2R7KwLTVt_O2UcnULd5I8FQCVCzoUafT1ZhiaE_Grc33JA8urhLnmNQm07hKt4O0oZc_ESBTDDZ6a_8Eibh3ZHfO0Rr0F3uBDkPE428p0ayXgzjOT3KxI81YznEuPlRh6VahOAg-9VICc"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Apple Health</p>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
                      <span className="text-[10px] text-secondary font-bold uppercase tracking-widest">Active Sync</span>
                    </div>
                  </div>
                </div>
                <button className="text-on-surface-variant hover:text-primary transition-colors">
                  <span className="material-symbols-outlined">settings</span>
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl border border-outline-variant/20 grayscale opacity-50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center">
                    <img
                      alt="Google Fit"
                      className="w-6 h-6"
                      data-alt="Google Fit Icon"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYysDTEkANkZyIgE3LQ3DaGY2YtqefVX7BR6zAbiq5G_HLQDl-kw3cEckBL1u3i91PkMb3xYeqJlA9UosdwCxPEUY1nUTw7LzcakG0Frx_1DDOnh7d4Wq34--JThhx0ix57bH9SHehO4E3qKeFLzYDaKFgDyVQryjvdpgtInIX56Fq3gd54KYZugXGXOD2fyXGXwBQoXD21PahlQXRSiM4v30_gP_u4TEZXKrZWSM62Ss9oJxESGrkj_J-lOg1esBSctsTPF3bPZQ"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Google Fit</p>
                    <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Not Linked</p>
                  </div>
                </div>
                <button className="bg-surface-container-highest text-on-surface px-4 py-1.5 rounded-full text-xs font-bold">Link</button>
              </div>
            </div>

            <div className="mt-8 p-4 bg-tertiary/5 rounded-xl border border-tertiary/10">
              <div className="flex gap-3">
                <span className="material-symbols-outlined text-tertiary">lightbulb</span>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  <span className="text-tertiary font-bold">Pro Tip:</span> Syncing Apple Health automatically grants +50 XP for daily movement milestones!
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}