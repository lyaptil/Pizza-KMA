/**
 * Created by chaika on 09.02.16.
 */
var Pizza_List = require('./data/Pizza_List');
var LIQPAY_PRIVATE_KEY = 'FDSLmKEkj3d3HVBIgbIIPbnU8MxwqH8hHK2RvZ3N';

function base64(str) {
    return new Buffer(str).toString('base64');
}

var crypto = require('crypto');
function sha1(string) {
    var sha1 = crypto.createHash('sha1');
    sha1.update(string);
    return sha1.digest('base64');
}



exports.dataSign = function () {
    
}

exports.getPizzaList = function(req, res) {
    res.send(Pizza_List); //Відправити назад все, що міститься в Pizza_List
};


exports.createOrder = function(req, res) {
    var order_info = req.body;
    console.log("Creating Order", order_info);

    var descr = "Замовлення піци: " + order_info.name+ '\n' +"Адреса доставки: " + order_info.address
        + '\n' + 'Телефон: '+ order_info.phone+ '\n'+ "Замовлення:";

    order_info.order.forEach(function (t) {
        descr+='\n- ' +t.quantity + "шт. " + t.pizza.title;
    }) ;
    descr += '\nРазом: ' + order_info.price ;

    var order = {
        version: 3,
        public_key: 'i31178965953',
        action: "pay",
        amount: parseInt(order_info.price),
        currency: "UAH",
        description: descr,
        order_id: Math.random(),
//!!!Важливо щоб було 1, бо інакше візьме гроші!!!
        sandbox: 1
    };
    var data = base64(JSON.stringify(order));
    var signature = sha1(LIQPAY_PRIVATE_KEY + data + LIQPAY_PRIVATE_KEY);


    res.send({
        success: true,
        name: order_info.name,
        phone: order_info.phone,
        address: order_info.address,
        pizzas: order_info.order.length,
        price: order_info.price,

        data: data,
        signature: signature
    });
};