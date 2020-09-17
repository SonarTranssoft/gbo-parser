const axios = require('axios');
const cheerio = require('cheerio');
const Chapter = require('./models/chapter');
let URL = 'https://www.mirgaza.ru/catalog/'

function getChaptersFromCatalog() {
     return axios({
        method: "GET",
        url: URL
    });
}

getChaptersFromCatalog()
    .then(res => {
        const $ = cheerio.load(res.data);
        let listOfCatalog = $('.catalog').children().toArray();
        let arrayOfIds = listOfCatalog.map(el => el.attribs.id);
        let chapters = arrayOfIds.map(el => {
            return new Chapter($('#' + el).text().trim(), $('#' + el).find('a').attr('href').substring(9, this.length))
        })
        console.log(chapters)
    })
    .catch(err => console.error(err));


