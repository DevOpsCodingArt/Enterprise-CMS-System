import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-8 sm:p-20 font-body bg-background text-foreground">
      {/* Header Banner */}
      <header className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-border bg-card/80 pb-6 pt-8 backdrop-blur-2xl lg:static lg:w-auto lg:rounded-xl lg:border lg:p-4">
          Get started by editing&nbsp;
          <code className="font-mono font-bold">src/app/page.tsx</code>
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-background via-background lg:static lg:h-auto lg:w-auto lg:bg-none">
          <div className="flex items-center gap-2 p-8 lg:p-0">
            <span className="text-xs text-muted-foreground font-mono">By</span>
            <Image
              src="/prime-logo.png"
              alt="Prime Networks Logo"
              width={28}
              height={28}
              className="object-contain"
              priority
            />
            <span className="font-heading font-extrabold text-base tracking-tight">PRIME NETWORKS</span>
          </div>
        </div>
      </header>

      {/* Main Center Stage */}
      <main className="flex flex-col items-center justify-center my-16 text-center">
        <div className="relative flex place-items-center mb-8">
          <Image
            src="/prime-logo.png"
            alt="Prime Logo"
            width={120}
            height={120}
            className="object-contain drop-shadow-md"
            priority
          />
        </div>

        <h1 className="font-heading font-extrabold text-4xl sm:text-5xl tracking-tight mb-4">
          Prime One <span className="text-primary">Telecom Platform</span>
        </h1>

        <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto font-normal mb-8">
          The next-generation operations and management system for high-velocity optical networks.
        </p>

        <div className="flex items-center gap-4 text-sm font-mono font-semibold">
          <a
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-primary hover:bg-primary-hover text-white px-5 py-2.5 transition-colors shadow-sm"
          >
            Read Docs →
          </a>
          <a
            href="https://nextjs.org/learn"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-border bg-card hover:bg-card-subtle px-5 py-2.5 transition-colors"
          >
            Learn Next.js
          </a>
        </div>
      </main>

      {/* 4 Feature Cards */}
      <footer className="grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left gap-4">
        <div className="group rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/50 hover:bg-card-subtle">
          <h2 className="font-heading font-bold text-lg mb-1 flex items-center justify-between">
            Prime Desk
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 text-xs text-muted-foreground">
            Multi-branch live customer interaction desk with staff audit notes.
          </p>
        </div>

        <div className="group rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/50 hover:bg-card-subtle">
          <h2 className="font-heading font-bold text-lg mb-1 flex items-center justify-between">
            SmartOLT
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 text-xs text-muted-foreground">
            Real-time optical RX/TX power metrics and subnet attenuation sweeps.
          </p>
        </div>

        <div className="group rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/50 hover:bg-card-subtle">
          <h2 className="font-heading font-bold text-lg mb-1 flex items-center justify-between">
            Van Stock QR
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 text-xs text-muted-foreground">
            Camera-verified barcode and serial scanner locking inventory to tickets.
          </p>
        </div>

        <div className="group rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/50 hover:bg-card-subtle">
          <h2 className="font-heading font-bold text-lg mb-1 flex items-center justify-between">
            20 Regional Hubs
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 text-xs text-muted-foreground">
            Isolated branch subnets across Islamabad & Rawalpindi distribution nodes.
          </p>
        </div>
      </footer>
    </div>
  );
}
