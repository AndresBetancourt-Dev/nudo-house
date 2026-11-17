// The only invitation the brand makes, so every call to action is this link.
export function RequestLink({ variant }: { variant?: "solid" | "light" }) {
  return (
    <a className={variant ? `cta ${variant}` : "cta"} href="#request">
      Request a consultation <span className="arr" aria-hidden="true">→</span>
    </a>
  );
}
