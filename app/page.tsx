import { Care } from "@/components/care";
import { Closing } from "@/components/closing";
import { Concierge } from "@/components/concierge";
import { Consultation } from "@/components/consultation";
import { Manifesto } from "@/components/manifesto";
import { MobileBar } from "@/components/mobile-bar";
import { Opening } from "@/components/opening";
import { SiteHeader } from "@/components/site-header";
import { Story } from "@/components/story";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="top">
        <Opening />
        <Story />
        <Manifesto />
        <Care />
        <Concierge />
        <Consultation />
        <Closing />
      </main>
      <MobileBar />
    </>
  );
}
