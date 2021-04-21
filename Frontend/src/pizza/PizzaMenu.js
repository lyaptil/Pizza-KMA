/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
var API = require("../API");
//var Pizza_List = require('../Pizza_List');
var Pizza_List = {};

//HTML едемент, куди будуть додаватися піци
var $pizza_list = $("#pizza_list");

function showPizzaList(list) {
    //Очищаємо старі піци в кошику
    $pizza_list.html("");

    //Оновлення однієї піци
    function showOnePizza(pizza) {
        var html_code = Templates.PizzaMenu_OneItem({pizza: pizza});

        var $node = $(html_code);
        $node.find(".buy-small").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Small);
        });
        $node.find(".buy-big").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Big);
        });


        $pizza_list.append($node);
    }

    list.forEach(showOnePizza);
}
var PizzaFilter = {
    Meat:0,
    Pineapple:1,
    Onion:2,
    Ocean:3,
    Vega: 4,
    All:5
};
function setTitle(title) {
    $(".all-title .text").text(title);
}
function filterPizza(filter) {
    if (filter === PizzaFilter.All) {
        showPizzaList(Pizza_List);
        setTitle("Усі піци");
        $(".all-count").text("8");
    } else {
        //Масив куди потраплять піци, які треба показати
        var pizza_shown = [];
        if (filter === PizzaFilter.Meat) {
            Pizza_List.forEach(function (pizza) {
                if (pizza.content.meat) {
                    pizza_shown.push(pizza);
                }
            });
            setTitle("М'ясні піци");
        }
        if (filter === PizzaFilter.Pineapple) {
            Pizza_List.forEach(function (pizza) {
                if (pizza.content.pineapple) {
                    pizza_shown.push(pizza);
                }
            });
            setTitle("Піци з ананасами");
        }
        if (filter === PizzaFilter.Onion) {
            Pizza_List.forEach(function (pizza) {
                if (pizza.content.mushroom) {
                    pizza_shown.push(pizza);
                }
            });
            setTitle("Піци з грибами");
        }
        if (filter === PizzaFilter.Ocean) {
            Pizza_List.forEach(function (pizza) {
                if (pizza.type === "Морська піца") {
                    pizza_shown.push(pizza);
                }
            });
            setTitle("Піци з морепродуктами");
        }
        if (filter === PizzaFilter.Vega) {
            Pizza_List.forEach(function (pizza) {
            if (pizza.type === "Вега") {
                pizza_shown.push(pizza);
            }
            });
            setTitle("Вегетеріанські піци");
        }
        $(".all-count").text(pizza_shown.length);
        //Показати відфільтровані піци
        showPizzaList(pizza_shown);
    }

}

function initialiseMenu() {
    //Показуємо усі піци, які приймаємо із сервера
    API.getPizzaList(function (err, list) {
        if(err){
            alert(err.message);
        } else {
            Pizza_List = list;
            showPizzaList(Pizza_List);
        }
    });
}

exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;