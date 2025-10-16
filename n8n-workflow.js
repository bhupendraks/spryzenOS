/**
 * This is a Netlify serverless function. It acts as a secure backend to communicate
 * with the n8n API. The user's credentials are only ever handled here on the server,
 * never exposed in the browser.
 *
 * To deploy, this file should be placed in the `netlify/functions` directory
 * at the root of your project.
 */

// We use the 'node-fetch' library to make HTTP requests from this Node.js environment.
// You will need to add `node-fetch` to your project's dependencies.
// Run `npm install node-fetch` in your project's root directory.
const fetch = require('node-fetch');

exports.handler = async (event) => {
  // We only accept POST requests to this function.
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ message: 'Method Not Allowed' }) };
  }

  try {
    const { n8nUrl, n8nApiKey } = JSON.parse(event.body);

    // --- Basic validation ---
    if (!n8nUrl || !n8nApiKey) {
      return { statusCode: 400, body: JSON.stringify({ message: 'Missing n8n URL or API Key.' }) };
    }

    // --- Define the AI Agent Workflow ---
    // This is a simple example of an n8n workflow. You can create complex workflows
    // in the n8n editor, then export the JSON and paste it here.
    const aiAgentWorkflow = {
      name: "My New AI Agent (from Spryzen)",
      nodes: [
        {
          parameters: {},
          name: "Start",
          type: "n8n-nodes-base.start",
          typeVersion: 1,
          position: [240, 300],
        },
        {
          parameters: {
            text: "The AI Agent workflow was created successfully!",
          },
          name: "Success Message",
          type: "n8n-nodes-base.noOp",
          typeVersion: 1,
          position: [460, 300],
        },
      ],
      connections: {
        Start: {
          main: [
            [{ node: "Success Message", type: "main" }],
          ],
        },
      },
      active: true,
      settings: {},
    };
    // --- End of Workflow Definition ---

    // Construct the full API URL for creating workflows in the user's n8n instance.
    const apiUrl = `${n8nUrl.replace(/\/$/, '')}/api/v1/workflows`;

    // Make the secure, server-to-server API call to n8n.
    const n8nResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-N8N-API-KEY': n8nApiKey,
      },
      body: JSON.stringify(aiAgentWorkflow),
    });

    // If the n8n API returns an error (e.g., invalid key), forward a clear error message.
    if (!n8nResponse.ok) {
        const errorData = await n8nResponse.json();
        const errorMessage = errorData.message || `n8n API returned status ${n8nResponse.status}`;
        return { statusCode: n8nResponse.status, body: JSON.stringify({ message: `Failed to create workflow: ${errorMessage}` }) };
    }

    // If successful, return a 200 OK response.
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Workflow created successfully!' }),
    };

  } catch (error) {
    // Catch any other errors (e.g., network issues, invalid JSON).
    return {
      statusCode: 500,
      body: JSON.stringify({ message: `An internal error occurred: ${error.message}` }),
    };
  }
};