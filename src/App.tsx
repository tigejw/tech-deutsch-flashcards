import './App.css'
import { LessonSelector } from './components/lessonSelector'
import { moduleSummaries } from './data/vocab'
function doFUckall(){}
function App() {
  return (
    <>
    <LessonSelector modules={moduleSummaries} onStart={doFUckall}/>
    </>
  )
}

export default App
