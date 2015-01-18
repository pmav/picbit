function rgb2lab(p) {

    var R = p[0];
    var G = p[1];
    var B = p[2];

    var var_R = R/255.0;
    var var_G = G/255.0;
    var var_B = B/255.0;


    if ( var_R > 0.04045 )
        var_R = Math.pow( (( var_R + 0.055 ) / 1.055 ), 2.4 );
    else
        var_R = var_R / 12.92;
    
    if ( var_G > 0.04045 )
        var_G = Math.pow( ( ( var_G + 0.055 ) / 1.055 ), 2.4);
    else
        var_G = var_G / 12.92;
    
    if ( var_B > 0.04045 )
        var_B = Math.pow( ( ( var_B + 0.055 ) / 1.055 ), 2.4);
    else
        var_B = var_B / 12.92;

    var_R = var_R * 100.;
    var_G = var_G * 100.;
    var_B = var_B * 100.;

    var X = var_R * 0.4124 + var_G * 0.3576 + var_B * 0.1805;
    var Y = var_R * 0.2126 + var_G * 0.7152 + var_B * 0.0722;
    var Z = var_R * 0.0193 + var_G * 0.1192 + var_B * 0.9505;

    var var_X = X / 95.047;
    var var_Y = Y / 100.000;
    var var_Z = Z / 108.883;

    if ( var_X > 0.008856 )
        var_X = Math.pow(var_X , ( 1./3. ) );
    else
        var_X = ( 7.787 * var_X ) + ( 16. / 116. );
    
    if ( var_Y > 0.008856 )
        var_Y = Math.pow(var_Y , ( 1./3. ));
    else
        var_Y = ( 7.787 * var_Y ) + ( 16. / 116. );
    
    if ( var_Z > 0.008856 )
        var_Z = Math.pow(var_Z , ( 1./3. ));
    else
        var_Z = ( 7.787 * var_Z ) + ( 16. / 116. );

    l_s = ( 116. * var_Y ) - 16.;
    a_s = 500. * ( var_X - var_Y );
    b_s = 200. * ( var_Y - var_Z );

    return [l_s, a_s, b_s];
}

function euclidean(p1, p2) {
    var r = Math.pow(p2[0] - p1[0], 2);
    var g = Math.pow(p2[1] - p1[1], 2);
    var b = Math.pow(p2[2] - p1[2], 2);

    return (r + g + b);
}

function CIE76(l1, l2) {
    var l = Math.pow(l2[0] - l1[0], 2);
    var a = Math.pow(l2[1] - l1[1], 2);
    var b = Math.pow(l2[2] - l1[2], 2);

    return (l + a + b);
}

function CIE94(x, y)
{
    var isTextiles = false;

    var x = {l: x[0], a: x[1], b: x[2]};
    var y = {l: y[0], a: y[1], b: y[2]};
    labx = x;
    laby = y;
    var k2;
    var k1;
    var kl;
    var kh = 1;
    var kc = 1;
    if (isTextiles) {
        k2 = 0.014;
        k1 = 0.048;
        kl = 2;
    }
    else {
        k2 = 0.015;
        k1 = 0.045;
        kl = 1;
    }
 
    var c1 = Math.sqrt(x.a * x.a + x.b * x.b);
    var c2 = Math.sqrt(y.a * y.a + y.b * y.b);
 
    var sh = 1 + k2 * c1;
    var sc = 1 + k1 * c1;
    var sl = 1;
 
    var da = x.a - y.a;
    var db = x.b - y.b;
    var dc = c1 - c2;
 
    var dl = x.l - y.l;
    var dh = Math.sqrt(da * da + db * db - dc * dc);
 
    return Math.sqrt(Math.pow((dl/(kl * sl)),2) + Math.pow((dc/(kc * sc)),2) + Math.pow((dh/(kh * sh)),2));
}

