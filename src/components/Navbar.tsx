import Link from 'next/link';
import SearchBar from './SearchBar';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-neutral-950/80 backdrop-blur-md border-b border-white/5">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-white hover:text-neutral-200 transition-colors">
            Manga Nexus
          </Link>

          {/* Search Bar */}
          <SearchBar />
        </div>
      </div>
    </nav>
  );
}
