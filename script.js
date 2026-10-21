// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

// Paste the ID from your Formspree form URL (https://formspree.io/f/<ID>).
// Leave empty until the form is created; the page falls back to email.
const FORMSPREE_ID = "";

// Email is assembled at runtime so the full address never appears in the HTML.
const EMAIL_USER = "1215932753";
const EMAIL_DOMAIN = "qq.com";
const EMAIL = EMAIL_USER + "@" + EMAIL_DOMAIN;

const form = document.getElementById("feedback-form");
const fallback = document.getElementById("form-fallback");
const status = document.getElementById("form-status");
const submitBtn = form.querySelector('button[type="submit"]');

// ---------------------------------------------------------------------------
// Optional links: any element whose link has no href hides itself
// ---------------------------------------------------------------------------

document.querySelectorAll("[data-optional]").forEach((el) => {
  const link = el.matches("a") ? el : el.querySelector("a");
  if (!link || !link.getAttribute("href")) {
    (el.closest("li") || el).hidden = true;
  } else if (!link.textContent.trim()) {
    try {
      const url = new URL(link.href);
      link.textContent = url.hostname.replace(/^www\./, "") + url.pathname.replace(/\/$/, "");
    } catch {
      link.textContent = link.getAttribute("href");
    }
  }
});

// Hide the "coming soon" note once the talk's own materials are live.
const hasMaterial = [...document.querySelectorAll(".links .pill[data-material]")]
  .some((a) => !(a.closest("li") || a).hidden && a.getAttribute("href"));
if (hasMaterial) {
  document.getElementById("materials-note").hidden = true;
}

// ---------------------------------------------------------------------------
// Email link + copy button
// ---------------------------------------------------------------------------

const emailLink = document.getElementById("email-link");
emailLink.textContent = EMAIL;
emailLink.href = "mailto:" + EMAIL;

const fallbackEmail = document.getElementById("fallback-email");
fallbackEmail.href = "mailto:" + EMAIL;

const copyBtn = document.getElementById("copy-email");
copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(EMAIL);
    copyBtn.textContent = "Copied";
  } catch {
    const range = document.createRange();
    range.selectNodeContents(emailLink);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    copyBtn.textContent = "Selected — press Ctrl/Cmd+C";
  }
  setTimeout(() => (copyBtn.textContent = "Copy"), 2200);
});

// ---------------------------------------------------------------------------
// Feedback form
// ---------------------------------------------------------------------------

if (!FORMSPREE_ID) {
  form.hidden = true;
  document.getElementById("feedback-lede").hidden = true;
  fallback.hidden = false;
} else {
  form.action = "https://formspree.io/f/" + FORMSPREE_ID;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const message = form.querySelector("#f-message");
    if (!message.value.trim()) {
      status.textContent = "Please write a short message first.";
      status.className = "status err";
      message.focus();
      return;
    }

    submitBtn.disabled = true;
    const original = submitBtn.textContent;
    submitBtn.textContent = "Sending…";
    status.textContent = "";
    status.className = "status";

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        form.reset();
        status.textContent = "Thank you — your feedback was sent.";
        status.className = "status ok";
      } else {
        const data = await response.json().catch(() => ({}));
        const detail = data.errors?.map((e) => e.message).join("; ");
        throw new Error(detail || "Submission failed.");
      }
    } catch (error) {
      status.innerHTML =
        'Something went wrong. Please email me instead: <a href="mailto:' +
        EMAIL +
        '">' +
        EMAIL +
        "</a>";
      status.className = "status err";
      console.error(error);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = original;
    }
  });
}
