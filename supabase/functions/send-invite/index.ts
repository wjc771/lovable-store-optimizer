
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

interface InviteEmailData {
  email: string;
  storeName: string;
  role: string;
  inviteUrl: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, storeName, role, inviteUrl }: InviteEmailData = await req.json();

    // Send email using Resend
    const { data: emailResponse, error: emailError } = await resend.emails.send({
      from: 'Store Management <onboarding@resend.dev>',
      to: [email],
      subject: `You've been invited to join ${storeName}`,
      html: `
        <h1>Welcome to ${storeName}!</h1>
        <p>You've been invited to join ${storeName} as a ${role}.</p>
        <p>Click the link below to accept your invitation:</p>
        <a href="${inviteUrl}" style="display: inline-block; padding: 12px 20px; background-color: #7c3aed; color: white; text-decoration: none; border-radius: 6px;">
          Accept Invitation
        </a>
        <p>This invitation link will expire in 7 days.</p>
        <p>If you did not expect this invitation, please ignore this email.</p>
      `,
    });

    if (emailError) {
      console.error('Error sending email:', emailError);
      throw emailError;
    }

    console.log('Email sent successfully:', emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in send-invite function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
