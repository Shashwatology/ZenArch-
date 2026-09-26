'use server'

import { requireAdmin } from '@/lib/admin/auth'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function upsertProject(formData: FormData) {
  try {
    const { dbUser } = await requireAdmin()
    
    const id = formData.get('id') as string | null
    const name = formData.get('name') as string
    const slug = formData.get('slug') as string
    const location = formData.get('location') as string
    const category = formData.get('category') as string
    const year = parseInt(formData.get('year') as string) || new Date().getFullYear()
    const description = formData.get('description') as string
    const status = formData.get('status') as any

    const data = {
      name,
      slug,
      location,
      category,
      year,
      description,
      status
    }

    let project;
    
    if (id && id !== 'new') {
      project = await prisma.project.update({
        where: { id },
        data
      })
      await prisma.auditLog.create({
        data: {
          action: 'PROJECT_UPDATED',
          entityType: 'Project',
          entityId: project.id,
          userId: dbUser.id
        }
      })
    } else {
      project = await prisma.project.create({
        data
      })
      await prisma.auditLog.create({
        data: {
          action: 'PROJECT_CREATED',
          entityType: 'Project',
          entityId: project.id,
          userId: dbUser.id
        }
      })
    }

    if (status === 'PUBLISHED') {
      await prisma.auditLog.create({
        data: { action: 'PROJECT_PUBLISHED', entityType: 'Project', entityId: project.id, userId: dbUser.id }
      })
    } else if (status === 'ARCHIVED') {
      await prisma.auditLog.create({
        data: { action: 'PROJECT_UNPUBLISHED', entityType: 'Project', entityId: project.id, userId: dbUser.id }
      })
    }

    revalidatePath('/admin/projects')
    revalidatePath(`/admin/projects/${project.id}`)
    revalidatePath('/projects')
    
    return { success: true, project }
  } catch (error: any) {
    console.error('Project save error:', error)
    return { error: error.message || 'Failed to save project' }
  }
}
