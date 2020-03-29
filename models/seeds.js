// var mongoose = require("mongoose");
var Campground=require('./campground.js');
var Comment=require("./comment.js");

var data=[
    {
        name:"Halong Bay",
        image:"https://www.planetware.com/photos-large/VIE/vietnam-halong-bay.jpg",
        description:"Halong Bay is one of the world's most spellbinding sea views and is a UNESCO World Heritage Site."
    },
    {
        name:"Ho Chi Minh City",
        image:"https://www.planetware.com/photos-large/VIE/vietnam-ho-chi-minh-city-street.jpg",
        description:"Ho Chi Minh City, the buzzing and crazy commercial hub of the country."
    },
    {
        name:"Hue",
        image:"https://www.planetware.com/photos-large/VIE/vietnam-hue-imperial-palace-gate.jpg",
        description:"Hue is packed to the brim with relics from the reign of the 19th-century Nguyen emperors."
    },
    {
        name:"My Son",
        image:"https://www.planetware.com/photos-large/VIE/vietnam-my-son-ruins.jpg",
        description:"My Son is a ruined Cham era temple city that dates from the 4th century."
    },
    {
        name:"Hoi An",
        image:"https://www.planetware.com/photos-large/VIE/vietnam-hoi-an-riverfront.jpg",
        description:"Hoi An is the most atmospheric city in Vietnam, with bags of surviving historic architecture."
    }
];

function seedB(){
    //Remove all campgrounds
    Campground.deleteMany({}, function(err){
        if(err)
        {
            console.log(err);
        }
        console.log("Removed campgrounds"); 
    });
    //add seed campgrounds
    data.forEach(function(seed)
    {
        Campground.create(seed, function(err, campground)
        {
            if(err)
            {
                console.log(err);
            }
            else{
                console.log("add a camp");
                //create comment for each camp 
                Comment.create({
                    text:"Beautiful place",
                    author:"Chaos Knight"

                }, function(err, comment)
                {
                    if(err)
                    {
                        console.log(err);
                    }
                    else{
                        campground.comments.push(comment);
                        campground.save();
                        console.log("Created new comment");
                    }
                });
            }
        }
        );   
    });

    //add seed comments
}
module.exports=seedB;