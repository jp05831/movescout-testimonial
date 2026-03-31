import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || "info@movescout.net";

  try {
    const { businessName, contactName, email, videoUrl, videoFilename } = await request.json();

    if (!businessName || !videoUrl) {
      return NextResponse.json(
        { error: "Business name and video are required" },
        { status: 400 }
      );
    }

    // Send email with video link
    const { error: emailError } = await resend.emails.send({
      from: "MoveScout Testimonials <onboarding@resend.dev>",
      to: NOTIFICATION_EMAIL,
      subject: `🎬 New Testimonial from ${businessName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px;">
          <h2 style="color: #1a1a1a;">🎬 New Video Testimonial!</h2>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px;"><strong>Business:</strong> ${businessName}</p>
            ${contactName ? `<p style="margin: 0 0 10px;"><strong>Contact:</strong> ${contactName}</p>` : ""}
            ${email ? `<p style="margin: 0 0 10px;"><strong>Email:</strong> ${email}</p>` : ""}
            <p style="margin: 0;"><strong>Submitted:</strong> ${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })}</p>
          </div>
          
          <div style="margin: 20px 0;">
            <a href="${videoUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
              📥 Download Video
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            File: ${videoFilename}<br>
            <a href="${videoUrl}" style="color: #2563eb;">${videoUrl}</a>
          </p>
        </div>
      `,
    });

    if (emailError) {
      console.error("Email error:", emailError);
      // Don't throw - video is uploaded, just log the email failure
      console.log("⚠️ Email failed but video uploaded successfully");
    } else {
      console.log(`✅ Testimonial received from: ${businessName}`);
      console.log(`   Email sent to: ${NOTIFICATION_EMAIL}`);
    }

    return NextResponse.json({ 
      success: true, 
      message: "Testimonial submitted successfully" 
    });
  } catch (error) {
    console.error("Error processing testimonial:", error);
    return NextResponse.json(
      { error: "Failed to process submission" },
      { status: 500 }
    );
  }
}
