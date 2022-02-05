Game = {};
Game.BoardSize;
Game.StartPos;
Game.Configuration;
Game.RackSize;
Game.BoardState;
Game.WildsState;
Game.DirMult = {};
Game.BingoBonus;
Game.Results;
Game.MinWordLength = 2;
Game.WildsInRack;

Game.Init = function(config) {
    Game.Configuration = config;
    Game.BoardSize = Game.Configuration['boardSize'];
    Game.StartPos = Game.Configuration['specials'][0][1];
    Game.RackSize = Game.Configuration['rackSize'];
    Find.LastSpaceIndex = (Game.BoardSize * Game.BoardSize) - 1;
    Game.DirMult[true] = 1;
    Game.DirMult[false] = Game.BoardSize;
    
    var gb = $("#gameBoard")[0];
    
    for(var i = 0; i < Game.BoardSize; i++){
        var newSpan = document.createElement('span');
        newSpan.setAttribute('class', 'spaceRow');
        for(var j = 0; j < Game.BoardSize; j++){
            var newBox = document.createElement('input');
            newBox.setAttribute('id', ('space' + ((i * Game.BoardSize) + j)));
            newBox.setAttribute('type', 'text');
            newBox.setAttribute('maxLength', 1);
            newBox.setAttribute('class', 'space');
            newBox.ondblclick = function() { Input.ToggleWild(this); };  
            newSpan.appendChild(newBox); 
        }
        gb.appendChild(newSpan);
        gb.appendChild(document.createElement('br'));
    }
    
    var rack = $("#rack")[0];
    
    for(var i = 0; i < Game.RackSize; i++){
        var newBox = document.createElement('input');
        newBox.setAttribute('id', ('rack' + i));
        newBox.setAttribute('type', 'text');
        newBox.setAttribute('maxLength', 1);
        newBox.setAttribute('class', 'space rack');  
        rack.appendChild(newBox); 
    }
    
    Game.AddSpecials(Game.Configuration['specials']);
    Game.TileVals = Game.Configuration["tileVals"];
    Game.BingoBonus = Game.Configuration["bingoBonus"];
    
    Input.Init(Game.BoardSize);
};

Game.AddSpecials = function(specials) {
    for(var i = 0; i < specials.length; i++){
        for(var j = 1; j < specials[i].length; j++){
            $("#space" + specials[i][j]).addClass(specials[i][0]);
        }
    }
};

Game.FindWords = function(){
    Game.ClearResults();   
    //setTimeout(function() { 
    $(".workingInd").show(); 
    //}, 10);
    Input.Disabled(true);
    
    Game.BoardState = Input.GetBoardState();
    Game.RackState = Input.GetRackState();
    Game.WildsState = Input.GetWildsState();
    Game.WildsInRack = $(Game.RackState).each(function() { if(this == '*') { Validator.WildsInRack++; } });
    Game.IsFirstPlay = Game.GetIsFirstPlay();
    Game.Results = [];
    
    setTimeout(function() {
        Find.FindAll();
        
        Game.ShowResults();
        $(".workingInd").hide(); 
        Input.Disabled(false);          
    }, 10); 
};

Game.GetIsFirstPlay = function(){
    for(var i = 0; i < Game.BoardState.length; i++){
        if(Game.BoardState[i] != ''){
            return false;
        }
    }
    return true;
};

Game.Highlight = function(result){
    $(".highlight").removeClass("highlight");
    var dMult = result['hv'] === true ? 1 : Game.BoardSize;
    var pos = result['pos'];
    var len = result['word'].length;
    for(var i = 0; i < len; i++){
        $("#space" + (pos + (i * dMult))).addClass("highlight"); 
    }
};

Game.Play = function(result){
    $(".highlight").removeClass("highlight");
    var played = $(".played");
    for(var i = 0; i < played.length; i++){
        played[i].value = '';
    }
    played.removeClass("played").removeClass("tile");
    var dMult = result['hv'] === true ? 1 : Game.BoardSize;
    var pos = result['pos'];
    var word = result['word'];
    var len = word.length;
    for(var i = 0; i < len; i++){
        var space = $("#space" + (pos + (i * dMult)));
        if(space.hasClass("tile")){
            continue;
        }
        space.removeClass("start");
        space.addClass("tile played");
        space[0].value = word[i];         
    }
};

Game.ShowResults = function(){
    $(".highlight").removeClass("highlight");
    var results = null;
    if(Game.Results.length == 0){
        results = document.createElement('label');
        results.innerHTML = 'There are no valid plays.';
    } else {
        Game.Results.sort(function(a,b) {
            return b['word'].length - a['word'].length;
        });
        Game.Results.sort(function(a,b) {
            return b['score'] - a['score'];
        });
    
        results = document.createElement('table');
        results.setAttribute('class', 'results');
        for(var i = 0; i < Game.Results.length; i ++){
            var result = Game.Results[i];
            var tr = document.createElement('tr');
            tr.setAttribute('class','result');
            var tdScore = document.createElement('td');
            if(result[1] === true){
                tdScore.setAttribute('class','tile score bingo');
            } else {
                tdScore.setAttribute('class','tile score');
            }
            tdScore.innerHTML = result['score'];
            tr.appendChild(tdScore);
            for(var j = 0; j < result['word'].length; j++){
                var td = document.createElement('td');
                td.setAttribute('class','tile');
                td.innerHTML = result['word'][j];
                tr.appendChild(td);
            }
            tr['hv'] = result['hv'];            
            tr['pos'] = result['pos'];            
            tr['word'] = result['word'];
            tr.onmouseover = function() { Game.Highlight(this); };
            tr.onclick = function() { Game.Play(this) }; 
            results.appendChild(tr);
        }
    }
    $("#results")[0].appendChild(results);
};

Game.ClearResults = function(){
    $(".highlight").removeClass("highlight");
    $(".played").removeClass("played");
    var results = $("#results")[0];
    while(results.hasChildNodes()){
        results.removeChild(results.firstChild);
    }
};

Game.ShowLatest = function(){
    var resultCnt = Game.Results.length;
    if(resultCnt > 0){
        Game.Highlight(Game.Results[resultCnt - 1]);
    }
};
