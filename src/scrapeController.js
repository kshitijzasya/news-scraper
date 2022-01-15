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
    await page.goto(url, { waitUntil: "load", timeout: 0 });
    return page;
}

//start process of scraping
scrapeController.prototype.scrapeAll = async function (req, res) {
    try {
        this.url = req.query.url;
        this.date = req.query.date; 
        //Start the instance of the browser
        let page = await configureBrowser(this.url);
        //get the selected elements
        let contentArr = await this.scrapePage(page); 
        contentArr = await this.fetchNewsUrl(contentArr, page);
        this.exportNewsToFile(contentArr, res);  
    } catch (err) {
        console.log('Could not resolve the browser instance:', err)
    }
}

scrapeController.prototype.exportNewsToFile = function (content, res) {
    console.log('Exporting news date to file...');
    //Exporting to file
    let fs = require('fs');
    let json = JSON.stringify(content);
    let writeStream = fs.createWriteStream('./public/news.csv');
    writeStream.write(`URL, AUTHOR \n`);
    content.forEach(news => {
        writeStream.write(`${news.url},${news.date}\n`);
    })
    writeStream.end();

    writeStream.on('finish', () => { 
        console.log('File written successfully.');
    }).on('error', (err) => {
        console.log(err)
        return "";
    })
}

//Fetch news real url on the url basis
scrapeController.prototype.fetchNewsUrl = async function (content = [], page) {
    try {
        //Looping through the selected elements
        for (let i = 0; i < content.length; i++) {
            //Getting the news url
            let url = content[i].url;
            //Opening the news url
            await page.goto(url, { waitUntil: "load", timeout: 0 });
            //Getting the news content
            let newsContent = await scrapeNewsPage(page, url);
            //Saving the news content
            content[i].url = newsContent;
        }
        return content;
    } catch (err) {
        console.log('Could not resolve the browser instance:', err)
    }
}

async function scrapeNewsPage(page, url = "") {
    console.log('Going through news page..')
    try {
        //Waiting for the page to check selector
        if (await page.$('.news-ct__source-link') !== null) return page.$$eval('.news-ct__source-link a', (links) => links[0].href);
        throw Error('not valid')
    } catch (err) {
        console.log('not gettng url:', err)
        return url;
    }
}

async function getContent(page) {
    //Waiting for the page to load before scraping
    await page.waitForSelector('.exclusives__rows-row');
    console.log('New page load finish...');
    return page.evaluate(_ => [...document.querySelectorAll('.exclusives__rows-row')].map(value => {
        let result = {
            url: value.querySelector('.exclusives__rows-row-title').href,
            date: value.querySelector('.author__label').innerText,
        };
        //removing the content to clear space on tab
        value.remove();
        return result;
    }));
}

//check if news date has reached limit
function checkIfOverLimit(url, data) {
    let date = new Date(data.targetDate); 
    let dateArr = url.replace(`${data.origin.trim()}/`, '').split('/'); 
    if ( new Date(`${dateArr[0]}-${dateArr[1]}-01`) === "Invalid Date"  ) {
        return true;
    }
    return new Date(`${dateArr[0]}-${dateArr[1]}-01`) > date;
}

//scrape the page elements
scrapeController.prototype.scrapePage = async function (page, html = []) {
    try { 
        //Looping through different pages
        let result = await getContent(page);
        let next = false; 
        for(var i = 0; i < result.length; i++) { 
            if (await checkIfOverLimit(
                result[i].url, 
                {
                    origin: this.url,
                    targetDate: this.date
                })) {
                next = true;
                break;
            }
        }
        console.log('clicking on button to load news items.');
        await page.click(".pager__item a");
        return next ? this.scrapePage(page, [...html, ...result]) : [...html, ...result];
    } catch (err) {
        //Handle errors
        console.log('Could not evaluate page:', err)
    }
    //Default return
    return [];
}


module.exports = new scrapeController();