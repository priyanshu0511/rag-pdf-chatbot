import { LuMessageCircle, LuSparkles } from "react-icons/lu";

const QuestionSection = () => {
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
      >
        <LuSparkles />
        Ask Question
      </button>
    </div>
  );
};

export default QuestionSection;