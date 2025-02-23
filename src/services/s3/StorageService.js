/* eslint-disable no-underscore-dangle */

/**
 * @typedef {import('node:stream').Readable} Readable
 */

/**
 * @typedef HapiFileMetaData
 * @property {string} filename
 * @property {{'content-disposition': string, 'content-type': string}} headers
 */

/**
 * @typedef GetObjectCommandInput
 * @property {string} bucket
 * @property {string} key
 */

const process = require('node:process');
const { basename } = require('node:path');

const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

class StorageService {
  constructor() {
    this._s3 = new S3Client({
      region: String(process.env.AWS_REGION),
      credentials: {
        accessKeyId: String(process.env.AWS_ACCESS_KEY_ID),
        secretAccessKey: String(process.env.AWS_SECRET_ACCESS_KEY),
      },
    });
  }

  /**
   * @param {Readable} file
   * @param {HapiFileMetaData} meta
   * @returns {Promise<string>}
   * @throws {Error}
   */
  async writeFile(file, meta) {
    const sanitizedFileName = basename(meta.filename);

    const parameter = new PutObjectCommand({
      Bucket: String(process.env.AWS_BUCKET_NAME),
      Key: sanitizedFileName,
      // @ts-ignore
      Body: file._data,
      ContentType: meta.headers['content-type'],
    });

    const anas = await this._s3.send(parameter);

    console.log('anas', anas);

    return this.createPresignedUrl({
      bucket: String(process.env.AWS_BUCKET_NAME),
      key: sanitizedFileName,
    });
  }

  /**
   * @param {GetObjectCommandInput} input
   * @returns {Promise<string>}
   * @throws {Error}
   */
  async createPresignedUrl({ bucket, key }) {
    const command = new GetObjectCommand({ Bucket: bucket, Key: key });

    const url = await getSignedUrl(this._s3, command, { expiresIn: 3600 });

    console.log('url', url);

    return url;
  }
}

module.exports = StorageService;
