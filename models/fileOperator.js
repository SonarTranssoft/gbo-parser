const Excel = require('exceljs');
const fs = require('fs');

function checkFileAvailability(str) {
    if (fs.existsSync(str)) {
        return str;
    } else {
        return './images/no_image.jpg'
    }
}


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
        console.log(catalog)
        const workbook = new Excel.Workbook();
        let arrayOfSheets = map.get(catalog);
        console.log('Массив листов', arrayOfSheets)

        if (!arrayOfSheets.length) {
            let worksheet = workbook.addWorksheet(transformString(catalog), {
                properties: {
                    defaultRowHeight: 500,
                }
            })
            worksheet.columns = props;
            worksheet.getRow(1).height = 15;
            const productsForSheet = data.filter(val => val.parent === catalog)
            for (let i = 0; i < productsForSheet.length; i++) {

                let path = checkFileAvailability(`./images/${productsForSheet[i].imgSrc.split('/').pop()}`);
                console.log('Путь к картинке', path)
                let imageToPaste = workbook.addImage({
                    filename: path,
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
                console.log(el);
                let worksheet = workbook.addWorksheet(transformString(el), {
                    properties: {
                        defaultRowHeight: 500,
                    }
                })
                worksheet.columns = props;
                worksheet.getRow(1).height = 15;

                const productsForSheet = data.filter(val => val.parent === el)
                for (let i = 0; i < productsForSheet.length; i++) {
                    const path = checkFileAvailability(`./images/${productsForSheet[i].imgSrc.split('/').pop()}`);
                    console.log('Путь к картинке', path)
                    let imageToPaste = workbook.addImage({
                        filename: path,
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
            .writeFile(`./${catalog}.xlsx`)
            .then(() => console.log('Saved'))
            .catch(err => console.log(err, catalog + 'При записи этого файла произошла ошибка'))
    }
}

function transformString(str) {
    if (str.length > 31) {
        return str.split(' ').map(el => el.substring(0, 3) + '. ')
            .join('');
    } else {
        return str;
    }
}