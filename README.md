# ISCC — Industrial Safety Compliance Checker

A local educational screening demo for reviewing safety procedure documents. It extracts PDF/DOCX text, applies transparent keyword-based demo rules, saves each audit in SQLite, and creates a PDF report. It is not AI, legal advice, comprehensive regulatory validation, or official certification; a qualified person must review every result.

## Requirements

- Windows 10/11, Python 3.10+ (tested with Python 3.13), Node.js 20+ and npm.
- Internet access during first setup to install packages.

## Setup and launch

1. Extract the ZIP to a folder you can write to.
2. Double-click `setup.bat` (or run it from Command Prompt). It creates `backend\.venv` and installs Python and frontend dependencies.
3. Double-click `run_iscc.bat`. It serves the app at http://127.0.0.1:5173. Document analysis runs in the browser; the backend API is retained for local development but is not needed by the website.
4. Use **Start Free Audit**, choose a PDF or DOCX, and open History to revisit saved results. `sample_documents\sample_safety_procedure.docx` is provided for a demo.

Keep the launch window open while using the app. Stop it with Ctrl+C. If a port is occupied, close the other process using it and retry.

## Storage and handover

The website stores audit history in the browser's local storage. It does not upload documents to the website, and a different browser or device has its own separate history. To hand over source, ZIP the `iscc` folder after setup is complete; do not include `backend\.venv`, `frontend\node_modules`, or `backend\data`. A friend runs `setup.bat` on their own laptop.

## Troubleshooting

- **Python/npm not found:** install Python 3.10+ and Node.js 20+, enable PATH options, then reopen Command Prompt.
- **Install fails:** check internet access and retry `setup.bat`; package installation uses the standard Python/npm registries.
- **Port conflict:** close the process using 8000 or 5173 and relaunch.
- **Upload/report error:** PDFs must contain extractable text (OCR is not included); try a DOCX or text-based PDF. Uploads are limited to 20 MiB.
- **No browser opens:** visit http://127.0.0.1:5173 manually.

## How the demo score works

Seven configurable demo checks run against extracted text. Each missing topic creates a finding. Score = rounded percentage of checks whose topic was detected. Rules are internal educational examples, not citations to regulatory clauses.

## Developer checks

From `backend`, run `.venv\Scripts\python.exe -m unittest discover -v`. From `frontend`, run `npm run build`.

## Free website deployment (Vercel Hobby)

The hosted build is a static Vite site. PDF/DOCX text extraction, screening, and report creation run in the visitor's browser; uploaded files are not sent to a server. Audit history is stored in that browser's local storage, so each person has a separate history on each device.

1. Push the project to the public GitHub repository.
2. Sign in to Vercel and import `kaushiki-bruh/iscc-industrial-safety-compliance-checker`.
3. Keep the account on **Hobby (Free)**. Vercel should read `vercel.json`; confirm the build command uses `frontend` and the output directory is `frontend/dist`.
4. Deploy, then share the resulting `vercel.app` URL. Future pushes to `main` redeploy the site.

Vercel Hobby is free for personal, non-commercial projects. It pauses Hobby projects when included usage limits are exceeded instead of charging overages. Do not upgrade to Pro or enable paid add-ons. See [Vercel Hobby plan details](https://vercel.com/docs/plans/hobby).

**Privacy:** each visitor's uploaded document is processed on their own device. Reports and history are available only in that same browser unless the visitor downloads a report; there is no shared server history or account system.
