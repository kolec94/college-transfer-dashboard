# College transfer dashboard

A static GitHub Pages dashboard for comparing six transfer options. It contains no transcript PDFs or personal identifiers.

## Use it

Serve this folder with a local web server (for example `python3 -m http.server 8000`) or open the published site. The page loads `data/schools.json`, so opening `index.html` directly as a file may not work.

To update a school's status or comparison fields, edit `data/schools.json` in the GitHub repository and commit the change to `main`. The published dashboard reads that file, so everyone sees the same information after Pages deploys. A public Pages site makes committed data public, so do not enter private notes, dates of birth, student numbers, or transcript files.

The site follows your device's light or dark setting by default. Use the theme button in the header to override it; that choice is saved in your browser.

The 69 EICC credits are semester credits. Purdue Global's 10 additional earned credits are quarter credits and are deliberately shown separately. Transfer credit, residency, and tuition fields remain unconfirmed until verified. Get EICC courses approved by the receiving school in writing before taking them.

## Transcript references

The `transcripts/` folder contains [EICC](transcripts/EICC-redacted.pdf) and [Purdue Global](transcripts/Purdue-Global-redacted.pdf) **redacted public copies**. Names, birth details, and student numbers were covered before export. These image-based copies are for personal comparison; send official transcripts directly from the schools when applying. The unredacted originals are not in this public repository.

## Enable GitHub Pages

Open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, select **main** and **/(root)**, then save. The expected URL is `https://kolec94.github.io/college-transfer-dashboard/` after GitHub reports a successful deployment.

## Data

`data/schools.json` is the shared source. The interface escapes user text before rendering. No backend, account, or build step is required.
