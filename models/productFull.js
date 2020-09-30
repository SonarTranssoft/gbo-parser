class ProductFull {
    // картинка
// наименование
// артикул
// Детальное описание
// цена
// производитель
    constructor(options) {
        if (typeof options !== 'object') {
            throw new Error('options must be an object');
        }

        this.imgSrc = options.imgSrc;
        this.title = options.title;
        this.parent = options.parent || 'noparent';
        this.vendorCode = options.vendorCode || 0;
        this.cost = options.cost || 0;
        this.manufacturerCode = options.manufacturerCode || 0;
        this.description = options.description || 0;
    }
}


module.exports = ProductFull;
