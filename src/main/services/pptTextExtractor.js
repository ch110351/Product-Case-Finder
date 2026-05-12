const path = require('path');
const AdmZip = require('adm-zip');
const { XMLParser } = require('fast-xml-parser');

const parser = new XMLParser({
  ignoreAttributes: false,
  parseTagValue: false,
  trimValues: true
});

function extractSlides(filePath) {
  const zip = new AdmZip(filePath);
  const slideEntries = zip
    .getEntries()
    .filter((entry) => /^ppt\/slides\/slide\d+\.xml$/i.test(normalizeZipPath(entry.entryName)))
    .sort((a, b) => getSlideNumber(a.entryName) - getSlideNumber(b.entryName));

  return slideEntries.map((entry) => {
    const xml = entry.getData().toString('utf8');
    const parsed = parser.parse(xml);
    const textParts = [];

    collectText(parsed, textParts);

    return {
      slideNumber: getSlideNumber(entry.entryName),
      textContent: normalizeText(textParts.join(' '))
    };
  });
}

function normalizeZipPath(entryName) {
  return entryName.replace(/\\/g, '/');
}

function getSlideNumber(entryName) {
  const fileName = path.basename(entryName);
  const match = fileName.match(/slide(\d+)\.xml/i);
  return match ? Number(match[1]) : 0;
}

function collectText(value, textParts) {
  if (value === null || value === undefined) {
    return;
  }

  if (typeof value === 'string' || typeof value === 'number') {
    const text = String(value).trim();

    if (text) {
      textParts.push(text);
    }

    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => collectText(item, textParts));
    return;
  }

  if (typeof value !== 'object') {
    return;
  }

  for (const [key, childValue] of Object.entries(value)) {
    if (key === 'a:t' || key === 'm:t') {
      collectText(childValue, textParts);
      continue;
    }

    if (key.startsWith('@_')) {
      continue;
    }

    collectText(childValue, textParts);
  }
}

function normalizeText(text) {
  return text.replace(/\s+/g, ' ').trim();
}

module.exports = {
  extractSlides
};
