const axios = require('axios');
const cheerio = require('cheerio');
const tunnel = require('tunnel');
const fs = require('fs');
const cliProgress = require('cli-progress');
const _colors = require('colors');

module.exports = class Parser {

  multibar = new cliProgress.MultiBar({
    clearOnComplete: true,
    stopOnComplete: true,
    hideCursor: true,
    format: 'Parse Progress |' + _colors.cyan('{bar}') + '| {percentage}% || {value}/{total} Pages || Current: {link}',
  }, cliProgress.Presets.shades_grey);


  client = axios.create({
    baseURL: 'https://www.mirgaza.ru',
    // httpsAgent: tunnel.httpsOverHttp({
    //   proxy: {
    //     host: '193.31.103.37',
    //     port: 9477,
    //     proxyAuth: 'CcxHv8:6ymQqU'
    //   }
    // }),
    // proxy: false
  });

  catalog = {};
  totalProductsAmount = 0;

  async getCatalog(force = false) {

    if (!force && fs.existsSync(__dirname + '/catalog.json')) {

      this.catalog = JSON.parse(fs.readFileSync(__dirname + '/catalog.json', 'utf8'));
      console.log(_colors.yellow('Catalog loaded from cache! Remove file catalog.json to parse again'));
      this.updateProductsAmount();
      return this.catalog;

    }

    await this._parse();

    fs.writeFileSync(__dirname + '/catalog.json', JSON.stringify(this.catalog), 'utf8');

    console.log(_colors.green('Catalog loaded!'));

    this.updateProductsAmount();
    return this.catalog;

  }

  updateProductsAmount() {

    this.totalProductsAmount = 0;

    for (let code in this.catalog) {
      if (Array.isArray(this.catalog[code].products)) {
        this.totalProductsAmount += this.catalog[code].products.length;
      }
    }

  }

  /** Спарсить весь сайт, и вернуть результат. если forse === true, то парсер не будет смотреть кэш  */
  async _parse(link = '/catalog/') {

    const self = this, links = [];
    let data, $;

    // стараемся всегда минимизировать try/catch блоки
    try {
      data = (await this.client.get(encodeURI(link))).data;

      $ = cheerio.load(data);
    }
    catch (e) {
      throw new Error(e)
    }

    if ($('.group_list').length) {

      const bar = this.multibar.create($('.group_list').find('.group_list_item').length, 0, {
        link: link
      });

      $('.group_list').find('.group_list_item').each(function () {

        if (!self.catalog.hasOwnProperty($(this).attr('href')) && $('.prev_button').first()) {
          // добавляем каталог
          self.catalog[$(this).attr('href')] = {
            title: $(this).attr('title'),
            code: $(this).attr('href'),
            parent: link
          };

        }

        links.push($(this).attr('href'));
      });

      for (let i = 0; i < links.length; i++) {
        try {
          await this._parse(links[i]);
          bar.increment();
          break; // удалить эту строку чтобы спарсить весь каталог
        } catch (e) {
          throw new Error(e);
        }
      }

      this.multibar.remove(bar);

    } else if ($('.shop_block').length) {

      const bar = this.multibar.create($('.shop_item').length, 0, {
        link: "N/A"
      });

      const parent = this.catalog[link];

      if (!parent.products || !Array.isArray(parent.products)) parent.products = [];

      for (let i = 0; i < $('.shop_item').length; i++) {

        bar.update(i, {
          link: $($('.shop_item')[i]).find('.description_sell > a').attr('href')
        });

        const product = await self.getProduct($($('.shop_item')[i]).find('.description_sell > a').attr('href'));

        parent.products.push(Object.assign(product, {
          parent: parent.code
        }));
      }

      this.multibar.remove(bar);

    }

    return;

  }

  async getProduct(link) {

    if (!link || typeof link !== 'string') {
      throw new Error('link must be an string')
    }

    const params = {};
    let data, $;

    try {
      data = (await this.client.get(encodeURI(link))).data;

      $ = cheerio.load(data);
    }
    catch (e) {
      throw new Error(e)
    }

    $('div.shop_full_item_right > div').each(function () {
      if ($(this).find('.full_title').length) {
        params[$($(this).contents().get(0)).text().trim()] = $($(this).contents().get(1)).text().trim();
      }
    });

    const price = $('span.price_value')
      .text()
      .replace(/\s/g, '') // удаляем все пробелы в тексте
      .match(/([\w]+)([\W]+)/); // регуляркой разбираем на массив

    return Object.assign(params, {
      image: $('img.shop_full_item_img').attr('src'),
      description: $('div.shop_full_item_tabs').find('.box').first().text().trim(),
      price: price ? price[1] : null,
      currency: price ? price[2] : null
    });

  }


}
