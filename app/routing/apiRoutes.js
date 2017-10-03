// ===============================================================================
// LOAD DATA
// We are linking our routes to a series of "data" sources.
// These data sources hold arrays of information on table-data, waitinglist, etc.
// ===============================================================================

var friendsData = require("../data/friends");


// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function(app) {
  // API GET Requests
  // Below code handles when users "visit" a page.
  // In each of the below cases when a user visits a link
  // (ex: localhost:PORT/api/admin... they are shown a JSON of the data in the table)
  // ---------------------------------------------------------------------------

  app.get("/api/friends", function(req, res) {
      console.log("app.get /api/friends Called.")
    res.json(friendsData);
  });

function findMatch(newFriend) {
    console.log("findMatch, newFriend", newFriend);
    newsScores = newFriend.scores;
    console.log("newScores", newsScores);
    bestDiff = 51; //10 Questions, 5 Points Max (+ 1) so set this to Max Match Number and someone will be closer than this
    bestName = "";

    for (i=-0; i < friendsData.length; i++) {
        diff = 0;
        scores = friendsData[i].scores;
        console.log("scores", scores);
        for (j=0; j < scores.length; j++) {
            diff += (Math.abs(scores[j]) - Math.abs(newsScores[j]));
        }
        if (diff < bestDiff) {
            //New Best Match Found!
            bestName = friendsData[i].name;
        }
    } //End For Loop
    return bestName;
}

  // API POST Requests
  // Below code handles when a user submits a form and thus submits data to the server.
  // In each of the below cases, when a user submits form data (a JSON object)
  // ...the JSON is pushed to the appropriate JavaScript array
  // (ex. User fills out a reservation request... this data is then sent to the server...
  // Then the server saves the data to the tableData array)
  // ---------------------------------------------------------------------------

    app.post("/api/friends", function(req, res) {
        console.log("app/post /api/friends Called. req.body", req.body);
        // Note the code here. Our "server" will respond to requests and let users know if they have a table or not.
        // It will do this by sending out the value "true" have a table
        // req.body is available since we're using the body-parser middleware

        //Find Best Match For this and Return it!
        bestMatch = findMatch(req.body);
        console.log("bestMatch", bestMatch);
        for (i=0; i < friendsData.length; i++) {
            console.log("friendsData[i].name", friendsData[i].name);
            if (bestMatch == friendsData[i].name) {
                bestFriend = friendsData[i];
            }
        }

        //Now Push New Friend onto FriendsData Array
        friendsData.push(req.body);
        console.log("friendsData After Pushing New Person", friendsData);
        res.json(bestFriend);
            
    });

};
