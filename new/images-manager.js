const fs = require('fs');
const axios = require('axios');
const sharp = require('sharp');
const tunnel = require('tunnel');

/** Обработчик изображений */
module.exports = class ImagesManager {

  imagesPath = __dirname + '/images/products';
  images = new Map();

  client = axios.create({
    baseURL: 'https://www.mirgaza.ru',
    // httpsAgent: tunnel.httpsOverHttp({
    //   proxy: {
    //     host: '193.31.103.37',
    //     port: 9477,
    //     proxyAuth: 'CcxHv8:6ymQqU'
    //   }
    // }),
    // proxy: false
  });

  constructor() {
    // создать каталог изображений
    this._createPath(this.imagesPath)
      .then(() => {

        // запомнить уже созданные изображения
        fs.readdir(this.imagesPath, (err, files) => {
          files.forEach(file => {
            this.images.set(file, true);
          });
        });

      });

  }

  /** Скачать изображение по ссылке */
  async download(url) {

    const imageName = url.split('/').pop();

    if (this.images.has(imageName)) return; // такая картинка уже создана

    const buffer = await this._getImageBufferFromUrl(url);

    await this._createImage(buffer, this.imagesPath + '/' + imageName);

    this.images.set(imageName, true);

    return;

  }

  _getImageBufferFromUrl(url) {

    return this.client
      .get(url, {
        responseType: 'arraybuffer'
      })
      .then(response => {
        return Buffer.from(response.data, 'binary')
      });

  }

  async _createImage(imageBuffer, pathToSave) {

    try {
      const resizedBuffer = await sharp(imageBuffer).resize(512, 512).toBuffer();
      await sharp(resizedBuffer).toFile(pathToSave);
    } catch (e) {
      throw new Error(e);
    }

    return;

  }

  _createPath(path) {

    return new Promise((resolve, reject) => {

      fs.mkdir(path, { recursive: true }, (err) => {
        if (err) return reject(err);
        return resolve();
      });

    });
  }
}
