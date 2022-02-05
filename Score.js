Score = {};

//pWords is an array of arrays, each array contains:
// 0) the starting position of the pWord
// 1) the pWord
Score.ScoreWord = function(hv, pos, word, pWords){
    //this doesn't yet handle all of the challenges associated with wilds
    var dMult = hv === true ? 1 : Game.BoardSize;
    var spaceVals = [];
    for(var i = 0; i < word.length; i++){
       var spaceClasses = $("#space" + (pos + (i * Game.DirMult[hv])))[0].getAttribute("class").split(' ');
       spaceVals.push(spaceClasses[spaceClasses.length - 1]);     
    }

    var wordScore = 0;
    var wordMult = 1;
    var rackLtrsUsed = 0;
    for(var i = 0; i < word.length; i++){
        var spaceVal = spaceVals[i];
        if(spaceVal == 'wild'){
            //this means there is already a tile and its a wild, so no points or multipliers
            continue;
        }
        var chkPos = pos + (i * Game.DirMult[hv]);        
        if(spaceVal[0] == 'l'){
            wordScore += Game.TileVals[word[i]] * parseInt(spaceVal[1]);
            rackLtrsUsed++;
        } else if (spaceVal[0] == 'w'){
            wordScore += Game.TileVals[word[i]];
            wordMult *= spaceVal[1];
            rackLtrsUsed++;
        } else if (spaceVal == "tile"){
            wordScore += Game.TileVals[Game.BoardState[chkPos]];
        } else if (spaceVal == "space"){
            wordScore += Game.TileVals[word[i]];
            rackLtrsUsed++;
        } 
    }
    wordScore *= wordMult;    
    
    if(pWords){
        //then this call was for the main word
        //call the same for each of the pWords
        for(var i = 0; i < pWords.length; i++){
            wordScore += Score.ScoreWord(!hv, pWords[i][0], pWords[i][1], null);
        }
    } else {
        //then this is a pWord, just return its score
        return wordScore;
    }
    
    //end perpendicular words
    var isBingo = false;
    if(rackLtrsUsed == Game.RackSize){
        wordScore += Game.BingoBonus;
        isBingo = true;
    }
    return [wordScore, isBingo];
};
