import { notFound } from 'next/navigation'
import { ProjectForm } from '@/components/admin/ProjectForm'
import { getAdminProjectById } from '@/lib/admin-data'

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const project = await getAdminProjectById(id)
  if (!project) notFound()

  return <ProjectForm projectId={project.id} initialProject={project} />
}
