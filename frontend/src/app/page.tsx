export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      <main className="flex flex-col items-center gap-6 text-center max-w-xl">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
          P1
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Prime One Telecom OS
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Clean Next.js workspace ready for development.
        </p>
      </main>
    </div>
  );
}
