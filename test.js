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

let varName = downloadFileFromUrl('/upload/shop_1/2/6/4/item_26455/shop_items_catalog_image26455.jpg');

// async function getCatalog(link, level) {
//
//     // результат уже как удобно сформируй
//     const result = [];
//     const chapters = [];
//
//
//     try {
//         console.log('Сканирую страницу...' + link);
//         const {data} = await axios({
//             method: 'GET',
//             url: BASE_URL + encodeURI(link),
//             httpsAgent: agent,
//             proxy: false
//         });
//
//         const $ = cheerio.load(data);
//
//
//         if ($('.group_list').length) {
//
//             await Promise.all(
//                 $('.group_list').find('.group_list_item')
//                     .toArray()
//                     .map(async elem => {
//                         const array = await getSubCatalogs($(elem).attr('href').trim());
//
//                         console.log(`Каталог ${$(elem).attr('title')}`, array);
//
//                         if (level === 1) {
//                             globalCatalog.set($(elem).attr('title'), array);
//                         }
//
//                         chapters.push(new Chapter($(elem).attr('title'), link, false, $(elem).attr('href')));
//
//                         return;
//                     })
//             );
//
//             result.push(...chapters);
//
//
//             for (let i = 0; i < chapters.length; i++) {
//                 result.push(...await getCatalog(chapters[i].link, ++level));
//             }
//
//             console.log('Страница ' + link + ' просканирована');
//
//         } else if ($('.shop_block').length) {
//             console.log(link + ' Дошли до товаров в этой категории');
//             $('.shop_table').find('div.description_sell').each(function () {
//                 console.log(`Залезли в каталог с товарами ${$(this).text().trim()}`)
//                 result.push(new Chapter($(this).text().trim(), link, true, $(this).find('a').attr('href')))
//             });
//         }
//
//         return result;
//     } catch (e) {
//         throw new Error(e);
//     }
// }
//
// async function getSubCatalogs(url) {
//     const arr = [];
//     let $;
//
//     try {
//         const {data} = await axios({
//             method: "GET",
//             url: BASE_URL + encodeURI(url),
//             httpsAgent: agent,
//             proxy: false
//         })
//
//         $ = cheerio.load(data);
//
//     } catch (e) {
//         console.log(BASE_URL + encodeURI(url));
//         console.log(e)
//     }
//
//     $('div.group_list_title_cell').each(function () {
//         arr.push($(this).text())
//     })
//
//     return arr;
// }
//
// async function start() {
//     const catalog1 = await getCatalog('/catalog/', 1);
//     const a1 = globalCatalog.keys();
//     console.log('Ключи глобалкаталога', a1)
//     console.log(globalCatalog.size)
// }
//
// start()
/**____________________________________________________________________________________________*/

const Excel = require('exceljs');

const workbook = new Excel.Workbook();
// add column headers
// worksheet.columns = [
//   { header: 'Package', key: 'package_name' },
//   { header: 'Author', key: 'author_name' }
// ];
//
// // Add row using key mapping to columns
// worksheet.addRow(
//   { package_name: "ABC", author_name: "Author 1" },
//   { package_name: "XYZ", author_name: "Author 2" }
// );
//
// // Add rows as Array values
// worksheet
//   .addRow(["BCD", "Author Name 3"]);

// Add rows using both the above of rows
// const rows = [
//   ["FGH", "Author Name 4"],
//   ["PQR", "Author 5"]
// ];
//
//
// worksheet
//   .addRows(rows);

// save workbook to disk
// workbook
//   .xlsx
//   .writeFile('sample.xlsx')
//   .then(() => {
//     console.log("saved");
//   })
//   .catch((err) => {
//     console.log("err", err);
//   });

// const arrayFileNames = ['one', 'two'];
// const map = new Map();
//
// map.set('1', {one: 1, two: 2, three: 3});
// map.set('2', {one: 4, two: 5, three: 6});
// map.set('3', {one: 7, two: 8, three: 9});
//
// async function writeDataToSheet(workbook, titleOfSheet, data) {
//     let sheet = workbook.addWorksheet(titleOfSheet);
//     let array = Object.keys(data);
//     sheet.columns = array.map(e => {
//         return {
//             header: e,
//             key: e
//         }
//     });
//     sheet.addRow(data);
//     sheet.addImage(data.img)
// }
//
// async function init() {
//     for (let i = 0; i < arrayFileNames.length; i++) {
//         const workbook = new Excel.Workbook();
//         for (let key of map.keys()) {
//             let array = map.get(key);
//             const img = workbook.addImage({
//                 filename: `shop_items_catalog_image264551.jpg`,
//                 extension: "jpg",
//                 ext: {
//                     width: 1100,
//                     height: 1100
//                 }
//             });
//             array.img = img;
//
//             await writeDataToSheet(workbook, key, array);
//         }
//         await workbook
//             .xlsx
//             .writeFile(`${arrayFileNames[i]}.xlsx`)
//             .then(() => console.log('Saved'))
//             .catch(err => console.log(err))
//     }
// }
//
// init();


