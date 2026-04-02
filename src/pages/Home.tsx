import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { UserService } from '../services/api';

export default function Home() {
  const { user, loading, error, showToast, updateUserLocally } = useUser();
  const navigate = useNavigate();
  const [claiming, setClaiming] = useState(false);
  const [syncingHealth, setSyncingHealth] = useState(false);
  const [syncingFit, setSyncingFit] = useState(false);

  if (loading) {
    return <div className="p-8 text-center text-on-surface-variant animate-pulse">Loading habitat...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-error">Failed to load: {error}</div>;
  }

  const stepHabit = user?.habits.find(h => h.type === 'step');
  const sleepHabit = user?.habits.find(h => h.type === 'sleep');
  const currentMission = sleepHabit || user?.habits[0];

  const handleClaimReward = async () => {
    if (!user) return;
    setClaiming(true);
    try {
      const updatedUser = await UserService.claimDailyReward(user.id);
      updateUserLocally(updatedUser);
      showToast('Daily Reward Claimed! +50 Gold, +20 XP', 'success');
    } catch (err) {
      if (((err as any).response)?.status === 400) {
         showToast('Reward already claimed today.', 'error');
      } else {
         showToast('Failed to claim reward.', 'error');
      }
    } finally {
      setClaiming(false);
    }
  };

  const handleQuickDuel = () => {
    // Navigate to battle page and pass state to trigger quick duel flow automatically
    navigate('/battle', { state: { autoFindDuel: true } });
  };

  const toggleHealth = async (platform: 'apple_health' | 'google_fit') => {
    if (!user) return;

    // Simplification for MVP: We just use one global 'healthConnected' field.
    const isCurrentlyConnected = user.healthConnected;
    const isApple = platform === 'apple_health';

    // Don't let them connect both simultaneously for this demo
    if (isApple) setSyncingHealth(true);
    else setSyncingFit(true);

    try {
      if (!isCurrentlyConnected) {
         const updatedUser = await UserService.syncHealth(user.id, "apple_health", true);
         updateUserLocally(updatedUser);
         showToast(`${platform === 'apple_health' ? 'Apple Health' : 'Google Fit'} Connected!`, 'success');
      } else {
         const updatedUser = await UserService.syncHealth(user.id, platform, false);
         updateUserLocally(updatedUser);
         showToast('Health disconnected.', 'info');
      }
    } catch (err: any) {
       showToast('Failed to toggle connection', 'error');
    } finally {
       setSyncingHealth(false);
       setSyncingFit(false);
    }
  };

  return (
    <main className="relative px-6 pt-4 pb-32 max-w-2xl mx-auto flex flex-col gap-8">
      {/* Top Bar for Resources */}
      <div className="flex justify-between items-center w-full px-2 pt-2">
         <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-full border border-outline-variant/20">
            <span className="material-symbols-outlined text-yellow-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
            <span className="font-bold text-xs">{user?.gold || 0}</span>
         </div>
         <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-full border border-outline-variant/20">
            <span className="material-symbols-outlined text-[#ca98ff] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>diamond</span>
            <span className="font-bold text-xs">{user?.gems || 0}</span>
         </div>
      </div>

      {/* Hero Section: Habitat */}
      <section className="relative aspect-square w-full flex flex-col items-center justify-center -mt-6">
        <div className="absolute inset-0 habitat-glow rounded-full scale-125 pointer-events-none"></div>
        {/* Floating Platform */}
        <div className="absolute bottom-12 w-64 h-16 bg-gradient-to-t from-primary/20 to-transparent rounded-[100%] blur-xl opacity-50"></div>
        {/* Central Pet */}
        <div className="relative z-10 w-64 h-64 flex flex-col items-center justify-center">
          <img
            alt="Celestial Fox"
            className="w-full h-full object-cover rounded-full drop-shadow-[0_0_32px_rgba(202,152,255,0.4)]"
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
        <div className="absolute top-1/4 right-0 flex flex-col gap-4 z-20">
          <button
             onClick={handleClaimReward}
             disabled={claiming}
             className="group flex items-center gap-2 glass-card p-3 rounded-xl border border-tertiary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-lg ${claiming ? 'bg-surface-container-high animate-pulse' : 'signature-gradient'}`}>
              <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>card_giftcard</span>
            </div>
            <div className="flex flex-col items-start pr-2">
              <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Reward</span>
              <span className="text-xs font-bold text-tertiary">{claiming ? 'Claiming...' : 'Claim Daily'}</span>
            </div>
          </button>

          <button
             onClick={handleQuickDuel}
             className="group flex items-center gap-2 glass-card p-3 rounded-xl border border-primary/20 hover:scale-105 active:scale-95 transition-all">
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
                <span className="text-2xl font-black text-on-surface">{stepHabit ? stepHabit.streak * 500 : 0}</span>
                <span className="text-xs text-on-surface-variant">/ {stepHabit ? Math.floor(stepHabit.goal/1000) + 'k' : '10k'}</span>
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
              <span className="text-xs text-on-surface-variant mt-1">Goal: {sleepHabit ? '8h' : '8h 30m'}</span>
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
              <h3 className="text-xl font-headline font-extrabold text-on-primary-fixed mt-1">
                {currentMission ? currentMission.title : 'Slayer of the Blue Screen'}
              </h3>
              <p className="text-sm text-on-primary-fixed-variant/80 font-medium mt-1">
                {currentMission ? currentMission.description : 'No phone 30 mins before bed'}
              </p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
              <span className="material-symbols-outlined text-on-primary-fixed text-2xl">arrow_forward_ios</span>
            </div>
          </div>
        </button>
      </section>

      {/* Streak History & Bento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
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
          </div>
        </section>

        {/* Integrations Section */}
        <section className="space-y-6">
          <div className="bg-surface-container-low rounded-lg p-6 border border-outline-variant/10 h-full">
            <h3 className="font-headline font-bold text-lg mb-6">Forge Connections</h3>
            <div className="space-y-4">
              {/* Apple Health */}
              <div className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${user?.healthConnected ? 'bg-surface-container-highest border-secondary/20' : 'bg-surface-container-low border-outline-variant/20 grayscale opacity-70'}`}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-lg">
                    <img
                      alt="Apple Health"
                      className="w-8 h-8"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQNvgz2mxw5UjoZWmkRkkt69h_NbMwxPdnQjjWdHF_71nx8iYHnQVOdcROeP6wIU7sYza5SiFR3ZkievGwQBBSVa3WO38pV9mbNEsl4BuPLOSV8a7xNszcgu-m0t7SHb2R7KwLTVt_O2UcnULd5I8FQCVCzoUafT1ZhiaE_Grc33JA8urhLnmNQm07hKt4O0oZc_ESBTDDZ6a_8Eibh3ZHfO0Rr0F3uBDkPE428p0ayXgzjOT3KxI81YznEuPlRh6VahOAg-9VICc"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Apple Health</p>
                    <div className="flex items-center gap-1.5">
                      {user?.healthConnected ? (
                         <>
                           <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></div>
                           <span className="text-[10px] text-secondary font-bold uppercase tracking-widest">Active Sync</span>
                         </>
                      ) : (
                         <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Not Linked</span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => toggleHealth('apple_health')}
                  disabled={syncingHealth}
                  className={`${user?.healthConnected ? 'text-on-surface-variant hover:text-error' : 'bg-surface-container-highest text-on-surface px-4 py-1.5 rounded-full text-xs font-bold'} transition-colors active:scale-95`}>
                  {syncingHealth ? '...' : user?.healthConnected ? <span className="material-symbols-outlined">link_off</span> : 'Link'}
                </button>
              </div>

              {/* Google Fit */}
              <div className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${!user?.healthConnected ? 'bg-surface-container-low border-outline-variant/20 grayscale opacity-70' : 'hidden'}`}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center">
                    <img
                      alt="Google Fit"
                      className="w-6 h-6"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYysDTEkANkZyIgE3LQ3DaGY2YtqefVX7BR6zAbiq5G_HLQDl-kw3cEckBL1u3i91PkMb3xYeqJlA9UosdwCxPEUY1nUTw7LzcakG0Frx_1DDOnh7d4Wq34--JThhx0ix57bH9SHehO4E3qKeFLzYDaKFgDyVQryjvdpgtInIX56Fq3gd54KYZugXGXOD2fyXGXwBQoXD21PahlQXRSiM4v30_gP_u4TEZXKrZWSM62Ss9oJxESGrkj_J-lOg1esBSctsTPF3bPZQ"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Google Fit</p>
                    <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Not Linked</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleHealth('google_fit')}
                  disabled={syncingFit}
                  className="bg-surface-container-highest text-on-surface px-4 py-1.5 rounded-full text-xs font-bold active:scale-95">
                  Link
                </button>
              </div>

            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
