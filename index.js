const axios = require('axios');
const cheerio = require('cheerio');
const Chapter = require('./models/chapter');
const Product = require('./models/product');

// картинка
// артикул
// наименование
// Детальное описание
// производитель
// цена

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

        $('div.shop_full_item_right').find('span.full_title').each(function() {
            if ($(this).text().length) {
                productData.push($(this).text())
            }
        })
        return productData
    } catch (error) {
        throw new Error(error)
    }
}


// чтобы рабоать с await, нужно выполнять промисы с async функции
// т.е. нужно запускать не в корне скрипта, примерно как ниже

async function init() {
    // const catalog = await getProductItem('/catalog/komplekty-gbo/komplekt-metan-4-tsil-poletron-263-tomasetto-at-12-tip-f-18-60-165kw/')
    // console.log(catalog)
    const catalog = await getCatalog('/catalog/cng-metan/'); // это бы тоже в try/catch обернуть, но для себя и так пойдет

    console.log('Каталог', catalog);

    // тут к примеру можно использовать
    for (let i = 0; i < catalog.length; i++) {
        const subCatalog = await getCatalog(catalog[i].link);

        console.log('Подкаталог', subCatalog);

        break;
    }

}

init();

