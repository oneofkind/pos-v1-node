const datbase = require("./datbase");

module.exports = function main(inputs) {
    const allItems = datbase.loadAllItems();
    const promotions = datbase.loadPromotions();

    const listItems = getListItems(inputs);
    const listFree = getListFree(listItems);

    //获取总计，节省
    let totalSum = listItems.reduce((sum, value) => sum + value.totalPrice, 0);
    let totalFreeSum = listFree.reduce((sum, value) => sum + value.totalPrice, 0);

    //打印列表
    let resultList = "***<没钱赚商店>购物清单***\n";
    listItems.forEach(value => resultList += "名称：" + value.name + "，数量：" + value.number + value.unit + "，单价：" + value.price.toFixed(2) + "(元)，" + "小计：" + value.totalPrice.toFixed(2) + "(元)" + "\n");
    resultList += "----------------------\n";
    resultList += "挥泪赠送商品：\n";
    listFree.forEach(value => resultList += "名称：" + value.name + "，数量：" + value.number + value.unit + "\n");
    resultList += "----------------------\n";
    resultList += "总计：" + totalSum.toFixed(2) + "(元)\n";
    resultList += "节省：" + totalFreeSum.toFixed(2) + "(元)\n";
    resultList += "**********************";

    //计算商品数量和总价
    function getListItems(list) {
        let allListItems = [];
        list.forEach(currentValue => allItems.forEach(value => {

            let id = currentValue;
            let number = 1;

            //特殊情况
            if (currentValue.includes("-")) {
                let rung_arr = currentValue.split("-");
                id = rung_arr[0];
                number = rung_arr[1] * 1;
            }

            //流程
            if (id == value.barcode) {
                if (allListItems.map(value1 => value1.id).includes(id)) {
                    allListItems.forEach(list_items => {
                        if (list_items.id == id) {
                            list_items.number += number;
                        }
                    })
                }

                //初始化
                else {
                    allListItems.push({
                        id: value.barcode,
                        name: value.name,
                        number: number,
                        unit: value.unit,
                        price: value.price,
                    })
                }
            }
        }));

        //计算总价格
        allListItems.forEach(value => value.totalPrice = value.number * value.price);
        return allListItems;
    }


    //优惠政策
    function getListFree(listItems) {
        let allListFree = [];

        listItems.forEach(value => {
            if (promotions[0].barcodes.includes(value.id)) {
                allListFree.push({
                    name: value.name,
                    number: Math.floor(value.number / 3),
                    price: value.price,
                    unit: value.unit
                });
                value.totalPrice = (value.number - Math.floor(value.number / 3)) * value.price
            }
        });

        allListFree.forEach(value => value.totalPrice = value.number * value.price);
        return allListFree;
    }

    console.log(resultList);
    return resultList;
};