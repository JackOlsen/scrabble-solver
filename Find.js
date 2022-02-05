Find = {};
Find.PlayableRows;
Find.PlayableCols;

Find.Init = function() {
    Game.Results = [];
    Find.PlayableRows = [];
    Find.PlayableCols = [];
};

Find.FindAll = function(){
    if(Game.RackState.length == 0){
        return;
    }
    
    Find.Init();
    
    Find.SetPlayables();
    if(Game.IsFirstPlay){
        var originalRack = Game.RackState;
        for(var i = 0; i < originalRack.length; i++){
            Game.BoardState[Game.StartPos] = originalRack[i];
            Game.RackState = [];
            for(var j = 0; j < originalRack.length; j++){
                if(j != i){
                    Game.RackState.push(originalRack[j]);
                }
            }
            if(originalRack[i] == '*'){
                Game.WildsState.push(Game.StartPos);
                var alpahbet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                for(var j = 0; j <= alpahbet.length; j++){
                    Game.BoardState[Game.StartPos] = alpahbet[j];                    
                    Find.Find();
                }
                Game.WildsState.pop();
            } else {
                Find.Find();
            }
        }
    } else {
        Find.Find();
    }
};

Find.Find = function(){
    Find.Find_D(true);
    Find.Find_D(false);
};

Find.SetPlayables = function(){
    if(Game.IsFirstPlay){
        var rowCol = Find.GetRowCol_Pos(Game.StartPos);
        Find.PlayableRows.push(rowCol[0]);
        Find.PlayableCols.push(rowCol[1]);
    } else {
        for(var i = 0; i < Game.BoardSize; i++){
            for(var j = 0; j < Game.BoardSize; j++){
                if(Game.BoardState[(i * Game.BoardSize) + j] != ''){
                    Find.AddToPlayables(true, [i - 1, i, i + 1]);
                    break;
                }
            }
            for(var j = 0; j < Game.BoardSize; j++){
                if(Game.BoardState[(j * Game.BoardSize) + i] != ''){
                    Find.AddToPlayables(false, [i - 1, i, i + 1]);
                    break;
                }
            }
        }
    }
};

Find.AddToPlayables = function(rowCol, indexes){
    var playables = rowCol === true ? Find.PlayableRows : Find.PlayableCols;
    for(var i = 0; i < indexes.length; i++){
        var index = indexes[i];
        if(index < 0 || index >= Game.BoardSize){
            continue;
        }
        var found = false;
        for(var j = 0; j < playables.length; j++){
            if(playables[j] == index){
                found = true;
            }
        }
        if(found != true){
            playables.push(index);
        }
    }
}



Find.Find_D = function(hv){
    for(var pos = 0; pos < Game.BoardState.length; pos++){    
        if(Find.IsInPlayableRowCol(pos) && Find.IsPlayablePos_D(hv, pos)){
            Find.Find_D_Pos(hv,pos);
        }                         
    }
};

Find.IsInPlayableRowCol = function(pos){
    var rowCol = Find.GetRowCol_Pos(pos);
    for(var i = 0; i < Find.PlayableRows.length; i++){
        if(Find.PlayableRows[i] == rowCol[0]){
            return true;
        }
    }
    for(var i = 0; i < Find.PlayableCols.length; i++){
        if(Find.PlayableCols[i] == rowCol[1]){
            return true;
        }
    }
    return false;
};

Find.IsPlayablePos_D = function(hv, pos){
    if(Find.HasTileBefore_D_Pos(hv, pos)){
        return false;
    }
    if(Game.IsFirstPlay){
        if(hv === true){
            for(var i = 0; i < Find.PlayableRows.length; i++){
                var row = (pos - (pos % Game.BoardSize)) / 15;
                if(Find.PlayableRows[i] == row){
                    return true;
                }
            }
            return false;
        } else {
            for(var i = 0; i < Find.PlayableCols.length; i++){
                var col = pos % Game.BoardSize;
                if(Find.PlayableCols[i] == col){
                    return true;
                }
            }
            return false;
        }
    } else {
        var rowStart = pos - (pos % Game.BoardSize);
        var rowEnd = rowStart + Game.BoardSize - 1;
        var maxLen_Pos = hv === true
            ? Game.BoardSize - (pos % Game.BoardSize)
            : Game.BoardSize - Math.floor(pos / Game.BoardSize);
        for(var i = 0; i < Game.RackState.length && i < maxLen_Pos; i++){
            var chkPos = pos + (i * Game.DirMult[hv]);
            var oneLeft = chkPos - 1;
            var oneRight = chkPos + 1;
            var oneUp = chkPos - Game.BoardSize;
            var oneDown = chkPos + Game.BoardSize;        
            if(Game.BoardState[chkPos] != ''
                || (Game.BoardState[oneDown] && Game.BoardState[oneDown] != '')
                || (Game.BoardState[oneUp] && Game.BoardState[oneUp] != '')
                || (oneRight <= rowEnd && Game.BoardState[oneRight] && Game.BoardState[oneRight] != '')
                || (oneLeft >= rowStart && Game.BoardState[oneLeft] && Game.BoardState[oneLeft] != '')){
                return true;
            }
        }
        return false;
    }
};

