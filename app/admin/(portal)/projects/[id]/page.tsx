import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { ProjectEditorForm } from '@/components/admin/ProjectEditorForm'

export const dynamic = 'force-dynamic'

export default async function AdminProjectDetailPage({ params }: { params: { id: string } }) {
  const isNew = params.id === 'new'
  
  let project = null
  if (!isNew) {
    project = await prisma.project.findUnique({
      where: { id: params.id },
      include: { images: true }
    })
    
    if (!project) return notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-white/10">
        <div>
          <h2 className="text-2xl font-light tracking-wider text-white">
            {isNew ? 'New Project' : `Edit: ${project?.name}`}
          </h2>
          <p className="text-sm text-gray-400 mt-1">Manage project details and gallery</p>
        </div>
      </div>

      <ProjectEditorForm project={project || { id: 'new', status: 'DRAFT', images: [] }} />
    </div>
  )
}
