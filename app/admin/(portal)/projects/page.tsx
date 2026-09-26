import prisma from '@/lib/prisma'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { updatedAt: 'desc' },
    include: {
      images: {
        where: { isCover: true },
        take: 1
      }
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-light tracking-wider text-white mb-2">Projects</h2>
          <p className="text-sm text-gray-400">Manage case studies and interior works</p>
        </div>
        <Link 
          href="/admin/projects/new"
          className="bg-[#C8A97E] hover:bg-[#b5956a] text-black px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Create Project
        </Link>
      </div>

      <div className="bg-[#1E1E1E] border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5 text-xs uppercase tracking-wider text-gray-400">
                <th className="px-6 py-4 font-medium">Project Title</th>
                <th className="px-6 py-4 font-medium">Location</th>
                <th className="px-6 py-4 font-medium">Year</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <Link href={`/admin/projects/${project.id}`} className="font-medium text-white hover:text-[#C8A97E] transition-colors">
                        {project.name}
                      </Link>
                      <span className="text-xs text-gray-500 mt-1">{project.category || 'Uncategorized'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {project.location || '-'}
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {project.year || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      project.status === 'PUBLISHED' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                      project.status === 'ARCHIVED' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                      'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                    }`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-gray-500 text-xs">
                    {new Date(project.updatedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              
              {projects.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No projects found. Create your first project to showcase your work.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
