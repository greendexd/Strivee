import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { SocialService, FriendService } from '../services/api';
import type { SocialEvent } from '../services/api';

export default function Social() {
  const { user, showToast, refreshUser } = useUser();
  const [events, setEvents] = useState<SocialEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFriendsMenu, setShowFriendsMenu] = useState(false);
  const [addFriendUsername, setAddFriendUsername] = useState('');
  const [addingFriend, setAddingFriend] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await SocialService.getFeed();
        setEvents(data);
      } catch (error) {
        console.error('Failed to fetch social feed:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleInteract = async (receiverId: string, type: string) => {
     if (!user) return;
     try {
        await FriendService.interact(user.id, receiverId, type);
        showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} sent!`, 'success');
     } catch (e: any) {
        showToast(`Failed to send ${type}`, 'error');
     }
  };

  const handleAddFriend = async () => {
     if (!user || !addFriendUsername.trim()) return;
     setAddingFriend(true);
     try {
        await FriendService.sendRequest(user.id, addFriendUsername.trim());
        showToast('Friend request sent!', 'success');
        setAddFriendUsername('');
        await refreshUser();
     } catch (e: any) {
        showToast(((e as any).response)?.data?.error || 'Failed to send request', 'error');
     } finally {
        setAddingFriend(false);
     }
  };

  const handleAcceptRequest = async (requestId: string) => {
     try {
        await FriendService.acceptRequest(requestId);
        showToast('Friend request accepted!', 'success');
        await refreshUser();
     } catch (e: any) {
        showToast('Failed to accept request', 'error');
     }
  };

  const handleDeclineRequest = async (requestId: string) => {
     try {
        await FriendService.declineRequest(requestId);
        showToast('Friend request declined.', 'info');
        await refreshUser();
     } catch (e: any) {
        showToast('Failed to decline request', 'error');
     }
  };

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  if (loading) {
    return <div className="h-[calc(100vh-144px)] flex items-center justify-center text-on-surface-variant animate-pulse">Loading feed...</div>;
  }

  const activeFriends = [
     ...(user?.sentFriendRequests?.filter(f => f.status === 'accepted') || []),
     ...(user?.receivedFriendRequests?.filter(f => f.status === 'accepted') || [])
  ];
  const pendingRequests = user?.receivedFriendRequests?.filter(f => f.status === 'pending') || [];

  return (
    <main className="h-[calc(100vh-144px)] relative">

      {/* Floating Friends Menu Button */}
      <button
         onClick={() => setShowFriendsMenu(true)}
         className="fixed top-4 right-4 z-40 bg-surface-container-highest border border-outline-variant/20 px-4 py-2 rounded-full flex items-center gap-2 shadow-lg active:scale-95 transition-transform backdrop-blur-md">
         <span className="material-symbols-outlined text-sm text-primary">group</span>
         <span className="font-bold text-xs uppercase tracking-widest text-on-surface">Friends</span>
         {pendingRequests.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-error text-[9px] flex items-center justify-center font-black animate-pulse">
               {pendingRequests.length}
            </span>
         )}
      </button>

      {/* Friends Modal */}
      {showFriendsMenu && (
         <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex flex-col pt-12 px-6 overflow-hidden">
            <div className="flex justify-between items-center mb-8">
               <h2 className="font-headline font-black text-3xl tracking-tighter">Comrades</h2>
               <button
                  onClick={() => setShowFriendsMenu(false)}
                  className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant hover:text-white transition-colors">
                  <span className="material-symbols-outlined">close</span>
               </button>
            </div>

            {/* Add Friend Input */}
            <div className="bg-surface-container-low p-2 rounded-2xl flex items-center gap-2 mb-8 border border-outline-variant/20">
               <span className="material-symbols-outlined text-on-surface-variant ml-2">person_add</span>
               <input
                  type="text"
                  value={addFriendUsername}
                  onChange={(e) => setAddFriendUsername(e.target.value)}
                  placeholder="Enter username..."
                  className="bg-transparent border-none flex-1 text-sm font-bold text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-0"
               />
               <button
                  onClick={handleAddFriend}
                  disabled={addingFriend || !addFriendUsername.trim()}
                  className="bg-primary text-background px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-50 active:scale-95 transition-all">
                  Add
               </button>
            </div>

            <div className="flex-1 overflow-y-auto pb-32 space-y-8 custom-scrollbar">
               {/* Pending Requests */}
               {pendingRequests.length > 0 && (
                  <section>
                     <p className="text-xs font-black uppercase tracking-[0.2em] text-secondary mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">notifications</span>
                        Pending Requests
                     </p>
                     <div className="space-y-2">
                        {pendingRequests.map(req => (
                           <div key={req.id} className="bg-surface-container-highest p-3 rounded-xl flex items-center justify-between border border-secondary/20 shadow-[0_4px_20px_rgba(47,248,1,0.05)]">
                              <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-black text-lg">
                                    {req.requester.username.charAt(0)}
                                 </div>
                                 <p className="font-bold text-sm text-on-surface">{req.requester.username}</p>
                              </div>
                              <div className="flex gap-2">
                                 <button
                                    onClick={() => handleDeclineRequest(req.id)}
                                    className="w-8 h-8 rounded-full bg-error/10 text-error flex items-center justify-center hover:bg-error hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-sm">close</span>
                                 </button>
                                 <button
                                    onClick={() => handleAcceptRequest(req.id)}
                                    className="w-8 h-8 rounded-full bg-secondary text-background flex items-center justify-center shadow-[0_0_15px_rgba(47,248,1,0.4)] active:scale-90 transition-transform">
                                    <span className="material-symbols-outlined text-sm font-black">check</span>
                                 </button>
                              </div>
                           </div>
                        ))}
                     </div>
                  </section>
               )}

               {/* Active Friends List */}
               <section>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant mb-4">Your Squad</p>
                  {activeFriends.length === 0 ? (
                     <div className="py-8 text-center text-on-surface-variant text-sm bg-surface-container-lowest rounded-xl border border-dashed border-outline-variant/20">
                        It's dangerous to go alone. Add some friends!
                     </div>
                  ) : (
                     <div className="space-y-2">
                        {activeFriends.map(f => {
                           const friendUser = f.requesterId === user?.id ? f.receiver : f.requester;
                           return (
                              <div key={f.id} className="bg-surface-container-low p-3 rounded-xl flex items-center justify-between border border-outline-variant/10">
                                 <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-lg border border-primary/30">
                                       {friendUser.username.charAt(0)}
                                    </div>
                                    <div>
                                       <p className="font-bold text-sm text-on-surface leading-tight">{friendUser.username}</p>
                                       <p className="text-[10px] text-on-surface-variant font-bold tracking-widest uppercase">Lvl {friendUser.level}</p>
                                    </div>
                                 </div>
                                 <button
                                    className="w-8 h-8 rounded-full bg-surface-container-highest text-primary flex items-center justify-center active:scale-90 transition-transform">
                                    <span className="material-symbols-outlined text-sm">swords</span>
                                 </button>
                              </div>
                           )
                        })}
                     </div>
                  )}
               </section>
            </div>
         </div>
      )}

      {/* Main Social Feed */}
      {events.length === 0 ? (
         <div className="h-full flex flex-col items-center justify-center text-on-surface-variant p-6 text-center">
            <span className="material-symbols-outlined text-6xl mb-4 opacity-50">satellite_alt</span>
            <p className="font-bold">No signals detected in your sector.</p>
         </div>
      ) : (
         <div className="h-full overflow-y-auto snap-y-mandatory scroll-smooth custom-scrollbar">
            {events.map((event, index) => (
            <section key={event.id} className="h-[calc(100vh-144px)] w-full relative flex flex-col snap-start overflow-hidden">
               {/* Background Visual */}
               <div className="absolute inset-0 z-0">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background z-10"></div>
                  <img
                     className="w-full h-full object-cover opacity-40"
                     data-alt="Cosmic nebula background with purple and blue gases"
                     src={index % 2 === 0
                     ? "https://lh3.googleusercontent.com/aida-public/AB6AXuAHzHn4Dyhse6ps7DrNiJxIMmAcBf4W0-48QLNlV9LXjrlSG3AcgdvmcJNaoWnQuJg2Q9Yplsyy-TtYL1DvWX6RQnbKhFXFMFjp5z0y24dBWl28EHBzCTFlrJJ--WCssw0bCufrFZ-da2PDDSSZ5qWy1dOmY8lsSgJyaQGdDj_t6Y1hAGPh_XQ-MATJ3WTN6RMxipldkYZSSovMYAjHyGwipO0PuUE9VYS2bnsxOIfWruesUnZ-jkSFdAABGAaWuCyPNbQlJReb_r4"
                     : "https://lh3.googleusercontent.com/aida-public/AB6AXuA01tYNdesFQXWqWFVLDwOMo0CNDSMpWe7jCPud2IuwRokdMpMZIWcnvV0-xJsH-YAGbAyLw-DR7HjQqxKgwn9s4aklEUHk6P3-3DqJlam_cqV7QRIrbdrVIpyM8Fi4j4ngcPClimIss_vt9RMf4q1RNOlWXDwkQowen-a3UOH_RzpEvOgR-RpwhWIeR9gh8Fa8aHhoJLCzMHihXc5Q_Sl-pvyKoF9bqXLH6hAg5yNzjsYx_50LB_FLLKTFdvFhpKlgSGk5gqhO7-k"
                     }
                  />
               </div>

               {/* Achievement Content */}
               <div className="relative z-20 flex-1 flex flex-col justify-end px-6 pb-24">
                  <div className="flex items-center gap-3 mb-6">
                     <div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center overflow-hidden border border-primary/20">
                     <img
                        alt={event.user.username}
                        className="w-full h-full object-cover"
                        src={event.user.username === 'Sarah'
                           ? "https://lh3.googleusercontent.com/aida-public/AB6AXuCZGMQCZFd8lXQFk-qpevmtc18CtYNLfNaI2g78LY9hEVeSHKN0YSxTmRMv8fhcczmvAlo6J78oHxLmn2xalCzzcuxoIBHAn5g8fQqYKaTS6M8t-T-lc2q4oJJx0NUun7OdZFZPYIRM2qh_Vvmc9G22RLeLlXdsCnT591WK6f8KX59rZnZ-kCUGWCwXBqowkxN6FuCf623NJt1MGCuax-rIWsDORMnnjXk7LLtzyixoE49PLS8--_LofWCNk0uRragzX5ywG5dRO1g"
                           : "https://lh3.googleusercontent.com/aida-public/AB6AXuD1JjnD_qIjoRpapNg3BGeSso1bDAP2noJ_PvEvgxDu1blzW2O6mk4TzcYr23g4nC40EeHIGxl9nkBp9Op0nI1yqK0KyOTafzNKmQw-7k8Wt7j2tjz-m1mLd5AJHqBIMIba9_UN4nJRDIe3v2V9ySQBgRrH12FTDlGIkqr-xEM8ReEUKWws70vpEl7zknruqBjR5rv_owpi0dg4G8dOYbJV9GXT7LUoAJ7HM3eUruiACOrJYxSo9DQc3d0sLSk5O_x9Y8L5qJt-xrs"
                        }
                     />
                     </div>
                     <div>
                     <h3 className="font-headline font-extrabold text-white text-lg leading-none">{event.user.username}</h3>
                     <p className="text-on-surface-variant text-sm mt-1">{timeAgo(event.createdAt)}</p>
                     </div>
                  </div>

                  {event.type === 'evolution' ? (
                     <div className="bg-surface-container-low/40 backdrop-blur-xl border border-white/5 rounded-lg p-6 mb-8 relative group">
                     <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-48 h-48 bg-primary/20 blur-[64px] rounded-full"></div>
                     <div className="relative text-center mb-6">
                        <div className="inline-block p-4 rounded-full bg-gradient-to-br from-primary to-primary-dim shadow-xl mb-4">
                           <span className="material-symbols-outlined text-white text-4xl" data-weight="fill">pet_supplies</span>
                        </div>
                        <h2 className="font-headline font-black text-2xl text-white mb-2">EVOLUTION COMPLETE!</h2>
                        <p className="font-body text-primary font-bold uppercase tracking-widest text-sm text-center">{event.message}</p>
                     </div>
                     <div className="flex justify-center items-end h-32 gap-4">
                        <div className="w-16 h-16 opacity-30 blur-[1px]">
                           <img
                           alt="Stage 1"
                           src="https://lh3.googleusercontent.com/aida-public/AB6AXuBm2p578hoQxMk_C_CTwGTQrqQ8T4YYmI8XILao2CaPzQh4tbVcFpUAamO0IjP600wcu0qne7jBarflN5zqqD1SIQUlxDW1bbUY91LzgZ2ZocAZcZm4bvJXI78rjm2WvbyTA9h5ogdPN5tb1gofpp98Inw6KoCLs975nN1QEUZ08kzi8KBCfcPODGT60gcxmK2dGwYYNCwc1Z5t4EMhQirdZw-AzV1hcFtmo8USp6C2HAtAE3OCSfLFUACIw1UTpqxIwo-R0_tol9E"
                           />
                        </div>
                        <div className="w-24 h-24 relative">
                           <div className="absolute inset-0 bg-primary/40 blur-2xl animate-pulse"></div>
                           <img
                           alt="Stage 5"
                           className="relative z-10 drop-shadow-[0_0_15px_rgba(202,152,255,0.8)]"
                           src="https://lh3.googleusercontent.com/aida-public/AB6AXuBypQe4UN_jFciQxJUL5HnLe8fI23_qXJLW7jAmRmMQ9H3I1pAa8lw5_g4o-uFhAYnFcjAUPtw5cHgbUewsMTQ7hvsvJxNgfTtQ5BlpXhdqfScMwXhOt-MY11q21YAgFmydPfos50SX_9UERVsQNkYlDrPnqBTrs1TOk8DE8PM6c3Cah9Rykt6BEM2rlOAb8BiI1xsgmaMOd6yzMwDmi0mbS9Gh3HM4UzXOD7ptX8Lnpr9FNVmd_VENeh6Lhe4WCiqvv0zeYBal6EA"
                           />
                        </div>
                     </div>
                     </div>
                  ) : (
                     <div className="bg-surface-container-low/40 backdrop-blur-xl border border-white/5 rounded-lg p-8 mb-8 relative overflow-hidden">
                     <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-secondary/10 blur-[80px] rounded-full"></div>
                     <div className="relative flex flex-col items-center">
                        <div className="relative mb-6">
                           <div className="absolute inset-0 bg-secondary/40 blur-[40px] animate-pulse"></div>
                           <span className="material-symbols-outlined text-secondary text-8xl relative z-10" data-weight="fill" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                        </div>
                        <h2 className="font-headline font-black text-4xl text-white mb-2 tracking-tight">STREAK ALIVE</h2>
                        <p className="font-body text-secondary-dim font-bold uppercase tracking-[0.2em] text-sm text-center">{event.message}</p>
                        <div className="w-full max-w-xs bg-surface-container-lowest h-2 rounded-full mt-8 overflow-hidden">
                           <div className="h-full bg-gradient-to-r from-secondary to-secondary-dim w-[100%] shadow-[0_0_12px_rgba(47,248,1,0.5)]"></div>
                        </div>
                     </div>
                     </div>
                  )}
               </div>

               {/* Interaction Sidebar */}
               {event.user.id !== user?.id && (
                  <aside className="absolute right-4 bottom-32 z-30 flex flex-col gap-6">
                     <button
                        onClick={() => handleInteract(event.user.id, 'congrats')}
                        className="group flex flex-col items-center gap-1 active:scale-95 transition-transform">
                     <div className="w-14 h-14 rounded-full bg-surface-container-highest/60 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:bg-primary/20 transition-colors">
                        <span className="material-symbols-outlined text-white text-3xl" data-weight="fill">favorite</span>
                     </div>
                     <span className="text-on-surface-variant text-[10px] font-bold uppercase tracking-tighter shadow-black drop-shadow-md">Congrats</span>
                     </button>
                     <button
                        onClick={() => handleInteract(event.user.id, 'nudge')}
                        className="group flex flex-col items-center gap-1 active:scale-95 transition-transform">
                     <div className="w-14 h-14 rounded-full bg-surface-container-highest/60 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:bg-secondary/20 transition-colors">
                        <span className="material-symbols-outlined text-white text-3xl">rocket_launch</span>
                     </div>
                     <span className="text-on-surface-variant text-[10px] font-bold uppercase tracking-tighter shadow-black drop-shadow-md">Nudge</span>
                     </button>
                  </aside>
               )}
            </section>
            ))}
         </div>
      )}
    </main>
  );
}
