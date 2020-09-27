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

const globalCatalog = new Map();
const BASE_URL = 'https://www.mirgaza.ru';

/** Запрос к корневому каталогу. Возвращает массив каталогов */
async function getCatalog(link, level) {

    const result = [];
    const chapters = [];

    try {
        console.log('Сканирую страницу...' + link);
        const {data} = await axios({
            method: 'GET',
            url: BASE_URL + encodeURI(link),
            httpsAgent: agent,
            proxy: false
        });

        const $ = cheerio.load(data);

        if ($('.group_list').length) {

            await Promise.all(
                $('.group_list').find('.group_list_item')
                    .toArray()
                    .map(async elem => {
                        const subdirectories = await getSubCatalogs($(elem).attr('href').trim());

                        console.log(`Каталог ${$(elem).attr('title')}`, subdirectories);

                        if (level === 1) {
                            globalCatalog.set($(elem).attr('title'), subdirectories);
                        }

                        chapters.push(new Chapter($(elem).attr('title'), link, false, $(elem).attr('href')));

                        return;
                    })
            );

            result.push(...chapters);

            for (let i = 0; i < chapters.length; i++) {
                result.push(...await getCatalog(chapters[i].link, ++level));
            }

            console.log('Страница ' + link + ' просканирована');

        } else if ($('.shop_block').length) {
            console.log(link + ' Дошли до товаров в этой категории');
            $('.shop_table').find('div.description_sell').each(function () {
                console.log(`Залезли в каталог с товарами ${$(this).text().trim()}`)
                result.push(new Chapter($(this).text().trim(), link, true, $(this).find('a').attr('href')))
            });
        }
        return result;
    } catch (e) {
        throw new Error(e);
    }
}

/** Получает массив подкаталогов */
async function getSubCatalogs(url) {
    const arrayOfSubdirectories = [];

    try {
        const {data} = await axios({
            method: "GET",
            url: BASE_URL + encodeURI(url),
            httpsAgent: agent,
            proxy: false
        })

        const $ = cheerio.load(data);

        $('div.group_list_title_cell').each(function () {
            arrayOfSubdirectories.push($(this).text())
        })

        return arrayOfSubdirectories;

    } catch (e) {
        console.log(BASE_URL + encodeURI(url));
        console.log(e)
    }
}

/** Получаем данные по конкретному товару */
async function getProductDataItem(link) {

    const params = {};
    let data = null;
    try {

        data = await axios({
            method: "GET",
            url: BASE_URL + encodeURI(link),
            httpsAgent: agent,
            proxy: false
        });

        const $ = cheerio.load(data);

    } catch (e) {
        console.log(BASE_URL + link)
        console.log(e);
    }

    $('div.shop_full_item_right > div').each(function () {
        if ($(this).find('.full_title').length) {
            params[$($(this).contents().get(0)).text().trim()] = $($(this).contents().get(1)).text().trim();
        }
    });

    return new Product({
        imgSrc: $('img.shop_full_item_img').attr('src'),
        title: $('h1.catalog_group_h1').text() || '-',
        vendorCode: params["Код товара:"] || "-",
        cost: $('span.price_value').text(),
        manufacturerCode: params["Артикул производителя:"] || "-",
        description: $('div.shop_full_item_tabs').find('.box').first().text().trim(),
        parent: $('div.catalog_group_h1').text()
    });
}

/** Загрузка изображения для конкретного товара */
async function downloadFileFromUrl(url) {
    const {data} = await axios.get(BASE_URL + url, {
        responseType: "arraybuffer"
    });

    const buffer = Buffer.from(data, 'binary');
    const image = url.split('/').pop();

    await sharp(buffer)
        .toFile(__dirname + '/images/' + image);

    return image;
}

async function init() {

    const arrayOfProductsData = [];

    try {
        const catalog = await getCatalog('/catalog/');
        const products = catalog.filter(e => e.isProduct);

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
