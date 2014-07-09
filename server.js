var app = require('express')();

app.use(function(req, res, next) {
    // Retrieve POST content as text
    req.text = '';
    req.on('data', function (chunk) { req.text += chunk });
    req.on('end', next);
});

app.all('*', function(req, res) {
    var data;

    res.header('Access-Control-Allow-Origin', '*');
 
    try {
        if (req.method !== 'POST') {
            throw 'Invalid request method. Expected POST.';
        }

        data = JSON.parse(req.text);

        if (!data.payload || !data.payload.push) {
            throw 'Request data is incorrectly formatted.';
        }

        res.json({
            response:
                data.payload
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