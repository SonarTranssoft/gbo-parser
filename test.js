const fs = require('fs');
const axios = require("axios");
const cheerio = require('cheerio');
const sharp = require('sharp');
const Excel = require('exceljs');
const Chapter = require('./models/chapter');
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

// async function downloadFileFromUrl(url) {
//     const {data} = await axios.get(BASE_URL + url, {
//         responseType: "arraybuffer"
//     });
//
//     const buffer = Buffer.from(data, 'binary');
//     const image = url.split('/').pop();
//
//     //Хочу сохранить изображения в отдельный файлик
//     await sharp(buffer).toFile(__dirname + '/images/' + image);
//
//     return image;
// }
//
// let varName = downloadFileFromUrl('/upload/shop_1/2/6/4/item_26455/shop_items_catalog_image26455.jpg')

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

            await Promise.all( 
                $('.group_list').find('.group_list_item')
                .toArray()
                .map(async elem => {
                    const array = await getSubCatalogs($(elem).attr('href').trim());

                    console.log(`Каталог ${$(elem).attr('title')}`, array);

                    if (!globalCatalog.has($(elem).attr('title'))) {
                        globalCatalog.set($(elem).attr('title'), array);
                    }

                    chapters.push(new Chapter($(elem).attr('title'), link, false, $(elem).attr('href')));

                    return;
                })
            );

            result.push(...chapters);


            for (let i = 0; i < chapters.length; i++) {
                result.push(...await getCatalog(chapters[i].link));
            }

            console.log('Страница ' + link + ' просканирована');

        } else if ($('.shop_block').length) {
            console.log(link + ' Дошли до товаров в этой категории');
            $('.shop_table').find('div.description_sell').each(function () {
                console.log(`Залезли в каталог с товарами ${$(this).text().trim()}`)
                globalCatalog.set($(this).text().trim(), null)
                result.push(new Chapter($(this).text().trim(), link, true, $(this).find('a').attr('href')))
            });
        }
        console.log('Каталоги', globalCatalog.keys())
        console.log('Результат', result)
        return result;
    } catch (e) {
        throw new Error(e);
    }
}

async function getSubCatalogs(url) {
    const arr = [];
    let $;

    try {
        const {data} = await axios({
            method: "GET",
            url: BASE_URL + encodeURI(url),
            httpsAgent: agent,
            proxy: false
        })

        $ = cheerio.load(data);

    } catch (e) {
        console.log(BASE_URL + encodeURI(url));
        console.log(e)
    }

    $('div.group_list_title_cell').each(function () {
        arr.push($(this).text())
    })

    return arr;
}

async function start() {
    const catalog1 = await getCatalog('/catalog/');
    const a1 = await globalCatalog.keys();
    console.log(a1)
    console.log(catalog1)
}

start()


