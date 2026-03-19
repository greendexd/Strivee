import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { ShopService } from '../services/api';
import type { ShopItem } from '../services/api';

export default function Shop() {
  const { user, showToast, refreshUser } = useUser();
  const [catalog, setCatalog] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'skin' | 'utility'>('all');
  const [unlockedItem, setUnlockedItem] = useState<{name: string, rarity: string, image?: string} | null>(null);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
         const items = await ShopService.getCatalog();
         setCatalog(items);
      } catch (err: any) {
         showToast('Failed to load shop items', 'error');
      } finally {
         setLoading(false);
      }
    };
    fetchCatalog();
  }, [showToast]);

  const handlePurchase = async (shopItem: ShopItem) => {
    if (!user) return;

    // Check balance
    if (shopItem.priceGold > 0 && user.gold < shopItem.priceGold) {
       showToast('Not enough Gold!', 'error');
       return;
    }
    if (shopItem.priceGems > 0 && user.gems < shopItem.priceGems) {
       showToast('Not enough Gems!', 'error');
       return;
    }

    setPurchasing(true);
    try {
      const result = await ShopService.buyItem(user.id, shopItem.id);
      await refreshUser(); // Update balance and inventory
      setUnlockedItem({
         name: result.item.name,
         rarity: result.item.rarity,
         image: shopItem.imageUrl
      });
      showToast(result.message, 'success');
    } catch (err: any) {
      showToast(((err as any).response)?.data?.error || 'Purchase failed', 'error');
    } finally {
      setPurchasing(false);
    }
  };

  const filteredInventory = user?.inventory?.filter(item => {
     if (activeFilter === 'all') return true;
     return item.type === activeFilter;
  }) || [];

  if (loading) {
     return <div className="h-[calc(100vh-144px)] flex items-center justify-center text-on-surface-variant animate-pulse">Loading Shop...</div>;
  }

  return (
    <main className="px-6 py-6 pb-32 max-w-2xl mx-auto space-y-10 relative">

      {/* Top Bar for Resources */}
      <div className="flex justify-end items-center w-full gap-2">
         <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-full border border-outline-variant/20">
            <span className="material-symbols-outlined text-yellow-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
            <span className="font-bold text-xs">{user?.gold || 0}</span>
         </div>
         <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-full border border-outline-variant/20">
            <span className="material-symbols-outlined text-[#ca98ff] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>diamond</span>
            <span className="font-bold text-xs">{user?.gems || 0}</span>
         </div>
      </div>

      <header>
        <h1 className="font-headline font-black text-4xl tracking-tighter text-on-surface mb-2">Mystic Bazaar</h1>
        <p className="text-on-surface-variant text-sm font-medium">Trade your hard-earned wealth for power.</p>
      </header>

      {/* Unlocked Item Modal */}
      {unlockedItem && (
         <div className="fixed inset-0 bg-background/95 z-50 flex flex-col items-center justify-center backdrop-blur-md px-6">
            <div className={`w-40 h-40 rounded-full flex items-center justify-center mb-8 relative ${
               unlockedItem.rarity === 'legendary' ? 'bg-tertiary/20' :
               unlockedItem.rarity === 'rare' ? 'bg-primary/20' : 'bg-surface-container-highest'
            }`}>
               <div className="absolute inset-0 animate-spin-slow opacity-50 bg-[conic-gradient(from_0deg,transparent_0_340deg,white_360deg)] rounded-full"></div>
               {unlockedItem.image ? (
                  <img src={unlockedItem.image} alt="Loot" className="w-24 h-24 object-contain relative z-10 drop-shadow-[0_0_20px_rgba(255,255,255,0.8)] animate-pulse" />
               ) : (
                  <span className={`material-symbols-outlined text-6xl relative z-10 ${
                     unlockedItem.rarity === 'legendary' ? 'text-tertiary drop-shadow-[0_0_15px_#ffe792]' :
                     unlockedItem.rarity === 'rare' ? 'text-primary drop-shadow-[0_0_15px_#ca98ff]' : 'text-on-surface'
                  }`} style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
               )}
            </div>

            <p className="text-sm font-bold tracking-[0.3em] uppercase mb-2 text-on-surface-variant">ITEM UNLOCKED</p>
            <h2 className={`text-3xl font-black font-headline text-center mb-12 ${
               unlockedItem.rarity === 'legendary' ? 'text-tertiary' :
               unlockedItem.rarity === 'rare' ? 'text-primary' : 'text-on-surface'
            }`}>
               {unlockedItem.name}
            </h2>

            <button
               onClick={() => setUnlockedItem(null)}
               className="w-full max-w-xs bg-surface-container-highest py-4 rounded-xl font-black tracking-widest active:scale-95 transition-transform hover:bg-surface-container">
               EQUIP LATER
            </button>
         </div>
      )}

      {/* Featured Loot Boxes */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h3 className="font-headline text-2xl font-black tracking-tight">Featured Items</h3>
            <p className="text-on-surface-variant text-sm font-medium">Unlock potential with mysterious relics</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {catalog.map(item => (
            <div key={item.id} className={`bg-surface-container-low p-6 rounded-xl flex flex-col items-center text-center group hover:translate-y-[-4px] transition-all duration-300 border relative overflow-hidden ${
               item.rarity === 'rare' ? 'border-primary/30 shadow-[0_4px_30px_rgba(202,152,255,0.1)]' :
               item.rarity === 'legendary' ? 'border-tertiary/30 shadow-[0_4px_30px_rgba(255,231,146,0.1)]' :
               'border-outline-variant/10'
            }`}>
              {item.rarity === 'rare' && <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>}
              {item.rarity === 'legendary' && <div className="absolute top-0 left-0 w-full h-1 bg-tertiary"></div>}

              <div className="w-32 h-32 mb-6 relative">
                <div className={`absolute inset-0 rounded-full blur-2xl opacity-50 ${
                   item.rarity === 'rare' ? 'bg-primary/40 animate-pulse' :
                   item.rarity === 'legendary' ? 'bg-tertiary/40 animate-pulse' : 'bg-surface-container-highest'
                }`}></div>
                {item.imageUrl ? (
                   <img alt={item.name} src={item.imageUrl} className="w-full h-full object-contain relative z-10 group-hover:scale-110 transition-transform" />
                ) : (
                   <div className="w-full h-full flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform">
                      <span className={`material-symbols-outlined text-6xl ${
                         item.rarity === 'rare' ? 'text-primary' :
                         item.rarity === 'legendary' ? 'text-tertiary' : 'text-on-surface-variant'
                      }`} style={{ fontVariationSettings: "'FILL' 1" }}>
                         {item.type === 'lootbox' ? 'inventory_2' : item.type === 'skin' ? 'checkroom' : 'ac_unit'}
                      </span>
                   </div>
                )}
              </div>
              <h4 className={`font-headline font-extrabold text-lg mb-1 ${
                 item.rarity === 'rare' ? 'text-primary' :
                 item.rarity === 'legendary' ? 'text-tertiary' : 'text-on-surface'
              }`}>{item.name}</h4>
              <p className="text-xs text-on-surface-variant/80 mb-6 uppercase tracking-widest font-bold">{item.description}</p>

              <button
                disabled={purchasing}
                onClick={() => handlePurchase(item)}
                className={`w-full py-3 rounded-full font-bold text-sm active:scale-95 transition-transform flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 ${
                   item.priceGems > 0
                     ? 'bg-gradient-to-br from-[#ca98ff] to-[#9c42f4] text-white shadow-primary/20 hover:opacity-90'
                     : 'bg-surface-container-highest text-yellow-500 hover:bg-surface-container border border-outline-variant/20'
                }`}>
                {item.priceGems > 0 ? (
                   <><span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>diamond</span>{item.priceGems} Gems</>
                ) : (
                   <><span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>{item.priceGold} Gold</>
                )}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* My Inventory */}
      <section className="space-y-6 pt-4 border-t border-outline-variant/10">
        <div className="flex items-center justify-between">
          <h3 className="font-headline text-2xl font-black tracking-tight">My Inventory</h3>
          <div className="flex gap-2">
            <button
               onClick={() => setActiveFilter('all')}
               className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-colors ${
                  activeFilter === 'all' ? 'bg-primary text-background shadow-[0_0_15px_rgba(202,152,255,0.4)]' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
               }`}>All</button>
            <button
               onClick={() => setActiveFilter('skin')}
               className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-colors ${
                  activeFilter === 'skin' ? 'bg-primary text-background shadow-[0_0_15px_rgba(202,152,255,0.4)]' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
               }`}>Skins</button>
            <button
               onClick={() => setActiveFilter('utility')}
               className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-colors ${
                  activeFilter === 'utility' ? 'bg-primary text-background shadow-[0_0_15px_rgba(202,152,255,0.4)]' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
               }`}>Utility</button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filteredInventory.length === 0 ? (
            <div className="col-span-full py-12 flex flex-col items-center justify-center gap-4 bg-surface-container-lowest rounded-xl border-2 border-dashed border-outline-variant/20">
               <span className="material-symbols-outlined text-4xl text-on-surface-variant">inventory_2</span>
               <p className="text-on-surface-variant font-medium">No items found in this category.</p>
            </div>
          ) : (
            filteredInventory.map((item) => (
              <div key={item.id} className={`aspect-square bg-surface-container p-4 rounded-xl border relative group hover:bg-surface-container-high transition-colors ${
                 item.rarity === 'legendary' ? 'border-tertiary/30' :
                 item.rarity === 'rare' ? 'border-primary/30' :
                 'border-outline-variant/10'
              }`}>
                {item.equipped && (
                   <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_#2ff801] z-20"></div>
                )}
                <div className="h-full flex flex-col items-center justify-center gap-2">
                  <div className="relative">
                    {item.rarity === 'legendary' && <div className="absolute inset-0 bg-tertiary/20 blur-xl rounded-full"></div>}
                    {item.rarity === 'rare' && <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>}

                    <div className={`w-16 h-16 rounded-full flex items-center justify-center relative z-10 border ${
                       item.rarity === 'legendary' ? 'bg-tertiary/10 text-tertiary border-tertiary/50' :
                       item.rarity === 'rare' ? 'bg-primary/10 text-primary border-primary/50' :
                       'bg-surface-container-lowest text-on-surface-variant border-outline-variant/20'
                    }`}>
                      <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {item.type === 'lootbox' ? 'inventory_2' : item.type === 'skin' ? 'checkroom' : 'ac_unit'}
                      </span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className={`text-xs font-bold leading-tight ${
                       item.rarity === 'legendary' ? 'text-tertiary' :
                       item.rarity === 'rare' ? 'text-primary' :
                       'text-on-surface'
                    }`}>{item.name}</p>
                    <p className="text-[9px] mt-1 text-on-surface-variant uppercase font-black tracking-widest">{item.rarity}</p>
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
