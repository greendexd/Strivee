import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { DuelService, CURRENT_USER_ID } from '../services/api';
import type { Duel } from '../services/api';

export default function Battle() {
  const { user } = useUser();
  const [duels, setDuels] = useState<Duel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDuels = async () => {
      try {
        const data = await DuelService.getUserDuels(CURRENT_USER_ID);
        setDuels(data);
      } catch (error) {
        console.error('Failed to fetch duels:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDuels();
  }, []);

  const activeDuel = duels.find(d => d.status === 'active');

  return (
    <main className="px-6 py-8 max-w-5xl mx-auto space-y-10 pb-32">
      {/* Global Challenge Banner */}
      <section className="relative overflow-hidden rounded-lg min-h-[220px] flex items-end p-8 group">
        <div className="absolute inset-0 z-0">
          <img
            className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
            data-alt="Epic landscape of people marching towards a sunrise"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9jgnGWtlmo70bgL_vTKyxaioQvKtGHb76JCe9jtsidG0D1c16xM2LU5U6-_7xoyT1uRwDN0Mku4Y4ZSlTKpawmU2r69y26DIBnrtRkJjTppihXpbJzeW6p3mvJSDbLzwYQd7xZcYYIvxYNyajuQ9aH5wYLVrFsFjALhQ6e7G3mPTfPCFfJSi1jDyTZ_c7vbE7h-ORTpxV_sPmW8_IzFKDa0Lz6rAXJdueJvYpsYLu4E5DGsxp9mym03knYKxSgfC7rrOdO1Td_aU"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
        </div>
        <div className="relative z-10 w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="inline-block px-3 py-1 bg-secondary/20 text-secondary text-xs font-black rounded-full mb-3 tracking-widest uppercase">Global Event</span>
              <h2 className="font-headline text-3xl md:text-4xl font-extrabold text-on-surface mb-2 tracking-tight">The 10k Step March</h2>
              <p className="text-on-surface-variant max-w-md">Join the legion. Every step contributes to our collective journey of 1M steps this week.</p>
            </div>
            <div className="bg-surface-container-highest/80 backdrop-blur-md p-4 rounded-xl border border-outline-variant/15 min-w-[200px]">
              <div className="flex justify-between text-xs font-bold mb-2">
                <span className="text-on-surface-variant">COMMUNITY GOAL</span>
                <span className="text-secondary">742,000 / 1M</span>
              </div>
              <div className="h-3 w-full bg-surface-container-lowest rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-secondary-container to-secondary w-[74.2%] relative">
                  <div className="absolute inset-0 shimmer-gold opacity-30"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Battle Map Layout / Active Duel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Duel Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-headline text-xl font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">swords</span>
              Active Duels
            </h3>
            <span className="text-primary text-sm font-bold">{duels.filter(d => d.status === 'active').length} Active</span>
          </div>

          {loading ? (
             <div className="glass-card rounded-lg p-8 text-center animate-pulse">Loading duels...</div>
          ) : activeDuel ? (
            <div className="glass-card rounded-lg p-8 border border-outline-variant/15 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4">
                <span className="bg-error/20 text-error text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">timer</span> 2 HOURS LEFT
                </span>
              </div>
              <div className="flex flex-col md:flex-row items-center justify-around gap-8 py-4">
                {/* User */}
                <div className="text-center space-y-3">
                  <div className="w-24 h-24 rounded-full border-4 border-primary p-1 bg-surface-container-lowest relative mx-auto">
                    <img
                      className="w-full h-full rounded-full object-cover"
                      data-alt="Heroic player avatar"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuClrZYiXnCPoIzGTn6N9aWaOb7gq5mTUjsK7s3eRqlHoDsInq8t80XURc5PNEdcuw6epxpd7BWB0oDPsHsZxNHO33Ot4_PweBQ_vWyX-xqoD1oCtkdhvUerwqYdzKGBHimEV-E0xGmCVvtwUH9vnOqRGKjLwfD_1nLaj8eEIkdV7fbRl6wqaBs7EtW0oukGYtM705486oBiGaw_PYgczQUCcB2raMdp1MiBpfbIB6cR82glp95VN6l5hp-W07CjjtbDan-GeTauojc"
                    />
                    <div className="absolute -top-2 -right-2 bg-primary text-on-primary-fixed text-xs font-black p-1.5 rounded-full shadow-lg">YOU</div>
                  </div>
                  <div>
                    <p className="font-bold text-lg">{user?.username || 'Guardian'}</p>
                    <p className="text-primary font-black text-2xl">{user?.xp || 0}</p>
                  </div>
                </div>

                {/* VS Divider */}
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-surface-container-highest rounded-full flex items-center justify-center border-2 border-outline-variant/30 font-black italic text-on-surface-variant">VS</div>
                  <div className="h-16 w-0.5 bg-gradient-to-b from-transparent via-outline-variant/30 to-transparent my-2"></div>
                  <div className="text-[10px] font-bold tracking-[0.2em] text-on-surface-variant uppercase">{activeDuel.type.replace('_', ' ')}</div>
                </div>

                {/* Opponent */}
                <div className="text-center space-y-3">
                  <div className="w-24 h-24 rounded-full border-4 border-on-surface-variant/30 p-1 bg-surface-container-lowest relative mx-auto">
                    <img
                      className="w-full h-full rounded-full object-cover"
                      data-alt="Rival player avatar Alex"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCm4sIwoZDtiTURK7nlKAHCVGVR1k_rFaR29_enQhDijW-UcH4Egm3TGrBnktMS878c7mZNt74tNqKzICLVbqXU56vcVHot4lw-7g0EWWf95YxYFfbvLHSQHCVThjzUnVDrj_HRQ-IfP47nsAHidgkyf_saAf7X0KPdXbb1XlfLRtqD-wFqH8Q-SIfsB2PWcmQ86RiuCnVZ_z_lMwtTz_cpmslw08qr8C46y1xR-qHkjjqU6bIYVHcGXRpIAGiTb1WITXNcAdOQNB4"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-lg text-on-surface-variant">
                      {activeDuel.challengerId === user?.id ? activeDuel.opponent.username : activeDuel.challenger.username}
                    </p>
                    <p className="text-on-surface-variant font-black text-2xl">
                      {activeDuel.challengerId === user?.id ? activeDuel.opponent.xp : activeDuel.challenger.xp}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-outline-variant/10 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-tertiary/20 to-tertiary/5 border border-tertiary/20 flex items-center justify-center shadow-lg">
                    <span className="material-symbols-outlined text-tertiary text-3xl" data-weight="fill">inventory_2</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">PRIZE POOL</p>
                    <p className="font-bold text-tertiary">Rare Loot Box</p>
                  </div>
                </div>
                <button className="bg-gradient-to-br from-primary to-primary-dim text-on-primary-fixed font-black px-8 py-3 rounded-xl active:scale-95 transition-transform flex items-center gap-2 group shadow-lg">
                  SYNC PROGRESS
                  <span className="material-symbols-outlined group-hover:rotate-180 transition-transform duration-500">sync</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-lg p-8 text-center text-on-surface-variant">
              No active duels found. Go find a challenger!
            </div>
          )}

          {/* Find Duel Button */}
          <div className="pt-4">
            <button className="w-full py-6 rounded-xl border-2 border-dashed border-outline-variant/30 hover:border-primary/50 hover:bg-primary/5 transition-all group flex flex-col items-center justify-center gap-2">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant group-hover:text-primary transition-colors">person_search</span>
              <span className="font-headline font-extrabold text-on-surface-variant group-hover:text-on-surface tracking-wide">Find a Duel</span>
              <span className="text-xs text-on-surface-variant/60">Match with random players around your level</span>
            </button>
          </div>
        </div>

        {/* Leaderboard Preview */}
        <aside className="space-y-6">
          <h3 className="font-headline text-xl font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary">leaderboard</span>
            Top Champions
          </h3>
          <div className="bg-surface-container-low rounded-lg p-6 space-y-6 border border-outline-variant/10">
            {/* Rank 1 */}
            <div className="flex items-center gap-4 relative">
              <div className="relative">
                <div className="w-14 h-14 rounded-full border-2 border-tertiary p-1 glow-primary">
                  <img
                    className="w-full h-full rounded-full bg-surface-container-highest"
                    data-alt="Leaderboard Rank 1 player"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD15NKf6mA4SBW2HJysa_obhfvbdr4OQc08cEsQb9mYAcHn4QA7mavUBBd9rJQ2rn3VPuObngfU65Zh7a-qacmRmnNHeMWyVjxpTnwGXT5TUSTJXa2gghjD49wHyjP244WZWhRYsgmeOM2iU0UKj3w0c-mGoANdu9H5zxhG-XowTijI8-1d_mlPisvTYcG_gJTA6vXkOLbOmsbmwyQ5rf0SGjlv-ORO9oKlHV0_0ZmFMpYSdjbbyTEmi44683npHEpFrF1xVK0cPpA"
                  />
                </div>
                <div className="absolute -top-2 -left-2 bg-tertiary text-on-tertiary-fixed text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-background">1</div>
              </div>
              <div className="flex-1">
                <p className="font-bold text-on-surface">Kaelen_Star</p>
                <p className="text-xs text-tertiary font-bold tracking-tight">124,500 pts</p>
              </div>
              <span className="material-symbols-outlined text-tertiary text-xl" data-weight="fill">workspace_premium</span>
            </div>

            {/* Rank 2 */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-full border-2 border-on-surface-variant/30 p-1">
                  <img
                    className="w-full h-full rounded-full bg-surface-container-highest"
                    data-alt="Leaderboard Rank 2 player"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbrr9dUUi0iWPwfkcTk3GUbdM5tZ8I0f0ADGj5n8Ozeryhfk18Ey-j8etcHSPIdnPAyykLq6kf0wxE-6wNM46h_n8f468Pb22eUbBcR6XtyB518U2PsAiu9iEIRTq8K34jaYK46J6TZa7y5v_gTWyjwPhnSOufnDxfjBHOd5U94AW159tFzo3f7-ne41VA9uitHNesD-fN4nXh8YTARWlh6acpyfY6s2iCBRS45lu_HRyFr-qSIe9S_VpyRz1oVM9LIFP-xhB71Tw"
                  />
                </div>
                <div className="absolute -top-2 -left-2 bg-on-surface-variant text-on-background text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-background">2</div>
              </div>
              <div className="flex-1">
                <p className="font-bold text-on-surface">MistyRain</p>
                <p className="text-xs text-on-surface-variant font-bold tracking-tight">118,200 pts</p>
              </div>
            </div>

            {/* Rank 3 */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-full border-2 border-on-surface-variant/20 p-1">
                  <img
                    className="w-full h-full rounded-full bg-surface-container-highest"
                    data-alt="Leaderboard Rank 3 player"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbShravyEvQ80f4R5Z1lpfWJPSTaKMag1foKLto6lVeCrwbqBkeiM0VJXU3m50Z6H8t6jY0UR9Ex_i4uy651sVmmI1plKfCU9jtz-zTI4hNRli8X2Y-hKo4i8LiiAWOR0hE4D6V-H6sL1820XTwQsqlmj4Ae9lj8ZI-wIeWS3yEI1yzxZRsipty3IEqcOiVGonLcCS40YUnsfRvWHjf18qTUbpjip4xV3sZX0OF1-YTGwAF6esIyV91SrzspuFUQ1Qql6yQoMhp7I"
                  />
                </div>
                <div className="absolute -top-2 -left-2 bg-[#cd7f32] text-on-background text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-background">3</div>
              </div>
              <div className="flex-1">
                <p className="font-bold text-on-surface">Vesper_Ly</p>
                <p className="text-xs text-on-surface-variant font-bold tracking-tight">112,050 pts</p>
              </div>
            </div>
            <button className="w-full py-3 rounded-lg bg-surface-container-highest text-on-surface-variant font-bold text-sm hover:text-primary transition-colors mt-4">VIEW FULL BOARD</button>
          </div>

          {/* Reward Highlight */}
          <div className="bg-gradient-to-br from-[#161b2e] to-[#0a0e1a] rounded-lg p-6 border border-tertiary/20 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <span className="material-symbols-outlined text-9xl text-tertiary" data-weight="fill">military_tech</span>
            </div>
            <p className="text-tertiary text-xs font-black tracking-widest uppercase mb-1">Weekly Prize</p>
            <h4 className="font-headline font-bold text-xl text-on-surface mb-2">Golden Wing Wingsuit</h4>
            <p className="text-sm text-on-surface-variant mb-4">Top 10 duelists this week unlock this limited cosmetic item.</p>
            <div className="w-full h-1 bg-surface-container-lowest rounded-full">
              <div className="h-full bg-tertiary w-1/3 shadow-[0_0_12px_#ffe792]"></div>
            </div>
            <p className="text-[10px] mt-2 font-bold text-tertiary/60">YOUR CURRENT RANK: #4,201</p>
          </div>
        </aside>
      </div>

      {/* Fab for quick duel */}
      <button className="fixed bottom-24 right-6 w-14 h-14 bg-secondary text-on-secondary rounded-full flex items-center justify-center shadow-[0_0_32px_rgba(47,248,1,0.3)] active:scale-90 transition-transform z-40 md:hidden">
        <span className="material-symbols-outlined font-black">add</span>
      </button>
    </main>
  );
}