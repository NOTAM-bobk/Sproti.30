export default {
  async fetch(request, env) {
    // Basic CORS setup so the frontend can securely talk to this API from any domain
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
    
    // Handle preflight requests (browsers do this automatically before sending POST data)
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    
    // Remove any accidental trailing slashes from the URL path so '/sync/' becomes '/sync'
    const path = url.pathname.endsWith('/') && url.pathname.length > 1 
      ? url.pathname.slice(0, -1) 
      : url.pathname;

    // GET /sync?username=User
    // Fetch data using the unique display name
    if (request.method === 'GET' && path === '/sync') {
      const username = url.searchParams.get('username');
      if (!username) {
        return new Response('Username required', { status: 400, headers: corsHeaders });
      }

      const data = await env.SPROTI_KV.get(username);
      if (!data) {
        return new Response('User data not found', { status: 404, headers: corsHeaders });
      }

      return new Response(data, { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    // POST /sync
    // Safely save data into the KV store under the user's name
    if (request.method === 'POST' && path === '/sync') {
      try {
        const body = await request.json();
        if (!body.username || !body.data) {
          return new Response('Invalid payload', { status: 400, headers: corsHeaders });
        }

        // Store the payload in KV using the username as the key
        await env.SPROTI_KV.put(body.username, JSON.stringify(body.data));
        
        return new Response(JSON.stringify({ success: true }), { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
        
      } catch (e) {
        return new Response('Error saving data', { status: 500, headers: corsHeaders });
      }
    }

    // Default welcome page if you open the worker directly in your browser
    return new Response('Sproti Cloud Sync API is running properly! Your KV is connected.', { headers: corsHeaders });
  }
};
