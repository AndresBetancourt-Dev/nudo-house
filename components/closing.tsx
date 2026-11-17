import { INSTAGRAM_HANDLE, INSTAGRAM_URL, STUDIO_EMAIL } from "@/lib/site";
import { CopyButton } from "./copy-button";
import { Logo } from "./logo";
import { RequestLink } from "./request-link";

export function Closing() {
  return (
    <section className="band closing">
      <div className="wrap">
        <div className="meaning">
          <span className="ser">nudo</span>
          <span className="mono">naked &nbsp;·&nbsp; knot</span>
        </div>
        <h2>
          The finest brands begin <em>with a conversation.</em>
        </h2>
        <RequestLink variant="light" />
        <div className="contact-row">
          <div>
            <span className="mono">Write to us</span>
            <div className="val">{STUDIO_EMAIL}</div>
            <CopyButton className="copy" text={STUDIO_EMAIL} label="Copy address" />
          </div>
          <div>
            <span className="mono">Instagram</span>
            <a className="val" href={INSTAGRAM_URL} target="_blank" rel="noopener">
              {INSTAGRAM_HANDLE}
            </a>
          </div>
          <div>
            <span className="mono">Working</span>
            <div className="val">Worldwide, by appointment</div>
          </div>
        </div>
        <div className="sign">
          <Logo tone="noir" label="NUDO" />
          <span className="mono">© MMXXVI NUDO · Raw ideas, refined.</span>
        </div>
      </div>
    </section>
  );
}
