import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const resend = new Resend(process.env.RESEND_API_KEY);
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || "info@movescout.net";
const MAX_ATTACHMENT_SIZE = 25 * 1024 * 1024; // 25MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const businessName = formData.get("businessName") as string;
    const contactName = formData.get("contactName") as string;
    const email = formData.get("email") as string;
    const video = formData.get("video") as File;

    if (!businessName || !video) {
      return NextResponse.json(
        { error: "Business name and video are required" },
        { status: 400 }
      );
    }

    const bytes = await video.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const extension = video.name.split(".").pop() || "webm";
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const safeName = businessName.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 50);
    const filename = `${safeName}_${timestamp}.${extension}`;

    // Always save locally as backup
    const uploadsDir = path.join(process.cwd(), "uploads");
    await mkdir(uploadsDir, { recursive: true });
    const filePath = path.join(uploadsDir, filename);
    await writeFile(filePath, buffer);

    // Save metadata
    const metadata = {
      businessName,
      contactName: contactName || null,
      email: email || null,
      videoFilename: filename,
      submittedAt: new Date().toISOString(),
    };
    const metadataPath = path.join(uploadsDir, `${safeName}_${timestamp}.json`);
    await writeFile(metadataPath, JSON.stringify(metadata, null, 2));

    // Prepare email
    const isSmallEnough = buffer.length <= MAX_ATTACHMENT_SIZE;
    
    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px;">
        <h2 style="color: #1a1a1a;">🎬 New Video Testimonial!</h2>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0 0 10px;"><strong>Business:</strong> ${businessName}</p>
          ${contactName ? `<p style="margin: 0 0 10px;"><strong>Contact:</strong> ${contactName}</p>` : ""}
          ${email ? `<p style="margin: 0 0 10px;"><strong>Email:</strong> ${email}</p>` : ""}
          <p style="margin: 0;"><strong>Submitted:</strong> ${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })}</p>
        </div>
        
        ${isSmallEnough 
          ? `<p style="color: #666;">✅ Video attached to this email.</p>`
          : `<p style="color: #666;">📁 Video saved on server: <code>${filename}</code><br><small>(File too large to attach — ${(buffer.length / 1024 / 1024).toFixed(1)}MB)</small></p>`
        }
      </div>
    `;

    const emailOptions: any = {
      from: "MoveScout Testimonials <onboarding@resend.dev>",
      to: NOTIFICATION_EMAIL,
      subject: `🎬 New Testimonial from ${businessName}`,
      html: emailHtml,
    };

    if (isSmallEnough) {
      emailOptions.attachments = [{ filename, content: buffer }];
    }

    const { error: emailError } = await resend.emails.send(emailOptions);

    if (emailError) {
      console.error("Email error:", emailError);
      // Don't throw - video is saved, just log the email failure
      console.log("⚠️ Email failed but video saved locally");
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