function CIEDE2000(c1,c2)
{
    var sqrt = Math.sqrt;
    var pow = Math.pow;
    var cos = Math.cos;
    var atan2 = Math.atan2;
    var sin = Math.sin;
    var abs = Math.abs;
    var exp = Math.exp;
    var PI = Math.PI;

    // Get L,a,b values for color 1
    var L1 = c1[0];
    var a1 = c1[1];
    var b1 = c1[2];

    // Get L,a,b values for color 2
    var L2 = c2[0];
    var a2 = c2[1];
    var b2 = c2[2];

    // Weight factors
    var kL = 1;
    var kC = 1;
    var kH = 1;

    /**
    * Step 1: Calculate C1p, C2p, h1p, h2p
    */
    var C1 = sqrt(pow(a1, 2) + pow(b1, 2)) //(2)
    var C2 = sqrt(pow(a2, 2) + pow(b2, 2)) //(2)

    var a_C1_C2 = (C1+C2)/2.0;             //(3)

    var G = 0.5 * (1 - sqrt(pow(a_C1_C2 , 7.0) /
                          (pow(a_C1_C2, 7.0) + pow(25.0, 7.0)))); //(4)

    var a1p = (1.0 + G) * a1; //(5)
    var a2p = (1.0 + G) * a2; //(5)

    var C1p = sqrt(pow(a1p, 2) + pow(b1, 2)); //(6)
    var C2p = sqrt(pow(a2p, 2) + pow(b2, 2)); //(6)

    var hp_f = function(x,y) //(7)
    {
    if(x== 0 && y == 0) return 0;
    else{
      var tmphp = degrees(atan2(x,y));
      if(tmphp >= 0) return tmphp
      else           return tmphp + 360;
    }
    }

    var h1p = hp_f(b1, a1p); //(7)
    var h2p = hp_f(b2, a2p); //(7)

    /**
    * Step 2: Calculate dLp, dCp, dHp
    */
    var dLp = L2 - L1; //(8)
    var dCp = C2p - C1p; //(9)

    var dhp_f = function(C1, C2, h1p, h2p) //(10)
    {
    if(C1*C2 == 0)               return 0;
    else if(abs(h2p-h1p) <= 180) return h2p-h1p;
    else if((h2p-h1p) > 180)     return (h2p-h1p)-360;
    else if((h2p-h1p) < -180)    return (h2p-h1p)+360;
    else                         throw(new Error());
    }
    var dhp = dhp_f(C1,C2, h1p, h2p); //(10)
    var dHp = 2*sqrt(C1p*C2p)*sin(radians(dhp)/2.0); //(11)

    /**
     * Step 3: Calculate CIEDE2000 Color-Difference
     */
    var a_L = (L1 + L2) / 2.0; //(12)
    var a_Cp = (C1p + C2p) / 2.0; //(13)

    var a_hp_f = function(C1, C2, h1p, h2p) { //(14)
    if(C1*C2 == 0)                                      return h1p+h2p
    else if(abs(h1p-h2p)<= 180)                         return (h1p+h2p)/2.0;
    else if((abs(h1p-h2p) > 180) && ((h1p+h2p) < 360))  return (h1p+h2p+360)/2.0;
    else if((abs(h1p-h2p) > 180) && ((h1p+h2p) >= 360)) return (h1p+h2p-360)/2.0;
    else                                                throw(new Error());
    }
    var a_hp = a_hp_f(C1,C2,h1p,h2p); //(14)
    var T = 1-0.17*cos(radians(a_hp-30))+0.24*cos(radians(2*a_hp))+
    0.32*cos(radians(3*a_hp+6))-0.20*cos(radians(4*a_hp-63)); //(15)
    var d_ro = 30 * exp(-(pow((a_hp-275)/25,2))); //(16)
    var RC = sqrt((pow(a_Cp, 7.0)) / (pow(a_Cp, 7.0) + pow(25.0, 7.0)));//(17)
    var SL = 1 + ((0.015 * pow(a_L - 50, 2)) /
                sqrt(20 + pow(a_L - 50, 2.0)));//(18)
    var SC = 1 + 0.045 * a_Cp;//(19)
    var SH = 1 + 0.015 * a_Cp * T;//(20)
    var RT = -2 * RC * sin(radians(2 * d_ro));//(21)
    var dE = sqrt(pow(dLp /(SL * kL), 2) + pow(dCp /(SC * kC), 2) +
                pow(dHp /(SH * kH), 2) + RT * (dCp /(SC * kC)) *
                (dHp / (SH * kH))); //(22)
    return dE;
}

function degrees(n) { return n*(180/Math.PI); }
function radians(n) { return n*(Math.PI/180); }


