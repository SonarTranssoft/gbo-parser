const axios = require('axios');
const cheerio = require('cheerio');
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

  try {
    const {data} = await axios({
      method: 'GET',
      url: BASE_URL + link
    });

    const $ = cheerio.load(data);

    if ($('.group_list').length) {
      $('.group_list').find('.group_list_item').each(function () {
        result.push(new Chapter($(this).attr('title'), $(this).attr('href')))
      });
    } else if ($('.shop_block').length) {
      $('.shop_table').find('div.description_sell').each(function () {
        result.push(new Product($(this).text().trim(), $(this).find('a').attr('href')))
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
    })

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


// чтобы рабоать с await, нужно выполнять промисы с async функции
// т.е. нужно запускать не в корне скрипта, примерно как ниже

async function init() {

  try {
    // получаем подкаталоги первого уровня (пример: "Метановое оборудование")
    const catalog1 = await getCatalog('/catalog/');

    //перебираю массив подкаталогов 1-го уровня
    for (let i = 0; i < catalog1.length; i++) {
      // получаем подкаталоги второго уровня (пример: "Комплекты ГБО Метан")
      const catalog2 = await getCatalog(catalog1[i].link);
      if (catalog2[i] instanceof Chapter) {
        //Обхожу каталог уровня 2 (пример: "ГБО Метан")
        for (let b = 0; b < catalog2.length; b++) {
          //не проверяю здесь содержимое, т.к. заведомо известно, что здесь уже находятся конечные данные
          const productData = await getProductDataItem(catalog2[b].link);
        }
      } else {
        const productData = await getProductDataItem(catalog1[i].link)
      }
    }
    console.log('Готово');
  } catch (e) {
    throw new Error(e);
  }
}


init();

