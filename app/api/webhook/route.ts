import { isPrivateIP } from '@/lib/utils';
import { URL } from 'url';
import { promises as dns } from 'dns';

// Helper function to resolve the IP address of a hostname
async function resolveIP(hostname) {
  try {
    const addresses = await dns.lookup(hostname, { all: true });

    const ipv4Address = addresses.find(addr => addr.family === 4)?.address;

    if (ipv4Address) {
      return ipv4Address;
    }

    return addresses[0]?.address;

  } catch (error) {
    console.error(`DNS lookup failed for ${hostname}:`, error.message);
    throw new Error("DNS_RESOLUTION_FAILED");
  }
}

/**
 * This function enforces SSRF protection policies using real DNS lookups.
 */
export async function POST(request) {
  let destinationUrl, secretKey, payload;

  try {
    const body = await request.json();
    ({ destinationUrl, secretKey, payload } = body);
  } catch (e) {
    return Response.json({ success: false, error: 'Invalid JSON body or missing required fields.' }, { status: 400 });
  }

  // 1. Validate Required Payload Fields
  if (!destinationUrl || !secretKey || !payload) {
    return Response.json({ success: false, error: 'Missing destinationUrl, secretKey, or payload in the request body.' }, { status: 400 });
  }

  let url;
  try {
    url = new URL(destinationUrl);
  } catch (e) {
    return Response.json({ success: false, error: 'Invalid destination URL format.' }, { status: 400 });
  }

  // 2. --- SSRF DEFENSE 1: PROTOCOL LOCK ---
  if (url.protocol !== 'https:') {
    return Response.json({ success: false, error: 'Protocol violation. Only HTTPS endpoints are permitted for security reasons.' }, { status: 403 });
  }

  // Check if the hostname is an IP address already (e.g., https://1.2.3.4/hook)
  const isDirectIP = url.hostname.match(/^(\d{1,3}\.){3}\d{1,3}$/);

  let resolvedIp;

  //. --- SSRF DEFENSE 2: IP BLOCKLIST CHECK ---
  try {
    if (isDirectIP) {
      // If the user provided an IP directly, we use it directly
      resolvedIp = url.hostname;
    } else {
      // Otherwise, we perform a real DNS lookup
      resolvedIp = await resolveIP(url.hostname);
    }

    if (!resolvedIp) {
      return Response.json({ success: false, error: 'DNS resolution failed or returned no address.' }, { status: 403 });
    }

    // Check if the resolved IP is private
    if (isPrivateIP(resolvedIp)) {
      console.warn(`SSRF BLOCK: Attempted request to private IP ${resolvedIp} for URL ${destinationUrl}`);
      return Response.json({
        success: false,
        error: 'Security Policy Violation: Target IP resolves to a private or reserved network. Request blocked to prevent SSRF.'
      }, { status: 403 });
    }
  } catch (e) {
    if (e.message === "DNS_RESOLUTION_FAILED") {
      return Response.json({ success: false, error: 'Target hostname could not be resolved.' }, { status: 403 });
    }
    return Response.json({ success: false, error: 'Internal server error during IP verification.' }, { status: 500 });
  }

  // Execute the Webhook Request
  try {
    const webhookResponse = await fetch(destinationUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // --- PAYLOAD INTEGRITY DEFENSE ---
        'X-Webhook-Secret': secretKey,
        'User-Agent': 'AICAP-Webhook-Dispatcher/1.0',
      },
      body: JSON.stringify(payload),
    });

    const status = webhookResponse.status;

    if (webhookResponse.ok) {
      return Response.json({
        success: true,
        message: 'Webhook delivered successfully.',
        targetStatus: status
      }, { status: 200 });
    } else {
      const responseText = await webhookResponse.text();
      console.error(`Webhook failed, remote status: ${status}. Response: ${responseText.substring(0, 100)}`);
      return Response.json({
        success: false,
        error: `Webhook failed. Target responded with status: ${status}.`,
        targetStatus: status
      }, { status: 200 });
    }

  } catch (e) {
    console.error(`Network error during webhook execution: ${e.message}`);
    return Response.json({
      success: false,
      error: `Network connection failed or timed out: ${e.message}`
    }, { status: 200 });
  }
}

// Optional: Block other methods for stricter API design
export async function GET() {
  return Response.json({ error: 'Method Not Allowed' }, { status: 405 });
}