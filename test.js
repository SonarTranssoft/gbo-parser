const fs = require('fs');
const axios = require("axios");
const sharp = require('sharp');

const BASE_URL = 'https://www.mirgaza.ru';

async function downloadFileFromUrl(url) {
    const {data} = await axios.get(BASE_URL + url, {
        responseType: "arraybuffer"
    });

    const buffer = Buffer.from(data, 'binary');
    const image = url.split('/').pop();

    //Хочу сохранить изображения в отдельный файлик
    await sharp(buffer).toFile(__dirname + '/images/' + image);

    return image;
}

let varName = downloadFileFromUrl('/upload/shop_1/2/6/4/item_26455/shop_items_catalog_image26455.jpg')
