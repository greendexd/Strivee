import { NavLink } from 'react-router-dom';

export default function BottomNavBar() {
  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center justify-center transition-all active:translate-y-[-2px] ${
      isActive
        ? "text-[#ca98ff] scale-110 drop-shadow-[0_0_8px_rgba(202,152,255,0.6)]"
        : "text-[#a7aabb] opacity-60 hover:text-[#ca98ff] hover:opacity-100"
    }`;

  const iconClasses = ({ isActive }: { isActive: boolean }) =>
    `material-symbols-outlined mb-1 ${isActive ? "font-variation-settings-fill" : ""}`;

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 bg-[#0a0e1a]/90 backdrop-blur-2xl rounded-t-[3rem] pb-safe no-line bg-gradient-to-t from-[#0a0e1a] to-transparent shadow-[0_-8px_32px_rgba(0,0,0,0.5)]">
      <NavLink to="/" className={linkClasses}>
        {({ isActive }) => (
          <>
            <span className={iconClasses({ isActive })} style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>home</span>
            <span className="font-['Be_Vietnam_Pro'] text-[10px] uppercase tracking-widest font-bold">Home</span>
          </>
        )}
      </NavLink>
      <NavLink to="/battle" className={linkClasses}>
        {({ isActive }) => (
          <>
            <span className={iconClasses({ isActive })} style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>swords</span>
            <span className="font-['Be_Vietnam_Pro'] text-[10px] uppercase tracking-widest font-bold">Battle</span>
          </>
        )}
      </NavLink>
      <NavLink to="/stats" className={linkClasses}>
        {({ isActive }) => (
          <>
            <span className={iconClasses({ isActive })} style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>leaderboard</span>
            <span className="font-['Be_Vietnam_Pro'] text-[10px] uppercase tracking-widest font-bold">Stats</span>
          </>
        )}
      </NavLink>
      <NavLink to="/shop" className={linkClasses}>
        {({ isActive }) => (
          <>
            <span className={iconClasses({ isActive })} style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>shopping_bag</span>
            <span className="font-['Be_Vietnam_Pro'] text-[10px] uppercase tracking-widest font-bold">Shop</span>
          </>
        )}
      </NavLink>
      <NavLink to="/social" className={linkClasses}>
        {({ isActive }) => (
          <>
            <span className={iconClasses({ isActive })} style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>group</span>
            <span className="font-['Be_Vietnam_Pro'] text-[10px] uppercase tracking-widest font-bold">Social</span>
          </>
        )}
      </NavLink>
    </nav>
  );
}