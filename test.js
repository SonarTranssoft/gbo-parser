const fs = require('fs');
const axios = require("axios");
const cheerio = require('cheerio');
const sharp = require('sharp');
const Excel = require('exceljs');
const Chapter = require('./models/chapter');
const tunnel = require('tunnel');
const Product = require('./models/productFull');
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
//     await sharp(buffer)
//         .toFile(__dirname + '/images/' + image);
//
//     return image;
// }
//
// let varName = downloadFileFromUrl('/upload/shop_1/2/6/4/item_26455/shop_items_catalog_image26455.jpg');

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

// const Excel = require('exceljs');

// const workbook = new Excel.Workbook();
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


const map = new Map();
const products = [
    new Product({
    imgSrc: '/upload/shop_1/4/5/4/item_45495/shop_items_catalog_image45495.jpg',
    title: 'Ремкомплект ред. впрыск Tms NORDIC XP',
    parent: 'Ремкомплекты',
    vendorCode: '17558',
    cost: '1 563 р',
    manufacturerCode: '-',
    description: 'Ремкомплект для газового редуктора Tomasetto AT09 NORDIC XP служит для замены почти всех изнашиваемых деталей газового редуктора. Имеет высокий ресурс работы и способен вернуть редуктору нормальный режим работы. \n' +
        '  Мембраны редуктора от воздействий температуры и пропана, постепенно выходят из строя. Они теряют эластичность или вовсе рассыпаются. Этот фактор вызывает потерю динамики редуктора, а также повышенный расход газа.\n' + ' \n Ремкомплект газового редуктора Tomasetto способен дать вторую жизнь испарителю, после замены ремкомплекта редуктор способен показывать номинальные рабочие характеристики, автомобиль при этом будет демонстрировать оптимальные показ'
}),
    new Product({
        imgSrc: '/upload/shop_1/4/5/4/item_45495/shop_items_catalog_image45495.jpg',
        title: 'Ремкомплект ред. впрыск Tms NORDIC XP',
        parent: 'Ремкомплекты',
        vendorCode: '17558',
        cost: '1 563 р',
        manufacturerCode: '-',
        description: 'Ремкомплект для газового редуктора Tomasetto AT09 NORDIC XP служит для замены почти всех изнашиваемых деталей газового редуктора. Имеет высокий ресурс работы и способен вернуть редуктору нормальный режим работы. \n' +
            '  Мембраны редуктора от воздействий температуры и пропана, постепенно выходят из строя. Они теряют эластичность или вовсе рассыпаются. Этот фактор вызывает потерю динамики редуктора, а также повышенный расход газа.\n' + ' \n Ремкомплект газового редуктора Tomasetto способен дать вторую жизнь испарителю, после замены ремкомплекта редуктор способен показывать номинальные рабочие характеристики, автомобиль при этом будет демонстрировать оптимальные показ'
    }),
    new Product({
        imgSrc: '/upload/shop_1/4/5/4/item_45495/shop_items_catalog_image45495.jpg',
        title: 'Ремкомплект ред. впрыск Tms NORDIC XP',
        parent: 'Ремкомплекты',
        vendorCode: '17558',
        cost: '1 563 р',
        manufacturerCode: '-',
        description: 'Ремкомплект для газового редуктора Tomasetto AT09 NORDIC XP служит для замены почти всех изнашиваемых деталей газового редуктора. Имеет высокий ресурс работы и способен вернуть редуктору нормальный режим работы. \n' +
            '  Мембраны редуктора от воздействий температуры и пропана, постепенно выходят из строя. Они теряют эластичность или вовсе рассыпаются. Этот фактор вызывает потерю динамики редуктора, а также повышенный расход газа.\n' + ' \n Ремкомплект газового редуктора Tomasetto способен дать вторую жизнь испарителю, после замены ремкомплекта редуктор способен показывать номинальные рабочие характеристики, автомобиль при этом будет демонстрировать оптимальные показ'
    }),
    new Product({
        imgSrc: '/upload/shop_1/2/4/8/item_24821/shop_items_catalog_image24821.jpg',
        title: 'Ремкомплект ред. метан  BRC  ME (3 мембраны)',
        parent: 'Ремкомплекты',
        vendorCode: '3544',
        cost: '1 936 р',
        manufacturerCode: '02BM00010006',
        description: 'Ремкомплект для электронного редуктора BRC ME служит для замены почти всех изнашиваемых деталей электронного газового редуктора. Имеет высокий ресурс работы и способен вернуть редуктору нормальный режим работы. \n' +
            ' \n' +
            'Мембраны редуктора от воздействий температуры и пропана, постепенно выходят из строя. Они теряют эластичность или вовсе рассыпаются. Этот фактор вызывает потерю динамики редуктора, а также повышенный расход газа.\n' +
            ' \n' +
            'Ремкомплект газового редуктора BRC способен дать вторую жизнь испарителю, после замены ремкомплекта редуктор способен показывать номинальные рабочие характеристики, автомобиль при этом будет демонстрировать оптимальные показатели' +
            'динамики и расхода. Однако, как правило, срок службы редуктора при этом уменьшается.\n' +
            'Для того чтобы редуктор мог прослужить дольше, необходимо:\n' +
            '\n' +
            'Устанавливать перед редуктором электромагнитный газовый клапан с фильтром грубой очистки;\n' +
            'Осуществлять замену фильтрующего элемента грубой очистки через каждые 8 000 – 10 000 километров пробега на газе;\n' +
            'Применять в работе только качественный метан;\n' +
            'Максимально избегать запуска газобаллонного оборудования на холодном двигателе. Иначе мембраны редуктора будут перемерзать, и быстрее выйдут из строя.\n' +
            '\n' +
            ' \n' +
            'Применим для таких моделей редукторов:\n' +
            '\n' +
            'BRC ME до 100 kW или до 137 лошадиных сил;\n' +
            'BRC ME SUPER с мощностью до 140 киловатт (до 192 лошадиных сил;\n' +
            'BRC ME MAXI FLOW. Он имеет мощность свыше 140 kW или свыше 192 лошадиных сил.'
    })
]

