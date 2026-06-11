import type { AnalysisReport, HeaderCategory } from "@/lib/headers/types";
import { HeaderRow } from "./HeaderRow";

const TITLES: Record<HeaderCategory, string> = {
  critical: "Críticos",
  recommended: "Recomendados",
  informational: "Informativos",
};

export function ReportView({ report }: { report: AnalysisReport }) {
  const cats: HeaderCategory[] = ["critical", "recommended", "informational"];
  return (
    <div className="space-y-8">
      {cats.map((c) => {
        const items = report.findings.filter((f) => f.category === c);
        if (!items.length) return null;
        return (
          <section key={c}>
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <span className="inline-block size-2 rounded-full bg-primary" /> {TITLES[c]}
            </h2>
            <div className="space-y-3">
              {items.map((f) => <HeaderRow key={f.name} f={f} />)}
            </div>
          </section>
        );
      })}
    </div>
  );
}