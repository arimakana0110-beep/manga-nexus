"use client";
import { Home, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();
  
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-neutral-900/90 backdrop-blur-xl border border-neutral-800 px-8 py-3 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-300 w-[90%] max-w-[280px]">
      <div className="flex items-center justify-around">
        <Link className="group flex flex-col items-center" href="/">
          <Home className={`w-5 h-5 transition-all ${pathname === '/' ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.4)] scale-110' : 'text-neutral-400 group-hover:text-neutral-200'}`} />
        </Link>
        <Link className="group flex flex-col items-center" href="/profile">
          <User className={`w-5 h-5 transition-all ${pathname === '/profile' ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.4)] scale-110' : 'text-neutral-400 group-hover:text-neutral-200'}`} />
        </Link>
      </div>
    </div>
  );
}
