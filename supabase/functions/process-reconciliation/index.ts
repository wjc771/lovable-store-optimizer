
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import * as csv from "https://deno.land/std@0.177.0/encoding/csv.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { fileId } = await req.json()

    if (!fileId) {
      return new Response(
        JSON.stringify({ error: 'No file ID provided' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get file upload record
    const { data: fileUpload, error: fileError } = await supabase
      .from('file_uploads')
      .select('*')
      .eq('id', fileId)
      .single()

    if (fileError || !fileUpload) {
      return new Response(
        JSON.stringify({ error: 'File not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }

    // Download file from storage
    const { data: fileData, error: downloadError } = await supabase
      .storage
      .from('reconciliation')
      .download(fileUpload.file_path)

    if (downloadError) {
      return new Response(
        JSON.stringify({ error: 'Failed to download file' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Parse CSV data
    const text = await fileData.text()
    const [headers, ...rows] = await csv.parse(text)

    // Process records based on file type
    const records = rows.map(row => {
      const record: Record<string, any> = {}
      headers.forEach((header, index) => {
        record[header] = row[index]
      })
      return record
    })

    // Compare with system data and create reconciliation items
    // This is a simplified example - you'll need to implement the actual comparison logic
    for (const record of records) {
      const { error: itemError } = await supabase
        .from('reconciliation_items')
        .insert({
          job_id: fileUpload.id,
          table_name: 'products', // This should be determined by the file type
          system_value: {}, // Query and add actual system value
          uploaded_value: record,
          status: 'pending'
        })

      if (itemError) {
        console.error('Error creating reconciliation item:', itemError)
      }
    }

    // Update job status
    const { error: updateError } = await supabase
      .from('reconciliation_jobs')
      .update({ status: 'completed' })
      .eq('id', fileUpload.id)

    if (updateError) {
      console.error('Error updating job status:', updateError)
    }

    return new Response(
      JSON.stringify({ message: 'Reconciliation processing completed' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('Error processing reconciliation:', error)
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
