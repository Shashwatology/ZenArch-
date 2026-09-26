import prisma from '@/lib/prisma'
import { ContentForm } from './ContentForm'

export const dynamic = 'force-dynamic'

export default async function AdminContentPage() {
  const content = await prisma.pageContent.findUnique({
    where: { route: 'home' }
  })

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-light tracking-wider text-white mb-2">Homepage CMS</h2>
          <p className="text-sm text-gray-400">Manage public content without touching code</p>
        </div>
      </div>
      
      <ContentForm initialContent={content} />
    </div>
  )
}
