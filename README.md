# Zeshan Learning Hub

A free, static personal learning website covering:
- SAP S/4HANA Sales & Distribution / Order-to-Cash
- Scenario-based SAP certification preparation
- SAP SD T-codes and shortcuts
- SAP SD interview questions & model answers
- DTZ B1 preparation, grammar and official model-paper links
- CV-aligned mid-level job search for Germany, Austria, Switzerland and the UK
- Local progress tracking, search and dark mode

## Run locally

Open `index.html` directly in a browser, or run:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Free hosting

### GitHub Pages
1. Create a GitHub repository.
2. Upload the contents of this folder.
3. In Settings → Pages, choose the `main` branch and `/root`.
4. Open the generated Pages URL.

### Cloudflare Pages
Upload the folder as a static site. No build command is required.

## Job updates

A static site cannot safely scrape arbitrary job boards. This version therefore:
- includes live source links for BA (Germany), AMS (Austria), Job-Room (Switzerland) and UK job search;
- includes a current seeded snapshot of selected SAP SD/OTC roles;
- provides a place for a permitted API/RSS feed updater.

The included `.github/workflows/jobs-update.yml` is intentionally a template. Add only APIs/feeds whose terms permit automated retrieval. Do not place private API secrets in `app.js`.

## Exam-content note

The SAP section is a learning aid, not an official SAP exam dump. SAP's current certification guidance says practical exams are moving toward performance-based, open-book assessments and that certification format should be checked on the specific certification page.

For DTZ, the site links to official Goethe preparation/model materials rather than reproducing copyrighted exam papers. You can add legally obtained materials under `materials/` and link them from the DTZ section.

## CV basis

The job-matching profile was built from the uploaded CV:
- SAP S/4HANA SD / OTC
- master data, pricing, delivery and billing
- UAT/testing and documentation
- Fiori / SAP GUI
- customer operations and order management
- PMP® certification
- English and German B1
- Berlin, Germany; open to relocation

## Job-level filter
The job board is intentionally focused on mid-level / consultant roles. Senior, lead, manager and architect roles are excluded from the displayed snapshot. Some countries may show a live search link rather than a verified individual posting when a current non-senior match cannot be confirmed.

- Expandable SAP process steps with detailed learning notes, checks, transaction references and exam focus.
