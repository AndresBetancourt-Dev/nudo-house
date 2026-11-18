import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import type { CSSProperties, ReactNode } from "react";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, SITE_URL, STUDIO_EMAIL } from "../../lib/site";

// The site's palette as solid colours: several email clients ignore rgba borders and backgrounds.
export const color = {
  ivory: "#F8F6F1",
  sand: "#E9E4DA",
  noir: "#1E1717",
  rosso: "#CE1B17",
  nudo: "#C9A189",
  pietra: "#68625E",
  ink: "#4B4542",
  hair: "#DAD7D2",
};

// Apple Mail and iOS load the house serif; Gmail and Outlook fall back to Georgia and Courier.
export const font = {
  display: "'Instrument Serif', Georgia, 'Times New Roman', serif",
  body: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  mono: "'IBM Plex Mono', 'Courier New', Courier, monospace",
};

const fontFaces = `
@font-face { font-family: 'Instrument Serif'; font-style: normal; font-weight: 400; src: url(https://fonts.gstatic.com/s/instrumentserif/v5/jizBRFtNs2ka5fXjeivQ4LroWlx-6zUTjnTLgNs.woff2) format('woff2'); }
@font-face { font-family: 'Instrument Serif'; font-style: italic; font-weight: 400; src: url(https://fonts.gstatic.com/s/instrumentserif/v5/jizHRFtNs2ka5fXjeivQ4LroWlx-6zAjjH7Motmp5g.woff2) format('woff2'); }
@font-face { font-family: 'IBM Plex Mono'; font-style: normal; font-weight: 400; src: url(https://fonts.gstatic.com/s/ibmplexmono/v23/-F63fjptAgt5VM-kVkqdyU8n1i8q131nj-o.woff2) format('woff2'); }
`;

const gutter = "0 40px";

export function House({
  preview,
  footnote,
  contacts = true,
  children,
}: {
  preview: string;
  footnote: string;
  // The studio's own notifications skip the "write to us" details.
  contacts?: boolean;
  children: ReactNode;
}) {
  return (
    <Html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="x-apple-disable-message-reformatting" />
        <meta name="color-scheme" content="light only" />
        <meta name="supported-color-schemes" content="light only" />
        <style dangerouslySetInnerHTML={{ __html: fontFaces }} />
      </Head>
      <Preview>{preview}</Preview>
      <Body style={{ margin: 0, padding: "32px 0", backgroundColor: color.ivory, color: color.noir }}>
        <Container style={{ width: "100%", maxWidth: 600, backgroundColor: color.ivory }}>
          <Section style={{ padding: "8px 40px 48px" }}>
            <Img src={`${SITE_URL}/email/nudo-ivory.png`} width={120} height={34} alt="NUDO" />
          </Section>
          <Section style={{ padding: gutter }}>{children}</Section>
          <Section style={{ marginTop: 56, padding: "40px", backgroundColor: color.noir }}>
            <Img src={`${SITE_URL}/email/nudo-noir.png`} width={96} height={27} alt="NUDO" />
            {contacts && (
              <>
                <Text style={{ ...labelStyle, color: color.nudo, margin: "28px 0 6px" }}>Write to us</Text>
                <Link href={`mailto:${STUDIO_EMAIL}`} style={footerValue}>
                  {STUDIO_EMAIL}
                </Link>
                <Text style={{ ...labelStyle, color: color.nudo, margin: "20px 0 6px" }}>Instagram</Text>
                <Link href={INSTAGRAM_URL} style={footerValue}>
                  {INSTAGRAM_HANDLE}
                </Link>
                <Text style={{ ...labelStyle, color: color.nudo, margin: "20px 0 6px" }}>Working</Text>
                <Text style={{ ...footerValue, margin: 0 }}>Worldwide, by appointment</Text>
              </>
            )}
            <Text
              style={{
                fontFamily: font.body,
                fontSize: 12,
                lineHeight: "18px",
                color: color.nudo,
                margin: "32px 0 0",
              }}
            >
              {footnote}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const labelStyle: CSSProperties = {
  fontFamily: font.mono,
  fontSize: 10,
  lineHeight: "16px",
  letterSpacing: "0.24em",
  textTransform: "uppercase",
  color: color.pietra,
  margin: "0 0 14px",
};

const footerValue: CSSProperties = {
  fontFamily: font.display,
  fontSize: 22,
  lineHeight: "28px",
  color: "#F2F0EA",
  textDecoration: "none",
};

// A mono label led by the red square, as on the site.
export function Label({ children }: { children: ReactNode }) {
  return (
    <Text style={labelStyle}>
      <span
        style={{
          display: "inline-block",
          width: 7,
          height: 7,
          backgroundColor: color.rosso,
          marginRight: 12,
          verticalAlign: 1,
        }}
      />
      {children}
    </Text>
  );
}

export function Title({ children }: { children: ReactNode }) {
  return (
    <Heading
      as="h1"
      style={{
        fontFamily: font.display,
        fontWeight: 400,
        fontSize: 44,
        lineHeight: "46px",
        color: color.noir,
        margin: "0 0 20px",
      }}
    >
      {children}
    </Heading>
  );
}

export function Paragraph({ children }: { children: ReactNode }) {
  return (
    <Text
      style={{
        fontFamily: font.body,
        fontWeight: 300,
        fontSize: 16,
        lineHeight: "27px",
        color: color.ink,
        margin: "0 0 16px",
      }}
    >
      {children}
    </Text>
  );
}

export function Rule() {
  return <Hr style={{ border: "none", borderTop: `1px solid ${color.hair}`, margin: "36px 0" }} />;
}

// Label and value pairs separated by hairlines.
export function Answers({ rows }: { rows: [string, ReactNode][] }) {
  return (
    <Section>
      {rows.map(([label, value]) => (
        <Row key={label} style={{ borderTop: `1px solid ${color.hair}` }}>
          <Column style={{ width: "38%", padding: "12px 16px 12px 0", verticalAlign: "top" }}>
            <Text style={{ ...labelStyle, margin: 0, lineHeight: "24px" }}>{label}</Text>
          </Column>
          <Column style={{ padding: "12px 0", verticalAlign: "top" }}>
            <Text style={{ fontFamily: font.body, fontSize: 15, lineHeight: "24px", color: color.noir, margin: 0 }}>
              {value}
            </Text>
          </Column>
        </Row>
      ))}
    </Section>
  );
}

// The roman-numeral movements used on the site and in the confirmation.
export function NextSteps({ steps }: { steps: string[] }) {
  const numerals = ["i.", "ii.", "iii.", "iv."];
  return (
    <Section>
      {steps.map((step, index) => (
        <Row key={step} style={{ borderTop: `1px solid ${color.hair}` }}>
          <Column style={{ width: 44, padding: "14px 0", verticalAlign: "top" }}>
            <Text
              style={{
                fontFamily: font.display,
                fontStyle: "italic",
                fontSize: 24,
                lineHeight: "24px",
                color: color.rosso,
                margin: 0,
              }}
            >
              {numerals[index]}
            </Text>
          </Column>
          <Column style={{ padding: "14px 0", verticalAlign: "top" }}>
            <Text style={{ fontFamily: font.body, fontSize: 15, lineHeight: "24px", color: color.noir, margin: 0 }}>
              {step}
            </Text>
          </Column>
        </Row>
      ))}
    </Section>
  );
}
