# Security Policy

## Supported Versions

Only the latest commit on the `main` branch is actively maintained and receives security fixes.

| Version | Supported |
|---------|-----------|
| main (latest) | Yes |
| older commits | No |

## Reporting a Vulnerability

**Public disclosure (non-sensitive issues):** Open a GitHub Issue and apply the `security` label. Please include a clear description of the issue and steps to reproduce.


We ask that you avoid publishing or sharing vulnerability details publicly until we have had a reasonable opportunity to address the issue.

## Response Timeline

We operate on a best-effort basis. Our goal is to acknowledge reported vulnerabilities within **48 hours** and provide a status update or resolution within **14 days**, depending on complexity.

## API Key Security

CSV DataLab accepts Anthropic API keys entered directly in the browser UI. The following describes how keys are handled:

- Keys are transmitted from the client to Next.js API routes via HTTP request headers on a per-request basis.
- Keys are **never logged, written to disk, or persisted** in any server-side store, database, or cache.
- Keys are **never included in server responses** or exposed to other users.
- The server uses the key only to forward the request to the Anthropic API and then discards it.

### Recommendations for Users

- Use **scoped API keys** with the minimum permissions required.
- Set **usage limits and spending caps** on your Anthropic account to limit exposure if a key is compromised.
- Treat your API key like a password. Do not share it or commit it to version control.
- Rotate your key immediately if you suspect it has been compromised.

## Vulnerability vs. Expected Behavior

The following are considered **potential vulnerabilities**:

- A user's API key being logged, stored, or exposed to any party other than Anthropic.
- Cross-site scripting (XSS) or injection attacks within the application.
- Server-side request forgery (SSRF) or unauthorized outbound requests.
- Any mechanism that allows one user's data or keys to be accessed by another user.
- Exposure of internal infrastructure details or credentials via error messages or responses.

The following are **expected behavior and not considered vulnerabilities**:

- The application requires a valid Anthropic API key to function — unauthenticated requests to the API routes are rejected.
- API keys entered in the browser are visible in the browser's memory and developer tools for the duration of the session. This is inherent to client-side key entry and is documented behavior.
- Usage costs incurred by intentional, repeated requests made by the key owner.
- Rate limiting or errors returned directly from the Anthropic API.
