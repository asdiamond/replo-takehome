export default function Home() {
  return (
    <main className="flex min-h-[calc(100svh-3.5rem)] flex-1 bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-[820px] flex-1 flex-col px-8 pt-24 pb-16 md:px-12 md:pt-32">
        <div className="flex flex-col gap-5">
          <p className="text-sm font-medium text-muted-foreground">Home</p>
          <h1 className="text-5xl font-semibold tracking-tight md:text-6xl">
            Welcome to your workspace
          </h1>
          <p className="text-lg text-muted-foreground">
            Select a page from the sidebar or create a new one to start writing.
          </p>
        </div>
      </div>
    </main>
  )
}
