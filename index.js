const axios = require('axios');
const cheerio = require('cheerio');

const BASE_URL = 'https://www.mirgaza.ru';

/** Сделать запрос, и вернуть результат калалога с id равным link */
async function getCatalog(link = '/catalog/') {

  // результат уже как удобно сформируй
  const result = [];

  try {

    const {data} = await axios({
      method: 'GET',
      url: BASE_URL + link
    });

    const $ = cheerio.load(data);

    // тут проверь, если в результате есть $('.group_list')
    // то обрабатывай как каталог с подкаталогами
    // если есть $('.shop_block'), то обрабатывай как товарами
    // т.е. запомни ссылки на товары, а после того как все товары получишь, уже выполняй функцию парса данных с товара

    // тут обрабатываешь результат запроса
    // не использую костыли вида toArray()
    // лучше перебирай все элементы так:

    $('.group_list').find('.group_list_item').each(function() {
      // each это функция перебора элементов массива cheerio
      // конструкция $(this) тебе даст cheerio элемент каждого из .group_list_item

      result.push({
        title: $(this).attr('title'),
        link: $(this).attr('href')
      });

    });

    return result;

  } catch (e) {

    throw new Error(e);

  }

}


// чтобы рабоать с await, нужно выполнять промисы с async функции
// т.е. нужно запускать не в корне скрипта, примерно как ниже

async function init() {

  const catalog = await getCatalog(); // это бы тоже в try/catch обернуть, но для себя и так пойдет

  console.log(catalog);

  // тут к примеру можно использовать
  for (let i = 0; i < catalog.length; i++) {
    const subCatalog =  await getCatalog(catalog[i].link);
    
    console.log(subCatalog);

    break;
  }

}

init();

