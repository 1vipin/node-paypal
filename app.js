const express = require('express');
const app = express();
const ejs = require('ejs');
const paypal = require('paypal-rest-sdk');

paypal.configure({
    'mode':'sandbox', //sandbox or live
    'client id': '', //put client id
    'client secret': ''//put client secret
})

app.get('/', function(req, res){
    res.render('index');
});

app.post('/apy' ,function(req, res){
   const create_payment_json = {
        "intent": "authorize",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:3000/success",
            "cancel_url": "http://localhost:3000/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "mobile", //put the name of products
                    "sku": "o2",
                    "price": "25.00",
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": "25.00"
            },
            "description": "best payment ever."
        }]
    };
    paypal.payment.create(create_payment_json, second_config, function (error, payment) {
        if (error) {
            throw error;
        } else {
           for(let i = 0; i< payment.links.length; i++) {
               if(payment.links[i].rel=== 'approval_url'){
                   res.redirect('payment.links[i].href');

               }

           }
        }
    });
    app.get('/success', function(req, res){
     const payerId = req.body.payerID,
     const paymentId = req.body.paymentId;
     const execute_payment_json = {
         "payer_id" :payerId,
         "transaction": [{
             "amount": {
                 "currency": "USD",
                 "total": "25.00"
             }
         }]
     }
     paypal.payment.create(paymentId,execute_payment_json, function (error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            console.log("GET Payment Response");
            console.log(json.stringify(payment));
            res.send('success')
        }
    });
  })
});
        app.get('/cancel', function(req, res){
        res.render('cancelled');
        });

app.listen(3000,function(req, res){
    console.log('server started');
});