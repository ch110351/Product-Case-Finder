const folderPathEl = document.getElementById('folderPath');
const selectFolderButton = document.getElementById('selectFolderButton');
const rebuildButton = document.getElementById('rebuildButton');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const summaryText = document.getElementById('summaryText');
const resultList = document.getElementById('resultList');
const progressText = document.getElementById('progressText');
const progressCount = document.getElementById('progressCount');
const scanProgress = document.getElementById('scanProgress');

let currentFolderPath = '';
let statusTimer = null;

function setSummary(message) {
  summaryText.textContent = message;
}

function setFolderPath(folderPath) {
  currentFolderPath = folderPath || '';
  folderPathEl.textContent = folderPath || 'No folder selected';
  folderPathEl.title = folderPath || '';
}

function renderScanStatus(status) {
  const totalFiles = status.totalFiles || 0;
  const processedFiles = status.processedFiles || 0;
  const progressValue = totalFiles > 0 ? Math.round((processedFiles / totalFiles) * 100) : 0;

  progressText.textContent = status.message || 'Scan engine is idle.';
  progressCount.textContent = `${processedFiles} / ${totalFiles}`;
  scanProgress.value = progressValue;
}

function renderEmpty(message) {
  resultList.innerHTML = '';
  const empty = document.createElement('p');
  empty.className = 'empty-state';
  empty.textContent = message;
  resultList.appendChild(empty);
}

function renderError(message) {
  resultList.innerHTML = '';
  const error = document.createElement('p');
  error.className = 'error-state';
  error.textContent = message;
  resultList.appendChild(error);
}

function renderResults(results) {
  resultList.innerHTML = '';

  if (!results.length) {
    renderEmpty('No matching results.');
    return;
  }

  const groupedResults = groupResultsByPpt(results);

  for (const group of groupedResults) {
    const item = document.createElement('article');
    item.className = 'ppt-result-group';

    const header = document.createElement('div');
    header.className = 'ppt-result-header';

    const title = document.createElement('h3');
    title.className = 'result-title';
    title.textContent = group.fileName;

    const meta = document.createElement('p');
    meta.className = 'result-meta';
    meta.textContent = `${group.matches.length} matched slide(s)`;

    const path = document.createElement('p');
    path.className = 'result-path';
    path.textContent = group.filePath;

    const headerText = document.createElement('div');
    headerText.append(title, meta, path);

    const openButton = document.createElement('button');
    openButton.type = 'button';
    openButton.textContent = 'Open PPT';
    openButton.addEventListener('click', async () => {
      openButton.disabled = true;
      try {
        const response = await window.cypApi.openPpt(group.filePath);
        if (!response.ok) {
          setSummary(response.error || 'Unable to open PPT.');
        }
      } finally {
        openButton.disabled = false;
      }
    });

    header.append(headerText, openButton);

    const slideList = document.createElement('div');
    slideList.className = 'slide-match-list';

    for (const matchResult of group.matches) {
      const slideItem = document.createElement('div');
      slideItem.className = 'slide-match-item';

      const slideNumber = document.createElement('p');
      slideNumber.className = 'slide-number';
      slideNumber.textContent = `Slide ${matchResult.slideNumber}`;

      const match = document.createElement('p');
      match.className = 'match-text';
      match.textContent = matchResult.matchedText || matchResult.textContent || '';

      slideItem.append(slideNumber, match);
      slideList.appendChild(slideItem);
    }

    item.append(header, slideList);
    resultList.appendChild(item);
  }
}

function groupResultsByPpt(results) {
  const groups = new Map();

  for (const result of results) {
    const key = result.filePath;

    if (!groups.has(key)) {
      groups.set(key, {
        fileName: result.fileName,
        filePath: result.filePath,
        matches: []
      });
    }

    groups.get(key).matches.push(result);
  }

  return Array.from(groups.values());
}

async function loadStartupState() {
  const state = await window.cypApi.getStartupState();
  setFolderPath(state.folderPath);
  renderScanStatus(await window.cypApi.getScanStatus());

  const slideCount = state.stats?.slideCount ?? 0;
  const pptCount = state.stats?.pptCount ?? 0;
  setSummary(`Ready. Current index has ${slideCount} slides from ${pptCount} PPT files.`);
}

async function selectFolder() {
  selectFolderButton.disabled = true;
  try {
    const response = await window.cypApi.selectFolder();
    setFolderPath(response.folderPath);

    if (response.canceled) {
      setSummary('Folder selection canceled.');
      return;
    }

    setSummary('Folder saved. Click Rebuild Index to scan PPTX files.');
  } catch (error) {
    setSummary(`Folder selection failed: ${error.message}`);
  } finally {
    selectFolderButton.disabled = false;
  }
}

async function rebuildIndex() {
  if (!currentFolderPath) {
    setSummary('Please select a folder before rebuilding the index.');
    return;
  }

  setBusyState(true);
  renderEmpty('Rebuilding index...');
  setSummary('Rebuilding index. Large folders may take a while.');
  startStatusPolling();

  try {
    const response = await window.cypApi.rebuildIndex(currentFolderPath);

    if (!response.ok) {
      renderError(response.error || 'Index rebuild failed.');
      setSummary(response.error || 'Index rebuild failed.');
      return;
    }

    const { indexedSlides, indexedFiles, errorCount } = response.summary;
    renderEmpty('Index rebuild complete. Enter a product name to search.');
    setSummary(`Indexed ${indexedSlides} slide(s) from ${indexedFiles} PPTX file(s). ${errorCount} file(s) failed.`);
  } catch (error) {
    renderError(error.message);
    setSummary('Index rebuild failed.');
  } finally {
    stopStatusPolling();
    renderScanStatus(await window.cypApi.getScanStatus());
    setBusyState(false);
  }
}

function setBusyState(isBusy) {
  selectFolderButton.disabled = isBusy;
  rebuildButton.disabled = isBusy;
  searchButton.disabled = isBusy;
  searchInput.disabled = isBusy;
}

function startStatusPolling() {
  stopStatusPolling();
  statusTimer = setInterval(async () => {
    renderScanStatus(await window.cypApi.getScanStatus());
  }, 350);
}

function stopStatusPolling() {
  if (statusTimer) {
    clearInterval(statusTimer);
    statusTimer = null;
  }
}

async function search() {
  const keyword = searchInput.value.trim();

  if (!keyword) {
    renderEmpty('Enter a product name to search.');
    setSummary('Search keyword is empty.');
    return;
  }

  searchButton.disabled = true;
  try {
    const response = await window.cypApi.search(keyword);
    renderResults(response.results);
    const pptCount = groupResultsByPpt(response.results).length;
    setSummary(`Found ${response.total} slide result(s) in ${pptCount} PPT file(s) for "${keyword}".`);
  } catch (error) {
    renderError(error.message);
    setSummary('Search failed.');
  } finally {
    searchButton.disabled = false;
  }
}

selectFolderButton.addEventListener('click', selectFolder);
rebuildButton.addEventListener('click', rebuildIndex);
searchButton.addEventListener('click', search);
searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    search();
  }
});

loadStartupState().catch((error) => {
  renderError(error.message);
  setSummary('Application startup failed.');
});
