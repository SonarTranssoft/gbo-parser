class ProductFull {
    // картинка
// наименование
// артикул
// Детальное описание
// цена
// производитель
    constructor(imgSrc, vendorCode = 0, cost = 0, manufacturerCode = 0) {
        this.imgSrc = imgSrc;
        this.vendorCode = vendorCode;
        this.cost = cost;
        this.manufacturerCode = manufacturerCode;
    }
}


module.exports = ProductFull;