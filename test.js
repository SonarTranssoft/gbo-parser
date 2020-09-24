const fs = require('fs');
const axios = require("axios");
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


async function getSubCatalogs(url) {
    let $, data;
    const arr = [];

    try {
        data = await axios({
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


const a = await getSubCatalogs('/catalog/cng-metan/');
console.log(a);
