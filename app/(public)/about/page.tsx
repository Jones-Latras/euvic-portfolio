import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Download } from 'lucide-react'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { getAboutData } from '@/lib/data'

export const revalidate = 3600

export const metadata = {
  title: 'About',
  description: 'Background, education, and skills for the architectural drafting portfolio.',
}

export default async function AboutPage() {
  const { about, education, skills } = await getAboutData()
  const groupedSkills = skills.reduce<Record<string, typeof skills>>((groups, skill) => {
    groups[skill.category] = groups[skill.category] || []
    groups[skill.category].push(skill)
    return groups
  }, {})

  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[24rem_1fr]">
        <div className="space-y-5">
          <div className="relative h-[200px] w-[200px] overflow-hidden rounded-full bg-slate-200">
            <Image
              src={about.photo_url || 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=1200&q=75'}
              alt="Portfolio owner portrait"
              fill
              sizes="200px"
              className="object-cover"
              quality={75}
            />
          </div>
          {about.cv_url ? (
            <ButtonLink href={about.cv_url} className="w-full gap-2">
              <Download aria-hidden="true" size={16} />
              Download CV
            </ButtonLink>
          ) : null}
        </div>
        <div className="space-y-12">
          <div className="space-y-4">
            <p className="font-mono text-xs uppercase tracking-wide text-[var(--muted)]">
              About
            </p>
            <h1 className="text-4xl font-semibold leading-tight">Profile</h1>
            <div className="max-w-prose text-base leading-relaxed text-[var(--muted)]">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{about.bio || ''}</ReactMarkdown>
            </div>
          </div>
          <section className="space-y-5">
            <h2 className="text-2xl font-semibold">Education</h2>
            <div className="space-y-3">
              {education.map((item) => (
                <div key={item.id} className="border border-[var(--border)] bg-[var(--surface)] p-5">
                  <p className="font-semibold">{item.institution}</p>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">
                    {item.program} · {item.start_year} - {item.end_year || 'Present'}
                  </p>
                </div>
              ))}
            </div>
          </section>
          <section className="space-y-5">
            <h2 className="text-2xl font-semibold">Skills</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {Object.entries(groupedSkills).map(([category, items]) => (
                <div key={category} className="border border-[var(--border)] bg-[var(--surface)] p-5">
                  <h3 className="font-semibold">{category}</h3>
                  <div className="mt-4 space-y-3">
                    {items.map((skill) => (
                      <div key={skill.id} className="space-y-2">
                        <div className="flex items-center justify-between gap-3 text-sm">
                          <span>{skill.name}</span>
                          <span className="font-mono text-xs text-[var(--muted)]">
                            {skill.level || 0}/5
                          </span>
                        </div>
                        <div className="h-2 bg-slate-200 dark:bg-slate-700">
                          <div
                            className="h-full bg-accent dark:bg-slate-300"
                            style={{ width: `${((skill.level || 0) / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </section>
  )
}
