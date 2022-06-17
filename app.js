
const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const ejs=require("ejs");
//const _=require("lodash");
const app=express();
app.set("view engine",ejs);
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/recipeDB", {useNewUrlParser: true});

const recipeSchema={
    name: String,
    content: String 

};
const Recipe= mongoose.model("Recipe",recipeSchema);
////////////////////////////////////Requests ///////////////////////////////////////////////////////

app.route("/recipes")
//Listing all recipes
.get(function(req,res){
    Recipe.find({},function(err,foundRecipes){
        if(err){
            res.send(err);
        }else{
            res.send(foundRecipes);
        }
    })
})
//Creating new recipe
.post(function(req,res){
    const recipe=new Recipe({
        name: req.body.name,
        content:req.body.content
    });
    recipe.save(function(err){
        if(err){
            res.send(err);
        }else{
            res.send("Successfully created recipe!");
        }
    })
});
/////////////////////////////Requests to specific  recipes////////////////////////////////////////

//Fetching data about individual recipe
app.route("/recipes/:recipeName")
.get(function(req,res){
    Recipe.findOne({name: req.params.recipeName},function(err,foundRecipe){
        if(err){
            res.send(err);
        }else{
            if(foundRecipe)
                res.send(foundRecipe);
            else{
                res.send("No such recipe found!");
            }
        }
    })
})
//updating a recipe
.patch(function(req,res){
    Recipe.updateOne({name: req.params.recipeName},
                    {$set: req.body},
                    function(err){
                        if(err){
                            res.send(err);
                        }else{
                            res.send("Successfully updated!");
                        }
                    })
})
//replacing a specific recipe with a new one
.put(function(req,res){
    Recipe.updateOne({name: req.params.recipeName},
                     {name: req.body.name, content: req.body.content},
                     {upsert: true},
                     {function(err){
                         if(err){
                             res.send(err);
                         }
                         else{
                             res.send("Successfully replaced!");
                         }
                     }})
})
//deleting a recipe
.delete(function(req,res){
    Recipe.deleteOne({name: req.params.recipeName},
                    function(err){
                        if(err){
                        res.send(err);
                    }else{
                        res.send("Successfuly deleted!");
                    }
                })
})
app.listen(3000,function(req,res){
    console.log("server running at port 3000!");
})