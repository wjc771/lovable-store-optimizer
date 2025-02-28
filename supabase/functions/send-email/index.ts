
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

// Configuração do CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Inicialização do cliente Resend com a API key
const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

// Inicialização do cliente Supabase
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

// Estrutura para os dados do email
interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, html, text, from }: EmailData = await req.json();

    // Validação básica
    if (!to || !subject || !html) {
      throw new Error('Missing required fields: to, subject, or html');
    }

    // Configuração do remetente
    const sender = from || 'Sistema <onboarding@resend.dev>';

    // Envio do email usando o Resend
    const { data: emailResponse, error: emailError } = await resend.emails.send({
      from: sender,
      to: [to],
      subject: subject,
      html: html,
      text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML tags for text version
    });

    if (emailError) {
      console.error('Erro ao enviar email:', emailError);
      throw emailError;
    }

    console.log('Email enviado com sucesso:', emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erro na função send-email:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
