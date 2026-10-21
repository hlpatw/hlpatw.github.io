# conference-landing

A single-page site for a conference talk: materials, feedback form, and contact — reachable through one QR code.

Live at <https://hlpatw.github.io>

## Editing your details

All visible text lives in `index.html`, inside the block marked `CONTENT` at the top of `<body>`:

- name, affiliation, talk title, conference/date — plain HTML in the `<header>`
- **Materials** — give a pill an `href` and it appears; leave `href=""` and it stays hidden
- **Contact** — every `<li data-optional>` hides itself until its link has an `href`. Google Scholar, ORCID, OSF, X, LinkedIn are already stubbed; just paste the URL.

The email address is assembled in `script.js` from `EMAIL_USER` + `EMAIL_DOMAIN` so the full address never sits in the HTML for scrapers to harvest.

## Connecting the feedback form

1. Sign up at <https://formspree.io> (free plan: 50 submissions/month).
2. Create a form; copy the ID from its endpoint `https://formspree.io/f/<ID>`.
3. Paste it into `FORMSPREE_ID` at the top of `script.js`.

Until an ID is set, the page hides the form and shows an "Email me" button instead. After wiring it up, send yourself one test submission.

## Adding a photo

Save it as `assets/portrait.jpg` (square, about 400×400 is plenty). The header shows initials until that file exists.

## Regenerating the QR code

```bash
pip install "qrcode[pil]"
python tools/make_qr.py
```

Outputs `qr/landing-qr.png` (1184 px) and `qr/landing-qr.svg`. Both use error-correction level H, so they still scan under projection glare or a blurry phone photo.

## Publishing

The repository name `hlpatw.github.io` makes GitHub serve it at the account root.

```bash
git add -A
git commit -m "Update talk page"
git push
```

Pages rebuilds automatically in about a minute.

## Notes

- No analytics, no cookies, no external fonts or CDNs — the page opens fast from both the US and China.
- Dark mode follows the visitor's system setting.
- If the QR fails, the footer shows the plain address as a fallback.
