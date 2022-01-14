const scrapeController = require('./src/scrapeController');

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

//serve static site files
app.use(express.static("public"));

app.get('/scrape', (req, res) => {
    let url = req.query.url;
    if(url && url.length) {
        scrapeController.scrapeAll(url)
    }
    
    res.json({url});
})

app.listen(port, _ => console.log(`Listening on port ${port}`));