const steps = [
  {
    title: "Discover",
    body: "Stakeholder interviews, user research, and competitive audits to surface real constraints and opportunities.",
  },
  {
    title: "Define",
    body: "Problem framing, personas, journey maps, and success metrics that keep the team aligned.",
  },
  {
    title: "Design",
    body: "Flows, wireframes, and high-fidelity UI — iterated with prototypes and usability feedback.",
  },
  {
    title: "Deliver",
    body: "Design systems, specs, and collaboration with engineering so craft survives into production.",
  },
];

export function ProcessSection() {
  return (
    <section id="process" className="scroll-mt-20 border-y border-border bg-muted/20 section-pad">
      <div className="container-page">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Process
        </p>
        <h2 className="display-title mt-2 text-3xl font-semibold sm:text-4xl">
          How I work
        </h2>
        <p className="mt-3 max-w-xl text-muted-foreground">
          A clear, repeatable methodology — flexible enough for startups, rigorous
          enough for product teams.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div key={step.title} className="relative">
              <p className="display-title text-4xl font-semibold text-primary/40">
                0{i + 1}
              </p>
              <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
