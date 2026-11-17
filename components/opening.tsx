import { RequestLink } from "./request-link";

export function Opening() {
  return (
    <section className="band opening" id="opening">
      <div className="wrap">
        <div className="meaning">
          <span className="ser">nudo</span>
          <span className="mono">it. naked &nbsp;·&nbsp; es. knot</span>
        </div>
        <h1>
          Your brand, considered <em>personally.</em>
        </h1>
        <div className="lede">
          <p>
            NUDO is a private house for brand identity and digital presence. We
            work with few clients, and we begin every relationship the same way:
            by listening.
          </p>
          <div className="act">
            <RequestLink variant="solid" />
            <span className="mono">A founder replies personally</span>
          </div>
        </div>
      </div>
    </section>
  );
}
