import raw from "./vocab-lists-output.json" with { type: "json" }
import type { ModuleList } from "../types/vocab"

export const vocabData: ModuleList[] = raw

export const moduleSummaries = vocabData.map((module) => {
    return {
        moduleId: module.moduleId,
        moduleTitle: module.moduleTitle,
        lessons: module.lessons.map((lesson) => {
            return { lessonNumber: lesson.lessonNumber, lessonTItle: lesson.lessonTitle }
        })
    }
})
