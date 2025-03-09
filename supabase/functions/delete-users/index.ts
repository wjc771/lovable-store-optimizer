
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.42.0';

// Create a Supabase client with the admin key
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

interface RequestData {
  preserveEmails: string[];
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json'
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  // Check for POST method
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      headers: corsHeaders,
      status: 405,
    });
  }

  try {
    // Get the current authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        headers: corsHeaders,
        status: 401,
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: verifyError } = await supabaseAdmin.auth.getUser(token);

    if (verifyError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized', details: verifyError }), {
        headers: corsHeaders,
        status: 401,
      });
    }

    // Check if the user is authorized (super admin)
    const isAuthorized = user.email === 'wjc771@gmail.com' || user.email === 'jotafieldsfirst@gmail.com';
    if (!isAuthorized) {
      return new Response(JSON.stringify({ error: 'Forbidden: Only super admins can perform this action' }), {
        headers: corsHeaders,
        status: 403,
      });
    }

    // Get request data
    let requestData: RequestData;
    try {
      const bodyText = await req.text();
      requestData = bodyText ? JSON.parse(bodyText) : { preserveEmails: ['wjc771@gmail.com', 'jotafieldsfirst@gmail.com'] };
    } catch (e) {
      console.error('Error parsing request body:', e);
      // Default preserveEmails if JSON parsing fails
      requestData = { preserveEmails: ['wjc771@gmail.com', 'jotafieldsfirst@gmail.com'] };
    }
    
    const preserveEmails = requestData.preserveEmails || ['wjc771@gmail.com', 'jotafieldsfirst@gmail.com'];
    console.log('Preserving emails:', preserveEmails);

    // Get all users except the preserved ones
    const { data: users, error: fetchError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (fetchError) {
      console.error('Failed to fetch users:', fetchError);
      return new Response(JSON.stringify({ error: 'Failed to fetch users', details: fetchError }), {
        headers: corsHeaders,
        status: 500,
      });
    }

    const usersToDelete = users.users.filter(u => !preserveEmails.includes(u.email || ''));
    console.log(`Found ${usersToDelete.length} users to delete`);
    
    if (usersToDelete.length === 0) {
      return new Response(JSON.stringify({ message: 'No users to delete' }), {
        headers: corsHeaders,
        status: 200,
      });
    }

    // Delete each user
    const deletionResults = [];
    for (const user of usersToDelete) {
      console.log(`Deleting user: ${user.id} (${user.email})`);
      const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);
      
      if (deleteError) {
        console.error(`Error deleting user ${user.id}:`, deleteError);
      }
      
      deletionResults.push({
        userId: user.id,
        email: user.email,
        success: !deleteError,
        error: deleteError ? deleteError.message : null,
      });
    }

    const successCount = deletionResults.filter(r => r.success).length;
    console.log(`Successfully deleted ${successCount} users`);

    return new Response(JSON.stringify({
      message: `${successCount} users deleted`,
      preservedEmails: preserveEmails,
      results: deletionResults
    }), {
      headers: corsHeaders,
      status: 200,
    });
  } catch (error) {
    console.error('Error in delete-users function:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : String(error) 
    }), {
      headers: corsHeaders,
      status: 500,
    });
  }
});
