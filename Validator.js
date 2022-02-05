Validator = {};
Validator.Wild = '*';

Validator.DoesNotMatchIntersections = function(word, intersections){
    for(var i = 0; i < intersections.length; i++){
        if(word[intersections[i][0]] != intersections[i][1]){
            return true;
        } 
    }
    return false;
};

Validator.CanBeMade = function(word, intersections){
    var letters = intersections + Game.RackState;
    var wildCount = Validator.WildsInRack;
    for(var i = 0; i < word.length; i++){
        var index = letters.indexOf(word[i]);
        if(index != -1){
            letters = letters.substring(0,index) + letters.substring(index+1,letters.length);
            continue;
        } 
        index = letters.indexOf(Validator.Wild);
        if(index != -1) {
            letters = letters.substring(0,index) + letters.substring(index+1,letters.length);
            continue;
        }
        return false;        
    }
    return true;
};

Validator.Eval = function(hv, pos, word){    
    var pWords = [];
    if(hv){
        for(var i = 0; i < word.length; i++){
            var chkPos = pos + i;
            if(Game.BoardState[chkPos] != ''){
                continue;
            }   
            var pWord = word[i];
            var pWordStart = chkPos;
            
            var chkPos = pos + i - Game.BoardSize;
            while (Game.BoardState[chkPos] && Game.BoardState[chkPos] != ''){
                pWord = Game.BoardState[chkPos] + pWord; 
                pWordStart -= Game.BoardSize;
                chkPos -= Game.BoardSize;
            }
            chkPos = pos + i + Game.BoardSize;            
            while(Game.BoardState[chkPos] && Game.BoardState[chkPos] != ''){
                pWord += Game.BoardState[chkPos];
                chkPos += Game.BoardSize;
            }
            if(pWord.length > 1){
                if(!Validator.IsWord(pWord)){
                    return;
                }
                pWords.push([pWordStart, pWord]);
            }
            
        }
    } else {
        for(var i = 0; i < word.length; i++){
            var chkPos = pos + (i * Game.BoardSize);
            if(Game.BoardState[chkPos] != ''){
                continue;
            }
            var rowBeg = chkPos - (chkPos % Game.BoardSize);
            var rowEnd = rowBeg + Game.BoardSize - 1
            var pWord = word[i];
            var pWordStart = chkPos;
            chkPos -= 1;
            while (chkPos >= rowBeg && Game.BoardState[chkPos] != '') {
                pWord = Game.BoardState[chkPos] + pWord;
                pWordStart -= 1;
                chkPos -= 1;
            }
            chkPos = pos + (i * Game.BoardSize) + 1;
            while(chkPos <= rowEnd && Game.BoardState[chkPos] != ''){
                pWord += Game.BoardState[chkPos];
                chkPos += 1;
            }
            if(pWord.length > 1){
                if(!Validator.IsWord(pWord)){
                    return;
                }
                pWords.push([pWordStart, pWord]);
            }
        }
    }
    Validator.Found(hv, pos, word, pWords);
};

Validator.IsWord = function(word){
    var words = Words[word.length];
    var high = words.length - 1;
    var low = 0;
    
    var wildIndexes = [];
    for(var i = 0; i < word.length; i++){
        if(word[i] == '*'){
            wildIndexes.push(i);
            word = word.substring(0,i) + word.substring(i+1);
        }
    }
    
    while(low <= high){
        mid = parseInt((low + high) / 2)
        element = words[mid];
        if(wildIndexes.length > 0){
            for(var i = 0; i < wildIndexes.length; i++){
                element = element.substring(0,wildIndexes[i]) + element.substring(wildIndexes[i]+1);
            }
        }
        if(element > word){
            high = mid - 1;
        } else if (element < word) {
            low = mid + 1;
        } else {
            return true;
        }
    }
    return false;
};

Validator.Found = function(hv, pos, word, pWords){
    var score = Score.ScoreWord(hv, pos, word, pWords);
    result = [];
    result['score'] = score[0];
    result['bingo'] = score[1];
    result['hv'] = hv;
    result['pos'] = pos;
    result['word'] = word;
    Game.Results.push(result);
};



