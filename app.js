const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//TODO

mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true});

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")
    
.get(function(req, res){
    Article.find(function(err, foundArticles){
        if(!err){
            res.send(foundArticles);
        } else{
            res.send(err);
        }
    });
})
    
.post(function(req, res){
    console.log();
    console.log();
    
    const article = new Article({
        title: req.body.title,
        content: req.body.content
    });
    
    article.save(function(err){
        if(!err){
            res.send("Success!");
        } else{
            res.send(err);
        }
    });
})

.delete(function(req, res){
    Article.deleteMany(function(err){
        if(!err){
            res.send("Success!");
        } else{
            res.send(err);
        }
    });
});

app.route("/articles/:articleTitle")

.get(function(req, res){
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
        console.log(foundArticle);
        if(!err){
            if(foundArticle){
            res.send(foundArticle);
        } else{
            res.send("No article with that title was found!");
        }
        } else{
            res.send(err);
        }
    });
})

.put(function(req, res){
    Article.update({title: req.params.articleTitle},
                  {title: req.body.title, content: req.body.content},
                  {overwrite: true},
                  function(err){
                    if(!err){
                        res.send("Successfully updated article!");
                    }
                    }
    );
})

.patch(function(req, res){
    Article.update({title: req.params.articleTitle},
                  {$set: req.body},
                  function(err){
                    if(!err){
                        res.send("Successfully updated the article!");
                    }
                    }
    );
})

.delete(function(req, res){
    Article.deleteOne(
        {title: req.params.articleTitle},
        function(err){
        if(!err){
            res.send("Successfully Deleted!");
        } else{
            res.send(err);
        }
    });
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});