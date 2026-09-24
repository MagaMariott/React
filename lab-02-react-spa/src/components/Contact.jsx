const contacts = [
  {
    label: "GitHub",
    value: "github.com/MagaMariott",
    href: "https://github.com/MagaMariott",
  },
  {
    label: "University",
    value: "KBTU, Almaty",
    href: "https://kbtu.edu.kz/",
  },
  {
    label: "Address",
    value: "Planet Earth",
  },
  {
    label: "Currently",
    value: "Happy to talk about course projects",
  },
];

export default function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="section-title">
        <p className="eyebrow">Contact</p>
        <h2>Where to find me</h2>
      </div>
      <ul>
        {contacts.map((item) => (
          <li key={item.label}>
            <span>{item.label}</span>
            {item.href ? (
              <a href={item.href} target="_blank" rel="noreferrer">
                {item.value}
              </a>
            ) : (
              <strong>{item.value}</strong>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
