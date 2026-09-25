import prisma from '@/lib/prisma'
import { cache } from 'react'

export const getPublishedProjects = cache(async () => {
  return prisma.project.findMany({
    where: {
      status: 'PUBLISHED'
    },
    orderBy: { createdAt: 'desc' }
  })
})

export const getProjectBySlug = cache(async (slug: string) => {
  return prisma.project.findUnique({
    where: {
      slug,
      status: 'PUBLISHED'
    }
  })
})
