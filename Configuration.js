Configuration = {};

Configuration.Standard = function(){
    var config = [];
    config['boardSize'] = 15;
    config['rackSize'] = 7;
    var specials = [];
    specials.push(['start startSpace',112]);
    specials.push(['l2',3,11,36,38,45,52,59,92,96,98,102,108,116,122,126,128,132,165,172,179,186,188,213,221]);
    specials.push(['w2',16,28,32,42,48,56,64,70,80,84,112,140,144,154,160,168,176,182,192,196,208]);
    specials.push(['l3',20,24,76,80,84,88,136,140,144,148,200,204]);
    specials.push(['w3', 0,7,14,105,119,210,217,224]);
    config['specials'] = specials;
    var tileVals = {};
    tileVals['*'] = 0;
    tileVals['A'] = tileVals['E'] = tileVals['I'] = tileVals['O'] = tileVals['N'] = tileVals['R'] = tileVals['T'] = tileVals['L'] = tileVals['S'] = tileVals['U'] = 1;
    tileVals['D'] = tileVals['G'] = 2;
    tileVals['B'] = tileVals['C'] = tileVals['M'] = tileVals['P'] = 3;
    tileVals['F'] = tileVals['H'] = tileVals['V'] = tileVals['W'] = tileVals['Y'] = 4;
    tileVals['K'] = 5;
    tileVals['J'] = tileVals['X'] = 8;
    tileVals['Q'] = tileVals['Z'] = 10;
    config['tileVals'] = tileVals;   
    config['bingoBonus'] = 50; 
    return config;
}