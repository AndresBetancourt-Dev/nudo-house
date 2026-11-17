import { ConsultationForm } from "./consultation-form";

export function Consultation() {
  return (
    <section className="band request" id="request">
      <div className="wrap">
        <div className="req-grid">
          <div className="req-intro">
            <div className="mark mono">Request a consultation</div>
            <h2>
              Tell us a little about <em>you.</em>
            </h2>
            <p>
              Three short steps. A founder reads every request personally and
              writes back to arrange a twenty-minute conversation at a time that
              suits you.
            </p>
            <p className="sig">The founders of NUDO</p>
            <span className="mono">By private consultation</span>
          </div>
          <ConsultationForm />
        </div>
      </div>
    </section>
  );
}
