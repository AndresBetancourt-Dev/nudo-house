import { Logo } from "./logo";

export function SiteHeader() {
  return (
    <header className="band site">
      <div className="wrap">
        <a className="home" href="#top" aria-label="NUDO, back to top">
          <Logo />
        </a>
        <a className="cta" href="#request" aria-label="Request a consultation">
          <span className="long">Request a consultation</span>
          <span className="short">Request</span>
          <span className="arr" aria-hidden="true">→</span>
        </a>
      </div>
    </header>
  );
}
