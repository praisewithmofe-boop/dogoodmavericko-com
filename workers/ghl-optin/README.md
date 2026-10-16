# Terrific 30 signup relay

This Cloudflare Worker accepts the Terrific 30 form (`firstName`, `email`, `phone`) and writes the contact in GoHighLevel. `phone` is an E.164 number such as `+12025550123`. The form requires it. A request that leaves it out still succeeds, so an older copy of the page keeps working; a phone that is present must be valid. The private integration token lives only as a Worker secret. The static site never sees it.

The Worker upserts the contact (`locationId`, `firstName`, `email`, `phone`, `source`) and then adds the tag `terrific30-free`. Tags are not sent on the upsert, so existing tags stay in place.

Allowed browser origins: `https://dogoodmavericko.com`, plus `http://localhost` and `http://127.0.0.1` (any port) for local testing.

## What you do once

You need a free Cloudflare account, three GitHub Actions secrets, and one public repository variable. `GHL_PRIVATE_INTEGRATION_TOKEN` is already saved on this repo. Do not put that token in the Next.js app, in `NEXT_PUBLIC_GHL_OPTIN_URL`, or in any file you commit.

### 1. Create a free Cloudflare account

1. Open [https://dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up).
2. Create the account with the free plan. You do not need to add the website’s domain to Cloudflare. GitHub Pages keeps serving `dogoodmavericko.com`.
3. Open **Workers & Pages**.
4. If Cloudflare asks you to choose a workers.dev subdomain, pick one and save it. The first deploy fails until this subdomain exists.

### 2. Create an API token

1. Click the person icon (top right) → **My Profile** → **API Tokens**.
2. **Create Token** → find **Edit Cloudflare Workers** → **Use template**.
3. Under **Account Resources**, include the account you just created.
4. **Continue to summary** → **Create Token**.
5. Copy the token immediately. Cloudflare shows it only once. This value becomes the GitHub secret `CLOUDFLARE_API_TOKEN`.

### 3. Copy the account ID

1. Go to **Workers & Pages** in the dashboard.
2. Copy **Account ID** from the right-hand sidebar. This becomes the GitHub secret `CLOUDFLARE_ACCOUNT_ID`.

### 4. Add the GitHub secrets

1. Open this repo on GitHub → **Settings** → **Secrets and variables** → **Actions**.
2. **New repository secret** for each of these:

| Name | Value |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | The token from step 2 |
| `CLOUDFLARE_ACCOUNT_ID` | The account ID from step 3 |
| `GHL_PRIVATE_INTEGRATION_TOKEN` | Already saved. Leave it. This is the GoHighLevel private integration token, not the Cloudflare token. |

The location id `B61Axi1jMZDmpwTLX4tR` is already set in `wrangler.toml`. You do not need a `GHL_LOCATION_ID` secret.

### 5. Deploy the Worker

1. On GitHub, open **Actions** → **Deploy GHL opt-in worker** → **Run workflow**.
2. Choose the branch that contains this workflow (after this PR is merged, that is `main`) → **Run workflow**.
3. Open the run. The deploy step logs a line like `https://ghl-optin.<your-subdomain>.workers.dev`. Copy that URL. It is public. It is not a secret.
4. If the run says Cloudflare secrets are missing, repeat step 4 and run the workflow again. The workflow skips the deploy until both Cloudflare secrets exist, and it fails if those secrets exist but `GHL_PRIVATE_INTEGRATION_TOKEN` does not.

### 6. Point the website at that URL

1. Still in **Settings** → **Secrets and variables** → **Actions**, open the **Variables** tab (not Secrets).
2. **New repository variable**.
3. Name: `NEXT_PUBLIC_GHL_OPTIN_URL`
4. Value: the `https://….workers.dev` URL from step 5, with no trailing path.
5. Open **Actions** → **Deploy to GitHub Pages** → **Run workflow** on `main`.

That variable is inlined into the static site at build time. It must be the Worker URL only. Never paste the GoHighLevel token into it.

Until this variable is set, both Terrific 30 forms show a short error instead of a fake success. After the Pages deploy finishes, submit a test address you control and confirm the contact in GoHighLevel has the tag `terrific30-free`.

If you would rather commit the URL, paste it into `CONFIGURED_GHL_OPTIN_URL` in `src/lib/ghl-optin.ts` and redeploy the site. The GitHub variable overrides that constant when it is set.

## Local check

```bash
cd workers/ghl-optin
cp .dev.vars.example .dev.vars
# put the GoHighLevel token in .dev.vars, then:
npx wrangler dev
```

From the repo root, with the dev server URL from Wrangler:

```bash
NEXT_PUBLIC_GHL_OPTIN_URL=http://localhost:8787 npm run dev
```

Worker tests (no Cloudflare account required):

```bash
npm run test:worker
```
