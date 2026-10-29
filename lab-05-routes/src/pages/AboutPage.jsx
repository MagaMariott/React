const facts = [
  {
    title: "The project",
    text: "Sign routes is a catalog of road signs. The list, each sign, and the dashboard are separate addresses. The records come from a simulated API with delay, errors, and local storage.",
  },
  {
    title: "Now",
    text: "Temirlan Satybaldy, fourth-year student at KBTU. This semester covers React, including routing and how a page is split into layouts.",
  },
  {
    title: "Before this",
    text: "Coursework in web development, iOS, and a computer-vision project on detecting road signs and traffic lights.",
  },
];

export default function AboutPage() {
  return (
    <section>
      <p className="eyebrow">About</p>
      <h1>A catalog with an address for every screen</h1>
      <div className="about-grid">
        {facts.map((fact) => (
          <article key={fact.title}>
            <h2>{fact.title}</h2>
            <p>{fact.text}</p>
          </article>
        ))}
      </div>
      <p>
        GitHub: <a href="https://github.com/MagaMariott">MagaMariott</a>
      </p>
    </section>
  );
}
