const axios = require('axios');
const cheerio = require('cheerio');
require("dotenv").config();
const accountSID = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSID, authToken);

const url = "https://www.pickaboo.com/iphone-13-pro-128gb.html";

const product = {name: "", price: "", link: ""};

//Setting interval to run the function after every 20 seconds
const handle = setInterval(scraper, 20000);

async function scraper() {
    //Data fetching
    const {data} = await axios.get(url);

    //loading up the data/html
    const $ = cheerio.load(data);

    //Extracting the data that we need
    const item = $("div.page-wrapper");
    product.name = $(item).find("h1 span.base").text();
    product.link = url;
    const price = $(item).find("span.price").text().replace(/[,.৳]/g, "");
    const priceNum = parseInt(price); //type changing from string to int
    product.price = priceNum;
    console.log(product);

    //Send sms
    if(priceNum < 150000){
        client.messages.create({
            body: `The price of ${product.name} has become ${product.price}. Purchase it at ${product.link} now!`,
            from: "+19856022520",
            to: "+8801631751612"
        }).then((message) => {
            console.log(message);
            clearInterval(handle); //stoping the function from running again & again
        });
    }
}

scraper();