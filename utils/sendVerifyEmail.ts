import { EmailTemplate } from "@/app/components/resendEmailTemplate";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_EMAIL_API_KEY);


export async function sendEmail(email: string,
  username: string,
  verifyCode: string) {

  try {
    const { data, error } = await resend.emails.send({
      from: 'AnonVoice <patangevaishnav5@gmail.com>',
      to: email,
      subject: 'Verify your email',
      react: await EmailTemplate({username, type:"VERIFY", verifyCode}),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}