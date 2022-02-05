Input = {};
Input.LastInput = null;
Input.Left = 37;
Input.Up = 38;
Input.Right = 39;
Input.Down = 40;

Input.Init = function() {
    var a = 65, z = 90;
    var backSpace = 8, tab = 9, justShift = 16, del = 46, wild = 56;

    $(".space:input:text").keydown( function(event) {
        Input.LastInput = this;
        var src = $(this);
        switch(event.keyCode){
            case backSpace: case tab: case justShift: case del: case Input.Left: case Input.Up: case Input.Right: case Input.Down:
                return true;
            case wild: case justShift:
                if(event.shiftKey){
                    return true;
                }    
                break;
            default: break;
        }        
        if(event.keyCode >= a && event.keyCode <=  z){
            return true;
        }        
        return false;
    }).keyup( function(event) {
        var src = $(this);
        var idPrefix = src.hasClass("rack") ? "rack" : "space";
        switch(event.keyCode){
            case Input.Left: case Input.Up: case Input.Right: case Input.Down:
                Input.Arrow(src, event.keyCode, idPrefix);
                return;
            case backSpace:
                Input.BackSpace(src, idPrefix);
                return;
            case del:
                src.removeClass("tile");
                src.removeClass("wild");
                if(src.is(".startSpace")){
                    src.addClass("start");
                }
                break;
            default: break;
        }
        
        if(Input.LastInput && Input.LastInput == this) {
            Input.LastInput = null;
            if(src && src[0] && src[0]["maxLength"]) {
                var dst = src.next(":input:text");
                if(!dst || dst.length == 0){
                    var nextId = "#space" + (parseInt(src[0].id.replace("space","")) + 1);
                    dst = $(nextId);
                }
                if(src[0].value.length == src[0]["maxLength"]){
                    src.addClass("tile");                
                    if(dst && dst.is(".space") && event.keyCode != 9 && event.which != 9 && event.keyCode != 16 && event.which != 16) { 
                        src.removeClass("start");
                        src.change();
                        dst.focus();
                    }
                }
            }
        }
    }).focus( function(){
        var src = $(this);
        src.select();
    });
};

Input.Arrow = function(src, keyCode, idPrefix){
    switch(keyCode){
        case Input.Left: Input.ChangePos(src, -1, idPrefix); break;
        case Input.Right: Input.ChangePos(src, 1, idPrefix); break;
        case Input.Up: Input.ChangePos(src, (-1 * Game.BoardSize), idPrefix); break;
        case Input.Down: Input.ChangePos(src, Game.BoardSize, idPrefix); break;
        default: break;
    }
};

Input.BackSpace = function(src, idPrefix){
    src[0].value = "";
    src.removeClass("wild");
    src.removeClass("tile");
    if(src.is(".startSpace")){
        src.addClass("start");
    }
    Input.Arrow(src, Input.Left, idPrefix);
};

Input.ChangePos = function(src, delta, idPrefix){
    srcId = parseInt(src[0].id.replace(idPrefix,""));
    dst = $("#" + idPrefix + (srcId + delta));
    if(dst && dst.is("." + idPrefix)) {
        dst.focus();
        dst.select();
    }
};

Input.Clear = function(){
    $.each($(".space"), function(i, space){
        var spc = $(space);
        spc.val("");
        spc.removeClass("tile");
        spc.removeClass("wild");
        if(spc.hasClass("startSpace")){
            spc.addClass("start");
        }
    });
    Game.ClearResults();
};

Input.GetBoardState = function(){
    var boardState = [];
    var wilds = [];
    $(".space:not(.rack)").each(function(i){       
        boardState[i++] = $(this)[0].value.toUpperCase();
    });    
    
    return boardState;
};

Input.GetWildsState = function(){
    var wilds = [];
    $(".space:not(.rack)").each(function(i){
        if($(this).hasClass("wild")){
            wilds.push(i++);
        }
    });    
    
    return wilds;
};

Input.GetRackState = function(){
    var rackState = [];
    $(".space.rack:[value!='']").each(function(i){
        rackState[i++] = $(this)[0].value.toUpperCase();
    });
    return rackState;
};

Input.Disabled = function(disabled){
    var inputs = $("input");
    inputs.each(function(input){
        input.disabled = disabled;
    });
};

Input.ToggleWild = function(sender){
    var input = $(sender);
    if(input.val() == ''){
        return;
    }
    if(input.hasClass('wild')){
        input.removeClass('wild');
    } else {
        input.addClass('wild');
    }
    input.blur();
};
