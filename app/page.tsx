import prisma from '@/lib/prisma'
import HomepageClient from './HomepageClient'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const pageContent = await prisma.pageContent.findUnique({
    where: { route: 'home' }
  })

  // Default fallback content if none exists in DB
  const defaultContent = {
    heroCopy: "Silence & Form",
    content: {
      heroSubheadline: "Japanese minimalism meets brutalist architecture. Crafting spaces that breathe.",
      aiHeadline: "Intelligent Curation",
      aiBody: "Upload a photo of your space and our spatial intelligence will analyze the DNA of your room to recommend the perfect brutalist pieces.",
      studioHeadline: "The Philosophy",
      studioBody: "We believe that space shapes thought. By stripping away the unnecessary and embracing raw materials, we create environments that foster clarity and calm."
    }
  }

  const content = pageContent || defaultContent

  return <HomepageClient pageContent={content} />
}
