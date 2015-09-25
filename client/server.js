var express = require('express');
var compression = require('compression');
var prerender = require('prerender-node');
var base64url = require('b64url');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var app = express();
var sm = require('sitemap'),
    currentSitemap;
// Here we require the prerender middleware that will handle requests from Search Engine crawlers
// We set the token only if we're using the Prerender.io service
app.use(require('prerender-node')
    //.set('prerenderToken', 'iYoMs0u5XdiRFnv84x97')
    //.set('prerenderServiceUrl', 'https://livejob-crawl.herokuapp.com')
    //.set('prerenderServiceUrl', 'http://localhost:3000')
    .set('prerenderServiceUrl', 'https://service.prerender.io'));
app.use(express.static(__dirname + '/dist'));
app.use(compression());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
// Connect to database
mongoose.connect(process.env.MONGOLAB_URI);
// Schema of Company
var ProductSchema = new Schema({
    name: String,
    slug: String,
    number: Number,
    title: String,
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        default: null
    },
    stock: Number,
    info: String,
    image: String,
    images: [{
        //url: String
    }],
    price: Number,
    priceBefore: Number,
    active: Boolean,
    features: {
        size: Number,
        weight: Number
    },
    created: {
        type: Date
    },
    updated: {
        type: Date,
        //default: Date.now
    }
}, {
    toJSON: {
        getters: true
    },
    toObject: {
        getters: true
    }
});
var CategorySchema = new Schema({
    name: String,
    slug: String,
    type: String, //product, faq, etc..
    info: String,
    active: Boolean,
    created: {
        type: Date
    },
    updated: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: {
        getters: true
    },
    toObject: {
        getters: true
    }
});
var Product = mongoose.model('Product', ProductSchema);
var Category = mongoose.model('Category', CategorySchema);
//handle sitemap get
app.get('/sitemap.xml', function(req, res) {
    //generates sitemap
    sitemap(function(err, currentSitemap) {     
        if (err) return handleError(res, 'sitemap error');
        res.header('Content-Type', 'application/xml');
        res.send(currentSitemap.toString());
    });
});
//handle all gets
app.get('/*', function(req, res) {
    res.sendFile(__dirname + '/dist/index.html');
});
//handle all posts
app.post('/*', function(req, res) {
    var url = 'https://www.glamoux.com/';
    var signedRequest = req.body.signed_request;
    //decode
    var data = signedRequest.split('.')[1];
    var buf = new Buffer(data, 'base64');
    data = JSON.parse(buf);
    var pageid = data.page.id;
    Company.findOne({
        facebook: pageid
    }, function(err, company) {
        if (company) {
            url += company.ref + '/#iframe';
            res.redirect(url);
        } else {
            res.sendFile(__dirname + '/dist/index.html');
        }
    });
});
app.listen(process.env.PORT || 3001);

function sitemap(cb) {
    var currentSitemap = sm.createSitemap({
        hostname: 'https://www.glamoux.com',
        cacheTime: 600000, // 600 sec - cache purge period
        urls: [{
            url: '/',
            changefreq: 'daily',
            priority: 0.3
        }]
    });
    Product.find({
        active: true
    }).populate('category').exec(function(err, products) {
        products.forEach(function(product) {
            currentSitemap.add({
                url: '/' + product.category.slug + '/' + product.slug + '/' + product.id + '/',
                changefreq: 'daily',
                prioty: 0.7
            });
        })
        if (cb) return cb(err, currentSitemap);
    });
}

function handleError(res, err) {
    return res.status(500).send(err);
}