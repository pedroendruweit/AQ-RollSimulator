/**
 * Returns a random Number between 1 and 6
 * @public
 * @returns {Number} Random number between 1 and 6
 */
function rollOneDie(){
    return Math.floor(Math.random() * 6) + 1;
};


/**
 * Based on a number of dice being played, and on the dice type,
 * returns a pull of rolled dice
 * @public
 * @param {Number} numberOfDice A number that represents the quantity of dice in play
 * @param {Object} playedDieType The object that represents all faces of the Die
 * @returns {Array} Array of die faces resulted of the dice roll
 */
function rollDicePool(numberOfDice, playedDieType){
    dicePool = [];
    for (i = 0; i < numberOfDice; i++) { 
        var diceResult = playedDieType[rollOneDie() - 1];
        dicePool.push(diceResult);
        if (diceResult.grantsExtraDie) {
            numberOfDice += 1;
        }
    }
    return dicePool;
};

/**
 * Interprets the faces of a dice pool and returns the number of hits
 * @public
 * @param {Array} dicePool An array of dice faces to be resolved
 * @returns {Number} Number of sucesses (Hits)
 */
function resolveDicePoll(dicePool){
    var numberOfSucesses = 0;
    var dicePoolLength = dicePool.length;
    for (var i = 0; i < dicePoolLength; i++) {
        if (dicePool[i].isHit) {
            numberOfSucesses += 1;
        }
    }
    return numberOfSucesses;
};

/**
 * Returns all the possible die faces for an specific type of die
 * based on the kind of roll being played
 * @public
 * @param {String} rollType The kind of roll being performed (Melee, Defence, Ranged, etc.)
 * @returns {Array} An array containing all possible faces of a Die
 */
function getDieType(rollType){
    switch (rollType) {
        case "Widow":
            return [
                { isHit: true,  grantsExtraDie: true }, 
                { isHit: true,  grantsExtraDie: true }, 
                { isHit: true,  grantsExtraDie: false }, 
                { isHit: false, grantsExtraDie: false }, 
                { isHit: false, grantsExtraDie: false }, 
                { isHit: false, grantsExtraDie: false }
            ];
        case "WidowBuff":
            return [
                { isHit: true,  grantsExtraDie: true }, 
                { isHit: true,  grantsExtraDie: true }, 
                { isHit: true,  grantsExtraDie: true }, 
                { isHit: false, grantsExtraDie: false }, 
                { isHit: false, grantsExtraDie: false }, 
                { isHit: false, grantsExtraDie: false }
            ];
        case "Defence":
            return [
                { isHit: true,  grantsExtraDie: true }, 
                { isHit: true,  grantsExtraDie: false }, 
                { isHit: false, grantsExtraDie: false }, 
                { isHit: false, grantsExtraDie: false }, 
                { isHit: false, grantsExtraDie: false }, 
                { isHit: false, grantsExtraDie: false }
            ];
        case "Melee":
            return [
                { isHit: true,  grantsExtraDie: true }, 
                { isHit: true,  grantsExtraDie: false }, 
                { isHit: true,  grantsExtraDie: false }, 
                { isHit: true,  grantsExtraDie: false }, 
                { isHit: false, grantsExtraDie: false }, 
                { isHit: false, grantsExtraDie: false }
            ];
        case "Range":
            return [
                { isHit: true,  grantsExtraDie: true }, 
                { isHit: true,  grantsExtraDie: false }, 
                { isHit: true,  grantsExtraDie: false }, 
                { isHit: false, grantsExtraDie: false }, 
                { isHit: false, grantsExtraDie: false }, 
                { isHit: false, grantsExtraDie: false }
            ];
        default:
            return [
                { isHit: false, grantsExtraDie: false }, 
                { isHit: false, grantsExtraDie: false }, 
                { isHit: false, grantsExtraDie: false }, 
                { isHit: false, grantsExtraDie: false }, 
                { isHit: false, grantsExtraDie: false }, 
                { isHit: false, grantsExtraDie: false }
        ];
    }
}

/**
 * Returns all the possible die faces for an specific type of die
 * based on the kind of roll being played
 * @public
 * @param {String} rollType The kind of roll being performed (Melee, Defence, Ranged, etc.)
 * @returns {Array} An array containing all possible faces of a Die
 */
function dicePoolContainMiss(dicePoolWithRerolls) {
    for (var i = 0; i < dicePoolWithRerolls.length; i++) {    
        if (!dicePoolWithRerolls[i].isHit) {
            return true;
        }
    }
    return false;
}

/**
 * Based on a dice pool, applies possible re-rolls on dice that are misses
 * @public
 * @param {Array} dicePool Dice pool where the re-rolls will be applied
 * @param {Number} reRollPool Number of available re-rolls
 * @param {String} rollType The kind of roll being performed (Melee, Defence, Ranged, etc.)
 * @returns {Array} An array containing the new dice results considering the re-rolls
 */
