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
        console.log(res.data);
    })
    .catch(err => console.error(err))

