<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0d1b2a,100:ff6b35&height=180&section=header&text=VENN%20SPOKE&fontSize=54&fontColor=ffffff&fontAlignY=36&desc=Everyday%2C%20elevated.&descSize=18&descAlignY=57&animation=fadeIn" alt="Venn Spoke" />
</p>

<p align="center">
  <strong>A responsive e-commerce experience with INR checkout, order tracking, and a local operations console.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=061827" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-Ready-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-Fast-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Payments-Demo%20only-ff6b35?style=for-the-badge" alt="Demo payments only" />
</p>

<p align="center">
  <a href="https://github.com/Cyberbadfit"><img src="https://img.shields.io/badge/Developer-Cyberbadfit-0d1b2a?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" /></a>
  <a href="https://www.instagram.com/cyber_badfit?igsh=bWpyYWg1dW14cW1x"><img src="https://img.shields.io/badge/Instagram-@cyber__badfit-ff6b35?style=for-the-badge&logo=instagram&logoColor=white" alt="Instagram" /></a>
</p>

<p align="center">
  <a href="#highlights">Explore features</a> · <a href="#run-locally">Run locally</a> · <a href="#github-pages-deployment">Deploy</a> · <a href="#security-and-production">Security</a>
</p>

## Highlights

- Responsive editorial storefront for mobile, tablet, and desktop
- 34 seeded products across shoes, bottles, bags, phones, kitchen, home, tech, and beauty
- Product cards, filtering, quantity controls, animated cart drawer, notifications, and mobile navigation
- All product amounts are formatted in Indian Rupees (INR)
- UPI checkout with a scannable QR payload for PhonePe, Google Pay, Paytm, and compatible UPI apps
- Card and net-banking payment views for realistic checkout exploration
- Deliberately explicit test-only confirmation: scanning or confirming the QR never processes money
- Motion-rich visual system with reduced-motion support
- Persistent local store data for products, customers, orders, stock, messages, and tracking events
- Password-gated admin console to add/remove products, set availability, publish the animated announcement, review users, and update order states

## Run locally

```bash
npm install
npm run dev
```

This starts the Vite site and the local API together. Open the Vite URL (usually `http://localhost:5173`). To run them separately, use `npm run server` and `npm run dev:web`. To create a production build:

```bash
npm run build
npm run preview
```

## GitHub Pages deployment

The storefront can be deployed as a static demo on GitHub Pages. Its browser-backed demo catalog, cart, orders, tracking, and admin experience continue to work there; the local Express API and `data/store.json` are intentionally not published.

```bash
npm run build
```

Publish the contents of `dist/` through GitHub Pages (or configure a GitHub Actions workflow to do so). For a production system, deploy the API separately and set `VITE_API_URL` to its HTTPS URL.

## Vercel deployment

Vercel detects the included `vercel.json` and deploys the Vite production build from `dist/`. Import `Cyberbadfit/Venn-Spoke` in Vercel, keep the default build settings, and deploy. The public static deployment uses the in-browser demo data store; connect an external API and configure `VITE_API_URL` when production-wide shared users, orders, and inventory are required.

## Demo payment behaviour

The payment gateway is a **front-end simulation**. It is intentionally designed not to charge real money or record financial information.

1. Add products and choose **Secure checkout**.
2. Choose **UPI / QR** to show a UPI-compatible QR code. Its payload labels the payment as a demo.
3. Scan it with a supported UPI app to view the test payment note, or click **I've completed demo payment**.
4. The site displays a clear test confirmation and resets the demo order.

For real payments, connect a PCI-compliant server-side order flow with a provider such as Razorpay, Cashfree, PhonePe PG, or PayU. Do not handle card data or mark payments as successful in the browser.

## Security and production

The local API uses a persistent development-only file database at `data/store.json`, created automatically on the first API request. It is suitable for local testing only; use a managed database such as Supabase Postgres for a deployment.

`data/`, `.env`, build files, and local logs are excluded through `.gitignore` so private order data and local configuration cannot be committed to GitHub.

Before a production deployment, set unique values for `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `CORS_ORIGIN` in the host's encrypted environment-variable settings. The API refuses to start in production without the required secret and password, restricts CORS to configured origins, applies basic login throttling, and returns security headers.

Do not publish admin credentials, JWT secrets, database URLs, or customer data in the repository or frontend source. The existing GitHub Pages and static Vercel builds are **catalog demos**, not a secure multi-user database. Connect a server-side API and database before accepting real customer information.

## Order tracking flow

Complete the demo checkout with name, email, and phone. The API stores the new order and creates an order ID such as `NX-1001`. In **Track order**, enter that ID. In **Admin**, update its status from *Order received* through *Delivered*; the customer tracking timeline updates immediately.

## Project map

```text
src/
  App.tsx       # Storefront, cart, checkout, and demo payment state
  styles.css    # Responsive visual design and animations
  main.tsx      # React entry point
server.js        # Express API, authentication, local data seeding, and admin endpoints
data/store.json  # Created at first API request; do not commit real customer data
.env.example     # Server configuration template
```

## Design notes

Venn Spoke uses a warm paper palette, inky typography, editorial Playfair headings, and a vivid orange accent. Product photography is served remotely from Unsplash and the QR image is generated from a public QR image endpoint at runtime, so an internet connection is needed for those visual assets.

## Accessibility

- Semantic navigation, buttons, labels, and dialog roles
- Useful image alt text and explicit payment status language
- Keyboard-accessible controls
- `prefers-reduced-motion` support

---

Built as a polished demo storefront — **beautiful to explore, safe to test**.
