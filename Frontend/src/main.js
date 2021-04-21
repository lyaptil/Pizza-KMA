/**
 * Created by chaika on 25.01.16.
 */

var map, marker, markerHome, point;
var directionDisplay;
var directionService;

function initialize() {
//Тут починаємо працювати з картою
    var mapProp = {
        center: new google.maps.LatLng(50.464379,30.519131),
        zoom: 13
    };

    var html_element = document.getElementById("googleMap");
    map = new google.maps.Map(html_element, mapProp);

    var rendererOptions = {
        map: map,
        suppressMarkers : true
    };
    directionDisplay = new google.maps.DirectionsRenderer(rendererOptions);

    directionService = new google.maps.DirectionsService();

    point = new google.maps.LatLng(50.464379,30.519131);
    marker = new google.maps.Marker({
        position: point,
        map: map,
        draggable: true,
        animation: google.maps.Animation.DROP,
        icon: "assets/images/map-icon.png"
    });
//Карта створена і показана
    markerHome = new google.maps.Marker({
        map: map,
        icon: "assets/images/home-icon.png"
    });

    google.maps.event.addListener(map, 'click',function(me){
        var coordinates = me.latLng;
        markerHome.setPosition(coordinates);

        geocodeLatLng(coordinates, function(err, address){
            if(!err) {
                //Дізналися адресу
                $('#enter-address').val(address);
                $('#address').text(address);

                calculateRoute(point, coordinates, function callback(err, data) {
                    if(!err){
                        $('#time').text(data.duration);
                    } else {
                        $('#time').text("невідомий");
                        console.log("Не можна знайти шлях.")
                    }
                });
            } else {
                $('#time').text("невідомий");
                $('#address').text('невідома');
                console.log("Немає адреси.")
            }
        })
    });
}

function geocodeAddress(address, callback) {
    var geocoder = new google.maps.Geocoder();

    geocoder.geocode({'address': address}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK && results[0]) {
            var coordinates = results[0].geometry.location;
            markerHome.setPosition(coordinates);

            calculateRoute(point, coordinates, function callback(err, data) {
                if(!err){
                    $('#time').text(data.duration);
                } else {
                    $('#time').text("невідомий");
                    console.log("Не можна знайти шлях.")
                }
            });
            callback(null, results[0].formatted_address);
        } else {
            $('#time').text("невідомий");
            $('#address').text('невідома');
            callback(new Error("Can not find the address."));
        }
    });
}

function geocodeLatLng(latlng, callback){
//Модуль за роботу з адресою
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'location': latlng}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK && results[1]) {
            var address = results[1].formatted_address;
            callback(null, address);
        } else {
            callback(new Error("Can't find address"));
        }
    });
}

function calculateRoute(A_latlng, B_latlng, callback) {
    var request = {
        origin: A_latlng,
        destination: B_latlng,
        travelMode: google.maps.TravelMode["DRIVING"]
    };

    directionService.route(request, function(result, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            directionDisplay.setDirections(result);

            var leg = result.routes[ 0 ].legs[ 0 ];
                callback(null, {
                    duration: leg.duration.text
                });
        }
        else {
            callback(new Error("Can' not find direction"));
        }
    });
}


$(function() {
    //This code will execute when the page is ready
    var PizzaMenu = require('./pizza/PizzaMenu');
    var PizzaCart = require('./pizza/PizzaCart');

    PizzaCart.initialiseCart();
    PizzaMenu.initialiseMenu();

if(window.location.href.indexOf('order')!== -1) {
    //Коли сторінка завантажилась
    google.maps.event.addDomListener(window, 'load', initialize);
}

    $('.clean-order').click(function () {
        PizzaCart.clean();
    });



    $(".nav-pills li").on("click", function () {
        $(".nav-pills li").removeClass("active");
        $(this).addClass("active");
        var selector = $(this).find('a').data('filter');
        PizzaMenu.filterPizza(selector);
    });

    $(".butt-next").on('click', function () {
        var name = $('#enter-name').val();
        var phone = $('#enter-phone').val();
        var address = $('#enter-address').val();
        var nameValid = checkName(name, '.name', '#name-help');
        var phoneValid = checkPhone(phone, '.phone', '#phone-help');
        var addressValid = checkAddress(address, '.address', '#address-help');

        if(nameValid && phoneValid && addressValid){
            PizzaCart.createOrder(function (err, data) {
                if (err) {
                    alert("Cannott create order");
                } else {
                    LiqPayCheckout.init({
                        data: data.data,
                        signature: data.signature,
                        embedTo: "#liqpay",
                        mode: "popup"
                    }).on("liqpay.callback", function(data){
                        console.log(data.status);
                        console.log(data);
                        alert(data);
                    }).on("liqpay.ready", function(data){
                        // ready
                    }).on("liqpay.close", function(data){
                        // close
                    });
                    }
            });
        }
    });

    function checkPhone(input, a, help) {
        if (input.substr(1).match(/^\d+$/) && ((input.startsWith("0") && input.length === 10) || (input.startsWith("+380")&& input.length === 13))){
            $(help).hide();
            $(a).removeClass("has-error");
            $(a).addClass("has-success");
            return true;
        }else {
            $(a).removeClass("has-success");
            $(a).addClass('has-error');
            $(help).show();
            return false;
        }
    }
    function checkName(input, a, help) {
        if (input.match(/^[a-zA-Zа-яієїА-ЯІЇЄ \-]{1,25}$/)) {
            $(help).hide();
            $(a).removeClass("has-error");
            $(a).addClass("has-success");
            return true;
        } else {
            $(a).removeClass("has-success");
            $(a).addClass('has-error');
            $(help).show();
            return false;
        }
    }
    
    function checkAddress(input, a, help) {
        if (input !== ""){
            $(help).hide();
            $(a).removeClass("has-error");
            $(a).addClass("has-success");
            return true;
        }else {
            $(a).removeClass("has-success");
            $(a).addClass('has-error');
            $(help).show();
            return false;
        }
    }

    $('#enter-name').keyup(function(){
        var name = $('#enter-name').val();
        checkName(name, '.name', '#name-help');
    });

    $('#enter-phone').keyup(function(){
        var phone = $('#enter-phone').val();
        checkPhone(phone, '.phone', '#phone-help');
    });

    $('#enter-address').on('input', function(){
        var address = $('#enter-address').val();

        geocodeAddress(address, function (err, address) {
            if(!err){
                $('#address').text(address);
            } else {
                console.log("Неправильна адреса.")
            }
        });
    });
});