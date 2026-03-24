export default function Home() {
  return (
    <div className="flex flex-1 justify-center">
      <main className="flex w-full max-w-5xl flex-1 flex-col gap-10 px-6 py-10 md:px-10">
        <section className="flex flex-col gap-4">
          <span className="text-sm font-medium text-muted-foreground">
            Product / Teamspace / Home
          </span>
          <div className="flex flex-col gap-3">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance">
              Build your Notion-style workspace from a solid sidebar foundation.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground">
              The shell is now in place: navigation on the left, roomy editing
              space on the right, and enough structure to start layering in
              pages, databases, and editor interactions.
            </p>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border bg-card p-5">
            <p className="text-sm font-medium text-muted-foreground">
              Next up
            </p>
            <h2 className="mt-2 text-lg font-semibold">Editor surface</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Replace this starter content with a block editor or rich text page
              view.
            </p>
          </div>
          <div className="rounded-xl border bg-card p-5">
            <p className="text-sm font-medium text-muted-foreground">
              Data model
            </p>
            <h2 className="mt-2 text-lg font-semibold">Pages and collections</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Add nested pages, favorites, and shared collections to mirror the
              Notion information architecture.
            </p>
          </div>
          <div className="rounded-xl border bg-card p-5">
            <p className="text-sm font-medium text-muted-foreground">
              Polish
            </p>
            <h2 className="mt-2 text-lg font-semibold">Keyboard-first UX</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Layer in command menu flows, quick search, and slash commands once
              the core layout feels right.
            </p>
          </div>
        </section>

        <section className="rounded-2xl border bg-card p-6 md:p-8">
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Starter outline
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                What this shell should grow into
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex flex-col gap-3">
                <h3 className="text-base font-medium">Core experiences</h3>
                <ul className="flex flex-col gap-2 text-sm leading-6 text-muted-foreground">
                  <li>Nested pages with drag-and-drop reordering.</li>
                  <li>Favorites, recents, and shared team spaces.</li>
                  <li>Document headers with emoji, cover, and properties.</li>
                </ul>
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="text-base font-medium">Interaction ideas</h3>
                <ul className="flex flex-col gap-2 text-sm leading-6 text-muted-foreground">
                  <li>Expandable sidebar sections for deeper navigation.</li>
                  <li>Inline slash commands for inserting blocks.</li>
                  <li>Command palette flows for jumping between pages.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
