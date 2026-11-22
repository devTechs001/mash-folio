import { getTechIcon } from '../utils/techIcons';

/**
 * Renders technology chips with their logos. `limit` hides the rest behind a
 * "+N" chip for compact card layouts.
 */
export default function TechChips({ tech = [], limit }) {
  const visible = limit ? tech.slice(0, limit) : tech;
  const hidden = limit ? tech.length - visible.length : 0;

  return (
    <div className="project-tech">
      {visible.map((name) => {
        const Icon = getTechIcon(name);

        return (
          <span className="chip" key={name}>
            <Icon aria-hidden="true" />
            {name}
          </span>
        );
      })}

      {hidden > 0 && <span className="chip chip-more">+{hidden}</span>}
    </div>
  );
}
