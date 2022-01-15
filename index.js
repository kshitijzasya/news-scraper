const scrapeController = require('./src/scrapeController');

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

//serve static site files
app.use(express.static("public"));

app.get('/scrape', async (req, res) => {
    let url = req.query.url;
    if(url && url.length) {
        let path =  await scrapeController.scrapeAll(req, res); 
        return res.status(200).json({})
    }    
    res.status(500).json({url});
});

app.get('/download', (req, res) => {
    res.download('./public/news.csv');
})

app.listen(port, _ => console.log(`Listening on port ${port}`));