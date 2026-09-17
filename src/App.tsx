import { FlashcardList } from './components/FlashcardList.tsx';
import { LessonSelector } from './components/LessonSelector.tsx';
import { useLessonSelection } from './hooks/useLessonSelection';
import { moduleSummaries, vocabData } from './data/vocab';


function App() {
  const { activeModulesSummary, toggleLesson, toggleModule } = useLessonSelection(moduleSummaries);

  return (
    <>
      <LessonSelector modules={activeModulesSummary}
        onToggleLesson={toggleLesson}
        onToggleModule={toggleModule} />
      <FlashcardList modules={vocabData} activeSummaries={activeModulesSummary} />
    </>
  )
}

export default App
