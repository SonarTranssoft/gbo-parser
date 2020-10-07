const Parser = require('./parser');
const parser = new Parser();

const ImagesManager = require('./images-manager');
const imagesManager = new ImagesManager();

const ExcelManager = require('./excel');
const excelManager = new ExcelManager();

const cliProgress = require('cli-progress');
const _colors = require('colors');
const fs = require('fs');

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

  // превратим каталог в массив, для убоной работы
  const catalogArray = [];

  for (let code in catalog) {
    catalogArray.push(catalog[code]);
  }

  // оставляем только каталоги с уровнем глубины "2", т.е. те что сразу в /catalog/
  const workbooks = catalogArray.filter(e => e.parent === '/catalog/');

  if (!fs.existsSync(`${__dirname}/output`)) {
    fs.mkdirSync(`${__dirname}/output`);
  }

  for (let i = 0; i < workbooks.length; i++) {

    excelManager.newBook();

    if (workbooks[i].products && Array.isArray(workbooks[i].products)) {

      // продукты находятся в корне подкаталога
      excelManager.newWorksheet(workbooks[i].title);
      excelManager.addProductRows(workbooks[i].products);

    } else {

      const subCatalogs = catalogArray.filter(e => e.parent === workbooks[i].code);

      for (let j = 0; j < subCatalogs.length; j++) {

        if (!subCatalogs[j].products || !Array.isArray(subCatalogs[j].products)) continue;

        excelManager.newWorksheet(subCatalogs[j].title);
        excelManager.addProductRows(subCatalogs[j].products);

      }

    }

    try {
      await excelManager.toFile(`${__dirname}/output/${workbooks[i].title}.xlsx`);
    } catch (e) {
      console.error('Не удалось записать файл');
      console.error(e);
    }

  }

  console.log(_colors.green('Done!'));

}
init();
