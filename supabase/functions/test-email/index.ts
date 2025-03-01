
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailTestRequest {
  email: string;
  testType: "auth" | "general";
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, testType }: EmailTestRequest = await req.json();
    
    console.log(`Attempting to send test email to: ${email}`);
    console.log(`Test type: ${testType}`);
    
    // Log the Resend API key (masked for security)
    const apiKey = Deno.env.get("RESEND_API_KEY") || "";
    console.log(`Resend API Key (first 4 chars): ${apiKey.substring(0, 4)}****`);

    // Create a reset password link similar to what Supabase would create
    const resetLink = `http://localhost:3000/auth?token=test-token&type=recovery&tab=reset`;

    let emailHtml = "";
    let emailSubject = "";

    if (testType === "auth") {
      emailSubject = "Password Reset Instructions";
      emailHtml = `
        <h1>Reset Your Password</h1>
        <p>We received a request to reset your password for your account.</p>
        <p>Click the link below to reset your password:</p>
        <p><a href="${resetLink}" style="padding: 10px 15px; background-color: #6366f1; color: white; text-decoration: none; border-radius: 4px;">Reset Password</a></p>
        <p>If you didn't request a password reset, you can ignore this email.</p>
        <p>This link is only valid for 1 hour.</p>
      `;
    } else {
      emailSubject = "Email Configuration Test";
      emailHtml = `
        <h1>Email Configuration Test</h1>
        <p>This is a test email to verify that your email configuration is working correctly.</p>
        <p>If you received this message, it means the email delivery system is functioning properly.</p>
        <p>Time sent: ${new Date().toISOString()}</p>
      `;
    }

    const emailResponse = await resend.emails.send({
      from: "Autonomme <noreply@autonomme.com>",
      to: [email],
      subject: emailSubject,
      html: emailHtml,
    });

    console.log("Email send attempt result:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in test-email function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        stack: error.stack,
        details: error 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
