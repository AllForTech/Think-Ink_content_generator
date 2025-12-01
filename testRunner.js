import { promises as dns } from 'dns';

// --- IMPORTANT CONFIGURATION ---
// You must replace this with the actual URL of your running Next.js API route.
// If you run Next.js locally, it will likely be:
const API_ENDPOINT = 'http://localhost:3000/api/execute-webhook';

// --- SSRF TEST TARGETS ---
// For a real test, you'd run a simple mock server that listens on different IPs
// For demonstration, we'll use public IPs (like Google's DNS or a known public test service)
// and the blocked private IP (127.0.0.1)

/**
 * Executes a POST request against the Next.js Webhook API endpoint.
 * @param {string} destinationUrl The URL the Next.js server will attempt to call.
 * @param {string} secretKey The mock secret key.
 * @param {object} payload The mock JSON payload.
 * @param {string} testName A description for the test case.
 */
async function runTest(testName, destinationUrl, secretKey, payload) {
  console.log(`\n--- Running Test Case: ${testName} ---`);
  console.log(`Target Webhook: ${destinationUrl}`);

  const body = { destinationUrl, secretKey, payload };

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const status = response.status;
    const result = await response.json();

    console.log(`API Status Code: ${status}`);
    console.log('Response Body:', result);

    // Assertions for expected behavior
    if (testName.includes("BLOCK")) {
      if (status === 403 && !result.success) {
        console.log('✅ TEST PASSED: Request was correctly blocked with 403.');
      } else {
        console.log(`❌ TEST FAILED: Expected 403 block, got status ${status} and success: ${result.success}.`);
      }
    } else if (testName.includes("SUCCESS")) {
      if (status === 200 && result.success === true) {
        console.log('✅ TEST PASSED: Webhook dispatch was processed successfully (200 OK).');
      } else {
        console.log(`❌ TEST FAILED: Expected 200 success, got status ${status} and success: ${result.success}.`);
      }
    }

  } catch (error) {
    console.error(`❌ TEST FAILED: Network error connecting to Next.js API at ${API_ENDPOINT}:`, error.message);
    console.error("-> Ensure your Next.js server is running on port 3000.");
  }
}


async function main() {
  console.log("=================================================");
  console.log("         SSRF Defense Test Runner Script         ");
  console.log("=================================================");

  // Check DNS module availability (only relevant if running on a platform
  // where Node.js features might be restricted, like Vercel Edge).
  try {
    await dns.lookup('google.com');
    console.log("DNS module check: Available (Node.js runtime confirmed).");
  } catch (e) {
    console.error("DNS module check: FAILED. Ensure your Next.js route is running in a Node.js environment.");
    return;
  }

  // --- TEST SUITE ---

  // 1. SSRF BLOCK TEST: Private IP (127.0.0.1) via Hostname
  // NOTE: This will fail if the Next.js server is running on Edge,
  // but should succeed if running as a Node function as expected.
  await runTest(
    "1. SSRF BLOCK TEST (127.0.0.1)",
    "https://127.0.0.1/internal-resource-that-should-be-safe",
    "mock-secret",
    { event: "test", data: 123 }
  );

  // 2. PROTOCOL BLOCK TEST: HTTP (Non-HTTPS)
  await runTest(
    "2. PROTOCOL BLOCK TEST (HTTP)",
    "http://example.com/some/path",
    "mock-secret",
    { event: "test", data: 456 }
  );

  // 3. SSRF BLOCK TEST: Private IP (192.168.x.x) via Hostname
  // We use a hostname that resolves to a public IP to simulate the DNS lookup,
  // but imagine 'localhost' or a resolved '192.168.1.1'
  // This test relies on the DNS lookup mechanism identifying a private IP.
  await runTest(
    "3. SSRF BLOCK TEST (localhost, needs mock)",
    "https://localhost/api/sensitive-data",
    "mock-secret",
    { event: "test", data: 789 }
  );

  // 4. EXTERNAL SUCCESS TEST: Public Endpoint (Assuming it connects)
  // NOTE: This test requires a real public webhook target (e.g., https://postman-echo.com/post)
  // or a proxy to succeed. We use a placeholder that will likely fail
  // due to lack of a real server but will pass the SSRF/Protocol checks.
  await runTest(
    "4. EXTERNAL SUCCESS TEST (Public HTTPS)",
    "https://jsonplaceholder.typicode.com/posts", // A real public API for testing POST
    "mock-secret-prod",
    { title: "Test Post", body: "This should be sent successfully", userId: 1 }
  );

  console.log("\n=================================================");
  console.log("Test Suite Finished.");
  console.log("=================================================");
}

main();