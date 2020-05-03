const express = require('express');
const router = express.Router();
const path = require('path');

const request = require('request');
const cheerio = require('cheerio');

const Comment = require('../models/Comment');
const Article = require('../models/Article');


router.get("/", function (req, res) {
    res.redirect('/articles');
});

router.get("/scrape", function (req, res) {
    request("http://www.vox.com", function (error, response, html) {
        var $ = cheerio.load(html);
        var titlesArray = [];

        $(".c-entry-box--compact__title").each(function (i, element) {
            var result = {};

            result.title = $(this)
                .children("a")
                .text();
            result.link = $(this)
                .children("a")
                .attr("href");

            if (result.title !== "" && result.link !== "") {
                if (titlesArray.indexOf(result.title) == -1) {
                    titlesArray.push(result.title);

                    Article.count({
                        title: result.title
                    }, function (err, test) {
                        if (test === 0) {
                            var entry = new Article(result);

                            entry.save(function (err, doc) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log(doc);
                                }
                            });
                        }
                    });
                } else {
                    console.log("Article already exists.");
                }
            } else {
                console.log("Not saved to DB, missing data");
            }
        });
        res.redirect("/");
    });
});

router.get("/articles", function (req, res) {
    Article.find({})
        .then(function (dbArticle) {
            res.render("index", dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

router.get("/articles-json", function (req, res) {
    Article.find({}, function (err, doc) {
        if (err) {
            console.log(err);
        } else {
            res.json(doc);
        }
    });
});

router.get("/clear", function (req, res) {
    Article.remove({}, function (err, doc) {
        if (err) {
            console.log(err);
        } else {
            console.log("cleared all articles");
        }
    });
    res.redirect("/");
});

router.get("/articles/:id", function (req, res) {
    Article.findOne({
            _id: req.params.id
        })
        .populate("comment")
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

router.post("/articles/:id", function (req, res) {
    Comment.create(req.body)
        .then(function (dbComment) {
            return Article.findOneAndUpdate({
                _id: req.params.id
            }, {
                comment: dbComment._id
            }, {
                new: true
            });
        })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

module.exports = router;