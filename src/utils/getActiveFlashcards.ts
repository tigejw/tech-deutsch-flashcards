import type { ModuleList, ActiveModuleSummary, Flashcard } from '../../src/types/vocab';

export function getActiveFlashcards(
    modules: ModuleList[],
    activeSummaries: ActiveModuleSummary[]
): Flashcard[] {
    let activeFlashcards: Flashcard[] = [];
    for (const module of activeSummaries) {
        const fullModule = modules.find(m => m.moduleId === module.moduleId);
        if (!fullModule) continue;

        for (const lesson of module.lessons) {
            if (!lesson.active) continue;
            const fullLesson = fullModule.lessons.find(l => l.lessonId === lesson.lessonId);
            if (!fullLesson) continue;
            activeFlashcards.push(...fullLesson.flashcards);
        }
    }
    return activeFlashcards;
}