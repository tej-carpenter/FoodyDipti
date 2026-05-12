import { getAdminEmails } from '@/lib/firebase';
import { NextRequest, NextResponse } from 'next/server';

type ContactPayload = {
  name?: string;
  contact?: string;
  message?: string;
};

function buildEmailContent(name: string, contact: string, message: string) {
  const escapedName = name.trim();
  const escapedContact = contact.trim();
  const escapedMessage = message.trim();

  return {
    subject: `New contact message from ${escapedName}`,
    text: [`Name: ${escapedName}`, `Contact: ${escapedContact}`, '', escapedMessage].join('\n'),
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f1f1f;">
        <h2 style="margin: 0 0 12px;">New contact message</h2>
        <p style="margin: 0 0 8px;"><strong>Name:</strong> ${escapedName}</p>
        <p style="margin: 0 0 8px;"><strong>Contact:</strong> ${escapedContact}</p>
        <p style="margin: 16px 0 8px;"><strong>Message:</strong></p>
        <div style="white-space: pre-wrap; padding: 16px; border-radius: 12px; background: #f8f5f0;">${escapedMessage}</div>
      </div>
    `,
  };
}

function isEmailAddress(value: string) {
  return /.+@.+\..+/.test(value);
}

async function sendAdminEmail(name: string, contact: string, message: string, adminEmails: string[]) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !fromEmail || adminEmails.length === 0) {
    return { status: 'skipped' as const, reason: 'Email service is not configured.' };
  }

  const emailContent = buildEmailContent(name, contact, message);
  const payload: Record<string, unknown> = {
    from: fromEmail,
    to: adminEmails,
    subject: emailContent.subject,
    text: emailContent.text,
    html: emailContent.html,
  };

  if (isEmailAddress(contact)) {
    payload.reply_to = contact.trim();
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Email provider rejected the message (${response.status}): ${errorBody}`);
  }

  return { status: 'sent' as const };
}

export async function POST(request: NextRequest) {
  try {
    const { name, contact, message } = (await request.json()) as ContactPayload;

    // Validation
    if (!name || !contact || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (name.trim().length < 2) {
      return NextResponse.json({ error: 'Name must be at least 2 characters' }, { status: 400 });
    }

    if (message.trim().length < 10) {
      return NextResponse.json({ error: 'Message must be at least 10 characters' }, { status: 400 });
    }

    const adminEmails = getAdminEmails();
    const trimmedName = name.trim();
    const trimmedContact = contact.trim();
    const trimmedMessage = message.trim();

    let emailStatus: 'sent' | 'skipped' | 'failed' = 'skipped';
    let emailError: string | undefined;

    try {
      const result = await sendAdminEmail(trimmedName, trimmedContact, trimmedMessage, adminEmails);
      emailStatus = result.status;
    } catch (error) {
      emailStatus = 'failed';
      emailError = error instanceof Error ? error.message : 'Failed to send notification email.';
      console.error('Contact email delivery failed:', error);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Contact message received. We will get back to you soon.',
        emailStatus,
        emailError,
        adminEmails,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to process contact form' },
      { status: 500 }
    );
  }
}
