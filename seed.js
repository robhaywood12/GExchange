var mongoose    = require("mongoose");
var Message     = require("./models/message");
var Convo       = require("./models/conversation");

var messages = [
    {
        author: "baguette99",
        content: "hi bob",
        convoId: "123"
    },
    {
        author: "america1",
        content: "hey steve",
        convoId: "123"
    },
    {
        author: "billie sheen",
        content: "hey mikael",
        convoId: "204"
    },
    {
        author: "mikael jaekson",
        content: "billie? what are you doing here?",
        convoId: "204",
    },
    {   
        author: "baguette99",
        content: "my name is not steve.",
        convoId: "123"
    },
    {
        author: "jimmyFallon",
        content: "flippity jibbits!",
        convoId: "762"
    }
]

var convos = [
    {
        convoId: "123",
        participants: {
            person1: "baguette99",
            person2: "america1"
        }
    },
    {
        convoId: "204",
        participants: {
            person1: "billie jean",
            person2: "mikael jaekson"
        }
    },
    {
        convoId: "762",
        participants: {
            person1: "jimmyFallon",
            person2: "baguette99"
        }
    }
    
]


function SeedDB(){
    Message.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed posts");
        // add the posts in
        messages.forEach(function(seed){
            Message.create(seed, function(err, post){
                if(err) {
                    console.log(err);
                } else {
                    console.log("seeding messages DB with one message");
                }
            });
        });
    });
    
    Convo.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed conversations");
        // add the conversations in
        convos.forEach(function(seed){
            Convo.create(seed, function(err, post){
                if(err){
                    console.log(err);
                } else {
                    console.log("seeding convos DB with a convo");
                }
            });
        });
    });
}

module.exports = SeedDB;