map.set('Метановое оборудование', ['Комплекты ГБО Метан', 'Баллоны метан', 'Крепления баллонов', 'Труба стальная', 'ВЗУ - Метан', 'Вентили', 'Клапаны', 'Редукторы', 'Ремкомплекты', 'Манометры', 'Фильтры', 'Монтаж']);
map.set('Мультиклапаны Венткамеры, ВЗУ', ['Мультиклапаны', 'ВЗУ, Венткамеры']);
map.set('Ремкомплекты', [])

async function createXLSXFiles() {
    let props = [
        {header: 'Изображение', key: 'img', width: 100},
        {header: 'Полное название', key: 'title', width: 30},
        {header: 'Род. каталог', key: 'parent', width: 30},
        {header: 'Артикул товара', key: 'vendorCode', width: 15},
        {header: 'Цена', key: 'cost', width: 15},
        {header: 'Код производителя', key: 'manufacturerCode', width: 20},
        {header: 'Полное описание', key: 'description', width: 300}
    ]
    for (let catalog of map.keys()) {
        const workbook = new Excel.Workbook();
        let arrayOfSheets = map.get(catalog);

        if (arrayOfSheets.length === 0) {
            let worksheet1 = workbook.addWorksheet(catalog, {
                properties: {
                    defaultRowHeight: 500,
                }
            })
            worksheet1.columns = props;
            let row = worksheet1.getRow(1).height = 15;
            const productsForSheet = products.filter(value => value.parent === value)
            worksheet1.addRows(productsForSheet);
        } else {
            arrayOfSheets.forEach(el => {
                let worksheet = workbook.addWorksheet(el, {
                    properties: {
                        defaultRowHeight: 500,
                    }
                })
                worksheet.columns = props;
                let row = worksheet.getRow(1).height = 15;

                const productsForSheet = products.filter(val => val.parent === el)
                // .forEach(product => {
                //     let imageFromArray = product.imgSrc.split('/').pop();
                //
                // })
                worksheet.addRows(productsForSheet);
            })
        }
        await workbook
            .xlsx
            .writeFile(`${catalog}.xlsx`)
            .then(() => console.log('Saved'))
            .catch(err => console.log(err))
    }
}

async function init() {
    await createXLSXFiles()
}

init();


