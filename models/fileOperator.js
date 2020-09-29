const Excel = require('exceljs');

class FileOperator {
    constructor() {
    }
}


FileOperator.prototype.createXLSXFiles = async function createXLSXFiles(data) {
    let props = [
        {header: 'Изображение', key: 'img', width: 100},
        {header: 'Полное название', key: 'title', width: 30},
        {header: 'Род. каталог', key: 'parent', width: 30},
        {header: 'Артикул товара', key: 'vendorCode', width: 15},
        {header: 'Цена', key: 'cost', width: 15},
        {header: 'Код производителя', key: 'manufacturerCode', width: 20},
        {header: 'Полное описание', key: 'description', width: 300}
    ]
    for (let catalog of map.keys()) {
        const workbook = new Excel.Workbook();
        let arrayOfSheets = map.get(catalog);

        if (arrayOfSheets.length === 0) {
            let worksheet1 = workbook.addWorksheet(catalog, {
                properties: {
                    defaultRowHeight: 500,
                }
            })
            worksheet1.columns = props;
            let row = worksheet1.getRow(1).height = 15;
            const productsForSheet = data.filter(val => val.parent === catalog)
            for (let i = 0; i < productsForSheet.length; i++) {
                let imageToPaste = workbook.addImage({
                    filename: `${__dirname}/images/${productsForSheet[i].imgSrc.split('/').pop()}`,
                    extension: "jpeg"
                });
                worksheet1.addImage(imageToPaste, {
                    tl: {col: 0, row: 1.1 + i},
                    ext: {width: 500, height: 500},
                    editAs: 'absolute'
                });
                worksheet1.addRow(productsForSheet[i], {
                    properties: {
                        defaultRowHeight: 500
                    }
                });
            }

        } else {
            arrayOfSheets.forEach(el => {
                let worksheet = workbook.addWorksheet(el, {
                    properties: {
                        defaultRowHeight: 500,
                    }
                })
                worksheet.columns = props;
                let row = worksheet.getRow(1).height = 15;

                const productsForSheet = data.filter(val => val.parent === el)
                for (let i = 0; i < productsForSheet.length; i++) {
                    let imageToPaste = workbook.addImage({
                        filename: `${__dirname}/images/${productsForSheet[i].imgSrc.split('/').pop()}`,
                        extension: "jpeg"
                    });
                    worksheet.addImage(imageToPaste, {
                        tl: {col: 0, row: 1.1 + i},
                        ext: {width: 500, height: 500},
                        editAs: 'absolute'
                    });
                    worksheet.addRow(productsForSheet[i]);
                }

            })
        }
        await workbook
            .xlsx
            .writeFile(`${catalog}.xlsx`)
            .then(() => console.log('Saved'))
            .catch(err => console.log(err))
    }
}

module.exports = FileOperator;