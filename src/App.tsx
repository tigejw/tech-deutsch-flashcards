import { LessonSelector } from './components/LessonSelector.tsx'
import { moduleSummaries } from './data/vocab'

function App() {
  return (
    <>
    <LessonSelector modules={moduleSummaries}/>
    </>
  )
}

export default App
