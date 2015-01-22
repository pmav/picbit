

$(document).ready(function() {
    PICBIT.main();
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
        exportImageElement : '#export-image',

        /**
         *
         */
        dropZoneElement : '#drop-zone',

        /**
         *
         */
        canvasElement : '#canvas',
        
        /**
         *
         */
        dropZoneHoverClass : 'drop-zone-hover',


        pixelSizeSelect : '#select-pixel-size',
        paletteSelect : '#select-palette',
        colorSelectionSelect : '#select-color-selection',
        pixelAggregationMethodSelect : '#select-pixel-aggregation-method',

        randomButtonElement : '#button-random',
        redrawButtonElement : '#button-redraw',

        processingTimeElement : '#processing-time',
        
        /**
         * Max image width.
         */
        maxImageWidth : 786,
        
        /**
         * Default alpha value.
         */
        alphaValue : 255,

        /**
         * Current app stete.
         */
        state : {

            /**
             * Curretn pixel size.
             */
            pixelSize : 4,

            /**
             * Current palette.
             */
            palette : null,
            
            /**
             * Current pixel aggregation method.
             */
            pixelAggregationMethod : null,

            /**
             * Current color selection method.
             */
            colorSelectionMethod : null,
        },

        /**
         *
         */
        palette : {

            original16 : 'original16',

            blackAndWhite : [ [0,     0,   0], [255, 255, 255] ],
            gameBoy : [ [17,   56, 17], [50,   98, 50], [139, 171, 36], [155, 187, 39] ],
            teletext : [ [0,     0,   0], [0,    39, 251], [255,  48,  22], [255,  63, 252], [0,   249,  44], [0,   252, 254], [255, 253,  51], [255, 255, 255] ],
            cga : [ [0,     0,   0], [85,  255, 255], [255,  85, 255], [255, 255, 255] ],
            ega : [ [0,    0,    0], [0,    0,  170], [0,   170,   0], [0,   170, 170], [170,   0,   0], [170,   0, 170], [170,  85,   0], [170, 170, 170], [85,   85,  85], [85,   85, 255], [85,  255,  85], [85,  255, 255], [255,  85,  85], [255,  85, 255], [255, 255,  85], [255, 255, 255] ],
            appleII : [ [0,     0,   0], [133,  59,  81], [80,   71, 137], [234,  93, 240], [0,   104,  82], [146, 146, 146], [0,   168, 241], [202, 195, 248], [81,   92,  15], [235, 127,  35], [146, 146, 146], [246, 185, 202], [0,   202,  41], [203, 211, 155], [154, 220, 203], [255, 255, 255] ],
            msWindows : [ [0,     0,   0], [128,   0,   0], [0,   128,   0], [128, 128,   0], [0,     0, 128], [128,   0, 128], [0,   128, 128], [192, 192, 192], [128, 128, 128], [255,   0,   0], [1,   255,   0], [255, 255,   0], [0,     0, 255], [255,   0, 255], [1,   255, 255], [255, 255, 255] ]
        }
    },

    main : function() {
        if(!window.FileReader)
            return;

        // Register drag and drop events.
        var dropZone = $(PICBIT.config.dropZoneElement);
        dropZone.on('dragenter', PICBIT.handlers.dragEnter);
        dropZone.on('dragexit', PICBIT.handlers.dragExit);
        dropZone.on('dragover', PICBIT.handlers.dragOver);
        dropZone.on('drop', PICBIT.handlers.dragDrop);

        // Register form events.
        $('#select-pixel-aggregation-method').change(PICBIT.handlers.draw);
        $('#select-pixel-size').change(PICBIT.handlers.draw);
        $('#select-palette').change(PICBIT.handlers.draw);
        $('#select-color-selection').change(PICBIT.handlers.draw);

        // Register button events.
        $(PICBIT.config.randomButtonElement).click(PICBIT.handlers.random);
        $(PICBIT.config.redrawButtonElement).click(PICBIT.handlers.draw);

        // Load initial image.
        var image = new Image();
        image.onload = function () {
          PICBIT.handlers.draw();
        }
        image.src = $(PICBIT.config.originalImageElement).attr("src");
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
            $(PICBIT.config.dropZoneElement).addClass(PICBIT.config.dropZoneHoverClass);
        },

        dragExit : function(e) {
            e.preventDefault();
            $(PICBIT.config.dropZoneElement).removeClass(PICBIT.config.dropZoneHoverClass);
        },

        dragOver : function(e) {
            e.preventDefault();
        },

        dragDrop : function(e) {
            e.preventDefault();
            $(PICBIT.config.dropZoneElement).removeClass(PICBIT.config.dropZoneHoverClass);

            var file = e.originalEvent.dataTransfer.files[0]; // Only process the first file per drop.
            var reader = new FileReader();
            $(reader).on('loadend', PICBIT.handlers.loadEnd);
            reader.readAsDataURL(file);
        },

        loadEnd : function(e, file) {
            var img = $(PICBIT.config.originalImageElement).get(0);
            img.src = this.result;
            img.onload = function() {
                PICBIT.handlers.draw();
            }
        },

        random : function() {
            
            // Randomize controls.
            var getRandomInt = function  (min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            };

            var setRandomOption = function(select) {
                options = $(select + ' option');
                var r = getRandomInt(0, options.length - 1);
                $(select).val(options.eq(r).val());
            };

            setRandomOption(PICBIT.config.pixelSizeSelect);
            setRandomOption(PICBIT.config.paletteSelect);
            setRandomOption(PICBIT.config.colorSelectionSelect);
            setRandomOption(PICBIT.config.pixelAggregationMethodSelect);

            // Draw.
            PICBIT.handlers.draw();
        },

        draw : function() {
            // Load current state from form.
            var img = $(PICBIT.config.originalImageElement).get(0);

            // Pixel size.
            PICBIT.config.state.pixelSize = parseInt($(PICBIT.config.pixelSizeSelect).val(), 10);

            // Palette.
            switch($(PICBIT.config.paletteSelect).val())
            {
                case 'original4':
                    PICBIT.config.state.selectedPalette = function(initialImageData) { PICBIT.config.state.selectedPalette  = PICBIT.process.palette.getOriginalColors(initialImageData, 4); };
                    break;
                case 'original8':
                    PICBIT.config.state.selectedPalette = function(initialImageData) { PICBIT.config.state.selectedPalette  = PICBIT.process.palette.getOriginalColors(initialImageData, 8); };
                    break;
                case 'original16':
                    PICBIT.config.state.selectedPalette = function(initialImageData) { PICBIT.config.state.selectedPalette  = PICBIT.process.palette.getOriginalColors(initialImageData, 16); };
                    break;
                default:
                    PICBIT.config.state.selectedPalette = PICBIT.config.palette[$(PICBIT.config.paletteSelect).val()];
            }

            // Color selection method.
            switch(parseInt($(PICBIT.config.colorSelectionSelect).val(), 10))
            {
                case 1:
                    PICBIT.config.state.colorSelectionMethod = PICBIT.process.distance.euclideanDistance;
                    break;
                case 2:
                    PICBIT.config.state.colorSelectionMethod = PICBIT.process.distance.distanceCIE76;
                    break;
                case 3:
                    PICBIT.config.state.colorSelectionMethod = PICBIT.process.distance.distanceCIE94;
                    break;
                case 4:
                    PICBIT.config.state.colorSelectionMethod = PICBIT.process.distance.CMClc;
                    break;
            }

            // Pixel aggregation method.
            switch(parseInt($(PICBIT.config.pixelAggregationMethodSelect).val(), 10)) {
                case 1:
                    PICBIT.config.state.pixelAggregationMethod = PICBIT.process.aggregation.average;
                    break;
                case 2:
                    PICBIT.config.state.pixelAggregationMethod = PICBIT.process.aggregation.lighter;
                    break;
                case 3:
                    PICBIT.config.state.pixelAggregationMethod = PICBIT.process.aggregation.darker;
                    break;
                case 4:
                    PICBIT.config.state.pixelAggregationMethod = PICBIT.process.aggregation.firstPixel;
                    break;
                case 5:
                    PICBIT.config.state.pixelAggregationMethod = PICBIT.process.aggregation.lastPixel;
                    break;
            }

            // Process image.
            var time = new Date().getTime();
            PICBIT.process.main(img);
            time = (new Date().getTime()) - time;

            $(PICBIT.config.processingTimeElement).html(time);
        }
    },

    process : {

        main : function(img) {
            var newW = img.width;
            var newH = img.height;
            
            // Resize image, if needed.

            if (newW > PICBIT.config.maxImageWidth)
            {
                newW = PICBIT.config.maxImageWidth;
                newH = Math.ceil(img.height * (newW / img.width)); // Ajust height.
            }

            // Crop image to be a multiple of pixel size.

            newW = newW - (newW % PICBIT.config.state.pixelSize);
            newH = newH - (newH % PICBIT.config.state.pixelSize);

            // Set loaded image.

            var canvas = $(PICBIT.config.canvasElement).get(0);
            var context = canvas.getContext('2d');
            context.canvas.width = newW;
            context.canvas.height = newH;
            context.drawImage(img, 0, 0, newW, newH);

            var initialImageData = context.getImageData(0, 0, newW, newH); // Loaded image.
            var finalImageData = context.createImageData(newW, newH); // Empty image.

            PICBIT.process.transform.image(initialImageData, finalImageData, newW, newH); // Process image.

            context.putImageData(finalImageData, 0, 0); // Draw final image into canvas.

            $(PICBIT.config.exportImageElement).attr('src', context.canvas.toDataURL('image/png')); // Copy image from canvas to final element.
        },

        transform : {

            /**
             * Transform a image (initialImageData) into a new one (finalImageData), apply custom functions.
             */
            image : function(initialImageData, finalImageData, w, h) {

                if (typeof(PICBIT.config.state.selectedPalette) == "function") {
                    PICBIT.config.state.selectedPalette(initialImageData);
                }

                //var q = new RgbQuant({ colors: 8 });
                //q.sample(initialImageData);
                //var a = q.reduce(initialImageData);

                //for (var i = 0; i < a.length; i++)
                    //initialImageData.data[i] = a[i];

                // --

                var step = PICBIT.config.state.pixelSize;

                for (var x = 0; x < w; x += step)
                {
                    for (var y = 0; y < h; y += step)
                    {
                        var points = [];

                        // Get all points to aggregate.
                        for (var offsetX = 0; offsetX < step; offsetX++)
                        {
                            for (var offsetY = 0; offsetY < step; offsetY++)
                            {
                                var index = PICBIT.process.helpers.getIndexFromCoords(x, y, w, offsetX, offsetY);
                                var p = PICBIT.process.helpers.getPoint(initialImageData, index);
                                points.push(p);
                            }
                        }
                        
                        var p = PICBIT.process.transform.point(points); // Aggregate points.

                        // Write new point.
                        for (var offsetX = 0; offsetX < step; offsetX++)
                        {
                            for (var offsetY = 0; offsetY < step; offsetY++)
                            {
                                var index = PICBIT.process.helpers.getIndexFromCoords(x, y, w, offsetX, offsetY);
                                PICBIT.process.helpers.setPoint(finalImageData, index, p);
                            }
                        }
                    }
                }
            },

            /**
             * Aggregate a group of points into a single one using a custom aggregation method and a custom color selection method.
             */
            point : function(points) {

                var palette = PICBIT.config.state.selectedPalette;

                // Aggregate points.
                var p = PICBIT.config.state.pixelAggregationMethod(points);

                // Select point color.
                var closerColor, closerColorDistance = 999999999;

                for (var i = 0; i < palette.length; i++)
                {
                    var currentColorDistance = PICBIT.config.state.colorSelectionMethod(p, palette[i]);

                    if (isNaN(currentColorDistance))
                        console.log('NaN');

                    if (currentColorDistance < closerColorDistance)
                    {
                        closerColorDistance = currentColorDistance;
                        closerColor = palette[i];
                    }
                }

                if (closerColor === undefined)
                {
                    closerColorDistance = 999999999;

                    for (var i = 0; i < palette.length; i++)
                    {
                        var currentColorDistance = PICBIT.config.state.colorSelectionMethod(p, palette[i]);

                        console.log(p+" "+palette[i]+" "+currentColorDistance);

                        if (currentColorDistance < closerColorDistance)
                        {
                            closerColorDistance = currentColorDistance;
                            closerColor = palette[i];
                        }
                    }
                }

                return [closerColor[0], closerColor[1], closerColor[2], PICBIT.config.alphaValue];
            },

            /*
            point2 : function(points) {

                var palette = PICBIT.config.state.selectedPalette;

                for (var a = 0; a < points.length; a++)
                {
                    var p = points[a];

                    // Select point color.
                    var closerColor, closerColorDistance = 999999999;

                    for (var i = 0; i < palette.length; i++)
                    {
                        var currentColorDistance = PICBIT.config.state.colorSelectionMethod(p, palette[i]);

                        if (currentColorDistance < closerColorDistance)
                        {
                            closerColorDistance = currentColorDistance;
                            closerColor = palette[i];
                        }
                    }

                    points[a] = [closerColor[0], closerColor[1], closerColor[2], PICBIT.config.alphaValue];
                }

                // Aggregate points.
                var p = PICBIT.config.state.pixelAggregationMethod(points);

                return p;
            }
            */
        },

        aggregation : {

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

                return [r, g, b, PICBIT.config.alphaValue];
            },
            
            darker : function(points) {
                var c,
                    cs = 256,
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

                return [c[0], c[1], c[2], PICBIT.config.alphaValue];
            },
            
            lighter : function(points) {
                var c,
                    cs = -1,
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

                return [c[0], c[1], c[2], PICBIT.config.alphaValue];
            },

            firstPixel : function(points) {
                return points[0];
            },

            lastPixel : function(points) {
                return points[points.length - 1];
            }
        },
        
        distance : {
            
            /**
             * Simple euclidean distance algorithm between RGB colors.
             */
            euclideanDistance : function(p1, p2) {
                var r = Math.pow(p2[0] - p1[0], 2);
                var g = Math.pow(p2[1] - p1[1], 2);
                var b = Math.pow(p2[2] - p1[2], 2);

                return r + g + b;
            },

            /**
             * CIE76 algorithm (LAB color space).
             */
            distanceCIE76 : function(p1, p2) {
                var l1 = PICBIT.process.helpers.rgb2lab(p1);
                var l2 = PICBIT.process.helpers.rgb2lab(p2);

                var l = Math.pow(l2[0] - l1[0], 2);
                var a = Math.pow(l2[1] - l1[1], 2);
                var b = Math.pow(l2[2] - l1[2], 2);

                return l + a + b;
            },

            /**
             * CIE94 algorithm (LAB color space).
             * 
             * Source: http://html5hub.com/exploring-color-matching-in-javascript/
             */
            distanceCIE94 : function(p1, p2) {
                var x = PICBIT.process.helpers.rgb2lab(p1);
                var y = PICBIT.process.helpers.rgb2lab(p2);
                var isTextiles = false;

                var x = { l: x[0], a: x[1], b: x[2] };
                var y = { l: y[0], a: y[1], b: y[2] };
                labx = x;
                laby = y;
                var k2, k1, kl, kh = 1, kc = 1;

                if (isTextiles) {
                    k2 = 0.014;
                    k1 = 0.048;
                    kl = 2;
                } else {
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
                var t = da * da + db * db - dc * dc;
                t = t < 0 ? 0 : t;
                var dh = Math.sqrt(t);
             
                return Math.pow((dl/(kl * sl)),2) + Math.pow((dc/(kc * sc)), 2) + Math.pow((dh/(kh * sh)), 2);
            },

            /**
             * CMC:lc algorithm (LAB color space).
             *
             * Source: https://github.com/THEjoezack/ColorMine/blob/master/ColorMine/ColorSpaces/Comparisons/CmcComparison.cs
             */
            CMClc : function(p1, p2) {
                var l1 = PICBIT.process.helpers.rgb2lab(p1);
                var l2 = PICBIT.process.helpers.rgb2lab(p2);

                var distanceDivided = PICBIT.process.distance.distanceDivided;
                var _lightness = 2.0;
                var _chroma = 1.0;

                var aLab = {L: l1[0], A: l1[1], B: l1[2]};
                var bLab = {L: l2[0], A: l2[1], B: l2[2]};

                var deltaL = aLab.L - bLab.L;
                var h = Math.atan2(aLab.B, aLab.A);
                var c1 = Math.sqrt(aLab.A * aLab.A + aLab.B * aLab.B);
                var c2 = Math.sqrt(bLab.A * bLab.A + bLab.B * bLab.B);
                var deltaC = c1 - c2;
                var t = (aLab.A - bLab.A) * (aLab.A - bLab.A) + (aLab.B - bLab.B) * (aLab.B - bLab.B) - deltaC * deltaC;
                t = t < 0 ? 0 : t;
                var deltaH = Math.sqrt(t);
                var c1_4 = c1 * c1;
                c1_4 *= c1_4;
                var t = 164 <= h || h >= 345
                    ? .56 + Math.abs(.2 * Math.cos(h + 168.0))
                    : .36 + Math.abs(.4 * Math.cos(h + 35.0));
                var f = Math.sqrt(c1_4 / (c1_4 + 1900.0));
                var sL = aLab.L < 16 ? .511 : (.040975 * aLab.L) / (1.0 + .01765 * aLab.L);
                var sC = (.0638 * c1) / (1 + .0131 * c1) + .638;
                var sH = sC * (f * t + 1 - f);
                var differences = distanceDivided(deltaL, _lightness * sL) + distanceDivided(deltaC, _chroma * sC) + distanceDivided(deltaH, sH);
                return Math.sqrt(differences);
            },

            distanceDivided : function(a, dividend) {
                var adiv = a / dividend;
                return adiv * adiv;
            }
        },

        palette : {

            getOriginalColors : function(initialImageData, limit) {
                var rgbQuant = new RgbQuant({ colors: limit });
                rgbQuant.sample(initialImageData);
                return rgbQuant.palette(true);
            }
        },
        
        helpers : {

            /**
             * Convert a (x, y) coord. to image index values.
             */
            getIndexFromCoords : function(x, y, w, offsetX, offsetY) {
                return ((x + offsetX) + ((y + offsetY)) * w) * 4;
            },

            /**
             * Get RGBA values from image index.
             */
            getPoint : function(imageData, index) {
                return [
                    imageData.data[index + 0],
                    imageData.data[index + 1],
                    imageData.data[index + 2],
                    imageData.data[index + 3]
                ];
            },

            /**
             * Set RGBA values at image index.
             */
            setPoint : function(imageData, index, p) {
                imageData.data[index + 0] = p[0];
                imageData.data[index + 1] = p[1];
                imageData.data[index + 2] = p[2];
                imageData.data[index + 3] = p[3];
            },

            /**
             * Convert a point from RGB to LAB color space.
             *
             * Source: http://stackoverflow.com/a/8433985
             */
            rgb2lab : function(p) {
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
    }

};
