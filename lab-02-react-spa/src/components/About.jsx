const facts = [
  {
    title: "Now",
    text: "Fourth-year student at KBTU. This semester I am learning React and how a page is actually put together from components.",
  },
  {
    title: "Before this",
    text: "Coursework in web development, iOS, and a computer-vision project on detecting road signs and traffic lights.",
  },
  {
    title: "How I work",
    text: "I would rather ship a small page that reads well than a large one that needs a tour. Names, states, and empty cases should be obvious.",
  },
];

export default function About() {
  return (
    <section className="about" id="about">
      <div className="section-title">
        <p className="eyebrow">About me</p>
        <h2>A short introduction</h2>
      </div>
      <div className="facts">
        {facts.map((fact) => (
          <article key={fact.title}>
            <h3>{fact.title}</h3>
            <p>{fact.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
