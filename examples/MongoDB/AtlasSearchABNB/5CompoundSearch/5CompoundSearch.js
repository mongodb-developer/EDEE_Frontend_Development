
var mongoClient = null;
var collection

// ℹ️ we can compound operators in a single search

async function get_AtlasSearch(req, res) {
  var rval = {}
  
  var queryTerm = req.query.get("queryTerm")
    
  searchOperation = [ 
    { $search : { 
      "index": "default",
      "compound": {
        "must": [
          {
            "text": {
              "query": queryTerm,
              "path": "description"
            }
          }
        ],
        "should": [
          {
            "range": {
              "path": "accommodates",
              "gt": 5,
              "lt": 10
            }
          }
        ]
      }
    } 
  } 
]
searchResultsCursor = collection.aggregate(searchOperation)

rval.searchResult = await searchResultsCursor.toArray()

res.status(201);
res.send(rval)
}

// Connect to MongoDB Atlas
async function initWebService() {
  var userName = await system.getenv("MONGO_USERNAME")
  var passWord = await system.getenv("MONGO_PASSWORD", true)

  if (userName == "" || userName == null || passWord == ""|| passWord == null) {
    alert("Please enter valid auth");
    return;
  }  
  
  mongoClient = new MongoClient("mongodb+srv://" + userName + ":" + passWord + "@learn.mongodb.net");
  collection = mongoClient.getDatabase("sample_airbnb").getCollection("listingsAndReviews");
}