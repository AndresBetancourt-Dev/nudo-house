"use server";

import { Resend } from "resend";
import ConsultationReceived from "@/emails/consultation-received";
import NewConsultation from "@/emails/new-consultation";
import { parseRequest } from "@/lib/consultation";
import { FORM_SENDER, STUDIO_EMAIL } from "@/lib/site";

// Returns whether the studio received the request; on false the form offers to send it by email instead.
export async function submitConsultation(input: unknown, honeypot: unknown): Promise<boolean> {
  // Only bots fill the hidden field; tell them it worked so they learn nothing.
  if (honeypot) return true;

  const request = parseRequest(input);
  if (!request) return false;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("submitConsultation: RESEND_API_KEY is not set");
    return false;
  }
  const resend = new Resend(apiKey);

  const studio = await resend.emails.send({
    from: `NUDO Concierge <${FORM_SENDER}>`,
    to: STUDIO_EMAIL,
    replyTo: request.email,
    subject: `Consultation request — ${request.brand}`,
    react: NewConsultation({ request }),
  });
  if (studio.error) {
    console.error("submitConsultation: studio email failed", studio.error);
    return false;
  }

  const client = await resend.emails.send({
    from: `NUDO <${STUDIO_EMAIL}>`,
    to: request.email,
    replyTo: STUDIO_EMAIL,
    subject: "Your request is with us",
    react: ConsultationReceived({ request }),
  });
  // The studio already has the request, so the visitor still sees it as received.
  if (client.error) console.error("submitConsultation: confirmation email failed", client.error);

  return true;
}
