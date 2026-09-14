// A beat between two sections: a line that says why the next one exists, and a
// cue that the page keeps going. Purely presentational — the rule draws itself
// in on reveal, using the same [data-reveal] pass the sections use.
export default function ScrollHook({ eyebrow, line }: { eyebrow: string; line: string }) {
  return (
    <div className="scroll-hook" data-reveal="1">
      <span className="scroll-hook-rule" aria-hidden="true" />
      <span className="scroll-hook-eyebrow">{eyebrow}</span>
      <p>{line}</p>
      <span className="scroll-hook-cue" aria-hidden="true" />
    </div>
  )
}
