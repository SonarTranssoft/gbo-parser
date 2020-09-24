const fs = require('fs');
const axios = require("axios");
const sharp = require('sharp');

const BASE_URL = 'https://www.mirgaza.ru';

async function downloadFileFromUrl(url) {
  const { data } = await axios.get(BASE_URL + url, {
    responseType: "arraybuffer"
  });

  const buffer = Buffer.from(data, 'binary');

  // тоже самое что твой url.substring(url.lastIndexOf('/') + 1, url.length)
  // .split() это метод для строк, который делит строку по "делителю" и превращает в массив
  // "/upload/shop_1/2/4/2/item_24239/shop_items_catalog_image24239.jpg".split('/') === ["upload", "shop_1", "2", "4", "2", "item_24239", "shop_items_catalog_image24239.jpg"]
  // .pop() метод для массивов. Удаляет последний элемент с массива, и возвращает его.
  // ["upload", "shop_1", "2", "4", "2", "item_24239", "shop_items_catalog_image24239.jpg"].pop() === "shop_items_catalog_image24239.jpg", 
  // при этом исходный массив уже будет равен ["upload", "shop_1", "2", "4", "2", "item_24239"] (у тебя не присвоен будет к переменной, но чтобы понимал)
  const image = url.split('/').pop(); 

  //Хочу сохранить изображения в отдельный файлик
  await sharp(buffer).toFile(__dirname + '/images/' + image);

  return image;
}

function createPath(path) {

  if (!path || typeof path !== 'string') throw new Error('Path must be an valid path string');

  return new Promise((resolve, reject) => {

    fs.mkdir(path, { recursive: true }, (err) => {
      if (err) return reject(err);
      return resolve();
    });

  });

}


createPath('images')
  .then(() => downloadFileFromUrl('/Images/no_image.jpg'))
  .then(str => console.log(`Загрузка файла ${str} завершена`))
  .catch(e => {
    console.error(e);
  })
