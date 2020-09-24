const Parser = require('./parser');
const ImagesManager = require('./images-manager');
const cliProgress = require('cli-progress');
const _colors = require('colors');

const imagesManager = new ImagesManager();
const parser = new Parser();

async function init() {

  const catalog = await parser.getCatalog();

  /** Прогресс создания картинок */
  const parseBar = new cliProgress.SingleBar({
    clearOnComplete: true,
    hideCursor: true,
    stopOnComplete: true,
    format: 'Images creating Progress |' + _colors.cyan('{bar}') + '| {percentage}% || {value}/{total}',
  }, cliProgress.Presets.shades_grey);

  parseBar.start(parser.totalProductsAmount, 0);

  for (let code in catalog) {
    const item = catalog[code];

    if (!item.products || !Array.isArray(item.products)) continue;

    for (let i = 0; i < item.products.length; i++) {
      await imagesManager.download(item.products[i].image);

      parseBar.increment();
    }

  }

  parseBar.stop();

  console.log(_colors.green('Images created!'));

}
init();
