# ISCC — Industrial Safety Compliance Checker

A local educational screening demo for reviewing safety procedure documents. It extracts PDF/DOCX text, applies transparent keyword-based demo rules, saves each audit in SQLite, and creates a PDF report. It is not AI, legal advice, comprehensive regulatory validation, or official certification; a qualified person must review every result.

## Requirements

- Windows 10/11, Python 3.10+ (tested with Python 3.13), Node.js 20+ and npm.
- Internet access during first setup to install packages.

## Setup and launch

1. Extract the ZIP to a folder you can write to.
2. Double-click `setup.bat` (or run it from Command Prompt). It creates `backend\.venv` and installs Python and frontend dependencies.
3. Double-click `run_iscc.bat`. The API starts at http://127.0.0.1:8000 and Vite serves the app at http://127.0.0.1:5173.
4. Use **Start Free Audit**, choose a PDF or DOCX, and open History to revisit saved results. `sample_documents\sample_safety_procedure.docx` is provided for a demo.

Keep the launch window open while using the app. Stop it with Ctrl+C. If a port is occupied, close the other process using it and retry.

## Storage and handover

The API creates `backend\data\iscc.sqlite3` and `backend\data\uploads\` on first run. These contain local audit metadata and uploaded files. They are excluded from a clean source ZIP by `.gitignore`. To hand over source, ZIP the `iscc` folder after setup is complete; do not include `backend\.venv`, `frontend\node_modules`, or `backend\data`. A friend runs `setup.bat` on their own laptop.

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

## Public website deployment (Render)

This repo includes a Dockerfile and Render Blueprint. After pushing it to GitHub:

1. Sign in to Render and connect the public GitHub repository.
2. Create a new **Blueprint** from that repository and review `render.yaml` before applying it. It creates a public web service on Render's **Free** plan, with no persistent disk.
3. Wait for the deploy to finish, then open the `onrender.com` URL shown for the service. The app and `/api` run on the same origin; `/api/health` is the health check.
4. Send that URL to your friend. Later pushes to `main` can trigger redeployment.

**Free plan limits:** Render spins down an idle Free web service; its next visit can take about a minute to load. Its filesystem is temporary, so SQLite audit history and uploaded files can disappear whenever Render restarts, spins down, or redeploys the service. See [Render's Free instance limits](https://render.com/docs/free).

**Public access warning:** anyone can open this site, upload documents, and view the shared audit history and generated reports while they remain available. Do not upload confidential or personal documents. The current demo has no login, quota, or per-user data separation.
