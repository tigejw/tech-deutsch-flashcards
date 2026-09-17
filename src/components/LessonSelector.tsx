import { useState } from "react";
import { useLessonSelection } from "../hooks/useLessonSelection";
import type { ModuleSummary } from "../types/vocab";

type LessonSelectorProps = {
  modules: ModuleSummary[];
};

export function LessonSelector({ modules }: LessonSelectorProps) {
  const { activeModulesSummary, toggleLesson, toggleModule } = useLessonSelection(modules);
  const [expandedModuleIds, setExpandedModuleIds] = useState<Set<number>>(new Set());

  const toggleExpanded = (moduleId: number) => {
    setExpandedModuleIds((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }
      return next;
    });
  };

  return (
    <ul>
      {activeModulesSummary.map((m) => {
        const isExpanded = expandedModuleIds.has(m.moduleId);
        const activeCount = m.lessons.filter((l) => l.active).length;

        return (
          <li key={m.moduleId}>
            <button type="button" onClick={() => toggleExpanded(m.moduleId)}>
              {isExpanded ? "▼" : "▶"}
            </button>

            <label>
              <input
                type="checkbox"
                checked={activeCount === m.lessons.length && m.lessons.length > 0}
                onChange={() => toggleModule(m.moduleId)}
              />
              {m.moduleTitle}
            </label>

            {isExpanded && (
              <ul>
                {m.lessons.map((l) => (
                  <li key={l.lessonId}>
                    <label>
                      <input
                        type="checkbox"
                        checked={l.active}
                        onChange={() => toggleLesson(m.moduleId, l.lessonId)}
                      />
                      {l.lessonTitle}
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
}