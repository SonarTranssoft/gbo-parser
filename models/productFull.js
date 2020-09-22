class ProductFull {
    // картинка
// наименование
// артикул
// Детальное описание
// цена
// производитель
    constructor(imgSrc, title, vendorCode = 0, cost = 0, manufacturerCode = 0, description = '-', parent) {
        this.imgSrc = imgSrc;
        this.title = title;
        this.vendorCode = vendorCode;
        this.cost = cost;
        this.manufacturerCode = manufacturerCode;
        this.description = description;
        this.parent = parent;
    }
}


module.exports = ProductFull;