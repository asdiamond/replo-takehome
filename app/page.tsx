export default function Home() {
  return (
    <main className="flex min-h-[calc(100svh-3.5rem)] flex-1 bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-[820px] flex-1 flex-col px-8 pt-24 pb-16 md:px-12 md:pt-32">
        <div className="flex flex-col gap-5">
          <h1 className="text-5xl font-semibold tracking-tight text-foreground/10 md:text-6xl">
            New page
          </h1>
          <p className="text-lg text-foreground/40">
            Press <span className="text-foreground/55">&apos;space&apos;</span> for AI or{" "}
            <span className="text-foreground/55">&apos;/&apos;</span> for commands
          </p>
        </div>
      </div>
    </main>
  )
}
