var methods;
module.exports.func = rollOneDie;

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

// Exemples:
// averageDistribution(5, 0, "Melee", 100) // Playing 100 times a Melee attack, with 5 dice, 0 re-rolls. This will display a success percentage distribution
// averageResult(3, 1, "Defence", 10000) // Playing 10.000 times a Defence roll, with 3 dice and 1 re-roll. This will return the arithmetic average of successes
// play(2, 1, "Range") // Play 2 attack dice (considering Range as hits), with 1 re-roll. Returns the number of successes for this random roll