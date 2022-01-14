const puppeteer = require('puppeteer');

function scrapeController() { 
    //Contructor
}

//Creating instance of the browser
async function browserInstance() {
    let browsr = await puppeteer.launch({
        headless: false,
        devtools: true,
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
        //get the selected elements
        let contentArr = this.scrapePage(page);
        this.fetchNewsUrl(contentArr, page);
    } catch (err) {
        console.log('Could not resolve the browser instance:', err)
    }
}

//Fetch news real url on the url basis
scrapeController.prototype.fetchNewsUrl = async function(content = [], page) {

}

async function getContent(page) {
    //Waiting for the page to load before scraping
    await page.waitForSelector('.exclusives__rows-row'); 
    console.log('New page load finish...')
    return page.evaluate(_ => [...document.querySelectorAll('.exclusives__rows-row')].map(value => {
        let result = {
            url: value.querySelector('.exclusives__rows-row-title').href,
            date: value.querySelector('.author__label').innerText,
        };
        // value.parentNode.removeChild(value);
        value.remove();
        return result;
    }));
}

//scrape the page elements
scrapeController.prototype.scrapePage = async function (page) {
    let html = []; //result default 
    let pagesToScrape = 3; //limit to scrape through pages
    try {
        //Looping through different pages
        for(var i = 0; i <= pagesToScrape; i++) {
            //looping through the page to find the selected elements
            html = [...await getContent(page), ...html];
            console.log('clicking on button to load news items...', i++)
            await page.click(".pager__item a");
        }
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