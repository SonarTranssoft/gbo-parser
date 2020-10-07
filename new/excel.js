const Excel = require('exceljs');

const Image = {
  width: 100,
  height: 100
}

const SheetColumns = [{
  header: '№',
  key: 'incrementId',
  width: 5
}, {
  header: 'Код товара',
  key: 'Код товара:',
  width: 15
}, {
  header: 'Название',
  key: 'Полное наименование:',
  width: 50
}, {
  header: 'Цена',
  key: 'price',
  width: 10
}, {
  header: 'Изображение',
  key: 'image',
  width: 18 // не пиксели как у изображения. 14~100px.
}];

module.exports = class ExcelManager {

  /** текушая таблица и страница */
  workbook; worksheet; increment = 1;

  /** создаём пустую таблицу */
  newBook() {
    this.workbook = new Excel.Workbook();
  }

  /** Добавить новую страницу */
  newWorksheet(name) {
    this.worksheet = this.workbook.addWorksheet(name);
    this.worksheet.columns = SheetColumns;
    this.worksheet.properties.defaultRowHeight = 87; // НЕ пиксели. Не стал искать как установить в пикселях. 75~100px.

    this.worksheet.getRow(1).height = 20;

    this.increment = 1;
  }

  addProductRows(products) {
    for (let i = 0; i < products.length; i++) {

      const {image, ...woImageRow} = products[i];

      const row = this.worksheet.addRow({ incrementId: this.increment, ...woImageRow }, {
        height: Image.height
      });

      if (image) {

        const imageId = this.workbook.addImage({
          filename: __dirname + '/images/products/' + image.split('/').pop(),
          extension: 'jpeg',
        });

        this.worksheet.addImage(imageId, {
          tl: { col: SheetColumns.findIndex(e => e.key === 'image') + 0.2, row: this.increment + 0.2 },
          ext: { width: Image.width, height: Image.height }
        });

      }

      row.alignment = { vertical: 'middle', horizontal: 'left' };

      this.increment++;
    }
  }

  /** Записывает текущий workbook в файл */
  async toFile(filename) {
    await this.workbook.xlsx.writeFile(filename);
  }

}
