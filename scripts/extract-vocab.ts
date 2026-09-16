import fs from "fs"
import { PDFExtract } from 'pdf.js-extract';
const pdfExtract = new PDFExtract();

type Flashcard = {
    id: string;
    module: number;
    lesson: number;
    de: string;
    en: string;
}

type LessonList = {
    flashcards: Flashcard[]
    lessonTitle: string;
    lessonNumber: number;
    moduleId: number;
}

type ModuleList = {
    moduleTitle: string;
    moduleId: number;
    lessons: LessonList[]
}

type FileNames = string[]

async function extractPDF(fileName: string): Promise<ModuleList> {
    const data = await pdfExtract.extract(`./scripts/vocab-lists/${fileName}`, { normalizeWhitespace: true });
    const fullText = data.pages
        .map(page => page.content.map(item => item.str).join(' '))
        .join('\n\n');
    //module
    const moduleMatch = fullText.match(/Modul\s+(\d+)/);
    const moduleId = moduleMatch ? Number(moduleMatch[1]) : 0;
    if (!moduleMatch) console.warn(`Could not find module number in ${fileName}`)

    const moduleTitleMatch = fullText.match(/Modul\s+\d+:\s*(.*?)(?=\s*Lektion\s+\d+:)/s);
    const moduleTitle = moduleTitleMatch ? moduleTitleMatch[1].trim() : '';
    if (!moduleTitle) console.warn(`No module title found for Modul ${moduleId} (may genuinely have none)`);
    //lesson
    const lessonChunks = fullText.split(/(?=Lektion\s+\d+:)/g).slice(1)

    const lessons: LessonList[] = lessonChunks.map((chunk) => {
        const preprocessedChunk = moduleId === 7 ? protectQuotedSpans(chunk) : chunk;
        const segments = preprocessedChunk.split(/\s{2,}/).map(s => s.trim()).filter(Boolean);

        const headerMatch = segments[0]?.match(/Lektion\s+(\d+):\s*(.*)/);
        const lessonNumber = headerMatch ? Number(headerMatch[1]) : 0;
        const lessonTitle = headerMatch ? headerMatch[2].trim() : '';
        if (!headerMatch) console.warn(`Could not parse lesson header:`, segments[0]);

        const entrySegments = segments.slice(1).filter(s => s !== '•' && s.length > 1);
        const flashcards: Flashcard[] = entrySegments
            .map((entry, i): Flashcard | null => {
                const cleaned = entry.replace(/^•\s*/, ''); 
                const [de, en] = cleaned.split('=').map(s => s?.trim());
                if (!de || !en) {
                    console.warn(`Skipping malformed entry in Modul ${moduleId} Lektion ${lessonNumber}:`, entry);
                    return null;
                }
                return {
                    id: `m${moduleId}-l${lessonNumber}-${String(i).padStart(3, '0')}`,
                    module: moduleId,
                    lesson: lessonNumber,
                    de,
                    en,
                };
            })
            .filter((card): card is Flashcard => card !== null);

        return { flashcards, lessonTitle, lessonNumber, moduleId };
    });

    return { moduleTitle, moduleId, lessons };
}
extractPDF("Modul+7+Vokabular.pdf").then((res) => {
})

function protectQuotedSpans(text: string): string {
    return text.replace(/„[^"„“]*“\s*=\s*"[^"]*"/g, match => match.replace(/\s{2,}/g, ' '));
}

const fileNames: FileNames = fs.readdirSync("./scripts/vocab-lists")
const modulePromises = fileNames.map((fileName) => {
    return extractPDF(fileName)
})
Promise.all(modulePromises).then((res) => {
    const sorted = res.sort((a, b) => a.moduleId - b.moduleId);

    const outputPath = "./scripts/vocab-lists-output.json";
    fs.writeFileSync(outputPath, JSON.stringify(sorted, null, 2), "utf-8");

    const totalCards = sorted.reduce(
        (sum, mod) => sum + mod.lessons.reduce((s, l) => s + l.flashcards.length, 0),
        0
    );
    console.log(`Saved ${sorted.length} modules, ${totalCards} flashcards total → ${outputPath}`);
})
