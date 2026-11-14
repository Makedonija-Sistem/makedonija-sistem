/* MKS participation API stub — intentionally incapable of collecting personal data.
 * No storage bindings, body parsing, credential access or submission endpoints.
 * This is a non-live prototype. A future backend requires separate legal and Human Gate review.
 */
'use strict';

const STATUS = Object.freeze({
  service: 'MKS voluntary participation',
  phase: 'review-only',
  accepting_submissions: false,
  accepting_membership: false,
  storing_personal_data: false,
  automated_decisions: false,
  human_gate: 'not-approved'
});
const SECURITY_HEADERS = Object.freeze({
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'Pragma': 'no-cache',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
  'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
  'X-Robots-Tag': 'noindex, nofollow',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
});
const response = (status, payload, head = false) => new Response(
  head ? null : JSON.stringify(payload), {status, headers:SECURITY_HEADERS}
);

export default {
  async fetch(request) {
    // Do not read or log the request body; even an attempted submission is sensitive.
    const url = new URL(request.url);
    const method = request.method.toUpperCase();
    if (url.pathname === '/api/participation/status' && (method === 'GET' || method === 'HEAD')) {
      return response(200, STATUS, method === 'HEAD');
    }
    if (url.pathname.startsWith('/api/participation/') && !['GET','HEAD','OPTIONS'].includes(method)) {
      return response(423, {
        code:'COLLECTION_NOT_AUTHORIZED',
        message:'No applications, membership or personal-data submission service is active.'
      });
    }
    if (url.pathname.startsWith('/api/participation/') && method === 'OPTIONS') {
      return response(405, {code:'METHOD_NOT_ALLOWED'});
    }
    return response(404, {code:'NOT_FOUND'});
  }
};
