Setting up the Cloudflare Worker

To power the Cloud Sync functionality in Sproti, you'll need a free Cloudflare account. Here's a secure backend API script using Cloudflare Workers and KV Storage that works perfectly with the new integration.

Sign in to your Cloudflare dashboard and create a new Worker.

Go to Workers & Pages -> KV, and create a namespace named SPROTI_KV.

In your Worker's settings under Bindings, bind the variable SPROTI_KV to the namespace you just created.

Replace the code in your worker with the script below, deploy it, and then paste its web URL into the Account tab of your app!
