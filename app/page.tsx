export default function Home() {
  return (
    <main className="flex min-h-[calc(100svh-3.5rem)] flex-1 bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-12 px-8 py-16 md:px-12 md:py-24">
        <section className="flex max-w-3xl flex-col gap-4">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Workspace Home
          </p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
            A lightweight Notion-style workspace for pages and content blocks.
          </h1>
          <p className="text-lg text-muted-foreground">
            This screen is your landing page. Use the sidebar to open an existing page,
            create a new one, or manage pages from the hover menu.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border bg-card p-5">
            <p className="text-sm font-medium text-card-foreground">Create pages</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Use the plus button in the sidebar to add a new page to your workspace.
            </p>
          </div>
          <div className="rounded-xl border bg-card p-5">
            <p className="text-sm font-medium text-card-foreground">Open pages</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Click any page in the sidebar to navigate to its dedicated route.
            </p>
          </div>
          <div className="rounded-xl border bg-card p-5">
            <p className="text-sm font-medium text-card-foreground">Manage pages</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Hover a page row to reveal the menu and delete pages you no longer need.
            </p>
          </div>
        </section>

        <section className="max-w-3xl rounded-2xl border bg-muted/40 p-6">
          <p className="text-sm font-medium text-foreground">What this app supports</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            The editor is built around a block-based layout with text and image blocks.
            Text blocks support headings and paragraphs, and image blocks support source,
            width, and height configuration.
          </p>
        </section>
      </div>
    </main>
  )
}
