import { LuBrain } from "react-icons/lu"
import DarkModeToggle from "./components/DarkModeToggle"
import UploadSection from "./components/UploadSection"
import QuestionSection from "./components/QuestionSection"

function App() {

  return (
    <div className='bg-background h-screen text-foreground'>
  <div className="text-right h-1/12 flex justify-end items-end px-16">
    <DarkModeToggle />
  </div>

  <div className="flex items-center justify-center flex-col h-1/3 gap-4">
    <div className="p-5 rounded-3xl bg-card border-2 border-border text-6xl text-primary">
      <LuBrain />
    </div>

    <div className="flex items-center justify-center flex-col w-3/5 text-center gap-2">
      <h1 className="text-6xl font-bold text-foreground">
        Chat with PDF
      </h1>

      <p className="text-xl text-muted-foreground">
        Upload your documents and ask questions. Get intelligent answers powered by
        Retrieval-Augmented Generation technology.
      </p>
    </div>
  </div>
  <div className="max-w-5xl mx-auto px-6 pb-12 mt-10">
      <UploadSection />

      <div className="mt-8">
        <QuestionSection />
      </div>
    </div>
</div>
  )
}

export default App
