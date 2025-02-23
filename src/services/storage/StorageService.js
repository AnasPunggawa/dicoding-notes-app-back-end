/* eslint-disable no-underscore-dangle */
const { existsSync, mkdirSync, createWriteStream } = require('node:fs');
const { basename, join } = require('node:path');

class StorageService {
  /**
   * @param {string} folder
   */
  constructor(folder) {
    this._folder = folder;

    if (!existsSync(folder)) {
      mkdirSync(folder, { recursive: true });
    }
  }

  /**
   * @param {import('node:stream').Readable} file
   * @param {{ filename: string }} meta
   * @returns {Promise<string>}
   */
  writeFile(file, meta) {
    const sanitizedFileName = basename(meta.filename);
    // const fileName = +new Date() + meta.filename;
    const fileName = `${Date.now()}-${sanitizedFileName}`;
    const filePath = join(this._folder, fileName);

    const fileStream = createWriteStream(filePath);

    return new Promise((resolve, reject) => {
      fileStream.on('error', (error) => reject(error));
      file.on('error', (error) => reject(error));
      fileStream.on('finish', () => resolve(fileName));
      file.pipe(fileStream);
    });
  }

  /**
   * @returns {string}
   */
  getFolderPath() {
    return this._folder;
  }
}

module.exports = StorageService;
