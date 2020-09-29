const Excel = require('exceljs');

exports.createXLSXFiles = async function createXLSXFiles(map, data) {
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

        if (!arrayOfSheets.length) {
            let worksheet = workbook.addWorksheet(catalog, {
                properties: {
                    defaultRowHeight: 500,
                }
            })
            worksheet.columns = props;
            worksheet.getRow(1).height = 15;
            const productsForSheet = data.filter(val => val.parent === catalog)
            for (let i = 0; i < productsForSheet.length; i++) {
                let imageToPaste = workbook.addImage({
                    filename: `./images/${productsForSheet[i].imgSrc.split('/').pop()}`,
                    extension: "jpeg"
                });
                worksheet.addImage(imageToPaste, {
                    tl: {col: 0, row: 1.1 + i},
                    ext: {width: 500, height: 500},
                    editAs: 'undefined'
                });
                worksheet.addRow(productsForSheet[i]);
            }

        } else {
            arrayOfSheets.forEach(el => {
                let worksheet = workbook.addWorksheet(el, {
                    properties: {
                        defaultRowHeight: 500,
                    }
                })
                worksheet.columns = props;
                worksheet.getRow(1).height = 15;

                const productsForSheet = data.filter(val => val.parent === el)
                for (let i = 0; i < productsForSheet.length; i++) {
                    let imageToPaste = workbook.addImage({
                        filename: `./images/${productsForSheet[i].imgSrc.split('/').pop()}`,
                        extension: "jpeg"
                    });
                    worksheet.addImage(imageToPaste, {
                        tl: {col: 0, row: 1.1 + i},
                        ext: {width: 500, height: 500},
                        editAs: 'undefined'
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

exports.validateLength = async function validateLength(str) {
    if (str.length > 31) {
        return str.split(' ').map(el =>  el.substring(0, 3).concat('. ')).join('');
    } else {
        return str;
    }
}