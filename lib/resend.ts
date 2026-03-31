import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export const EMAIL_FROM = process.env.EMAIL_FROM ?? "noreply@seasonx.com";

export async function sendVerificationApprovedEmail(
  email: string,
  name: string
) {
  await resend.emails.send({
    from: EMAIL_FROM,
    to: email,
    subject: "You're verified on SeasonX! 🎉",
    html: `
      <h1>Welcome to SeasonX, ${name}!</h1>
      <p>Your Season Ticket Holder verification has been <strong>approved</strong>.</p>
      <p>You can now create listings and start selling your tickets.</p>
      <p>Reminder: Your $50/month subscription gives you unlimited listings with 0% seller fees.</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/seller/dashboard">Go to your Seller Dashboard</a></p>
    `,
  });
}

export async function sendVerificationRejectedEmail(
  email: string,
  name: string,
  reason?: string
) {
  await resend.emails.send({
    from: EMAIL_FROM,
    to: email,
    subject: "SeasonX Verification Update",
    html: `
      <h1>Hi ${name},</h1>
      <p>Unfortunately, your Season Ticket Holder verification was not approved at this time.</p>
      ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ""}
      <p>You can re-apply by submitting updated documentation.</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/seller/verify">Re-apply here</a></p>
    `,
  });
}

export async function sendTicketTransferEmail(
  buyerEmail: string,
  buyerName: string,
  eventName: string,
  downloadUrl: string
) {
  await resend.emails.send({
    from: EMAIL_FROM,
    to: buyerEmail,
    subject: `Your tickets for ${eventName} are ready`,
    html: `
      <h1>Hi ${buyerName}, your tickets are ready!</h1>
      <p>Your tickets for <strong>${eventName}</strong> have been transferred by the seller.</p>
      <p><a href="${downloadUrl}">Access your tickets here</a></p>
      <p>If you have any issues, please contact support.</p>
    `,
  });
}
