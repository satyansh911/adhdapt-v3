import { Brain, Calendar } from "lucide-react";

export function Header() {
  return (
    <div className="text-center mb-12">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="p-3 bg-[#d04f99]/10 rounded-full">
          <Brain className="h-8 w-8 text-[#d04f99]" />
        </div>
        <Calendar className="h-8 w-8 text-[#d04f99]" />
      </div>

      <h1 className="text-4xl font-bold text-foreground mb-3">Focus Flow</h1>

      <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
        An AI-powered task scheduler designed for ADHD minds. Add your tasks and
        let AI create a balanced schedule with proper breaks.
      </p>
    </div>
  );
}
