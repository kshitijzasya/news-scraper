const puppeteer = require('puppeteer');

function scrapeController() { 
    //Contructor
}

//Creating instance of the browser
async function browserInstance() {
    let browsr = await puppeteer.launch({
        headless: false,
        // args: ["--disable-setuid-sandbox"],
        // 'ignoreHTTPSErrors': true,
        args: [
            '--no-sandbox',
            '--disable-dev-shm-usage', // <-- add this one
            ],
    });
    return browsr;
}

//Configure the browser
async function configureBrowser(url) {
    let browser;
    browser = await browserInstance(); 
    const page = await browser.newPage();
    await page.goto(url,{ waitUntil: "load", timeout: 0 });
    return page;
}

//start process of scraping
scrapeController.prototype.scrapeAll = async function (url) {     
    try {
        //Start the instance of the browser
        let page = await configureBrowser(url);
        //Waiting for the page to load before scraping
        await page.waitForSelector('.exclusives__rows-row'); 
        //get the selected elements
        this.scrapePage(page);
    } catch (err) {
        console.log('Could not resolve the browser instance:', err)
    }
}

//scrape the page elements
scrapeController.prototype.scrapePage = async function (page) {
    let html;
    try {
        //looping through the page to find the selected elements
        html = await page.evaluate(_ => [...document.querySelectorAll('.exclusives__rows-row')].map(value => {
            let result = {
                url: value.querySelector('.exclusives__rows-row-title').href,
                date: value.querySelector('.author__label').innerText,
            };
            value.parentNode.removeChild(value);
            return result;
        })); 
        //return links
        return html;
    } catch (err) {
        //Handle errors
        console.log('Could not evaluate page:', err)
    }
    //Default return
    return [];
}


module.exports = new scrapeController();