import { notFound } from "next/navigation"

import { PageBlocks } from "@/components/page-blocks"
import { PageTitle } from "@/components/page-title"
import { getPage } from "@/server/pages_db"

type PageRouteProps = {
  params: Promise<{ pageId: string }> | { pageId: string }
}

export default async function PageRoute({ params }: PageRouteProps) {
  const { pageId } = await params
  const page = getPage(pageId)

  if (!page) {
    notFound()
  }

  return (
    <main className="flex min-h-[calc(100svh-3.5rem)] flex-1 bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-[820px] flex-1 flex-col px-8 pt-24 pb-16 md:px-12 md:pt-32">
        <div className="flex flex-col gap-5">
          <p className="text-sm font-medium text-muted-foreground">Page</p>
          <PageTitle initialTitle={page.title} pageId={page.id} />
          <p className="text-lg text-muted-foreground">
            Opened page <span className="font-mono text-sm text-foreground/70">{page.id}</span>
          </p>
        </div>
        <PageBlocks pageId={page.id} />
      </div>
    </main>
  )
}
