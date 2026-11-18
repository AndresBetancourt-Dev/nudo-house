import { Link, Text } from "@react-email/components";
import type { ReactNode } from "react";
import { describe, type ConsultationRequest } from "../lib/consultation";
import { Answers, House, Label, Paragraph, Rule, Title, color, font } from "./_components/house";

// "@handle" and bare names point to Instagram; anything with a dot is treated as a website.
function profileUrl(value: string) {
  if (/^https?:\/\//i.test(value)) return value;
  if (!value.startsWith("@") && value.includes(".")) return `https://${value}`;
  return `https://www.instagram.com/${value.replace(/^@/, "")}/`;
}

function linked(rows: [string, string][]): [string, ReactNode][] {
  return rows.map(([label, value]) => {
    if (label === "Email") return [label, <Link key={label} href={`mailto:${value}`} style={{ color: color.noir }}>{value}</Link>];
    if (label === "Website / Instagram") return [label, <Link key={label} href={profileUrl(value)} style={{ color: color.noir }}>{value}</Link>];
    return [label, value];
  });
}

// Sent to the studio. Its reply-to is the client, so replying writes to them directly.
export default function NewConsultation({ request }: { request: ConsultationRequest }) {
  const firstName = request.name.split(" ")[0];

  return (
    <House
      preview={`${request.name} would like to talk about ${request.brand}.`}
      footnote="Sent from the consultation form on nudo.house."
      contacts={false}
    >
      <Label>New consultation request</Label>
      <Title>{request.brand}</Title>
      <Paragraph>
        {request.name} would like to talk. Reply to this email to write to {firstName} directly.
      </Paragraph>

      <Rule />
      <Label>The commission</Label>
      <Answers rows={linked(describe(request, ["need", "scope", "start", "link"]))} />

      <Rule />
      <Label>How to reach them</Label>
      <Answers
        rows={linked(describe(request, ["name", "email", "phone", "contact", "days", "time", "timezone"]))}
      />

      {request.message && (
        <>
          <Rule />
          <Label>Their note</Label>
          <Text
            style={{
              fontFamily: font.body,
              fontSize: 15,
              lineHeight: "25px",
              color: color.noir,
              whiteSpace: "pre-wrap",
              backgroundColor: color.sand,
              padding: "18px 20px",
              margin: 0,
            }}
          >
            {request.message}
          </Text>
        </>
      )}
    </House>
  );
}

NewConsultation.PreviewProps = {
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
    message: "We are opening a second atelier in Madrid next spring.\nWe would love to begin before then.",
  },
} satisfies { request: ConsultationRequest };