Find.HasTileBefore_D_Pos = function(hv, pos){
    var posBefore = pos - Game.DirMult[hv];
    var minPos = hv === true 
        ? pos - (pos % Game.BoardSize)
        : 0;
    if(posBefore < minPos){
        return false;
    }
    return Game.BoardState[posBefore] != '';
};

Find.Find_D_Pos = function(hv, pos){
    var lens = Find.GetLens_D_Pos(hv, pos);
    for(var i = 0; i < lens.length; i++){
        Find.Find_D_Pos_Len(hv, pos, lens[i]);
    }
};

Find.GetLens_D_Pos = function(hv, pos){
    var lens = [];    
    var maxLen_Pos = hv === true
        ? Game.BoardSize - (pos % Game.BoardSize)
        : Game.BoardSize - Math.floor(pos / Game.BoardSize);
    var rackLtrCnt = Game.RackState.length;
    for(var len = Game.MinWordLength; len <= maxLen_Pos; len++){
        if(Find.HasTileAfter_D_Pos_Len(hv, pos, len)){
            continue;
        }
        if(Find.NotEnoughLtrs_D_Pos_Len(rackLtrCnt, hv, pos, len)){
            return lens;
        }
        if(Find.HasIntersectOrAdj_D_Pos_Len(hv, pos, len)){
            lens.push(len);
        }
    }
    return lens;
};

Find.NotEnoughLtrs_D_Pos_Len = function(rackLtrCnt, hv, pos, len){
    var neededLtrCnt = 0;
    for(var i = 0; i < len; i++){
        var chkPos = pos + (i * Game.DirMult[hv]);
        if(Game.BoardState[chkPos] == ''){
            neededLtrCnt++;
            if(neededLtrCnt > rackLtrCnt){
                return true;
            }
        }
    }
    return false;
};

Find.HasIntersectOrAdj_D_Pos_Len = function(hv, pos, len){
    for(var i = 0; i < len; i++){
        var chkPos = pos + (i * Game.DirMult[hv]);
        var adjLeftOrUp = chkPos - Game.DirMult[!hv]; 
        var minAdjPos = hv === true 
            ? 0
            : chkPos - (chkPos % Game.BoardSize);           
        var adjRightOrDown = chkPos + Game.DirMult[!hv];
        var maxAdjPos = hv === true
            ? (Game.BoardSize * Game.BoardSize) - 1
            : chkPos - (chkPos % Game.BoardSize) + Game.BoardSize - 1;
        if(Game.BoardState[chkPos] != ''
            || (adjLeftOrUp >= minAdjPos && Game.BoardState[adjLeftOrUp] && Game.BoardState[adjLeftOrUp] != '')
            || (adjRightOrDown <= maxAdjPos && Game.BoardState[adjRightOrDown] && Game.BoardState[adjRightOrDown] != '')){
            if(Find.NeedsRackLtr_D_Pos_Len(hv, pos, len)){
                return true;
            }                
        } 
    }
    return false;
};

Find.NeedsRackLtr_D_Pos_Len = function(hv, pos, len){
    for(var i = 0; i < len; i++){
        var chkPos = pos + (i * Game.DirMult[hv]);
        if(Game.BoardState[chkPos] == ''){
            return true;
        }
    }
    return false;
};

Find.Find_D_Pos_Len = function(hv, pos, len){
    var intersections = Find.GetIntersections_D_Pos_Len(hv, pos, len);
    var numWords_Len = Words[len].length;
    for(var i = 0; i < numWords_Len; i++){
        var word = Words[len][i];
        
        if(Validator.DoesNotMatchIntersections(word, intersections)){
            continue;
        }
        if(!Validator.CanBeMade(word, intersections)){
            continue;
        }
        Validator.Eval(hv, pos, word);
    }
};

Find.HasTileAfter_D_Pos_Len = function(hv, pos, len){
    var posAfter = pos + (Game.DirMult[hv] * len);
    var maxPos = hv === true 
        ? pos - (pos % Game.BoardSize) + Game.BoardSize - 1
        : (Game.BoardSize * Game.BoardSize) - 1;
    if(posAfter > maxPos){
        return false;
    }
    return Game.BoardState[posAfter] != '';
};

Find.GetRowCol_Pos = function(pos){
    return [Math.floor(pos / Game.BoardSize), pos % Game.BoardSize];
};

Find.GetIntersections_D_Pos_Len = function(hv, pos, length){
    var intersections = [];
    for(var i = 0; i < length; i++){
        var next = Game.BoardState[pos + (i * Game.DirMult[hv])];
        if(next != ''){
            intersections.push([i, next]);
        }
    }
    return intersections;
};
