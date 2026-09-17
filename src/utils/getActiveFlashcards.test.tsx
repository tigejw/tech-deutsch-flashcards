import { describe, it, expect } from 'vitest';
import { getActiveFlashcards } from './getActiveFlashcards';
import type { ModuleList, ActiveModuleSummary, Flashcard } from '../../src/types/vocab';

const card = (id: string, module: number, lesson: number): Flashcard => ({
  id,
  module,
  lesson,
  de: `de-${id}`,
  en: `en-${id}`,
});

const mockModules: ModuleList[] = [
  {
    moduleId: 1,
    moduleTitle: 'Module 1',
    lessons: [
      {
        lessonId: 1,
        lessonTitle: 'Lesson 1',
        moduleId: 1,
        flashcards: [card('1a', 1, 1), card('1b', 1, 1)],
      },
      {
        lessonId: 2,
        lessonTitle: 'Lesson 2',
        moduleId: 1,
        flashcards: [card('2a', 1, 2)],
      },
    ],
  },
  {
    moduleId: 2,
    moduleTitle: 'Module 2',
    lessons: [
      {
        lessonId: 3,
        lessonTitle: 'Lesson 3',
        moduleId: 2,
        flashcards: [card('3a', 2, 3)],
      },
    ],
  },
];

describe('getActiveFlashcards', () => {
  it('returns flashcards only from active lessons within active modules', () => {
    const activeSummaries: ActiveModuleSummary[] = [
      {
        moduleId: 1,
        moduleTitle: 'Module 1',
        active: false,
        lessons: [
          { lessonId: 1, lessonTitle: 'Lesson 1', active: true },
          { lessonId: 2, lessonTitle: 'Lesson 2', active: false },
        ],
      },
      {
        moduleId: 2,
        moduleTitle: 'Module 2',
        active: true,
        lessons: [
          { lessonId: 3, lessonTitle: 'Lesson 3', active: true },
        ],
      },
    ];

    const result = getActiveFlashcards(mockModules, activeSummaries);

    expect(result).toHaveLength(3);
    expect(result.map(c => c.id)).toEqual(['1a', '1b', "3a"]);
  });

  it('returns an empty array when no modules are active', () => {
    const activeSummaries: ActiveModuleSummary[] = [
      {
        moduleId: 1,
        moduleTitle: 'Module 1',
        active: false,
        lessons: [{ lessonId: 1, lessonTitle: 'Lesson 1', active: false }],
      },
    ];

    expect(getActiveFlashcards(mockModules, activeSummaries)).toEqual([]);
  });

  it('returns an empty array when activeSummaries is empty', () => {
    expect(getActiveFlashcards(mockModules, [])).toEqual([]);
  });

  it('skips if a module/lesson in activeSummaries has no match in modules', () => {
    const activeSummaries: ActiveModuleSummary[] = [
      {
        moduleId: 9999, 
        moduleTitle: 'Deutsch Ende',
        active: true,
        lessons: [{ lessonId: 1, lessonTitle: 'Deutsch endlich fertig', active: true }],
      },
    ];

    expect(getActiveFlashcards(mockModules, activeSummaries)).toEqual([]);
  });

  it('collects flashcards across multiple active modules', () => {
    const activeSummaries: ActiveModuleSummary[] = [
      {
        moduleId: 1,
        moduleTitle: 'Module 1',
        active: true,
        lessons: [{ lessonId: 2, lessonTitle: 'Lesson 2', active: true }],
      },
      {
        moduleId: 2,
        moduleTitle: 'Module 2',
        active: true,
        lessons: [{ lessonId: 3, lessonTitle: 'Lesson 3', active: true }],
      },
    ];

    const result = getActiveFlashcards(mockModules, activeSummaries);

    expect(result.map(c => c.id).sort()).toEqual(['2a', '3a']);
  });
});