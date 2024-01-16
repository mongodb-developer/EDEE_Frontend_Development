// Start by inserting some test data

var mongoClient = null;
var collection

// Connect to MongoDB Atlas
async function initWebService() {
  var userName = system.getenv("MONGO_USERNAME")
  var passWord = system.getenv("MONGO_PASSWORD")

  mongoClient = new MongoClient("mongodb+srv://" + userName + ":" + passWord + "@learn.mongodb.net");
  collection = mongoClient.getDatabase("search").getCollection("claims")
}


// Insert some test documents: use POST
async function post_AtlasSearch(req, res) {
  var rval = {}

  await collection.drop()
  var requestObj = JSON.parse(req.body)

  var claims = [];

  // prepare data for MongoDB
  // we use the existing claim_id as _id in our collection (is already unique, no need for an ObjectId here)
  requestObj.data.forEach(document => {
    claims.push({
      _id: document.claim_id,
      "policy_number": document.policy_number,
      ".date_of_incident": new Date(document.date_of_incident),
      "claim_description": document.claim_description,
      "claim_amount": document.claim_amount,
      "status": document.status
    })
  });

  console.log(claims);

  rval.insert = await collection.insertMany(claims)

  res.status(201);
  res.send(rval)
}

