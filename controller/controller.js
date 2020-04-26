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
    request("https://www.vox.com/", function (error, response, html) {
        const $ = cheerio.load(html);
        let titlesArr = [];

        $(".c-entry-box--compact__title").each(function (i, element) {
            let result = {};

            result.title = $(this).children('a').attr('href');
            result.link = $(this).children('a').attr('href');

            Article.create(result)
                .then(function (dbArticle) {

                    console.log(dbArticle);
                })
                .catch(function (err) {

                    console.log(err);
                });
        });

        res.redirect("/");
    });
});

router.get("/articles", function (req, res) {
    Article.find({})
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
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