export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 bg-neutral-950 flex flex-col items-center justify-center z-[9999] animate-fade-in">
      <div className="relative flex items-center justify-center">
        {/* Outer elegant spinning ring */}
        <div className="w-16 h-16 border-2 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin" />
        {/* Inner pulsing accent ring */}
        <div className="absolute w-10 h-10 border border-emerald-500/20 rounded-full animate-ping" />
      </div>
      <p className="text-xs uppercase tracking-widest text-neutral-400 mt-6 font-medium animate-pulse">
        Loading Content...
      </p>
    </div>
  );
}
