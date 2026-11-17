import { RequestLink } from "./request-link";

export function Manifesto() {
  return (
    <section className="band lacquer" aria-labelledby="manifesto-label">
      <div className="wrap">
        <span className="mono" id="manifesto-label">
          Manifesto
        </span>
        <blockquote>
          <span>Remove what is unnecessary.</span>
          <span>Keep what is true.</span>
        </blockquote>
        <div className="foot">
          <p>
            Make it unforgettable. Build it to endure. Four lines we hold every
            commission to.
          </p>
          <RequestLink variant="light" />
        </div>
      </div>
    </section>
  );
}
