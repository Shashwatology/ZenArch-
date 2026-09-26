'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin/auth'

export async function updateHomepageContent(formData: FormData) {
  try {
    const { dbUser } = await requireAdmin()

    const heroHeadline = formData.get('heroHeadline') as string
    const heroSubheadline = formData.get('heroSubheadline') as string
    
    const aiHeadline = formData.get('aiHeadline') as string
    const aiBody = formData.get('aiBody') as string
    
    const studioHeadline = formData.get('studioHeadline') as string
    const studioBody = formData.get('studioBody') as string

    const content = {
      heroSubheadline,
      aiHeadline,
      aiBody,
      studioHeadline,
      studioBody
    }

    const pageContent = await prisma.pageContent.upsert({
      where: { route: 'home' },
      update: {
        title: 'Homepage',
        heroCopy: heroHeadline,
        content: content as any,
        status: 'PUBLISHED'
      },
      create: {
        route: 'home',
        title: 'Homepage',
        heroCopy: heroHeadline,
        content: content as any,
        status: 'PUBLISHED'
      }
    })

    await prisma.auditLog.create({
      data: {
        action: 'CONTENT_UPDATED',
        entityType: 'PageContent',
        entityId: pageContent.id,
        userId: dbUser.id,
        after: JSON.stringify(content)
      }
    })

    revalidatePath('/')
    
    return { success: true }
  } catch (error: any) {
    console.error('Failed to update content:', error)
    return { error: error.message || 'Failed to update content.' }
  }
}
