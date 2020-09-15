const axios = require('axios')
const fs = require('fs');
// const cheerio = require('cheerio');



function getDataFromCatalog() {
    let URL = 'https://www.mirgaza.ru/catalog/';
    return axios({
        method: "GET",
        url: URL
    });
}

getDataFromCatalog()
    .then(res => {
        fs.writeFile
    })
    .catch(err => console.error(err))

