# CYP Product Case Finder

Windows desktop tool for scanning PowerPoint `.pptx` files, building a local SQLite index, and searching where CYP product names appear by PPT file and slide number.

## Tech Stack

- Electron
- Node.js
- HTML / CSS / Vanilla JavaScript
- SQLite via `sql.js`
- Windows desktop app

## Run

```powershell
npm.cmd install
npm.cmd start
```

Use `npm.cmd` on Windows PowerShell if script execution policy blocks `npm.ps1`.

## Current MVP Flow

1. Launch the app.
2. Click `Change Folder`.
3. Select a folder that contains `.pptx` files.
4. Click `Rebuild Index`.
5. Enter a product keyword.
6. Review matched PPT files and slide numbers.
7. Click `Open PPT` to open the original file in Windows.

## Project Structure

```text
src/
  database/
    schema.sql
  main/
    main.js
    preload.js
    services/
      configService.js
      dbService.js
      fileOpenService.js
      indexService.js
      pptScannerService.js
      pptTextExtractor.js
      searchService.js
  renderer/
    index.html
    renderer.js
    style.css
```

## Notes

- Only `.pptx` files are indexed.
- PowerPoint temporary files such as `~$example.pptx` are ignored.
- OCR, AI search, cloud sync, login, and SharePoint integration are out of MVP scope.
