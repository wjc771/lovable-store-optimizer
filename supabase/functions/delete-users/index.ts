
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

serve(async (req) => {
  // Check for POST method
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 405,
    });
  }

  try {
    // Get the current authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: verifyError } = await supabaseAdmin.auth.getUser(token);

    if (verifyError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized', details: verifyError }), {
        headers: { 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    // Check if the user is authorized (super admin)
    const isAuthorized = user.email === 'wjc771@gmail.com' || user.email === 'jotafieldsfirst@gmail.com';
    if (!isAuthorized) {
      return new Response(JSON.stringify({ error: 'Forbidden: Only super admins can perform this action' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 403,
      });
    }

    // Get request data
    let requestData: RequestData;
    try {
      requestData = await req.json();
    } catch (e) {
      // Default preserveEmails if JSON parsing fails
      requestData = { preserveEmails: ['wjc771@gmail.com', 'jotafieldsfirst@gmail.com'] };
    }
    
    const preserveEmails = requestData.preserveEmails || ['wjc771@gmail.com', 'jotafieldsfirst@gmail.com'];

    // Get all users except the preserved ones
    const { data: users, error: fetchError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (fetchError) {
      return new Response(JSON.stringify({ error: 'Failed to fetch users', details: fetchError }), {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    const usersToDelete = users.users.filter(u => !preserveEmails.includes(u.email || ''));
    
    if (usersToDelete.length === 0) {
      return new Response(JSON.stringify({ message: 'No users to delete' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // Delete each user
    const deletionResults = [];
    for (const user of usersToDelete) {
      const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);
      deletionResults.push({
        userId: user.id,
        email: user.email,
        success: !deleteError,
        error: deleteError ? deleteError.message : null,
      });
    }

    return new Response(JSON.stringify({
      message: `${deletionResults.filter(r => r.success).length} users deleted`,
      preservedEmails: preserveEmails,
      results: deletionResults
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in delete-users function:', error);
    return new Response(JSON.stringify({ error: 'Internal server error', details: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
