# Shop Order Page

A simple, static online ordering page. Customers browse the menu, build an
order, and send it to you as a pre-filled WhatsApp message — no backend
required yet.

## Files

```
index.html          Page structure
styles.css           Look and feel
script.js            Menu data, cart logic, WhatsApp link (config lives here)
Dockerfile            Packages the site into an nginx image
docker-compose.yml    One-command way to build + run the image
.dockerignore
```

## 1. Before you launch: edit `script.js`

Open `script.js` and update the block at the top:

```js
const SHOP_NAME = "The Green Spoon";
const WHATSAPP_NUMBER = "10000000000"; // country code + number, digits only
```

- `WHATSAPP_NUMBER` must be digits only — no `+`, spaces, or dashes.
  Example: a US number `+1 555-123-4567` becomes `15551234567`.
- Edit the `MENU` array below it to add your real categories, items,
  descriptions, and prices.

Also swap the placeholders in `index.html`: the `<title>`, `.shop-name`,
`.shop-tagline`, and `.shop-meta` (address / hours / phone).

## 2. Upload to GitHub

If you don't have git installed, install it first, then from inside this
folder:

```bash
git init
git add .
git commit -m "Initial commit: shop ordering page"
```

Create a new empty repository on GitHub (github.com → the "+" icon →
"New repository"). Don't initialize it with a README — you already have one.
Then connect and push:

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

## 3. Run it with Docker

Once the files are on your machine (cloned from GitHub or straight from
here), with Docker installed:

```bash
docker build -t shop-order .
docker run -d -p 8080:80 --name shop-order shop-order
```

Visit `http://localhost:8080` to see it live.

Or with Docker Compose (does the same thing in one step):

```bash
docker compose up -d --build
```

To stop it:

```bash
docker stop shop-order && docker rm shop-order
# or, with compose:
docker compose down
```

## 4. Hosting it somewhere public

A Docker image needs a host with Docker to run continuously. Options:

- **Any VPS** (DigitalOcean, Linode, a home server, etc.) — install Docker,
  pull your repo, run the same `docker run` command above, point a domain
  at the server's IP.
- **Render, Railway, Fly.io** — connect your GitHub repo, they detect the
  `Dockerfile` and build/host it automatically, and give you a public URL.
- **GitHub Pages** — note this is a *static-file* host and doesn't run
  Docker containers. Since this project has no backend, you could deploy
  `index.html`, `styles.css`, and `script.js` directly to Pages instead of
  Docker, if you just want it hosted for free. Docker becomes useful once
  you add a real backend later (order storage, payments, etc.).

## Notes for later

- Right now, submitting an order just opens WhatsApp with the message
  pre-filled — nothing is saved or charged automatically.
- When you're ready for a backend (accepting orders into a database,
  payments, an admin view of incoming orders), that's a separate service
  this static site can call — happy to help build that when you get there.
