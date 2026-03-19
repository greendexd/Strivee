import { useState } from 'react';
import { useUser } from '../context/UserContext';
import { InventoryService, CURRENT_USER_ID } from '../services/api';

export default function Shop() {
  const { user, refreshUser } = useUser();
  const [purchasing, setPurchasing] = useState(false);

  const handlePurchase = async (itemName: string, type: string, rarity: string) => {
    try {
      setPurchasing(true);
      await InventoryService.createItem({
        name: itemName,
        type,
        rarity,
        userId: CURRENT_USER_ID
      });
      alert(`Successfully purchased ${itemName}!`);
      await refreshUser();
    } catch (error) {
      console.error('Failed to purchase item:', error);
      alert('Failed to complete purchase. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-6 pt-8 space-y-10 pb-32">
      {/* Battle Pass Banner */}
      <section className="relative group cursor-pointer">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-dim to-secondary-dim rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
        <div className="relative bg-surface-container-high p-6 rounded-lg overflow-hidden">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded-full font-bold tracking-widest uppercase">Season 4</span>
                <h2 className="font-headline text-xl font-extrabold">Ethereal Battle Pass</h2>
              </div>
              <p className="text-on-surface-variant text-sm">Level {user?.level || 1} • {user?.xp || 0} / 1000 XP to next tier</p>
            </div>

            <div className="flex-1 max-w-md w-full">
              <div className="h-3 w-full bg-surface-container-lowest rounded-full overflow-hidden">
                <div className="h-full w-[85%] bg-gradient-to-r from-primary to-secondary relative shadow-[0_0_12px_rgba(47,248,1,0.4)]"></div>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">Current: Shadow Cape</span>
                <span className="text-[10px] font-bold text-tertiary uppercase tracking-tighter">Next: Phoenix Wings</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Loot Boxes */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h3 className="font-headline text-2xl font-black tracking-tight">Featured Items</h3>
            <p className="text-on-surface-variant text-sm font-medium">Unlock potential with mysterious relics</p>
          </div>
          <div className="flex items-center gap-2 bg-surface-container-highest px-3 py-1.5 rounded-xl">
            <span className="material-symbols-outlined text-primary text-sm">token</span>
            <span className="text-sm font-bold">2 Loot Shards</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Common Box */}
          <div className="bg-surface-container-low p-6 rounded-xl flex flex-col items-center text-center group hover:translate-y-[-4px] transition-all duration-300 border border-outline-variant/10">
            <div className="w-32 h-32 mb-6 relative">
              <div className="absolute inset-0 bg-on-surface-variant/5 rounded-full blur-2xl"></div>
              <img
                alt="Common Loot Box"
                className="w-full h-full relative z-10 opacity-80 group-hover:scale-110 transition-transform"
                data-alt="Sleek silver metallic gift box"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKnPYrwbhv14tZei1FsxYKfcgTDXgdlmCg-ygujWyE2SgHg1aSgO0PO4r_AcDQLut17yTJK48EIMz6fxg3BwxLM5JGveSjLKXVakD2eCbSeOClp-kcgMtSYaSAcCQ2aIS_4wqk7xVQH4Cks2SG1Md8j-2yti0xFfAxs_XEs3ERoRR6OoQJ7EvqBe9FF8VVwADH5QxL8hSVIFDq2mxWRo1mfS5O7Z_ZthbU8Nid5AxJha63IHJOlN56GF4YoUoYMGQyv9PYbmA9zG8"
              />
            </div>
            <h4 className="font-headline font-extrabold text-lg mb-1">Seeker's Crate</h4>
            <p className="text-xs text-on-surface-variant mb-6 uppercase tracking-widest font-bold">Common Tier</p>
            <button
              disabled={purchasing}
              onClick={() => handlePurchase("Seeker's Crate", "lootbox", "common")}
              className="w-full py-3 bg-surface-container-highest text-on-surface rounded-full font-bold text-sm active:scale-95 transition-transform flex items-center justify-center gap-2 hover:bg-surface-container-highest/80">
              <span className="material-symbols-outlined text-sm">payments</span>
              2,500 Gold
            </button>
          </div>

          {/* Rare Box */}
          <div className="bg-surface-container-high p-6 rounded-xl flex flex-col items-center text-center group hover:translate-y-[-4px] transition-all duration-300 rarity-rare relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
            <div className="w-32 h-32 mb-6 relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse"></div>
              <img
                alt="Rare Loot Box"
                className="w-full h-full relative z-10 group-hover:scale-110 transition-transform"
                data-alt="Glowing purple crystal chest with arcane markings"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0Ac3TBDyUjUIw-TY5a9tRDgD7f8p6F6NtPOihqkZRdutRaCj88OBINSMC9nDWTxPWPp84p0nWTcmK-j6I2DPLkxz1aBydEn6BOttOjCdfVQFvGYDirA1h_x0xxYTVgvY9K-CiabqiAQsfm6wHGHo9s8_sxM-aUm4dDGc5gl1e0AHTjTu_wvzAvE_Agqh6oXGeL9ekW48-Mr8jnUoIDkAu_gD6kekhXgyjP88L9eam5wHhJ_lb7RQuFbiGc3iseTCIfl-a1vUd4Zg"
              />
            </div>
            <h4 className="font-headline font-extrabold text-lg mb-1 text-primary">Astral Vault</h4>
            <p className="text-xs text-primary/70 mb-6 uppercase tracking-widest font-bold">Rare Tier</p>
            <button
              disabled={purchasing}
              onClick={() => handlePurchase("Astral Vault", "lootbox", "rare")}
              className="w-full py-3 bg-gradient-to-br from-[#ca98ff] to-[#9c42f4] text-white rounded-full font-bold text-sm active:scale-95 transition-transform shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:opacity-90">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>diamond</span>
              150 Gems
            </button>
          </div>

          {/* Legendary Box */}
          <div className="bg-surface-container-high p-6 rounded-xl flex flex-col items-center text-center group hover:translate-y-[-4px] transition-all duration-300 rarity-legendary relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-tertiary"></div>
            <div className="w-32 h-32 mb-6 relative">
              <div className="absolute inset-0 bg-tertiary/20 rounded-full blur-2xl animate-pulse"></div>
              <div className="absolute inset-0 shimmer-effect opacity-30"></div>
              <img
                alt="Legendary Loot Box"
                className="w-full h-full relative z-10 group-hover:scale-110 transition-transform"
                data-alt="Opulent gold and white cosmic treasure chest"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeq9rDGdi9ayilj9_gpXw09xQ9QfvSzBy3S_u37jA21KO-hEKg6lnUJTq2HvVk9Tuv53e4iuAdFrEq3-jnKPkD2_tpFxb7dhl7nkF5UHX0FBZ8-ghIcyeLcdwCg0EcMVyumXoUlpmWfn72T71qleleKMDK4FDl7G7kKJIF8M38OX0BkMRS1C_oEqlii-OlYVWfK9el9kjevwydpAli-xVZnXMg97kvx8TPsxr45av4CclEr4q9J51-kJ2jthLko_ro6F4fUKRpCec"
              />
            </div>
            <h4 className="font-headline font-extrabold text-lg mb-1 text-tertiary">Celestial Coffer</h4>
            <p className="text-xs text-tertiary/70 mb-6 uppercase tracking-widest font-bold">Legendary Tier</p>
            <button
              disabled={purchasing}
              onClick={() => handlePurchase("Celestial Coffer", "lootbox", "legendary")}
              className="w-full py-3 bg-gradient-to-br from-tertiary to-tertiary-dim text-on-tertiary-fixed rounded-full font-bold text-sm active:scale-95 transition-transform shadow-lg shadow-tertiary/20 flex items-center justify-center gap-2 hover:opacity-90">
              <span className="material-symbols-outlined text-sm">token</span>
              1 Loot Shard
            </button>
          </div>
        </div>
      </section>

      {/* My Inventory */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-headline text-2xl font-black tracking-tight">My Inventory</h3>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest">All</button>
            <button className="px-4 py-2 bg-surface-container-low text-on-surface-variant rounded-full text-xs font-bold uppercase tracking-widest">Skins</button>
            <button className="px-4 py-2 bg-surface-container-low text-on-surface-variant rounded-full text-xs font-bold uppercase tracking-widest">Utility</button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {user?.inventory?.length === 0 ? (
            <div className="col-span-full py-8 text-center text-on-surface-variant">Your inventory is empty. Buy something from the shop!</div>
          ) : (
            user?.inventory?.map((item) => (
              <div key={item.id} className={`aspect-square bg-surface-container p-4 rounded-xl border relative group hover:bg-surface-container-high transition-colors ${item.rarity === 'legendary' ? 'border-tertiary/20' : item.rarity === 'rare' ? 'border-primary/20' : 'border-outline-variant/10'}`}>
                <div className="h-full flex flex-col items-center justify-center gap-2">
                  <div className="relative">
                    {item.rarity === 'legendary' && <div className="absolute inset-0 bg-tertiary/10 blur-xl rounded-full"></div>}
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center relative z-10 ${item.rarity === 'legendary' ? 'bg-tertiary/20 text-tertiary' : item.rarity === 'rare' ? 'bg-primary/20 text-primary' : 'bg-secondary/10 text-secondary'}`}>
                      <span className="material-symbols-outlined text-3xl">
                        {item.type === 'lootbox' ? 'inventory_2' : item.type === 'skin' ? 'checkroom' : 'ac_unit'}
                      </span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className={`text-xs font-bold ${item.rarity === 'legendary' ? 'text-tertiary' : item.rarity === 'rare' ? 'text-primary' : 'text-on-surface'}`}>{item.name}</p>
                    <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-tighter">{item.rarity} {item.type}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}