import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Download } from 'lucide-react'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { getAboutData, getSettings } from '@/lib/data'
import type { Skill } from '@/lib/supabase/types'

export const revalidate = 3600

export const metadata = {
  title: 'About',
  description: 'Background, education, and skills for the architectural drafting portfolio.',
  alternates: {
    canonical: '/about',
  },
}

const services = [
  {
    number: '01',
    title: 'Technical Drafting',
    description:
      'Clear floor plans, elevations, and coordinated drawing sets for residential and academic design studies.',
  },
  {
    number: '02',
    title: '3D Visualization',
    description:
      'SketchUp-based massing, render concepts, and spatial studies that communicate form, light, and material intent.',
  },
  {
    number: '03',
    title: 'Presentation Boards',
    description:
      'Clean visual layouts for coursework, concept studies, and architectural documentation packages.',
  },
]

const skillGroups = [
  {
    title: 'Drafting & Documentation',
    fallback: ['AutoCAD', 'Revit', 'Floor Plans', 'Elevations', 'Construction Drawings'],
    match: ['drafting', 'software', 'autocad', 'revit'],
  },
  {
    title: 'Visualization',
    fallback: ['SketchUp', '3D Renders', 'Presentation Boards', 'Material Studies'],
    match: ['design', 'presentation', 'sketchup', 'adobe'],
  },
  {
    title: 'Manual & Concept Work',
    fallback: ['Hand Drafting', 'Space Planning', 'Design Studies'],
    match: ['core', 'hand', 'concept'],
  },
]

export default async function AboutPage() {
  const [{ about, education, skills }, settings] = await Promise.all([getAboutData(), getSettings()])
  const name = settings.student_name || 'Euvic G. Abellano'
  const email = settings.email || 'you@email.com'
  const cvUrl = about.cv_url || settings.cv_url

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
      <div className="mx-auto max-w-7xl space-y-14">
        <section className="grid gap-8 lg:grid-cols-[20rem_minmax(0,1fr)] lg:gap-14">
          <ProfileCard
            name={name}
            email={email}
            photoUrl={about.photo_url}
            cvUrl={cvUrl || ''}
          />

          <div className="grid gap-8 lg:grid-cols-[1px_minmax(0,1fr)]">
            <div className="hidden bg-[var(--border)] lg:block" aria-hidden="true" />
            <div className="space-y-8">
              <div className="space-y-5">
                <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--muted)]">
                  <span>About / 02</span>
                  <span aria-hidden="true">/</span>
                  <span>Cagayan de Oro, PH</span>
                </div>
                <h1 className="max-w-4xl font-display text-4xl font-semibold leading-tight sm:text-5xl">
                  Designing clear technical drawings for thoughtful residential spaces.
                </h1>
                <div className="max-w-3xl text-base leading-relaxed text-[var(--muted)]">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{about.bio || ''}</ReactMarkdown>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {services.map((service) => (
                  <article
                    key={service.number}
                    className="rounded-xl border border-[var(--border)] bg-[var(--surface)]/75 p-5"
                  >
                    <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--muted)]">
                      {service.number}
                    </p>
                    <h2 className="mt-4 font-display text-xl font-semibold">{service.title}</h2>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                      {service.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[20rem_minmax(0,1fr)] lg:gap-14">
          <SectionKicker label="Credential" title="Education" />
          <div className="space-y-4">
            {education.map((item, index) => (
              <article
                key={item.id}
                className="grid gap-5 rounded-xl border border-[var(--border)] bg-[var(--surface)]/75 p-5 sm:grid-cols-[4rem_minmax(0,1fr)]"
              >
                <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--muted)]">
                  {String(index + 1).padStart(2, '0')} / Education
                </div>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-display text-2xl font-semibold">{item.institution}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">
                      {item.program} · {item.start_year} - {item.end_year || 'Present'}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['Floor Plans', 'Elevations', '3D Visualization', 'Technical Documentation'].map(
                      (focus) => (
                        <span
                          key={focus}
                          className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold text-[var(--muted)]"
                        >
                          {focus}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[20rem_minmax(0,1fr)] lg:gap-14">
          <SectionKicker label="Capability" title="Skills" />
          <div className="grid gap-4 md:grid-cols-3">
            {buildSkillGroups(skills).map((group) => (
              <article
                key={group.title}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)]/75 p-5"
              >
                <h3 className="font-display text-xl font-semibold">{group.title}</h3>
                <div className="mt-5 flex flex-wrap gap-2">
                  {group.items.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold text-[var(--muted)]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  )
}

function ProfileCard({
  name,
  email,
  photoUrl,
  cvUrl,
}: {
  name: string
  email: string
  photoUrl: string | null
  cvUrl: string
}) {
  return (
    <aside className="lg:sticky lg:top-28 lg:self-start">
      <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="relative aspect-[4/5] bg-slate-200">
          <Image
            src={
              photoUrl ||
              'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=1200&q=75'
            }
            alt={`${name} portrait`}
            fill
            sizes="(min-width: 1024px) 320px, 100vw"
            className="object-cover"
            quality={75}
          />
        </div>
        <div className="space-y-5 p-5">
          <div>
            <p className="font-display text-2xl font-semibold">{name}</p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--muted)]">
              Architectural Drafting Student
            </p>
          </div>
          <dl className="space-y-3 border-y border-[var(--border)] py-4 text-sm">
            <ProfileMeta label="Location" value="Cagayan de Oro, PH" />
            <ProfileMeta label="Focus" value="Drafting · Visualization · Presentation" />
            <ProfileMeta label="Email" value={email} />
          </dl>
          {cvUrl ? (
            <ButtonLink href={cvUrl} className="w-full gap-2">
              <Download aria-hidden="true" size={16} />
              Download CV
            </ButtonLink>
          ) : null}
        </div>
      </div>
    </aside>
  )
}

function ProfileMeta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--muted)]">
        {label}
      </dt>
      <dd className="mt-1 font-semibold">{value}</dd>
    </div>
  )
}

function SectionKicker({ label, title }: { label: string; title: string }) {
  return (
    <div className="space-y-2">
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--muted)]">
        {label}
      </p>
      <h2 className="font-display text-3xl font-semibold">{title}</h2>
    </div>
  )
}

function buildSkillGroups(skills: Skill[]) {
  return skillGroups.map((group) => {
    const matches = skills
      .filter((skill) => {
        const haystack = `${skill.category} ${skill.name} ${skill.icon_slug || ''}`.toLowerCase()
        return group.match.some((token) => haystack.includes(token))
      })
      .map((skill) => skill.name)

    return {
      title: group.title,
      items: Array.from(new Set([...matches, ...group.fallback])).slice(0, 6),
    }
  })
}
