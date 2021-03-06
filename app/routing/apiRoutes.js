// ===============================================================================
// LOAD DATA
// We are linking our routes to a series of "data" sources.
// These data sources hold arrays of information on table-data, waitinglist, etc.
// ===============================================================================
console.log("INSIDE APIROUTE");
var friendsData = require("../data/friends.js");
console.log("BEGIN: friendsData", friendsData);

/* var sh = require("shelljs");
var cwd = sh.pwd();
console.log("cwd", cwd.stdout);
console.log("REQURING", cwd.stdout + "\\app\\data\\friends.js");

var friendsData = require(cwd.stdout + "\\app\\data\\friends.js");
console.log("BEGIN: friendsData", friendsData);
 */
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
    newScores = newFriend.scores;
    console.log("newScores", newScores);
    bestDiff = 51; //10 Questions, 5 Points Max (+ 1) so set this to Max Match Number and someone will be closer than this
    bestName = "";
    console.log("friendsData", friendsData);
    for (i=-0; i < friendsData.length; i++) {
        console.log("inside findMatch For Loop!");
        diff = 0;
        scores = friendsData[i].scores;
        console.log("scores", scores);
        for (j=0; j < scores.length; j++) {
            diff += (Math.abs(scores[j]) - Math.abs(newScores[j]));
        }
        console.log("diff = '" + diff + "'; bestDiff = '" + bestDiff + "'");
        if (diff < bestDiff) {
            //New Best Match Found!
            bestName = friendsData[i].name;
        }
    } //End For Loop
    return bestName;
}

    // API POST Requests
    // Below code handles when a user submits a form and thus submits data to the server.
    // ---------------------------------------------------------------------------

    app.post("/api/friends", function(req, res) {
        console.log("app/post /api/friends Called. req.body", req.body);
        // Note the code here. Our "server" will respond to requests and let users know if they have a table or not.
        // It will do this by sending out the value "true" have a table
        // req.body is available since we're using the body-parser middleware

        //Find Best Match For this and Return it!
        bestMatch = findMatch(req.body);
        console.log("bestMatch = '" + bestMatch + "'");
        for (i=0; i < friendsData.length; i++) {
            console.log("friendsData[" + i + "].name", friendsData[i].name);
            if (bestMatch == friendsData[i].name) {
                bestFriend = friendsData[i];
            }
        }

        //Now Push New Friend onto FriendsData Array
        friendsData.push(req.body);
        console.log("friendsData After Pushing New Person", friendsData);
        res.json(bestFriend);

        //Write out friendsData Object Array to the original file

        //DID NOT GET THIS WORKING YET!!
        // var fs = require("fs");

        // var resultHandler = function(err) { 
        //     if(err) {
        //        console.log("unlink failed", err);
        //     } else {
        //        console.log("file deleted");
        //     }
        // }
        
        // console.log("about to call unlink");
        // fs.unlink("app/data/friends.js", resultHandler);
        // console.log("called unlink");        
        // //__dirname + '/output.js' 
        // fs.writeFileSync('app/data/friends.js', JSON.stringify(friendsData, null, 4));
        // console.log("Wrote friendsData to 'data/friends.js'");
           
    });

};
