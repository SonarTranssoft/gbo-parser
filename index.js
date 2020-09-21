const axios = require('axios');
const cheerio = require('cheerio');
const Excel = require('exceljs');
const Chapter = require('./models/chapter');
const Product = require('./models/productFull');
const tunnel = require('tunnel');
const agent = tunnel.httpsOverHttp({
  proxy: {
    host: '193.31.103.37',
    port: 9477,
    proxyAuth: 'CcxHv8:6ymQqU'
  }
});


var globalCatalog = new Map();

const BASE_URL = 'https://www.mirgaza.ru';

/** Сделать запрос, и вернуть результат калалога с id равным link */
async function getCatalog(link) {

  // результат уже как удобно сформируй
  const result = [];
  const chapters = [];


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

  const tempArr = [];
  const productData = [];

  try {
    const {data} = await axios({
      method: "GET",
      url: BASE_URL + link,
      httpsAgent: agent,
      proxy: false
    });

    const $ = cheerio.load(data);

    $('div.shop_full_item_right').find('span.full_title').each(function () {
      if ($(this).text().length) {
        tempArr.push($(this).text())
        // $('div.shop_full_item_tabs').find('.box').text()
      }
    })

    tempArr.push($('div.shop_full_item_tabs').find('.box').first().text().trim());

    // productData.push(new Product($('img.shop_full_item_img').attr('src'), tempArr[0], tempArr[1], $('span.price_value').text(), tempArr[2]));

    return tempArr;
  } catch (error) {
    throw new Error(error)
  }
}

async function init() {

    // const catalog1 = await getCatalog('/catalog/');
    //
    // const arr = catalog1.filter(e => e.isProduct);
    // console.log(arr);
    // console.log('Готово');

  const arr = await getProductDataItem('/catalog/magistral-i-shlangi/pipe-faro-6-mm-thermoplastic/');
  // console.log(arr);
  console.log(arr);
  console.log(arr.length);
}


init();
