const axios = require('axios');
const cheerio = require('cheerio');
const sharp = require('sharp');
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

    const params = {};

    try {

        const {data} = await axios({
            method: "GET",
            url: BASE_URL + encodeURI(link),
            httpsAgent: agent,
            proxy: false
        });

        const $ = cheerio.load(data);

        $('div.shop_full_item_right > div').each(function () {
            if ($(this).find('.full_title').length) {
                params[$($(this).contents().get(0)).text().trim()] = $($(this).contents().get(1)).text().trim();
            }
        });

        return new Product({
            imgSrc: $('img.shop_full_item_img').attr('src'),
            title: params["Полное наименование:"] || '-',
            vendorCode: params["Код товара:"] || "-",
            cost: $('span.price_value').text(),
            manufacturerCode: params["Артикул производителя:"] || "-",
            description: $('div.shop_full_item_tabs').find('.box').first().text().trim(),
            parent: $('[itemscope="itemscope"]').last().prev().prev().text().trim()
        });

    } catch (e) {
        console.log(BASE_URL + link)
        console.log(e);
    }
}

async function downloadFileFromUrl(url) {
    const {data} = await axios.get(BASE_URL + url, {
        responseType: "arraybuffer"
    });

    const buffer = Buffer.from(data, 'binary');
    const image = url.split('/').pop();

    await sharp(buffer).toFile(__dirname + '/images/' + image);

    return image;
}

async function init() {

    const arrayOfProductsData = [];

    try {
        const catalog1 = await getCatalog('/catalog/');
        const products = catalog1.filter(e => e.isProduct);

        console.log('Список каталогов с товарами получен. Начинаю получение данных по каждому товару');

        for (let i = 0; i < products.length; i++) {
            try {
                let a = await getProductDataItem(products[i].link);
                arrayOfProductsData.push(a);
            } catch (e) {
                console.log(e)
            }
        }

        console.log(arrayOfProductsData);
        console.log(arrayOfProductsData.length);
        console.log('Начинаю загрузку изображений');

        // //Хочу обойти массив полученных данных, чтобы загрузить на диск изображения, которые потом будут записываться в *.xls файл.
        // // Пока не предусмотрел обрезание до нужного количества пикселей
        for (let i = 0; i < arrayOfProductsData.length; i++) {
            try {
                let imageFileName = await downloadFileFromUrl(arrayOfProductsData[i].imgSrc);
                console.log(`Файл ${imageFileName} загружен. Осталось загрузить примерно ${arrayOfProductsData.length - i} файлов`);
            } catch (e) {
                console.log(e)
            }
        }
    } catch (e) {
        throw new Error(e)
    }
}


init();
