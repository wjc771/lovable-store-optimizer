
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messageId } = await req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the message and its webhook URL
    const { data: message, error: messageError } = await supabase
      .from('chat_messages')
      .select('*, documents(n8n_webhook_url)')
      .eq('id', messageId)
      .single();

    if (messageError || !message) {
      throw new Error('Message not found');
    }

    const webhookUrl = message.documents?.n8n_webhook_url;
    if (!webhookUrl) {
      throw new Error('No webhook URL found for this document');
    }

    // Send message to N8N webhook
    const n8nResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messageId,
        message: message.message,
      }),
    });

    if (!n8nResponse.ok) {
      throw new Error('Failed to process message with N8N');
    }

    const processingResult = await n8nResponse.json();

    // Update the message with the response
    const { error: updateError } = await supabase
      .from('chat_messages')
      .update({
        response: processingResult.response,
        status: 'completed',
      })
      .eq('id', messageId);

    if (updateError) {
      throw updateError;
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error processing message:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
