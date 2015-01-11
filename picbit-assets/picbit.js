// http://colormine.org/
// http://www.brucelindbloom.com/index.html?Eqn_DeltaE_CMC.html
// http://stackoverflow.com/questions/13586999/color-difference-similarity-between-two-values-with-js
// http://en.wikipedia.org/wiki/Color_difference


$(document).ready(function() {
    PICBIT.main();
    PICBIT.loadInitialImage();
});

var PICBIT = {

    config : {
        /**
         *
         */
        originalImageElement : '#original-image',

        /**
         *
         */
        dropZoneElement : '#export-image',
        
        /**
         *
         */
        dropZoneHoverClass : '.drop-zone-hover',
        
        /**
         * Max image width.
         */
        maxImageWidth : 786,
        
        /**
         * Curretn pixel size.
         */
        pixelSize : 4,
        
        /**
         * Current pixel aggregation method.
         */
        pixelAggregationMethod : 1,

        /**
         * 
         */
        selectedPalette : null,

        /**
         *
         */
        colorSelectionMethod : 1,

        /**
         *
         */
        palette : {

            original : null,

            blackAndWhite : [
                [0,     0,   0],
                [255, 255, 255]
            ],

            gameBoy : [
                [17,   56, 17],
                [50,   98, 50],
                [139, 171, 36],
                [155, 187, 39]
            ],

            teletext : [
                [0,     0,   0],
                [0,    39, 251],
                [255,  48,  22],
                [255,  63, 252],
                [0,   249,  44],
                [0,   252, 254],
                [255, 253,  51],
                [255, 255, 255]
            ],

            cga : [
                [0,     0,   0],
                [85,  255, 255],
                [255,  85, 255],
                [255, 255, 255]
            ],

            ega : [
                [0,    0,    0],
                [0,    0,  170],
                [0,   170,   0],
                [0,   170, 170],
                [170,   0,   0],
                [170,   0, 170],
                [170,  85,   0],
                [170, 170, 170],
                [85,   85,  85],
                [85,   85, 255],
                [85,  255,  85],
                [85,  255, 255],
                [255,  85,  85],
                [255,  85, 255],
                [255, 255,  85],
                [255, 255, 255]
            ],

            appleII : [
                [0, 0, 0],
                [133, 59, 81],
                [80, 71, 137],
                [234, 93, 240],
                [0, 104, 82],
                [146, 146, 146],
                [0, 168, 241],
                [202, 195, 248],
                [81, 92, 15],
                [235, 127, 35],
                [146, 146, 146],
                [246, 185, 202],
                [0, 202, 41],
                [203, 211, 155],
                [154, 220, 203],
                [255, 255, 255],
            ],

            msWindows : [
                [0, 0, 0],
                [128, 0, 0],
                [0, 128, 0],
                [128, 128, 0],
                [0, 0, 128],
                [128, 0, 128],
                [0, 128, 128],
                [192, 192, 192],
                [128, 128, 128],
                [255, 0, 0],
                [1, 255, 0],
                [255, 255, 0],
                [0, 0, 255],
                [255, 0, 255],
                [1, 255, 255],
                [255, 255, 255],
            ]
        }
    },

    main : function() {
        if(!window.FileReader)
            return;

        var dropZone = $(PICBIT.config.dropZoneElement);
        dropZone.on('dragenter', PICBIT.handlers.dragEnter);
        dropZone.on('dragexit', PICBIT.handlers.dragExit);
        dropZone.on('dragover', PICBIT.handlers.dragOver);
        dropZone.on('drop', PICBIT.handlers.dragDrop);

        $('#draw').click(PICBIT.handlers.redraw); // TODO Remove.

        $('#select-pixel-aggregation-method').change(PICBIT.handlers.redraw);
        $('#select-pixel-size').change(PICBIT.handlers.redraw);
        $('#select-palette').change(PICBIT.handlers.redraw);
        $('#select-color-selection').change(PICBIT.handlers.redraw);
    },

    loadInitialImage : function() {
        var img = $(PICBIT.config.originalImageElement).get(0);
        img.onload = function() {
            PICBIT.handlers.redraw();
        }
    },

    
    helpers :  {
        showPalette : function()
        {
            var s = '';

            for (var i = 0; i < PICBIT.config.selectedPalette.length; i++)
            {
                var c = PICBIT.config.selectedPalette[i];
                s += '<span class="color" style="background: rgb('+c[0]+','+c[1]+','+c[2]+')">'+c[0]+','+c[1]+','+c[2]+'</span> ';
            }

            $('#palette').html(s);
        }
    },
    

    handlers : {

        dragEnter : function(e) {
            e.preventDefault();
            $('#drop-zone').addClass('drop-zone-hover'); // TODO Move ref.
            return false;
        },

        dragExit : function(e) {
            e.preventDefault();
            $('#drop-zone').removeClass('drop-zone-hover'); // TODO Move ref.
            return false;
        },

        dragOver : function(e) {
            e.preventDefault();
            return false;
        },

        dragDrop : function(e) {
            e.preventDefault();

            $('#drop-zone').removeClass('drop-zone-hover'); // TODO Move ref.

            var file = e.originalEvent.dataTransfer.files[0];
            
            var reader = new FileReader();
            $(reader).on('loadend', PICBIT.handlers.loadEnd);
            reader.readAsDataURL(file);

            return false;
        },

        loadEnd : function(e, file) {
            var img = $(PICBIT.config.originalImageElement).get(0);
            img.src = this.result;
            img.onload = function() {
                PICBIT.handlers.redraw();
            }
        },

        redraw : function() {
            PICBIT.config.pixelSize = parseInt($('#select-pixel-size').val(), 10);
            PICBIT.config.pixelAggregationMethod = parseInt($('#select-pixel-aggregation-method').val(), 10);
            PICBIT.config.selectedPalette = PICBIT.config.palette[$('#select-palette').val()];
            PICBIT.config.colorSelectionMethod = parseInt($('#select-color-selection').val(), 10);

            if ($('#select-palette').val() === 'original16')
                PICBIT.config.selectedPalette = [ [0,0,0], [255,100,100] ]; // TODO Color simplification, get top 16 from image.

            var img = $(PICBIT.config.originalImageElement).get(0);
            PICBIT.transform.main1(img);

            PICBIT.helpers.showPalette();
        }
    },

    transform : {

        main1 : function(img)
        {
            var start = new Date().getTime();

            var newW = img.width;
            var newH = img.height;
            
            // Resize image, if needed.

            if (newW > PICBIT.config.maxImageWidth)
            {
                newW = PICBIT.config.maxImageWidth;
                newH = Math.ceil(img.height * (newW / img.width)); // Ajust height.
            }

            // Crop image to be a multiple of step.

            newW = newW - (newW % PICBIT.config.pixelSize);
            newH = newH - (newH % PICBIT.config.pixelSize);

            // Set loaded image.

            var canvas = document.getElementById('canvas'); // TODO Ref.
            var context = canvas.getContext('2d');
            context.canvas.width = newW;
            context.canvas.height = newH;
            context.drawImage(img, 0, 0, newW, newH);

            PICBIT.transform.main(img, context);

            var end = new Date().getTime();
            var time = end - start;
            
            $('#time').text(time + 'ms' + ' / '+ Math.floor((newW * newW) / 1000) + ' K pixels');
        },

        main : function(img, ctx)
        {
            var w = ctx.canvas.width;
            var h = ctx.canvas.height;

            var initialImageData = ctx.getImageData(0, 0, w, h); // Loaded image.
            var finalImageData = ctx.createImageData(w, h); // Empty image.

            this.copy(initialImageData, finalImageData, w, h);

            ctx.putImageData(finalImageData, 0, 0); // Draw final image.

            $('#export-image').attr('src', ctx.canvas.toDataURL('image/png')); // TODO Move ref.
        },

        copy : function(initialImageData, finalImageData, w, h)
        {
            var step = PICBIT.config.pixelSize;

            for (var x = 0; x < w; x += step)
            {
                for (var y = 0; y < h; y += step)
                {
                    var points = [];

                    // Get all points.
                    for (var offsetX = 0; offsetX < step; offsetX++)
                    {
                        for (var offsetY = 0; offsetY < step; offsetY++)
                        {
                            var index = this.getIndexFromCoords(x, y, w, offsetX, offsetY);
                            var t = this.getPoint(initialImageData, index);
                            points.push(t);
                        }
                    }
                    
                    // TODO Transform point.
                    var p = this.transformPoint(points);

                    // Write new point.
                    for (var offsetX = 0; offsetX < step; offsetX++)
                    {
                        for (var offsetY = 0; offsetY < step; offsetY++)
                        {
                            var index = this.getIndexFromCoords(x, y, w, offsetX, offsetY);
                            this.setPoint(finalImageData, index, p);
                        }
                    }
                }
            }
        },

        transformPoint : function(points)
        {
            var p;
            switch(PICBIT.config.pixelAggregationMethod)
            {
                case 1:
                    p = this.aggregation.average(points);
                    break;
                case 2:
                    p = this.aggregation.lighter(points);
                    break;
                case 3:
                    p = this.aggregation.darker(points);
                    break;
            }

            return this.getCloserColor(p);
        },

        aggregation : 
        {
            average : function(points) {
                var r = 0,
                    g = 0,
                    b = 0,
                    t = points.length;

                for (var i = 0; i < t; i++)
                {
                    r += points[i][0];
                    g += points[i][1];
                    b += points[i][2];
                }

                r = Math.ceil(r / t);
                g = Math.ceil(g / t);
                b = Math.ceil(b / t);

                return [r, g, b, 255];
            },
            
            darker : function(points) {
                var c,
                    cs = Number.MAX_VALUE,
                    t = points.length;

                for (var i = 0; i < t; i++)
                {
                    var t1 = (points[i][0] + points[i][1] + points[i][2]) / 3;
                    if (t1 < cs)
                    {
                        c = points[i];
                        cs = t1;
                    }
                }

                return [c[0], c[1], c[2], 255];
            },
            
            lighter : function(points) {
                var c,
                    cs = Number.MIN_VALUE,
                    t = points.length;

                for (var i = 0; i < t; i++)
                {
                    var t1 = (points[i][0] + points[i][1] + points[i][2]) / 3;
                    if (t1 > cs)
                    {
                        c = points[i];
                        cs = t1;
                    }
                }

                return [c[0], c[1], c[2], 255];
            }
        },

        getCloserColor : function(p)
        {
            var closerColor, closerColorDistance = Number.MAX_VALUE;

            var palette = PICBIT.config.selectedPalette;

            if (palette === null)
                return p;

            for (var i = 0; i < palette.length; i++)
            {
                var currentColorDistance;

                switch(PICBIT.config.colorSelectionMethod)
                {
                    case 1:
                        currentColorDistance = this.euclideanDistance(p, palette[i]);
                        break;
                    case 2:
                        currentColorDistance = this.distanceCIE76(p, palette[i]);
                        break;
                    case 3:
                        currentColorDistance = this.distanceCIE94(p, palette[i]);
                        break;
                }
                
                if (currentColorDistance < closerColorDistance)
                {
                    closerColorDistance = currentColorDistance;
                    closerColor = palette[i];
                }
            }

            return [closerColor[0], closerColor[1], closerColor[2], 255];
        },

// http://en.wikipedia.org/wiki/Color_difference

        distanceCIE76 : function(p1, p2)
        {
            var l1 = this.rgb2lab(p1);
            var l2 = this.rgb2lab(p2);

            var l = Math.pow(l2[0] - l1[0], 2);
            var a = Math.pow(l2[1] - l1[1], 2);
            var b = Math.pow(l2[2] - l1[2], 2);

            return (l + a + b);
        },

/**
 * http://html5hub.com/exploring-color-matching-in-javascript/
 */
distanceCIE94 : function(p1, p2)
{
    var x = this.rgb2lab(p1);
    var y = this.rgb2lab(p2);
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
},

        euclideanDistance : function(p1, p2)
        {
            var r = Math.pow(p2[0] - p1[0], 2);
            var g = Math.pow(p2[1] - p1[1], 2);
            var b = Math.pow(p2[2] - p1[2], 2);

            return (r + g + b);
        },

        getIndexFromCoords : function(x, y, h, offsetX, offsetY)
        {
            return ((x + offsetX) + ((y + offsetY)) * h) * 4;
        },

        getPoint : function(imageData, index)
        {
            return [
                imageData.data[index + 0],
                imageData.data[index + 1],
                imageData.data[index + 2],
                imageData.data[index + 3]
            ];
        },

        setPoint : function(imageData, index, p)
        {
            imageData.data[index + 0] = p[0];
            imageData.data[index + 1] = p[1];
            imageData.data[index + 2] = p[2];
            imageData.data[index + 3] = p[3];
        },

/**
 * http://stackoverflow.com/a/8433985
 */
        rgb2lab : function(p)
        {
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
    }
};
