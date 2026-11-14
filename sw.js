/* MKS GitHub Pages CUTOVER REVIEW CANDIDATE v0.1.6
   Passive update for previously registered workers: no fetch handler, no caching.
   HTML registers no new worker. Existing registration may continue until browsers update.
   No Cloudflare Worker is modified by this file. */
self.addEventListener('install',event=>event.waitUntil(self.skipWaiting()));
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
