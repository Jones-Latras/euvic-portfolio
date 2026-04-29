export const PROJECT_CATEGORIES = [
  { value: 'floor-plan', label: 'Floor Plans' },
  { value: 'elevation', label: 'Elevations' },
  { value: '3d-render', label: '3D Renders' },
  { value: 'site-plan', label: 'Site Plans' },
  { value: 'conceptual', label: 'Conceptual Designs' },
] as const

export const PROJECT_TAGS = [
  'autocad',
  'revit',
  'sketchup',
  'hand-drawn',
  'residential',
  'commercial',
  'archicad',
  'adobe-suite',
] as const

export const CONTACT_SUBJECTS = [
  'Project Inquiry',
  'Drafting Request',
  '3D Visualization',
  'Academic Collaboration',
  'Job Opportunity',
  'General Message',
] as const

export const STORAGE_BUCKETS = {
  projectImages: 'project-images',
  projectPdfs: 'project-pdfs',
  profile: 'profile',
  siteAssets: 'site-assets',
} as const

export const GRID_ISR_SECONDS = {
  homepage: 3600,
  gallery: 1800,
  projectDetail: 1800,
  about: 3600,
} as const
