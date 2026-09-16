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
    lessonNumber: number;
    moduleId: number;
}

export type ModuleList = {
    moduleTitle: string;
    moduleId: number;
    lessons: LessonList[]
}