"use client";

import { useEffect, useRef, useState } from "react";

export function CopyButton({
  text,
  label,
  className,
}: {
  text: string;
  label: string;
  className: string;
}) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("copied");
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setStatus("idle"), 1800);
    } catch {
      setStatus("failed");
    }
  }

  return (
    <>
      <button className={className} type="button" onClick={copy}>
        {status === "copied"
          ? "Copied"
          : status === "failed"
            ? "Select and copy the text"
            : label}
      </button>
      <span className="sr-only" role="status">
        {status === "copied" ? "Copied to clipboard" : ""}
      </span>
    </>
  );
}