function CMClc(x, y)
{
    //var aLab = colorA.To<Lab>();
    //var bLab = colorB.To<Lab>();
var _lightness = 2.0;
var _chroma = 1.0;

    var aLab = {L: x[0], A: x[1], B: x[2]};
    var bLab = {L: y[0], A: y[1], B: y[2]};

    var deltaL = aLab.L - bLab.L;
    var h = Math.atan2(aLab.B, aLab.A);
    var c1 = Math.sqrt(aLab.A * aLab.A + aLab.B * aLab.B);
    var c2 = Math.sqrt(bLab.A * bLab.A + bLab.B * bLab.B);
    var deltaC = c1 - c2;
    var deltaH = Math.sqrt(
    (aLab.A - bLab.A) * (aLab.A - bLab.A) +
    (aLab.B - bLab.B) * (aLab.B - bLab.B) -
    deltaC * deltaC);
    var c1_4 = c1 * c1;
    c1_4 *= c1_4;
    var t = 164 <= h || h >= 345
    ? .56 + Math.abs(.2 * Math.cos(h + 168.0))
    : .36 + Math.abs(.4 * Math.cos(h + 35.0));
    var f = Math.sqrt(c1_4 / (c1_4 + 1900.0));
    var sL = aLab.L < 16 ? .511 : (.040975 * aLab.L) / (1.0 + .01765 * aLab.L);
    var sC = (.0638 * c1) / (1 + .0131 * c1) + .638;
    var sH = sC * (f * t + 1 - f);
    var differences = DistanceDivided(deltaL, _lightness * sL) +
    DistanceDivided(deltaC, _chroma * sC) +
    DistanceDivided(deltaH, sH);
    return Math.sqrt(differences);
}

function DistanceDivided(a, dividend) {
    var adiv = a / dividend;
    return adiv * adiv;
}

function getColorsByFrequency(initialImageData, limit) {

    var time = new Date().getTime();

    var length = initialImageData.data.length;
    var cache = {};

    for (var i = 0; i < length; i += 4)
    {
        var r = initialImageData.data[i];
        var g = initialImageData.data[i + 1];
        var b = initialImageData.data[i + 2];

        var k = r + '_' + g + '_' + b;
        if (cache[k] === undefined)
            cache[k] = 0;
        cache[k]++;
    }

    var tuples = [];

    for (var key in cache)
        tuples.push([key, cache[key]]);

    tuples.sort(function(a, b) {
        a = a[1];
        b = b[1];

        return a < b ? 1 : (a > b ? -1 : 0);
    });

    //console.log(tuples);
    //console.log();
    tuples =tuples.slice(0, limit);
    var a = []
    for (var t in tuples)
    {
        var c = tuples[t][0].split('_');
        a.push([c[0], c[1], c[2]]);
    }

    time = (new Date().getTime()) - time;
    console.log(time);

    //return [ [0,0,0], [255,100,100] ];
    return a;
}


var G = [181, 230, 29];
var G2 = [85, 255, 85]; // Light green.
var Y = [255, 255, 85]; // Yellow.

var lab_G = rgb2lab(G);
var lab_G2 = rgb2lab(G2);
var lab_Y = rgb2lab(Y);

console.log(lab_G);
console.log(lab_G2);
console.log(lab_Y);
console.log();

console.log('euclidean');
console.log('G -> G2: ' + euclidean(G, G2));
console.log('G ->  Y: ' + euclidean(G, Y));
console.log();

console.log('CIE76');
console.log('G -> G2: ' + CIE76(lab_G, lab_G2));
console.log('G ->  Y: ' + CIE76(lab_G, lab_Y));
console.log();

console.log('CIE94');
console.log('G -> G2: ' + CIE94(lab_G, lab_G2));
console.log('G ->  Y: ' + CIE94(lab_G, lab_Y));
console.log();

console.log('CIEDE2000');
console.log('G -> G2: ' + CIEDE2000(lab_G, lab_G2));
console.log('G ->  Y: ' + CIEDE2000(lab_G, lab_Y));

console.log('CMClc');
console.log('G -> G2: ' + CMClc(lab_G, lab_G2));
console.log('G ->  Y: ' + CMClc(lab_G, lab_Y));



//console.log(ciede2000(p1, p2));