function applyRerollPool(dicePool, reRollPool, rollType){
    var remainingReRolls = reRollPool;
    var dicePoolWithRerolls = [];
    for (var i = 0; i < dicePool.length; i++) {
        if (!dicePool[i].isHit && remainingReRolls > 0){
            remainingReRolls = remainingReRolls - 1;
            var reRolledDicePool = rollDicePool(1, getDieType(rollType));
            for (var j = 0; j < reRolledDicePool.length; j++) {
                dicePoolWithRerolls.push(reRolledDicePool[j]);
            }
        } else {
            dicePoolWithRerolls.push(dicePool[i]);
        }
    }
    if (remainingReRolls > 0 && dicePoolContainMiss(dicePoolWithRerolls)){
        dicePoolWithRerolls = applyRerollPool(dicePoolWithRerolls, remainingReRolls, rollType);
    }
    
    return dicePoolWithRerolls;
};

/**
 * Play one hand of dice
 * @public
 * @param {Number} numberOfDice Numbers of dice to be played
 * @param {Number} reRollPool Number of available re-rolls
 * @param {String} rollType The kind of roll being performed (Melee, Defence, Ranged, etc.)
 * @returns {Number} Number of sucesses (Hits)
 */
function play(numberOfDice, reRollPool, rollType){
    var dicePool = rollDicePool(numberOfDice, getDieType(rollType));
    dicePool = applyRerollPool(dicePool, reRollPool, rollType);
    return resolveDicePoll(dicePool);
};

/**
 * Calculates the average result of a combination of dice played multiple times
 * @public
 * @param {Number} numberOfDice Numbers of dice to be played
 * @param {Number} reRollPool Number of available re-rolls
 * @param {String} rollType The kind of roll being performed (Melee, Defence, Ranged, etc.)
 * @param {Number} numberOfPlays Number of plays to be performed and have the average calculated
 * @returns {Number} Average of sucesses (Hits)
 */
function averageResult(numberOfDice, reRollPool, rollType, numberOfPlays){
    var resultSum = 0;
    for (var i = 0; i < numberOfPlays; i++) {
        resultSum += play(numberOfDice, reRollPool, rollType);
    }
    return resultSum / numberOfPlays;
};

/**
 * Calculates the percentage of occurence of each number of sucesses on multiple plays
 * @public
 * @param {Number} numberOfDice Numbers of dice to be played
 * @param {Number} reRollPool Number of available re-rolls
 * @param {String} rollType The kind of roll being performed (Melee, Defence, Ranged, etc.)
 * @param {Number} numberOfPlays Number of plays to be performed and have the average calculated
 * @returns {Array} Array containing a list of Success Quantities and the percentage of their occurence
 */
function averageDistribution(numberOfDice, reRollPool, rollType, numberOfPlays){
    var distribution = {};
    var numberOfHits = 0;
    for (var i = 0; i < numberOfPlays; i++) {
        numberOfHits = play(numberOfDice, reRollPool, rollType);
        if (typeof distribution[numberOfHits] === "undefined"){
            distribution[numberOfHits] = 1;
        } else {
            distribution[numberOfHits] += 1;
        }
    }
    var sortedArray = [];
    for (var property in distribution) {
        if (distribution.hasOwnProperty(property)) {
            sortedArray.push([property, (distribution[property] / numberOfPlays * 100).toFixed(2) ]);
        }
    }
    sortedArray.sort(function(a, b) {
        return a[0] - b[0];
    });
    return sortedArray;
};

/**
 * Returns a list of tiles that are touched by a line of sight, according to an offset curve that decides which tile to consider on perfect diagonals
 * @public
 * @param {Object} tileFrom Tile (X, Y) FROM where the player is attacking
 * @param {object} tileTo Tile (X, Y) that the player is trying to hit
 * @param {String} offSetCurve "N" for North and "S" for South. Represent the curve of the shot for perfect diagonal decision
 * @returns {Array} List of tiles that must be empty to enable line of sight
 */
let castRay = (tileFrom, tileTo, offSetCurve) => {
    var xIncrement = (tileTo.X > tileFrom.X) ? 1 : -1
    var yIncrement = (tileTo.Y > tileFrom.Y) ? 1 : -1
    var offSet = (offSetCurve == "N") ? 0.1 : -0.1
    var delta = {X: Math.abs(tileFrom.X - tileTo.X), Y: Math.abs(tileFrom.Y - tileTo.Y)}
    var trajectory = delta.X - delta.Y + offSet
    var correctTrajectory = {X: delta.X * 2, Y: delta.Y * 2}
    var current = tileFrom
    var collisionList = []
    while (true){
        collisionList.push(current)
        if (current.X == tileTo.X && current.Y == tileTo.Y)
          return collisionList
        if (trajectory > 0){
            current = {X: current.X + xIncrement, Y: current.Y}
            trajectory -= correctTrajectory.Y
        }
        else if (trajectory < 0){
            current = {X: current.X, Y: current.Y + yIncrement}
            trajectory += correctTrajectory.X
        }
    }  
}

