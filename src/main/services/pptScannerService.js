const fs = require('fs');
const path = require('path');

const dbService = require('./dbService');
const indexService = require('./indexService');
const pptTextExtractor = require('./pptTextExtractor');

const status = {
  state: 'idle',
  message: 'Ready.',
  folderPath: '',
  totalFiles: 0,
  processedFiles: 0,
  indexedFiles: 0,
  indexedSlides: 0,
  errorCount: 0,
  currentFile: '',
  startedAt: null,
  finishedAt: null
};

let isRebuilding = false;

async function rebuildIndex(folderPath) {
  if (isRebuilding) {
    return {
      ok: false,
      error: 'Index rebuild is already running.',
      status: getStatus()
    };
  }

  if (!folderPath || !fs.existsSync(folderPath) || !fs.statSync(folderPath).isDirectory()) {
    return {
      ok: false,
      error: 'Please select a valid folder before rebuilding the index.',
      status: getStatus()
    };
  }

  isRebuilding = true;
  resetStatus(folderPath);

  const errors = [];

  try {
    const pptFiles = findPptxFiles(folderPath);
    status.totalFiles = pptFiles.length;
    status.message = `Found ${pptFiles.length} PPTX file(s).`;

    dbService.transaction(() => {
      indexService.clearIndex();
    });

    for (const filePath of pptFiles) {
      status.currentFile = filePath;
      status.processedFiles += 1;
      status.message = `Indexing ${path.basename(filePath)} (${status.processedFiles}/${status.totalFiles})`;

      try {
        const stats = fs.statSync(filePath);
        const slides = pptTextExtractor.extractSlides(filePath);

        dbService.transaction(() => {
          const pptId = indexService.insertPptFile(filePath, stats);

          for (const slide of slides) {
            const slideId = indexService.insertSlideContent(pptId, slide);
            indexService.insertSearchIndex(pptId, slideId, slide);
          }
        });

        status.indexedFiles += 1;
        status.indexedSlides += slides.length;
      } catch (error) {
        status.errorCount += 1;
        errors.push({
          filePath,
          message: error.message
        });
      }

      await yieldToEventLoop();
    }

    status.state = 'complete';
    status.currentFile = '';
    status.finishedAt = new Date().toISOString();
    status.message = `Indexed ${status.indexedSlides} slide(s) from ${status.indexedFiles} PPTX file(s).`;

    return {
      ok: true,
      summary: {
        totalFiles: status.totalFiles,
        indexedFiles: status.indexedFiles,
        indexedSlides: status.indexedSlides,
        errorCount: status.errorCount
      },
      errors,
      stats: dbService.getIndexStats()
    };
  } catch (error) {
    status.state = 'error';
    status.message = error.message;
    status.finishedAt = new Date().toISOString();

    return {
      ok: false,
      error: error.message,
      errors,
      status: getStatus()
    };
  } finally {
    isRebuilding = false;
  }
}

function resetStatus(folderPath) {
  status.state = 'running';
  status.message = 'Preparing index rebuild...';
  status.folderPath = folderPath;
  status.totalFiles = 0;
  status.processedFiles = 0;
  status.indexedFiles = 0;
  status.indexedSlides = 0;
  status.errorCount = 0;
  status.currentFile = '';
  status.startedAt = new Date().toISOString();
  status.finishedAt = null;
}

function findPptxFiles(folderPath) {
  const results = [];
  const entries = fs.readdirSync(folderPath, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = path.join(folderPath, entry.name);

    if (entry.isDirectory()) {
      results.push(...findPptxFiles(entryPath));
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    if (isPptxFile(entry.name)) {
      results.push(entryPath);
    }
  }

  return results.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
}

function isPptxFile(fileName) {
  const lowerName = fileName.toLowerCase();
  return lowerName.endsWith('.pptx') && !lowerName.startsWith('~$');
}

function getStatus() {
  return {
    ...status
  };
}

function yieldToEventLoop() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

module.exports = {
  rebuildIndex,
  getStatus
};
