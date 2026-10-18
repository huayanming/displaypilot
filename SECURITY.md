# Security policy

## Supported version

Security fixes are shipped in the latest signed LumePane release. The current download is listed at <https://lumepane.com/>.

## Reporting a vulnerability

Email **huayanming2019@gmail.com** with:

- the affected version and macOS version;
- the steps to reproduce;
- the impact you believe it has;
- whether you want to be credited.

Please do not open a public issue before a fix is available. Reports are acknowledged within 3 business days and handled by **尼森与海 / Neeson & Sea**.

## Scope

This repository contains the public website and signed release artifacts only; it does not contain the application source, signing keys, licence-service secrets or private support data. Release packages are Developer ID signed and Apple notarized; verify them with `codesign`, `spctl` and `stapler` as described at <https://lumepane.com/verify>.

## Out of scope

- Social engineering, physical access and denial of service against third-party hosts.
- Issues in macOS, GitHub, Cloudflare or payment providers themselves.
- Old releases left public for archival access; use the current release for security fixes.
