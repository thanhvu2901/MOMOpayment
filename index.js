var PORT = process.env.PORT || 5000;
const express = require('express');
const exphdbs = require('express-handlebars');
var path = require('path');
const app = express();



app.set('views', path.join(__dirname, "views"));
app.engine('handlebars', exphdbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true }))
var items = [{
        "name": "Ipad mini 1",
        "sku": "001",
        "price": "5.000.000",
        "currency": "VNĐ",
        "quantity": 1
    },
    {
        "name": "Ipad mini 2",
        "sku": "001",
        "price": "7.000.000",
        "currency": "VNĐ",
        "quantity": 1
    },

]


app.get('/', function(req, res) {
    res.render('index.handlebars', { 'items': items });
})


app.listen(PORT, function() {
    console.log('Server is listening');
})

const { v1: uuidv1 } = require('uuid');
const https = require('https');
//parameters send to MoMo get get payUrl
var endpoint = "https://test-payment.momo.vn/gw_payment/transactionProcessor"
var hostname = "https://test-payment.momo.vn"
var path = "/gw_payment/transactionProcessor"
    // var partnerCode = "MOMO"
    // var accessKey = "F8BBA842ECF85"
    // var serectkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz"
var partnerCode = "MOMORXW120210727"
var accessKey = "yQyIL5hLkYgkR2d3"
var serectkey = "b9SnCcQ28g4gFJj5tMy0UOeUYqIPBoVH"
var orderInfo = "pay with MoMo"
var returnUrl = "http://localhost:5000/success"
var notifyurl = "https://callback.url/notify"
var amount = '12000001'
var orderId = uuidv1()
var requestId = uuidv1()
var requestType = "captureMoMoWallet"
var extraData = "merchantName=;merchantId=" //pass empty value if your merchant does not have stores else merchantName=[storeName]; merchantId=[storeId] to identify a transaction map with a physical store

//before sign HMAC SHA256 with format
//partnerCode=$partnerCode&accessKey=$accessKey&requestId=$requestId&amount=$amount&orderId=$oderId&orderInfo=$orderInfo&returnUrl=$returnUrl&notifyUrl=$notifyUrl&extraData=$extraData
var rawSignature = "partnerCode=" + partnerCode + "&accessKey=" + accessKey + "&requestId=" + requestId + "&amount=" + amount + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&returnUrl=" + returnUrl + "&notifyUrl=" + notifyurl + "&extraData=" + extraData
    //puts raw signature
console.log("--------------------RAW SIGNATURE----------------")
console.log(rawSignature)
    //signature
const crypto = require('crypto');
const { url } = require('inspector');
const { type } = require('os');
var signature = crypto.createHmac('sha256', serectkey)
    .update(rawSignature)
    .digest('hex');
console.log("--------------------SIGNATURE----------------")
console.log(signature)

//json object send to MoMo endpoint
var body = JSON.stringify({
        partnerCode: partnerCode,
        accessKey: accessKey,
        requestId: requestId,
        amount: amount,
        orderId: orderId,
        orderInfo: orderInfo,
        returnUrl: returnUrl,
        notifyUrl: notifyurl,
        extraData: extraData,
        requestType: requestType,
        signature: signature,
    })
    //Create the HTTPS objects
var options = {
    hostname: 'test-payment.momo.vn',
    port: 443,
    path: '/gw_payment/transactionProcessor',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
    }
};

//Send the request and get the response
console.log("Sending....")

app.post('/pay', (require, respon) => {
    var req = https.request(options, (res) => {
        console.log(`Status: ${res.statusCode}`);
        console.log(`Headers: ${JSON.stringify(res.headers)}`);
        res.setEncoding('utf8');
        res.on('data', (body) => {
            console.log('Body');
            console.log(body);
            console.log('payURL');
            console.log((JSON.parse(body).payUrl));
            var a = JSON.parse(body).payUrl
            console.log(String(a))
            respon.redirect(a)
        });

        // res.on('end', () => {
        //     console.log('No more data in response.');
        // });
    });
    req.write(body);
    req.end();
    // var a = JSON.parse(body).payUrl
    // console.log(type(a))

})
app.get('/success', function(req, res) {
    res.render('success.handlebars');
})