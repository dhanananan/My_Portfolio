import { tools } from '@/data/tools'
import { Reveal } from '@/components/ui/Reveal'
import { ToolIcon } from '@/components/ui/ToolIcon'

/**
 * Tools — a compact index with each tool's real mark. Kept as a single row of
 * small chips rather than a logo wall: icon and name together, at text size,
 * so it reads as a list of what's used, not a wall of sponsors.
 */
export function ToolsSection() {
  return (
    <section className="border-t border-border py-16 sm:py-20" aria-labelledby="tools-heading">
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-12">
          <Reveal className="lg:col-span-3" y={16}>
            <h2 id="tools-heading" className="eyebrow">
              Tools I work in
            </h2>
          </Reveal>

          <Reveal className="lg:col-span-9" delay={60} y={16}>
            <ul className="flex flex-wrap gap-2.5">
              {tools.map((tool) => (
                <li key={tool.name}>
                  <span className="group flex items-center gap-3 rounded-full border border-border py-2.5 pl-3.5 pr-5 transition-[border-color,transform] duration-300 ease-out-expo hover:-translate-y-0.5 hover:border-border-strong">
                    {/* A fixed 24px slot every mark scales to fit: the tall
                        Figma / Framer marks and the square Adobe / Miro tiles
                        all sit on the same optical size and baseline. */}
                    <span className="flex size-6 shrink-0 items-center justify-center text-foreground">
                      <ToolIcon
                        id={tool.icon}
                        className="transition-transform duration-500 ease-out-expo group-hover:scale-110"
                      />
                    </span>
                    <span className="text-small text-muted transition-colors duration-300 group-hover:text-foreground">
                      {tool.name}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
