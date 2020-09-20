const axios = require('axios');
const cheerio = require('cheerio');
const tunnel = require('tunnel')
const Excel = require('exceljs');
const Chapter = require('./models/chapter');
const Product = require('./models/product');

// картинка
// артикул
// наименование
// Детальное описание
// производитель
// цена
var globalCatalog = new Map();

const BASE_URL = 'https://www.mirgaza.ru';

/** Сделать запрос, и вернуть результат калалога с id равным link */
async function getCatalog(link) {

  // результат уже как удобно сформируй
  const result = [];
  const chapters = [];
  const agent = tunnel.httpsOverHttp({
    proxy: {
      host: '193.31.103.37',
      port: 9477,
      proxyAuth: 'CcxHv8:6ymQqU'
    }
  });

  try {
    console.log('Сканирую страницу...' + link);
    const {data} = await axios({
      method: 'GET',
      url: BASE_URL + link,
      httpsAgent: agent,
      proxy: false
    });

    const $ = cheerio.load(data);

    if ($('.group_list').length) {
      $('.group_list').find('.group_list_item').each(function () {
        chapters.push(new Chapter($(this).attr('title'), link, false, $(this).attr('href')))
      });

      result.push(...chapters);

      for (let i = 0; i < chapters.length; i++) {
        result.push(...await getCatalog(chapters[i].link));
      }

      console.log('Страница ' + link + ' просканирована');

    } else if ($('.shop_block').length) {
      console.log(link + ' Дошли до товаров в этой категории');
      $('.shop_table').find('div.description_sell').each(function () {
        result.push(new Chapter($(this).text().trim(), link, true, $(this).find('a').attr('href')))
      });
    }

    return result;

  } catch (e) {
    throw new Error(e);
  }
}

async function getProductDataItem(link) {

  const productData = [];

  try {
    const {data} = await axios({
      method: "GET",
      url: BASE_URL + link
    });

    const $ = cheerio.load(data);

    $('div.shop_full_item_right').find('span.full_title').each(function () {
      if ($(this).text().length) {
        productData.push($(this).text())
      }
    });
    return productData
  } catch (error) {
    throw new Error(error)
  }
}

async function init() {

  // try {
    // получаем подкаталоги первого уровня (пример: "Метановое оборудование")
    const catalog1 = await getCatalog('/catalog/');

    const arr = catalog1.filter(e => e.isProduct);
    console.log(arr);

    // //перебираю массив подкаталогов 1-го уровня
    // for (let i = 0; i < catalog1.length; i++) {
    //   // получаем подкаталоги второго уровня (пример: "Комплекты ГБО Метан")
    //   const catalog2 = await getCatalog(catalog1[i].link);
    //   if (catalog1[i] instanceof Chapter) {
    //     //Обхожу каталог уровня 2 (пример: "ГБО Метан")
    //     for (let b = 0; b < catalog2.length; b++) {
    //       //не проверяю здесь содержимое, т.к. заведомо известно, что здесь уже находятся конечные данные
    //       const productData = await getProductDataItem(catalog2[b].link);
    //     }
    //   } else {
    //     const productData = await getProductDataItem(catalog1[i].link)
    //   }
    // }
    console.log('Готово');
  // } catch (e) {
  //   throw new Error(e);
  // }
}


init();
