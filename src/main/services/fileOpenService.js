const fs = require('fs');
const { shell } = require('electron');

async function openPpt(filePath) {
  if (!filePath || !fs.existsSync(filePath)) {
    return {
      ok: false,
      error: 'The PPT file does not exist.'
    };
  }

  const errorMessage = await shell.openPath(filePath);

  if (errorMessage) {
    return {
      ok: false,
      error: errorMessage
    };
  }

  return {
    ok: true
  };
}

module.exports = {
  openPpt
};
