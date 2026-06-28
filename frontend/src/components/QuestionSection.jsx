import { useState } from "react";
import { LuLoader, LuMessageCircle, LuSparkles } from "react-icons/lu";

const QuestionSection = () => {

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAsk=async()=>{
    if(!question.trim()){
      setError("Please enter a question");
      return;
    }
    setLoading(true);
    setError("");
    setAnswer("");
    try{
      const res=await fetch("http://localhost:5000/chat",{
        method:"POST",
        headers:{
          "Content-Type": "application/json"
        },
        body: JSON.stringify({question})
      });

      const data=await res.json();

      if(data.answer){
        setAnswer(data.answer);
      } else {
        setError(data.message || "Failed to get answer");
      }

  }
  catch(err){
    setError("An error occurred while fetching the answer");
  }finally{
    setLoading(false);
  }
}

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <h2 className="flex items-center gap-2 text-2xl font-semibold mb-6">
        <LuMessageCircle />
        Ask Questions
      </h2>

      <textarea
        placeholder="Ask a question about your uploaded documents..."
        className="
          w-full
          h-28
          resize-none
          rounded-xl
          border
          border-border
          bg-background
          p-4
          outline-none
          focus:ring-2
          focus:ring-ring
        "
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        disabled={loading}
      />

      <button
        className="
          mt-4
          w-full
          rounded-xl
          bg-primary
          text-primary-foreground
          py-3
          font-medium
          flex
          items-center
          justify-center
          gap-2
          hover:opacity-90
          transition
        "
        onClick={handleAsk}
        disabled={loading}
      >
        {loading ? <LuLoader className="animate-spin" /> : <LuSparkles />}
        {loading ? "Thinking..." : "Ask Question"}
      </button>

      {answer && (
        <div className="mt-6 p-4 rounded-xl bg-muted border border-border text-sm leading-relaxed">
          <p className="font-semibold text-muted-foreground mb-2">Answer</p>
          <p>{answer}</p>
        </div>
      )}

      {error && (
        <p className="mt-4 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default QuestionSection;