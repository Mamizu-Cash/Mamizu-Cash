import { CONSTANTS } from "../constants";

interface MailtoOptions {
  to?: string;
  subject?: string;
  body?: string;
  customBody?: string;
}

export function generateMailtoUrl(options: MailtoOptions = {}): string {
  const {
    to = CONSTANTS.EMAIL_CONFIG.TO,
    subject = CONSTANTS.EMAIL_CONFIG.SUBJECT,
    body = CONSTANTS.EMAIL_CONFIG.BODY_TEMPLATE,
    customBody,
  } = options;

  const params: string[] = [];

  if (subject) {
    params.push(`subject=${encodeURIComponent(subject)}`);
  }

  if (customBody || body) {
    params.push(`body=${encodeURIComponent(customBody || body)}`);
  }

  return `mailto:${to}?${params.join("&")}`;
}

export function generateBusinessVerificationEmailUrl(additionalInfo?: string): string {
  const body = additionalInfo
    ? `${CONSTANTS.EMAIL_CONFIG.BODY_TEMPLATE}\n\n${additionalInfo}`
    : CONSTANTS.EMAIL_CONFIG.BODY_TEMPLATE;

  return generateMailtoUrl({ body });
}

export function generateShareEmailUrl(content: string, subject?: string): string {
  return generateMailtoUrl({
    subject: subject || "[Mamizu-Cash] Shared Content",
    customBody: content,
  });
}
