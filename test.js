const http = require('http');
const fs = require('fs');
const axios = require("axios");
const sharp = require('sharp');

const BASE_URL = 'https://www.mirgaza.ru';

async function downloadFileFromUrl(url) {
    const {data} = await axios
        .get(BASE_URL + url, {
            responseType: "arraybuffer"
        })
    let buffer = Buffer.from(data, 'binary')


    let str1 = url.lastIndexOf('/') + 1;

    //Хочу сохранить изображения в отдельный файлик
    await sharp(buffer).toFile(__dirname + './images/' + url.substring(str1, url.length))
    return url.substring(str1, url.length)
}

downloadFileFromUrl('/Images/no_image.jpg').then(str => console.log(`Загрузка файла ${str} завершена`))
