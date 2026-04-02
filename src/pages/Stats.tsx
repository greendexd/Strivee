import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { StatsService } from '../services/api';
import type { UserStats } from '../services/api';

export default function Stats() {
  const { user } = useUser();
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('week');
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
       if (!user) return;
       setLoading(true);
       try {
          const data = await StatsService.getStats(user.id, period);
          setStats(data);
       } catch (error) {
          console.error('Failed to fetch stats', error);
       } finally {
          setLoading(false);
       }
    };
    fetchStats();
  }, [user, period]);

  const handleNextPeriod = () => {
     if (period === 'day') setPeriod('week');
     else if (period === 'week') setPeriod('month');
  };

  const handlePrevPeriod = () => {
     if (period === 'month') setPeriod('week');
     else if (period === 'week') setPeriod('day');
  };

  if (loading && !stats) {
     return <div className="p-8 text-center text-on-surface-variant animate-pulse">Calculating telemetry...</div>;
  }

  const chartLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <main className="px-6 pt-4 pb-32 max-w-2xl mx-auto space-y-8 relative">
      <header>
        <h1 className="font-headline font-black text-4xl tracking-tighter text-on-surface mb-2">Metrics</h1>
        <p className="text-on-surface-variant text-sm font-medium">Your journey by the numbers.</p>
      </header>

      {/* Main Stats Bento */}
      <section className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-primary-dim to-primary rounded-xl p-5 border border-primary/20 shadow-[0_8px_32px_rgba(202,152,255,0.2)] text-background relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-20 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-8xl" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
          </div>
          <p className="font-bold text-xs uppercase tracking-widest opacity-80 mb-2">Current Level</p>
          <p className="font-headline font-black text-5xl">{stats?.summary.level || user?.level || 1}</p>
          <p className="text-xs font-medium mt-2 opacity-90">{stats?.summary.xp || user?.xp || 0} XP Total</p>
        </div>

        <div className="grid grid-rows-2 gap-4">
          <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/10 flex flex-col justify-center relative overflow-hidden group">
             <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="material-symbols-outlined text-6xl text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
             </div>
            <p className="font-bold text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">Win Rate</p>
            <div className="flex items-baseline gap-1">
               <p className="font-headline font-black text-2xl text-secondary">
                  {stats?.summary.totalMatches ? Math.round((stats.summary.wins / stats.summary.totalMatches) * 100) : 0}%
               </p>
            </div>
          </div>
          <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/10 flex flex-col justify-center relative overflow-hidden group">
             <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="material-symbols-outlined text-6xl text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>task_alt</span>
             </div>
            <p className="font-bold text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">Active Quests</p>
            <p className="font-headline font-black text-2xl text-on-surface">{stats?.summary.totalHabits || 0}</p>
          </div>
        </div>
      </section>

      {/* Activity Chart Section */}
      <section className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="font-headline font-bold text-lg">Activity</h3>
            <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">
               {period === 'day' ? 'Today' : period === 'week' ? 'This Week' : 'This Month'}
            </p>
          </div>
          <div className="flex gap-2">
            <button
               onClick={handlePrevPeriod}
               disabled={period === 'day'}
               className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant disabled:opacity-30 active:scale-90 transition-transform"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
            <button
               onClick={handleNextPeriod}
               disabled={period === 'month'}
               className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant disabled:opacity-30 active:scale-90 transition-transform"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
          </div>
        </div>

        {/* Dynamic Bar Chart */}
        <div className="flex items-end justify-between h-48 gap-3">
          {stats?.chartData?.map((value, index) => {
             // Calculate percentage for height, cap at 100%
             const heightPct = Math.min(100, Math.max(5, value));
             // Color based on height
             const colorClass = heightPct > 80 ? 'bg-secondary' : heightPct > 50 ? 'bg-primary-dim' : 'bg-outline-variant';

             return (
               <div key={index} className="flex-1 flex flex-col items-center gap-3 h-full justify-end group">
                  <div className={`w-full bg-surface-container-highest rounded-t-lg relative overflow-hidden transition-all duration-700 ${heightPct > 80 ? 'shadow-[0_0_20px_rgba(47,248,1,0.4)]' : ''}`} style={{ height: `${heightPct}%` }}>
                     <div className={`absolute bottom-0 w-full h-full ${colorClass}`}></div>
                  </div>
                  <span className={`text-[10px] font-label font-bold ${heightPct > 80 ? 'text-primary' : 'text-on-surface-variant'}`}>{chartLabels[index]}</span>
               </div>
             )
          })}
        </div>
      </section>

      {/* Streak Details */}
      <section className="bg-surface-container-low rounded-lg p-6 border border-outline-variant/10">
         <div className="flex items-center justify-between mb-6">
            <h3 className="font-headline font-bold text-lg">Best Streak</h3>
            <div className="bg-tertiary/10 text-tertiary px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
               <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
               RECORD
            </div>
         </div>
         <div className="flex items-center justify-between p-4 bg-surface-container-high rounded-xl border border-tertiary/20">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white shadow-[0_0_20px_rgba(255,165,0,0.4)]">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>whatshot</span>
               </div>
               <div>
                  <p className="text-sm font-bold">Absolute Best</p>
                  <p className="text-xs text-on-surface-variant">All Habits Combined</p>
               </div>
            </div>
            <span className="text-3xl font-black font-headline text-orange-500">{stats?.summary.bestStreak || 0}</span>
         </div>
      </section>

    </main>
  );
}
