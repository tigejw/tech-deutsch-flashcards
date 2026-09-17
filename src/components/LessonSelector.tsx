import { useState } from "react";
import type { ActiveModuleSummary } from "../types/vocab";

type LessonSelectorProps = {
  modules: ActiveModuleSummary[];
  onToggleModule: (moduleId: number) => void;
  onToggleLesson: (moduleId: number, lessonId: number) => void;
};

export function LessonSelector({ modules, onToggleModule, onToggleLesson }: LessonSelectorProps) {
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
      {modules.map((m) => {
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
                onChange={() => onToggleModule(m.moduleId)}
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
                        onChange={() => onToggleLesson(m.moduleId, l.lessonId)}
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