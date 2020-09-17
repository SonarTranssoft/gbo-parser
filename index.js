const axios = require('axios');
const cheerio = require('cheerio');

function getDataFromCatalog() {
    let URL = 'https://www.mirgaza.ru/catalog/';
    return axios({
        method: "GET",
        url: URL
    });
}

getDataFromCatalog()
    .then(res => {
        const $ = cheerio.load(res.data);
        let listOfCatalog = $('.catalog').children().toArray();
        let arrayOfIds = listOfCatalog.map(el => el.attribs.id);
        let chapters = arrayOfIds.map(el => $('#' + el).text().trim());
        console.log(chapters);
    })
    .catch(err => console.error(err));

