# Security Policy

Brightleap is used by children, so we take security and privacy seriously.

## Reporting a vulnerability

**Please do not report security issues in public GitHub issues.**

Instead, report privately using one of these routes:

- GitHub's [private vulnerability reporting](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing-information-about-vulnerabilities/privately-reporting-a-security-vulnerability) (the **"Report a vulnerability"** button under the repository's *Security* tab), or
- Email **security@brightleap.co.uk**.

Please include enough detail to reproduce the issue. We'll acknowledge your
report as soon as we can and keep you updated on the fix.

## Scope

Things we especially care about:

- Any way to access another user's data or progress
- Weaknesses in authentication or Supabase Row Level Security policies
- Exposure of personal data about children

## A note on keys

The Supabase URL and **anon/publishable** key that ship in the client are public
by design and protected by Row Level Security — these are not secrets. Service
keys and any other credentials are never committed to this repository.

Thank you for helping keep Brightleap safe.
