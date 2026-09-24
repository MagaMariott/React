export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-copy">
        <p className="eyebrow">KBTU · Course 4</p>
        <h1>Temirlan Satybaldy</h1>
        <p className="lead">
          I study at the Kazakh-British Technical University in Almaty and I
          like software that is clear to use: web interfaces, small products,
          and the occasional computer-vision experiment.
        </p>
      </div>
      <figure className="portrait">
        <img src={`${import.meta.env.BASE_URL}myimage.JPG`} alt="Temirlan Satybaldy" />
        <figcaption>Almaty, somewhere between a lecture and a stage light.</figcaption>
      </figure>
    </section>
  );
}