/**
 * Returns a list of tiles that are touched by a line of sight
 * @public
 * @param {Object} tileFrom Tile (X, Y) FROM where the player is attacking
 * @param {object} tileTo Tile (X, Y) that the player is trying to hit
 * @returns {Array} List of tiles that must be empty to enable line of sight, considering both possibilities on perfect diagonals
 */
let listCollisionTiles = (tileFrom, tileTo) => {
    var northPath = castRay(tileFrom, tileTo, "N")
    var southPath = castRay(tileFrom, tileTo, "S")
    var collisionTiles = []
    var pathLenght = (northPath.length + southPath.length) / 2
    for (var i = 0; i < pathLenght; i++){
        if (northPath[i].X == southPath[i].X && northPath[i].Y == southPath[i].Y){
            if (i == 0){
                collisionTiles.push({attackingFrom: northPath[i]})
            } else if (i == pathLenght - 1){
                collisionTiles.push({targetOn: northPath[i]})
            } else {
                collisionTiles.push({hardCollision: northPath[i]})
            }
        } else {
            collisionTiles.push({softCollision: northPath[i], with: southPath[i]})
        }
    }
    return collisionTiles
}

let shootPath = (tileFrom, tileTo) => {
    var northPath = castRay(tileFrom, tileTo, "N")
    var southPath = castRay(tileFrom, tileTo, "S")
    var shootPath = []
    var pathLenght = (northPath.length + southPath.length) / 2
    for (var i = 0; i < pathLenght; i++){
        let nPosition = ''
        let sPosition = ''
        if (typeof southPath[i + 1] !== "undefined" && typeof northPath[i + 1] !== "undefined"){
            let spx = (southPath[i].X < 10)?'0':''
            let spx1 = (southPath[i+1].X < 10)?'0':''
            let spy = (southPath[i].Y < 10)?'0':''
            let spy1 = (southPath[i+1].Y < 10)?'0':''
            let npx = (northPath[i].X < 10)?'0':''
            let npx1 = (northPath[i+1].X < 10)?'0':''
            let npy = (northPath[i].Y < 10)?'0':''
            let npy1 = (northPath[i+1].Y < 10)?'0':''
            sPosition = spx + southPath[i].X + spy + southPath[i].Y + spx1 + southPath[i + 1].X + spy1 + southPath[i + 1].Y
            nPosition = npx + northPath[i].X + npy + northPath[i].Y + npx1 + northPath[i + 1].X + npy1 + northPath[i + 1].Y
            shootPath.push({viaS: sPosition, viaN: nPosition})
        } else
            return shootPath
    }
}

var fs = require('fs');
var jsonData = fs.readFileSync('AQ_maps.json', 'utf8');
var positions = JSON.parse(jsonData);
var mapName = "district_of_hammers"

let findCollision = (path) => {
    for(var j = 0; j < positions[mapName].length; j++){
        if(positions[mapName][j].pos === path &&
           positions[mapName][j].c)
            return {b: true, c: path}
    }
    return {b: false, c: path}
}

let los = (tileFrom, tileTo) => {
    let path = shootPath(tileFrom, tileTo)
    for(var i = 0; i < path.length-1; i++){
        let c1  = findCollision(path[i].viaS)
        let c1b = findCollision(path[i+1].viaS)
        let c2  = findCollision(path[i].viaN)
        let c2b = findCollision(path[i+1].viaN)
        if((c1.b || c1b.b) && (c2.b || c2b.b))
          return 'Blocked'
    }
    return 'LoS ok'
}
/*
console.log(los({X:1, Y:1}, {X:2, Y:2})) //los ok
console.log(los({X:9, Y:5}, {X:3, Y:4})) //los ok
console.log(los({X:5, Y:1}, {X:5, Y:9})) //los ok
console.log(los({X:3, Y:4}, {X:6, Y:7})) //los ok
console.log(los({X:4, Y:6}, {X:6, Y:8})) //los ok
console.log(los({X:1, Y:5}, {X:6, Y:4})) //los ok
console.log(los({X:1, Y:5}, {X:5, Y:4})) //blocked
console.log(los({X:4, Y:1}, {X:7, Y:4})) //blocked
console.log(los({X:2, Y:1}, {X:3, Y:2})) //blocked
*/


// Exemples:
// averageDistribution(5, 0, "Melee", 100) // Playing 100 times a Melee attack, with 5 dice, 0 re-rolls. This will display a success percentage distribution
// averageResult(3, 1, "Defence", 10000) // Playing 10.000 times a Defence roll, with 3 dice and 1 re-roll. This will return the arithmetic average of successes
//console.log( play(2, 1, "Range") ); // Play 2 attack dice (considering Range as hits), with 1 re-roll. Returns the number of successes for this random roll
 //console.log( listCollisionTiles({X:1, Y:1}, {X:2, Y:12}));


console.log( listCollisionTiles( {X:1, Y:5}, {X:6, Y:4} ) )
//console.log(los({X:1, Y:5}, {X:5, Y:4}))