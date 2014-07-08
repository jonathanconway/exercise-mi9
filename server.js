var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    logfmt = require("logfmt");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(logfmt.requestLogger());

app.all('*', function(req, res) {
    console.log(req);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Content-Type', 'application/json');
    res.contentType("application/json");
 
    try {
        if (req.method !== 'POST') {
            throw 'Invalid request method. Expected POST.';
        }

        if (!req.body.payload || !req.body.payload.push) {
            throw 'Request data is incorrectly formatted.';
        }

        res.json({
            response:
                req.body.payload
                    .filter(function (payloadItem) {
                        return payloadItem.image &&
                                payloadItem.drm &&
                                payloadItem.episodeCount > 0;
                    })
                    .map(function (payloadItem) {
                        return { 
                            image: payloadItem.image.showImage, 
                            slug: payloadItem.slug, 
                            title: payloadItem.title
                        };
                    })
        });
    }
    catch (ex) {
        res.json(400, { error: 'Could not decode request: ' + ex });
    }
});

app.listen(process.env.PORT || 5000, function () {});