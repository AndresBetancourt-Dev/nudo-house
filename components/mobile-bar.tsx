"use client";

import { useEffect, useState } from "react";

// Phone-only invitation, shown once the opening has scrolled away and hidden again at the form.
export function MobileBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const opening = document.getElementById("opening");
    const request = document.getElementById("request");
    if (!opening || !request) return;

    let inOpening = true;
    let inRequest = false;
    const update = () => setVisible(!inOpening && !inRequest);

    const openingObserver = new IntersectionObserver(
      ([entry]) => {
        inOpening = entry.isIntersecting;
        update();
      },
      { threshold: 0.2 },
    );
    const requestObserver = new IntersectionObserver(
      ([entry]) => {
        inRequest = entry.isIntersecting;
        update();
      },
      { threshold: 0.05 },
    );
    openingObserver.observe(opening);
    requestObserver.observe(request);

    return () => {
      openingObserver.disconnect();
      requestObserver.disconnect();
    };
  }, []);

  return (
    <div className={visible ? "mbar show" : "mbar"} inert={!visible}>
      <span className="t">By private consultation.</span>
      <a href="#request" aria-label="Request a consultation">
        Request
      </a>
    </div>
  );
}
