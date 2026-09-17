export type Flashcard = {
    id: string;
    module: number;
    lesson: number;
    de: string;
    en: string;
}

export type LessonList = {
    flashcards: Flashcard[]
    lessonTitle: string;
    lessonId: number;
    moduleId: number;
}

export type ModuleList = {
    moduleTitle: string;
    moduleId: number;
    lessons: LessonList[]
}
export type LessonSummary = {
    lessonId: number;
    lessonTitle: string;
}

export type ModuleSummary = {
    moduleTitle: string;
    moduleId: number;
    lessons: LessonSummary[]
}

export interface ActiveLessonSummary extends LessonSummary {
    active: boolean;
}

export interface ActiveModuleSummary extends ModuleSummary {
    active: boolean;
    lessons: ActiveLessonSummary[]
}
