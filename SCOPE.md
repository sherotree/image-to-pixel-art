# JSR publish status

| Item | Status |
| --- | --- |
| Package name | `@sherotree/image-to-pixel-art` |
| JSR scope `@sherotree` | **Created** (admin: sherotree) — https://jsr.io/@sherotree |
| GitHub repo | https://github.com/sherotree/image-to-pixel-art (public) |
| Version publication | **Not published yet** — dry-run only until explicitly requested |

## Remaining release steps

1. Confirm dry-run still passes: `deno task publish:dry-run`
2. From this repository root, as an account with `@sherotree` publish rights:
   ```bash
   deno publish
   ```
   or `npx jsr publish`
3. Optionally also publish the same version to npm under `@sherotree/image-to-pixel-art` if desired (separate step; not required for JSR).
4. Tag the release (e.g. `v0.1.0`) after a successful publish.

Do **not** publish a version from an automated agent unless the owner explicitly asks for version publication.
