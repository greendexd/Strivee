import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { DuelService } from '../services/api';
import type { Duel } from '../services/api';

export default function Battle() {
  const { user, showToast, refreshUser } = useUser();
  const location = useLocation();
  const autoFindDuel = location.state?.autoFindDuel || false;

  const [activeDuel, setActiveDuel] = useState<Duel | null>(null);
  const [loading, setLoading] = useState(true);
  const [findingMatch, setFindingMatch] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [battleResult, setBattleResult] = useState<{winner: boolean, xp: number, gold: number} | null>(null);

  const fetchDuels = async () => {
    if (!user) return;
    try {
      const duels = await DuelService.getUserDuels(user.id);
      // For MVP, just grab the first active duel
      if (duels.length > 0) {
        setActiveDuel(duels[0]);
      } else {
        setActiveDuel(null);
      }
    } catch (error) {
      console.error('Failed to fetch duels', error);
      showToast('Failed to load duels', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDuels();
    if (autoFindDuel) {
       handleFindDuel();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, autoFindDuel]);

  const handleFindDuel = async () => {
    if (!user) return;
    setFindingMatch(true);
    // Simulate matchmaking delay
    setTimeout(async () => {
       try {
         const newDuel = await DuelService.findDuel(user.id);
         setActiveDuel(newDuel);
         showToast('Opponent found!', 'success');
       } catch (e: any) {
         showToast('Failed to find opponent', 'error');
       } finally {
         setFindingMatch(false);
       }
    }, 2000);
  };

  const handleAction = async (type: 'attack' | 'defend') => {
    if (!user || !activeDuel) return;
    setActionLoading(true);
    try {
       const res = await DuelService.performAction(activeDuel.id, user.id, type);

       if (res.damage > 0) {
          showToast(`Dealt ${res.damage} damage!`, 'success');
       } else if (res.damage < 0) {
          showToast(`Healed for ${Math.abs(res.damage)} HP!`, 'info');
       } else {
          showToast('Attack missed!', 'error');
       }

       if (res.duel.status === 'finished') {
          // Finalize the battle and give rewards
          if (res.duel.winnerId === user.id) {
             await DuelService.syncRewards(res.duel.id);
             setBattleResult({ winner: true, xp: 50, gold: 100 });
          } else {
             setBattleResult({ winner: false, xp: 0, gold: 0 });
          }
          await refreshUser(); // Update global stats
       }

       setActiveDuel(res.duel);
    } catch (e: any) {
       showToast(((e as any).response)?.data?.error || 'Action failed', 'error');
    } finally {
       setActionLoading(false);
    }
  };

  if (loading) {
     return <div className="h-[calc(100vh-144px)] flex items-center justify-center text-on-surface-variant animate-pulse">Loading Arena...</div>;
  }

  const isMyTurn = activeDuel?.currentTurnId === user?.id;
  const isChallenger = activeDuel?.challengerId === user?.id;
  const myHp = isChallenger ? activeDuel?.challengerHp : activeDuel?.opponentHp;
  const oppHp = isChallenger ? activeDuel?.opponentHp : activeDuel?.challengerHp;
  const opponentUser = isChallenger ? activeDuel?.opponent : activeDuel?.challenger;

  return (
    <main className="px-6 py-6 pb-32 max-w-2xl mx-auto space-y-10 relative">

      {/* Finding Match Overlay */}
      {findingMatch && (
         <div className="fixed inset-0 bg-background/90 z-50 flex flex-col items-center justify-center backdrop-blur-sm">
            <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
               <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
               <span className="material-symbols-outlined text-5xl text-primary animate-pulse">radar</span>
            </div>
            <h2 className="text-2xl font-black font-headline tracking-widest text-on-surface animate-pulse">SEARCHING</h2>
            <p className="text-on-surface-variant mt-2 font-bold tracking-widest uppercase text-xs">Finding a worthy opponent...</p>
         </div>
      )}

      {/* Battle Result Overlay */}
      {battleResult && (
         <div className="fixed inset-0 bg-background/95 z-50 flex flex-col items-center justify-center backdrop-blur-md px-6">
            <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 shadow-[0_0_60px_rgba(0,0,0,0.5)] ${battleResult.winner ? 'bg-secondary/20 text-secondary' : 'bg-error/20 text-error'}`}>
               <span className="material-symbols-outlined text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                 {battleResult.winner ? 'emoji_events' : 'sentiment_dissatisfied'}
               </span>
            </div>
            <h2 className={`text-4xl font-black font-headline tracking-tighter ${battleResult.winner ? 'text-secondary' : 'text-error'}`}>
               {battleResult.winner ? 'VICTORY!' : 'DEFEAT'}
            </h2>
            {battleResult.winner && (
               <div className="flex gap-4 mt-6">
                  <div className="bg-surface-container-highest px-6 py-3 rounded-xl border border-secondary/20 flex flex-col items-center">
                     <span className="text-[10px] text-on-surface-variant font-bold uppercase">Gold Earned</span>
                     <span className="text-xl font-black text-yellow-500">+{battleResult.gold}</span>
                  </div>
                  <div className="bg-surface-container-highest px-6 py-3 rounded-xl border border-primary/20 flex flex-col items-center">
                     <span className="text-[10px] text-on-surface-variant font-bold uppercase">XP Earned</span>
                     <span className="text-xl font-black text-primary">+{battleResult.xp}</span>
                  </div>
               </div>
            )}
            <button
               onClick={() => {
                 setBattleResult(null);
                 setActiveDuel(null); // Clear active duel to show "Find Match" again
                 fetchDuels();
               }}
               className="mt-12 w-full max-w-xs bg-surface-container-highest py-4 rounded-xl font-black tracking-widest active:scale-95 transition-transform">
               RETURN TO ARENA
            </button>
         </div>
      )}

      <header>
        <h1 className="font-headline font-black text-4xl tracking-tighter text-on-surface mb-2">Arena</h1>
        <p className="text-on-surface-variant text-sm font-medium">Challenge others and claim glory.</p>
      </header>

      {/* Active Battle Section */}
      <div className="space-y-6">
        {activeDuel && activeDuel.status === 'active' ? (
          <div className="bg-surface-container-low rounded-xl p-6 border-2 border-primary/20 relative overflow-hidden shadow-[0_0_40px_rgba(202,152,255,0.05)]">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-tertiary"></div>

            <div className="flex justify-between items-center mb-8">
               <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase flex items-center gap-1">
                 <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                 BATTLE ACTIVE
               </span>
               <span className="text-xs text-on-surface-variant font-bold tracking-widest uppercase">{activeDuel.type.replace('_', ' ')}</span>
            </div>

            <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center mb-8">
              {/* You */}
              <div className="text-center space-y-2">
                <div className={`w-20 h-20 rounded-full border-4 mx-auto p-1 bg-surface-container-lowest transition-all ${isMyTurn ? 'border-primary shadow-[0_0_15px_rgba(202,152,255,0.5)] scale-110' : 'border-outline-variant/30'}`}>
                  <img className="w-full h-full rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC03Wv9WX346vmxfxyzySbjgdX8fz07B8zva6rFgoJ5YNgaDTZ4PFGEY3p8ze4ssPXCcBuYghSi2qV06vcyVzTf9tv5qX36-5wCii-rmVmUzAYWiXtw_LuIBBr4gtRWm6MEElOFzK8Akizl3Nv7A7_sqDBKboyRkj_7J28hsWwTRHmvVRxeq427SYzq6O6pBS95DJSucHbFhJaigHG09N5oHOk5cagDzpQmpym-srVg3Kqlx208SLmAXCITIn1GIh-GgXti9iQseks" alt="You" />
                </div>
                <p className="font-bold text-sm">You</p>
                <div className="w-full bg-surface-container-lowest rounded-full h-2 overflow-hidden border border-outline-variant/10">
                   <div className="bg-secondary h-full transition-all duration-500" style={{ width: `${myHp}%` }}></div>
                </div>
                <p className="text-xs font-black">{myHp} HP</p>
              </div>

              {/* VS */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center border-2 border-outline-variant/30 font-black italic text-on-surface-variant">VS</div>
              </div>

              {/* Opponent */}
              <div className="text-center space-y-2">
                <div className={`w-20 h-20 rounded-full border-4 mx-auto p-1 bg-surface-container-lowest transition-all ${!isMyTurn ? 'border-error shadow-[0_0_15px_rgba(255,84,73,0.3)] scale-110' : 'border-outline-variant/30'}`}>
                  <img className="w-full h-full rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCm4sIwoZDtiTURK7nlKAHCVGVR1k_rFaR29_enQhDijW-UcH4Egm3TGrBnktMS878c7mZNt74tNqKzICLVbqXU56vcVHot4lw-7g0EWWf95YxYFfbvLHSQHCVThjzUnVDrj_HRQ-IfP47nsAHidgkyf_saAf7X0KPdXbb1XlfLRtqD-wFqH8Q-SIfsB2PWcmQ86RiuCnVZ_z_lMwtTz_cpmslw08qr8C46y1xR-qHkjjqU6bIYVHcGXRpIAGiTb1WITXNcAdOQNB4" alt="Opponent" />
                </div>
                <p className="font-bold text-sm text-error">{opponentUser?.username}</p>
                <div className="w-full bg-surface-container-lowest rounded-full h-2 overflow-hidden border border-outline-variant/10">
                   <div className="bg-error h-full transition-all duration-500" style={{ width: `${oppHp}%` }}></div>
                </div>
                <p className="text-xs font-black text-error">{oppHp} HP</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-outline-variant/10">
               {isMyTurn ? (
                 <div className="grid grid-cols-2 gap-4">
                    <button
                       onClick={() => handleAction('attack')}
                       disabled={actionLoading}
                       className="bg-primary hover:bg-primary-dim text-on-primary font-black py-4 rounded-xl flex flex-col items-center justify-center gap-1 active:scale-95 transition-all shadow-[0_4px_20px_rgba(202,152,255,0.3)] disabled:opacity-50">
                       <span className="material-symbols-outlined text-2xl">swords</span>
                       ATTACK
                    </button>
                    <button
                       onClick={() => handleAction('defend')}
                       disabled={actionLoading}
                       className="bg-surface-container-highest hover:bg-surface-container-highest/80 border border-secondary/30 text-secondary font-black py-4 rounded-xl flex flex-col items-center justify-center gap-1 active:scale-95 transition-all disabled:opacity-50">
                       <span className="material-symbols-outlined text-2xl">shield</span>
                       DEFEND
                    </button>
                 </div>
               ) : (
                 <div className="w-full py-4 bg-surface-container-lowest rounded-xl flex items-center justify-center gap-2 border border-outline-variant/10 opacity-70">
                    <div className="w-4 h-4 rounded-full border-2 border-error border-t-transparent animate-spin"></div>
                    <span className="font-bold text-sm tracking-widest uppercase text-error">Waiting for {opponentUser?.username}'s move...</span>
                 </div>
               )}
            </div>
          </div>
        ) : (
          <div className="glass-card rounded-xl p-8 text-center border-2 border-dashed border-outline-variant/30 group hover:border-primary/30 transition-colors">
            <div className="w-20 h-20 rounded-full bg-surface-container-highest flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/10 transition-colors">
               <span className="material-symbols-outlined text-4xl text-on-surface-variant group-hover:text-primary transition-colors">person_search</span>
            </div>
            <h3 className="font-headline font-black text-xl mb-2">No Active Duels</h3>
            <p className="text-sm text-on-surface-variant mb-8">Enter the matchmaking queue to challenge players around the world.</p>
            <button
               onClick={handleFindDuel}
               className="w-full bg-gradient-to-br from-primary to-primary-dim text-background font-black py-4 rounded-xl shadow-[0_4px_20px_rgba(202,152,255,0.4)] active:scale-95 transition-transform flex justify-center items-center gap-2">
               FIND OPPONENT
               <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        )}
      </div>

      {/* Fab for quick duel */}
      {!activeDuel && (
        <button
          onClick={handleFindDuel}
          className="fixed bottom-24 right-6 w-14 h-14 bg-secondary text-on-secondary rounded-full flex items-center justify-center shadow-[0_0_32px_rgba(47,248,1,0.3)] active:scale-90 transition-transform z-40 md:hidden">
          <span className="material-symbols-outlined font-black">add</span>
        </button>
      )}
    </main>
  );
}
