# Copilot instructions for this repository

This is a small static/personal portfolio site (HTML/CSS/JS) with a simple PHP contact endpoint. Below are concise, actionable notes to help an AI coding agent be productive in this codebase.

- **Project type:** Static site with optional PHP contact handler. Main files: [index.html](index.html), [styles.css](styles.css), [script.js](script.js), [contact.php](contact.php).
- **Serve & test locally:** Open `index.html` in the browser for static checks. To exercise the contact endpoint and PHP behavior run a local PHP server from the project root:

  php -S localhost:8000

  Then visit http://localhost:8000/

- **Contact form behavior:** The form in `index.html` is handled by `script.js` which uses `FormData` and will POST to the form `action`. If `action` is empty the client simulates success. The server handler is `contact.php` which expects POST JSON responses and includes a honeypot field named `website` (bots) and basic sanitization/validation.

- **Notable JavaScript patterns:**
  - Theme toggling: `script.js` stores theme in `localStorage` under `theme`. Default mode is `'dark'` (see `initTheme()`).
  - Nav overflow: desktop breakpoint `DESKTOP_BREAKPOINT = 900`; the script keeps the first 6 primary nav items and moves the remainder into a `More` dropdown (see `buildMenus()` logic).
  - Contact form submission: uses `fetch(action, { method: 'POST', body: formData })` when `action` exists; otherwise simulated delay with `sleep(600)`.

- **Config & placeholders:** `assets/config.js` contains placeholders (`__CLIENT_ID__`, `__API_KEY__`, `__PROPERTY_ID__`). Update these when integrating analytics/third-party services. Google Analytics ID in `index.html` is a placeholder `G-XXXXXXXXXX`.

- **Assets & structure:** Static assets (images, logos, certificates, resume) live under `assets/` (e.g., `assets/logos/`, `assets/certificates/`, `assets/Resume_Prasenjit_Das.pdf`). Blog posts are under `assets/posts/`.

- **Editing guidance & conventions:**
  - Keep markup semantic and accessible: existing code uses ARIA attributes (e.g., `aria-expanded`, `aria-label`) and keyboard handlers — preserve these when changing UI behavior.
  - Avoid changing `DESKTOP_BREAKPOINT` or the DOM structure of the primary nav without updating `script.js` — nav overflow depends on top-level `li` order.

- **When modifying contact flow:**
  - If adding a server endpoint, ensure it returns JSON with `{ success: boolean, message: string }` (matching `script.js` handling).
  - Preserve the honeypot field name `website` and the anti-injection pattern used in `contact.php` (search for `content-type|bcc:|cc:|to:`).

- **Quick code pointers (examples):**
  - Theme default: `const mode = saved || 'dark';` in `script.js`.
  - Nav overflow keep count: `const keep = 6;` in `script.js`.
  - Contact honeypot check: `if (!empty($_POST['website'])) { echo json_encode(['success' => true]); exit; }` in `contact.php`.

- **No build system / tests present:** This repo is not using a bundler or test runner. Changes should be manually validated in a browser and via `php -S` for PHP endpoints.

If any parts of the codebase need more detail (CI, deployment, external integrations), tell me which area to expand and I'll update these instructions.
