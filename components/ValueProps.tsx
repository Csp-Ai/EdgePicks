export default function ValueProps() {
  const items = [
    {
      title: "Transparent agents",
      description: "Every decision traced to its source.",
    },
    {
      title: "Evidence-linked picks",
      description: "Tap into the rationale behind every pick.",
    },
    {
      title: "Live accuracy",
      description: "Performance metrics update in real time.",
    },
  ];
  return (
    <section className="grid gap-8 py-12 md:grid-cols-3">
      {items.map((item) => (
        <div key={item.title} className="text-center">
          <h3 className="text-xl font-semibold">{item.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
        </div>
      ))}
    </section>
  );
}
