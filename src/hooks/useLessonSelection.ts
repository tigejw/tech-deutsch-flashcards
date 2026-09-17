import { useState, useCallback } from "react";
import type { ActiveModuleSummary, ModuleSummary } from "../types/vocab";

function buildInitialSelection(modules: ModuleSummary[]): ActiveModuleSummary[] {
    return modules.map((m) => {
        const updatedLessons = m.lessons.map((l) => ({ ...l, active: false }));
        return { ...m, lessons: updatedLessons, active: false };
    });
}

export function useLessonSelection(modules: ModuleSummary[]) {
    const [activeModulesSummary, setActiveModulesSummary] = useState<ActiveModuleSummary[]>(
        () => buildInitialSelection(modules)
    );

    const toggleLesson = useCallback((moduleId: number, lessonId: number) => {
        setActiveModulesSummary((prev) =>
            prev.map((m) => {
                if (m.moduleId !== moduleId) return m;

                const updatedLessons = m.lessons.map((l) =>
                    l.lessonId === lessonId ? { ...l, active: !l.active } : l
                );

                return { ...m, lessons: updatedLessons };
            })
        );
    }, []);

    const toggleModule = useCallback((moduleId: number) => {
        setActiveModulesSummary((prev) =>
            prev.map((m) => {
                if (m.moduleId !== moduleId) return m;

                const anyInactive = m.lessons.some((l) => !l.active);
                const nextActive = anyInactive; // if any inactive, turn all on; else turn all off

                const updatedLessons = m.lessons.map((l) => ({ ...l, active: nextActive }));

                return { ...m, lessons: updatedLessons, active: nextActive };
            })
        );
    }, []);

    return {
        activeModulesSummary, toggleLesson, toggleModule
    };
}