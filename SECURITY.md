# Security policy

ZeroG captures a screenshot + recent console of the current page and sends them
to **your own** GitHub repo via a collector you host — never to us. The token
that authorizes writes stays server-side in your environment. Treat that token
like any secret; never expose it to the client.

## Reporting a vulnerability

Please **do not** open a public issue for security problems. Instead use GitHub's
private vulnerability reporting: the repo's **Security → Report a vulnerability**
tab. We'll acknowledge and work a fix before any public disclosure.

## Scope

- The package (`zerogub/*`) — capture client, collector, viewer.
- Not in scope: bugs in *your* app or *your* GitHub configuration.
