/**
 * Tools, matched to what the CV actually names (skills line + each project's
 * "Tools Used"). `icon` keys into the inlined brand marks in
 * `components/ui/ToolIcon.tsx` — add the mark there first when adding a tool.
 */

export type ToolIconId = 'figma' | 'adobe-xd' | 'sketch' | 'framer' | 'adobe-photoshop' | 'miro'

export type Tool = {
  name: string
  icon: ToolIconId
  category: 'Design' | 'Build' | 'Workflow'
}

export const tools: Tool[] = [
  { name: 'Figma', icon: 'figma', category: 'Design' },
  { name: 'Adobe XD', icon: 'adobe-xd', category: 'Design' },
  { name: 'Sketch', icon: 'sketch', category: 'Design' },
  { name: 'Framer', icon: 'framer', category: 'Design' },
  { name: 'Adobe Photoshop', icon: 'adobe-photoshop', category: 'Design' },
  { name: 'Miro', icon: 'miro', category: 'Workflow' },
]
