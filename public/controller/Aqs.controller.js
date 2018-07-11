sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/model/json/JSONModel'
], function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("com.aqs.controller.App", {
        onInit: function(){
            var oVizFrame = this.getView().byId("idVizFrame");
            oVizFrame.setVizProperties({
                plotArea: { 
                    dataLabel: { visible: true }, primaryScale: { fixedRange: true, maxValue: 100, minValue: 0 },
                    window: {
                        start:"firstDataPoint",
                        end:"lastDataPoint"
                    }
                },
                valueAxis: { title: { visible: true } },
                categoryAxis: { title: { visible: true } },
                title: { visible: true, text: 'Hits Distribution' }
            });
            
            var dataModel = new JSONModel();
            dataModel.setData(this.runApp());
            oVizFrame.setModel(dataModel);
        },

        runApp: function(){
            var diceNumber = Number(this.getView().byId("diceNumber").getValue());
            var reRollNumber = Number(this.getView().byId("reRollNumber").getValue());
            var diceType = this.getView().byId("diceType").getSelectedKey();
            var numberRolls = Number(this.getView().byId("numberRolls").getValue());
            
            var aAverageDistribution = this.averageDistribution(diceNumber, reRollNumber, diceType, numberRolls);
            var aElementObjects = { results: [] };

            aAverageDistribution.forEach(
                function(property) {        
                    aElementObjects.results.push(
                        { 
                            hits: Number(property[0]), 
                            result: Number(property[1]) 
                        }
                    );
                }
            );

            return aElementObjects;
        },
        
        onPress: function(oEventHandler){
            var oVizFrame = this.getView().byId("idVizFrame");
            var dataModel = oVizFrame.getModel();

            dataModel.setData(this.runApp());
        },

        
        /**
         * Returns a random Number between 1 and 6
         * @public
         * @returns {Number} Random number between 1 and 6
         */
        rollOneDie: function(){
            return Math.floor(Math.random() * 6) + 1;
        },


        /**
         * Based on a number of dice being played, and on the dice type,
         * returns a pull of rolled dice
         * @public
         * @param {Number} numberOfDice A number that represents the quantity of dice in play
         * @param {Object} playedDieType The object that represents all faces of the Die
         * @returns {Array} Array of die faces resulted of the dice roll
         */
        rollDicePool: function(numberOfDice, playedDieType){
            var dicePool = [];
            for (var i = 0; i < numberOfDice; i++) { 
                var diceResult = playedDieType[this.rollOneDie() - 1];
                dicePool.push(diceResult);
                if (diceResult.grantsExtraDie) {
                    numberOfDice += 1;
                }
            }
            return dicePool;
        },

        /**
         * Interprets the faces of a dice pool and returns the number of hits
         * @public
         * @param {Array} dicePool An array of dice faces to be resolved
         * @returns {Number} Number of sucesses (Hits)
         */
        resolveDicePoll: function(dicePool){
            var numberOfSucesses = 0;
            var dicePoolLength = dicePool.length;
            for (var i = 0; i < dicePoolLength; i++) {
                if (dicePool[i].isHit) {
                    numberOfSucesses += 1;
                }
            }
            return numberOfSucesses;
        },

        /**
         * Returns all the possible die faces for an specific type of die
         * based on the kind of roll being played
         * @public
         * @param {String} rollType The kind of roll being performed (Melee, Defence, Ranged, etc.)
         * @returns {Array} An array containing all possible faces of a Die
         */
        getDieType: function(rollType){
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
        },

        /**
         * Returns all the possible die faces for an specific type of die
         * based on the kind of roll being played
         * @public
         * @param {String} rollType The kind of roll being performed (Melee, Defence, Ranged, etc.)
         * @returns {Array} An array containing all possible faces of a Die
         */
        dicePoolContainMiss: function(dicePoolWithRerolls) {
            for (var i = 0; i < dicePoolWithRerolls.length; i++) {    
                if (!dicePoolWithRerolls[i].isHit) {
                    return true;
                }
            }
            return false;
        },

        /**
         * Based on a dice pool, applies possible re-rolls on dice that are misses
         * @public
         * @param {Array} dicePool Dice pool where the re-rolls will be applied
         * @param {Number} reRollPool Number of available re-rolls
         * @param {String} rollType The kind of roll being performed (Melee, Defence, Ranged, etc.)
         * @returns {Array} An array containing the new dice results considering the re-rolls
         */
        applyRerollPool: function(dicePool, reRollPool, rollType){
            var remainingReRolls = reRollPool;
            var dicePoolWithRerolls = [];
            for (var i = 0; i < dicePool.length; i++) {
                if (!dicePool[i].isHit && remainingReRolls > 0){
                    remainingReRolls = remainingReRolls - 1;
                    var reRolledDicePool = this.rollDicePool(1, this.getDieType(rollType));
                    for (var j = 0; j < reRolledDicePool.length; j++) {
                        dicePoolWithRerolls.push(reRolledDicePool[j]);
                    }
                } else {
                    dicePoolWithRerolls.push(dicePool[i]);
                }
            }
            if (remainingReRolls > 0 && this.dicePoolContainMiss(dicePoolWithRerolls)){
                dicePoolWithRerolls = this.applyRerollPool(dicePoolWithRerolls, remainingReRolls, rollType);
            }
            
            return dicePoolWithRerolls;
        },

        /**
         * Play one hand of dice
         * @public
         * @param {Number} numberOfDice Numbers of dice to be played
         * @param {Number} reRollPool Number of available re-rolls
         * @param {String} rollType The kind of roll being performed (Melee, Defence, Ranged, etc.)
         * @returns {Number} Number of sucesses (Hits)
         */
        play: function(numberOfDice, reRollPool, rollType){
            var dicePool = this.rollDicePool(numberOfDice, this.getDieType(rollType));
            dicePool = this.applyRerollPool(dicePool, reRollPool, rollType);
            return this.resolveDicePoll(dicePool);
        },

        /**
         * Calculates the average result of a combination of dice played multiple times
         * @public
         * @param {Number} numberOfDice Numbers of dice to be played
         * @param {Number} reRollPool Number of available re-rolls
         * @param {String} rollType The kind of roll being performed (Melee, Defence, Ranged, etc.)
         * @param {Number} numberOfPlays Number of plays to be performed and have the average calculated
         * @returns {Number} Average of sucesses (Hits)
         */
        averageResult: function(numberOfDice, reRollPool, rollType, numberOfPlays){
            var resultSum = 0;
            for (var i = 0; i < numberOfPlays; i++) {
                resultSum += this.play(numberOfDice, reRollPool, rollType);
            }
            return resultSum / numberOfPlays;
        },

        /**
         * Calculates the percentage of occurence of each number of sucesses on multiple plays
         * @public
         * @param {Number} numberOfDice Numbers of dice to be played
         * @param {Number} reRollPool Number of available re-rolls
         * @param {String} rollType The kind of roll being performed (Melee, Defence, Ranged, etc.)
         * @param {Number} numberOfPlays Number of plays to be performed and have the average calculated
         * @returns {Array} Array containing a list of Success Quantities and the percentage of their occurence
         */
        averageDistribution: function(numberOfDice, reRollPool, rollType, numberOfPlays){
            var distribution = {};
            var numberOfHits = 0;
            for (var i = 0; i < numberOfPlays; i++) {
                numberOfHits = this.play(numberOfDice, reRollPool, rollType);
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
        }

        // Exemples:
        // averageDistribution(5, 0, "Melee", 100) // Playing 100 times a Melee attack, with 5 dice, 0 re-rolls. This will display a success percentage distribution
        // averageResult(3, 1, "Defence", 10000) // Playing 10.000 times a Defence roll, with 3 dice and 1 re-roll. This will return the arithmetic average of successes
        // play(2, 1, "Range") // Play 2 attack dice (considering Range as hits), with 1 re-roll. Returns the number of successes for this random roll
    });   
});
