export default function Social() {
  return (
    <main className="h-[calc(100vh-144px)] overflow-y-auto snap-y-mandatory scroll-smooth custom-scrollbar">
      {/* Feed Item 1: Evolution Achievement */}
      <section className="h-[calc(100vh-144px)] w-full relative flex flex-col snap-start overflow-hidden">
        {/* Background Visual */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background z-10"></div>
          <img
            className="w-full h-full object-cover opacity-40"
            data-alt="Cosmic nebula background with purple and blue gases"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHzHn4Dyhse6ps7DrNiJxIMmAcBf4W0-48QLNlV9LXjrlSG3AcgdvmcJNaoWnQuJg2Q9Yplsyy-TtYL1DvWX6RQnbKhFXFMFjp5z0y24dBWl28EHBzCTFlrJJ--WCssw0bCufrFZ-da2PDDSSZ5qWy1dOmY8lsSgJyaQGdDj_t6Y1hAGPh_XQ-MATJ3WTN6RMxipldkYZSSovMYAjHyGwipO0PuUE9VYS2bnsxOIfWruesUnZ-jkSFdAABGAaWuCyPNbQlJReb_r4"
          />
        </div>

        {/* Achievement Content */}
        <div className="relative z-20 flex-1 flex flex-col justify-end px-6 pb-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center overflow-hidden border border-primary/20">
              <img
                alt="Alex"
                data-alt="Portrait of Alex the user"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1JjnD_qIjoRpapNg3BGeSso1bDAP2noJ_PvEvgxDu1blzW2O6mk4TzcYr23g4nC40EeHIGxl9nkBp9Op0nI1yqK0KyOTafzNKmQw-7k8Wt7j2tjz-m1mLd5AJHqBIMIba9_UN4nJRDIe3v2V9ySQBgRrH12FTDlGIkqr-xEM8ReEUKWws70vpEl7zknruqBjR5rv_owpi0dg4G8dOYbJV9GXT7LUoAJ7HM3eUruiACOrJYxSo9DQc3d0sLSk5O_x9Y8L5qJt-xrs"
              />
            </div>
            <div>
              <h3 className="font-headline font-extrabold text-white text-lg leading-none">Alex</h3>
              <p className="text-on-surface-variant text-sm mt-1">2 mins ago</p>
            </div>
          </div>

          <div className="bg-surface-container-low/40 backdrop-blur-xl border border-white/5 rounded-lg p-6 mb-8 relative group">
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-48 h-48 bg-primary/20 blur-[64px] rounded-full"></div>
            <div className="relative text-center mb-6">
              <div className="inline-block p-4 rounded-full bg-gradient-to-br from-primary to-primary-dim shadow-xl mb-4">
                <span className="material-symbols-outlined text-white text-4xl" data-weight="fill">pet_supplies</span>
              </div>
              <h2 className="font-headline font-black text-2xl text-white mb-2">EVOLUTION COMPLETE!</h2>
              <p className="font-body text-primary font-bold uppercase tracking-widest text-sm">Alex just evolved their pet to Level 5!</p>
            </div>
            <div className="flex justify-center items-end h-32 gap-4">
              <div className="w-16 h-16 opacity-30 blur-[1px]">
                <img
                  alt="Stage 1"
                  data-alt="Small baby chick pet"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBm2p578hoQxMk_C_CTwGTQrqQ8T4YYmI8XILao2CaPzQh4tbVcFpUAamO0IjP600wcu0qne7jBarflN5zqqD1SIQUlxDW1bbUY91LzgZ2ZocAZcZm4bvJXI78rjm2WvbyTA9h5ogdPN5tb1gofpp98Inw6KoCLs975nN1QEUZ08kzi8KBCfcPODGT60gcxmK2dGwYYNCwc1Z5t4EMhQirdZw-AzV1hcFtmo8USp6C2HAtAE3OCSfLFUACIw1UTpqxIwo-R0_tol9E"
                />
              </div>
              <div className="w-24 h-24 relative">
                <div className="absolute inset-0 bg-primary/40 blur-2xl animate-pulse"></div>
                <img
                  alt="Stage 5"
                  className="relative z-10 drop-shadow-[0_0_15px_rgba(202,152,255,0.8)]"
                  data-alt="Majestic glowing eagle pet"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBypQe4UN_jFciQxJUL5HnLe8fI23_qXJLW7jAmRmMQ9H3I1pAa8lw5_g4o-uFhAYnFcjAUPtw5cHgbUewsMTQ7hvsvJxNgfTtQ5BlpXhdqfScMwXhOt-MY11q21YAgFmydPfos50SX_9UERVsQNkYlDrPnqBTrs1TOk8DE8PM6c3Cah9Rykt6BEM2rlOAb8BiI1xsgmaMOd6yzMwDmi0mbS9Gh3HM4UzXOD7ptX8Lnpr9FNVmd_VENeh6Lhe4WCiqvv0zeYBal6EA"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Interaction Sidebar */}
        <aside className="absolute right-4 bottom-32 z-30 flex flex-col gap-6">
          <button className="group flex flex-col items-center gap-1 active:scale-95 transition-transform">
            <div className="w-14 h-14 rounded-full bg-surface-container-highest/60 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:bg-primary/20 transition-colors">
              <span className="material-symbols-outlined text-white text-3xl" data-weight="fill">favorite</span>
            </div>
            <span className="text-on-surface-variant text-[10px] font-bold uppercase tracking-tighter">Congrats</span>
          </button>
          <button className="group flex flex-col items-center gap-1 active:scale-95 transition-transform">
            <div className="w-14 h-14 rounded-full bg-surface-container-highest/60 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:bg-secondary/20 transition-colors">
              <span className="material-symbols-outlined text-white text-3xl">rocket_launch</span>
            </div>
            <span className="text-on-surface-variant text-[10px] font-bold uppercase tracking-tighter">Nudge</span>
          </button>
          <button className="group flex flex-col items-center gap-1 active:scale-95 transition-transform">
            <div className="w-14 h-14 rounded-full bg-surface-container-highest/60 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:bg-tertiary/20 transition-colors">
              <span className="material-symbols-outlined text-white text-3xl">swords</span>
            </div>
            <span className="text-on-surface-variant text-[10px] font-bold uppercase tracking-tighter">Duel</span>
          </button>
        </aside>
      </section>

      {/* Feed Item 2: Streak Achievement */}
      <section className="h-[calc(100vh-144px)] w-full relative flex flex-col snap-start overflow-hidden">
        {/* Background Visual */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background z-10"></div>
          <img
            className="w-full h-full object-cover opacity-40"
            data-alt="Abstract deep blue and neon patterns"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA01tYNdesFQXWqWFVLDwOMo0CNDSMpWe7jCPud2IuwRokdMpMZIWcnvV0-xJsH-YAGbAyLw-DR7HjQqxKgwn9s4aklEUHk6P3-3DqJlam_cqV7QRIrbdrVIpyM8Fi4j4ngcPClimIss_vt9RMf4q1RNOlWXDwkQowen-a3UOH_RzpEvOgR-RpwhWIeR9gh8Fa8aHhoJLCzMHihXc5Q_Sl-pvyKoF9bqXLH6hAg5yNzjsYx_50LB_FLLKTFdvFhpKlgSGk5gqhO7-k"
          />
        </div>

        {/* Achievement Content */}
        <div className="relative z-20 flex-1 flex flex-col justify-end px-6 pb-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center overflow-hidden border border-secondary/20">
              <img
                alt="Sarah"
                data-alt="Portrait of Sarah the user"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZGMQCZFd8lXQFk-qpevmtc18CtYNLfNaI2g78LY9hEVeSHKN0YSxTmRMv8fhcczmvAlo6J78oHxLmn2xalCzzcuxoIBHAn5g8fQqYKaTS6M8t-T-lc2q4oJJx0NUun7OdZFZPYIRM2qh_Vvmc9G22RLeLlXdsCnT591WK6f8KX59rZnZ-kCUGWCwXBqowkxN6FuCf623NJt1MGCuax-rIWsDORMnnjXk7LLtzyixoE49PLS8--_LofWCNk0uRragzX5ywG5dRO1g"
              />
            </div>
            <div>
              <h3 className="font-headline font-extrabold text-white text-lg leading-none">Sarah</h3>
              <p className="text-on-surface-variant text-sm mt-1">1 hour ago</p>
            </div>
          </div>

          <div className="bg-surface-container-low/40 backdrop-blur-xl border border-white/5 rounded-lg p-8 mb-8 relative overflow-hidden">
            <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-secondary/10 blur-[80px] rounded-full"></div>
            <div className="relative flex flex-col items-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-secondary/40 blur-[40px] animate-pulse"></div>
                <span className="material-symbols-outlined text-secondary text-8xl relative z-10" data-weight="fill" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
              </div>
              <h2 className="font-headline font-black text-4xl text-white mb-2 tracking-tight">30 DAY STREAK</h2>
              <p className="font-body text-secondary-dim font-bold uppercase tracking-[0.2em] text-sm">Sarah is UNSTOPPABLE!</p>
              <div className="w-full max-w-xs bg-surface-container-lowest h-2 rounded-full mt-8 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-secondary to-secondary-dim w-[100%] shadow-[0_0_12px_rgba(47,248,1,0.5)]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Interaction Sidebar */}
        <aside className="absolute right-4 bottom-32 z-30 flex flex-col gap-6">
          <button className="group flex flex-col items-center gap-1 active:scale-95 transition-transform">
            <div className="w-14 h-14 rounded-full bg-surface-container-highest/60 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:bg-primary/20 transition-colors">
              <span className="material-symbols-outlined text-white text-3xl" data-weight="fill">favorite</span>
            </div>
            <span className="text-on-surface-variant text-[10px] font-bold uppercase tracking-tighter">Congrats</span>
          </button>
          <button className="group flex flex-col items-center gap-1 active:scale-95 transition-transform">
            <div className="w-14 h-14 rounded-full bg-surface-container-highest/60 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:bg-secondary/20 transition-colors">
              <span className="material-symbols-outlined text-white text-3xl">rocket_launch</span>
            </div>
            <span className="text-on-surface-variant text-[10px] font-bold uppercase tracking-tighter">Nudge</span>
          </button>
          <button className="group flex flex-col items-center gap-1 active:scale-95 transition-transform">
            <div className="w-14 h-14 rounded-full bg-surface-container-highest/60 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:bg-tertiary/20 transition-colors">
              <span className="material-symbols-outlined text-white text-3xl">swords</span>
            </div>
            <span className="text-on-surface-variant text-[10px] font-bold uppercase tracking-tighter">Duel</span>
          </button>
        </aside>
      </section>
    </main>
  );
}