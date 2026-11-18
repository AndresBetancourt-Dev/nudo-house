import { Button, Section, Text } from "@react-email/components";
import { describe, type ConsultationRequest } from "../lib/consultation";
import { BOOKING_URL } from "../lib/site";
import { Answers, House, Label, NextSteps, Paragraph, Rule, Title, color, font } from "./_components/house";

// Sent to the client. It repeats only their name, brand and the form's fixed choices,
// so a stranger's address typed into the form cannot be sent arbitrary text or links.
export default function ConsultationReceived({ request }: { request: ConsultationRequest }) {
  const firstName = request.name.split(" ")[0];

  return (
    <House
      preview="A founder reads every request personally and will write to you to arrange your conversation."
      footnote="This message confirms a request made at nudo.house. If it was not you, no action is needed."
    >
      <Label>Request received</Label>
      <Title>Thank you, {firstName}.</Title>
      <Paragraph>
        Your request for {request.brand} is with us. A founder reads every request personally and
        writes back to arrange a twenty-minute conversation at a time that suits you.
      </Paragraph>

      <Rule />
      <Label>What happens next</Label>
      <NextSteps
        steps={[
          "A founder reads your request and looks at your brand.",
          "We write to you to arrange your conversation.",
          "After we talk, we write a proposal for your brand alone.",
        ]}
      />

      <Rule />
      <Label>What you told us</Label>
      <Answers rows={describe(request, ["need", "scope", "start", "contact", "days", "time"])} />

      {BOOKING_URL && (
        <Section style={{ marginTop: 32 }}>
          <Button
            href={BOOKING_URL}
            style={{
              backgroundColor: color.noir,
              color: "#F2F0EA",
              fontFamily: font.mono,
              fontSize: 11,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              padding: "18px 28px",
            }}
          >
            Choose your time →
          </Button>
        </Section>
      )}

      <Rule />
      <Paragraph>Should anything change, simply reply to this email.</Paragraph>
      <Text
        style={{
          fontFamily: font.display,
          fontStyle: "italic",
          fontSize: 24,
          lineHeight: "30px",
          color: color.noir,
          margin: "24px 0 0",
        }}
      >
        The founders of NUDO
      </Text>
    </House>
  );
}

ConsultationReceived.PreviewProps = {
  request: {
    need: ["A new brand identity", "A website or online boutique"],
    brand: "Maison Prova",
    link: "@maisonprova",
    scope: "A complete brand",
    start: "In the coming months",
    name: "Ada Lovelace",
    email: "ada@example.com",
    phone: "+57 300 000 0000",
    contact: "Video call",
    days: ["Tue", "Thu"],
    time: ["Morning"],
    timezone: "America/Bogota",
    message: "We are opening a second atelier in Madrid next spring.",
  },
} satisfies { request: ConsultationRequest };
