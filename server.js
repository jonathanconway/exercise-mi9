var express = require('express'),
    app = express(),
    bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.post('*', function(req, res) {
    res.header('Access-Control-Allow-Origin', '*');

    try {
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
        res.json(400, { error: 'Could not decode request: ' + ex.message });
    }
});

app.listen(process.env.PORT || 5000, function () {});