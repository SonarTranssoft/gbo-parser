const http = require('http');
const fs = require('fs');
const axios = require("axios");
const sharp = require('sharp');

const BASE_URL = 'https://www.mirgaza.ru';

// function download(url) {
//     return axios
//         .get(BASE_URL + url, {
//             responseType: "arraybuffer"
//         })
//         .then(res => {
//             return Buffer.from(res.data, 'binary')
//         })
// }

// function downloadFileFromUrl(url) {
//
//
//     return axios
//         .get(BASE_URL + url, {
//             responseType: "arraybuffer"
//         })
//         .then(res => {
//             return Buffer.from(res.data, 'binary')
//         })
// }
let str = '/upload/shop_1/2/4/2/item_24239/shop_items_catalog_image24239.jpg';
let str1 = str.lastIndexOf('/') + 1;
console.log(str.substring(str1, str.length))


