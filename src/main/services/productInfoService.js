const { shell } = require('electron');
const cheerio = require('cheerio');

const CYP_PRODUCT_SEARCH_URL = 'https://www.cypress.com.tw/tw/Home/SearchResult';
const CYP_ORIGIN = 'https://www.cypress.com.tw';

async function openProductInfo(productName) {
  const keyword = normalizeProductName(productName);

  if (!keyword) {
    return {
      ok: false,
      error: 'Please enter a product name before opening product information.'
    };
  }

  const url = buildProductSearchUrl(keyword);
  await shell.openExternal(url);

  return {
    ok: true,
    url
  };
}

async function getProductSummary(productName) {
  const keyword = normalizeProductName(productName);

  if (!keyword) {
    return {
      ok: false,
      error: 'Please enter a product name before loading product information.'
    };
  }

  try {
    const searchUrl = buildProductSearchUrl(keyword);
    const searchHtml = await fetchText(searchUrl);
    const detailUrl = findProductDetailUrl(searchHtml, keyword);

    if (!detailUrl) {
      return {
        ok: false,
        error: `No CYP product detail page was found for "${keyword}".`,
        searchUrl
      };
    }

    const detailHtml = await fetchText(detailUrl);
    const summary = parseProductDetail(detailHtml, detailUrl, keyword);

    return {
      ok: true,
      summary
    };
  } catch (error) {
    return {
      ok: false,
      error: `Unable to load CYP product information: ${error.message}`
    };
  }
}

async function openProductDetailUrl(url) {
  if (!isTrustedCypUrl(url)) {
    return {
      ok: false,
      error: 'Invalid CYP product detail URL.'
    };
  }

  await shell.openExternal(url);

  return {
    ok: true,
    url
  };
}

function buildProductSearchUrl(productName) {
  const params = new URLSearchParams({
    search_keyword: productName,
    SearchAll: 'False',
    SearchNews: 'False',
    SearchEvents: 'False',
    SearchPro: 'True'
  });

  return `${CYP_PRODUCT_SEARCH_URL}?${params.toString()}`;
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      'user-agent': 'CYP Product Case Finder'
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.text();
}

function findProductDetailUrl(html, productName) {
  const $ = cheerio.load(html);
  const normalizedProductName = productName.toLowerCase();
  const candidates = [];

  $('a[href*="/tw/Product/"]').each((_index, element) => {
    const linkText = cleanText($(element).text());
    const href = $(element).attr('href') || '';
    const absoluteUrl = toAbsoluteUrl(href);

    if (!absoluteUrl) {
      return;
    }

    const decodedHref = safeDecodeUri(absoluteUrl).toLowerCase();
    const normalizedLinkText = linkText.toLowerCase();
    const score = getProductLinkScore(normalizedProductName, normalizedLinkText, decodedHref);

    if (score > 0) {
      candidates.push({
        url: absoluteUrl,
        score
      });
    }
  });

  candidates.sort((a, b) => b.score - a.score);
  return candidates[0]?.url || null;
}

function getProductLinkScore(productName, linkText, href) {
  let score = 0;

  if (linkText === productName) {
    score += 100;
  } else if (linkText.includes(productName)) {
    score += 70;
  }

  if (href.endsWith(`/${productName}`)) {
    score += 60;
  } else if (href.includes(`/${productName}`)) {
    score += 40;
  }

  return score;
}

function parseProductDetail(html, detailUrl, requestedProductName) {
  const $ = cheerio.load(html);
  const title = cleanText($('.detail-info .pro-info h1, .detail-info .pro-info h2, .detail-info .pro-info h3, .detail-info .pro-info h4, .detail-info .pro-info h5').first().text()) ||
    cleanText($('title').first().text()) ||
    requestedProductName;
  const description = cleanText($('meta[name="description"]').attr('content') || '');
  const subtitle = findSubtitle($, requestedProductName);
  const features = findFeatureItems($);

  return {
    productName: title,
    subtitle,
    description,
    features,
    sourceUrl: detailUrl
  };
}

function findSubtitle($, productName) {
  const detailSubtitle = cleanText($('.detail-info .pro-info > p').first().text());

  if (detailSubtitle) {
    return detailSubtitle;
  }

  const productHeading = $('main h1, main h2, main h3, main h4, main h5')
    .filter((_index, element) => cleanText($(element).text()).toLowerCase() === productName.toLowerCase())
    .first();

  if (productHeading.length) {
    const subtitle = cleanText(productHeading.parent().find('p.f-bold, p.text-dark').first().text());

    if (subtitle) {
      return subtitle;
    }
  }

  const fallbackSubtitle = cleanText($('main p.f-bold.text-dark, main p.f-bold').first().text());
  return fallbackSubtitle;
}

function findFeatureItems($) {
  const featureItems = [];
  const seen = new Set();

  $('.detail-info .pro-info .bg-block li, main li').each((_index, element) => {
    const text = cleanText($(element).text());

    if (!isUsefulFeatureText(text) || seen.has(text)) {
      return;
    }

    seen.add(text);
    featureItems.push(text);
  });

  return featureItems.slice(0, 8);
}

function isUsefulFeatureText(text) {
  if (text.length < 12 || text.length > 220) {
    return false;
  }

  const ignoredTexts = [
    '應用案例',
    '產品',
    '新聞訊息',
    '展覽及活動',
    '下載',
    'English',
    '繁體中文'
  ];

  return !ignoredTexts.some((ignoredText) => text.includes(ignoredText));
}

function toAbsoluteUrl(href) {
  if (!href || href.startsWith('#')) {
    return null;
  }

  if (href.startsWith('http://') || href.startsWith('https://')) {
    return href;
  }

  if (href.startsWith('/')) {
    return `${CYP_ORIGIN}${href}`;
  }

  return `${CYP_ORIGIN}/${href}`;
}

function safeDecodeUri(value) {
  try {
    return decodeURI(value);
  } catch (_error) {
    return value;
  }
}

function isTrustedCypUrl(url) {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'https:' && parsedUrl.hostname === 'www.cypress.com.tw';
  } catch (_error) {
    return false;
  }
}

function normalizeProductName(productName) {
  return String(productName || '').trim();
}

function cleanText(text) {
  return String(text || '')
    .replace(/\s+/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .trim();
}

module.exports = {
  openProductInfo,
  openProductDetailUrl,
  getProductSummary,
  buildProductSearchUrl
};
