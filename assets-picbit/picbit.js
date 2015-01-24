/**
 * Picbit, 2015
 * http://pmav.eu
 */

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
        paletteListElement : '#palette-list',
        
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
            selectedPalette : null,
            
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

            // 2 colors

            blackAndWhite : [
                [0,     0,   0],
                [255, 255, 255]
            ],

            // 4 colors

            gameBoy : [
                [17,   56, 17],
                [50,   98, 50],
                [139, 171, 36],
                [155, 187, 39]
            ],

            cga : [
                [0,     0,   0],
                [85,  255, 255],
                [255,  85, 255],
                [255, 255, 255]
            ],
            
            grayscale : [
                [  0,   0,   0],
                [104, 104, 104],
                [184, 184, 184],
                [255, 255, 255]
            ],

            // 8 colors

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

            // 16 colors

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
                [0,     0,   0],
                [133,  59,  81],
                [80,   71, 137],
                [234,  93, 240],
                [0,   104,  82],
                [146, 146, 146],
                [0,   168, 241],
                [202, 195, 248],
                [81,   92,  15],
                [235, 127,  35],
                [146, 146, 146],
                [246, 185, 202],
                [0,   202,  41],
                [203, 211, 155],
                [154, 220, 203],
                [255, 255, 255]
            ],

            webColors : [
                [0,     0,   0],
                [128,   0,   0],
                [0,   128,   0],
                [128, 128,   0],
                [0,     0, 128],
                [128,   0, 128],
                [0,   128, 128],
                [192, 192, 192],
                [128, 128, 128],
                [255,   0,   0],
                [0,   255,   0],
                [255, 255,   0],
                [0,     0, 255],
                [255,   0, 255],
                [0,   255, 255],
                [255, 255, 255]
            ],

            solarized : [
                [  0,  43,  54],
                [  7,  54,  66],
                [ 88, 110, 117],
                [101, 123, 131],
                [131, 148, 150],
                [147, 161, 161],
                [238, 232, 213],
                [253, 246, 227],
                [181, 137,   0],
                [203,  75,  22],
                [220,  50,  47],
                [211,  54, 130],
                [108, 113, 196],
                [ 38, 139, 210],
                [ 42, 161, 152],
                [133, 153,   0]
            ]


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
        $(PICBIT.config.pixelAggregationMethodSelect).change(PICBIT.handlers.draw);
        $(PICBIT.config.pixelSizeSelect).change(PICBIT.handlers.draw);
        $(PICBIT.config.paletteSelect).change(PICBIT.handlers.draw);
        $(PICBIT.config.colorSelectionSelect).change(PICBIT.handlers.draw);

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
            PICBIT.process.helpers.showPalette();
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

                    //if (isNaN(currentColorDistance))
                    //    console.log('NaN');

                    if (currentColorDistance < closerColorDistance)
                    {
                        closerColorDistance = currentColorDistance;
                        closerColor = palette[i];
                    }
                }

                /*
                if (closerColor === undefined)
                {
                    closerColorDistance = 999999999;

                    for (var i = 0; i < palette.length; i++)
                    {
                        var currentColorDistance = PICBIT.config.state.colorSelectionMethod(p, palette[i]);

                        if (currentColorDistance < closerColorDistance)
                        {
                            closerColorDistance = currentColorDistance;
                            closerColor = palette[i];
                        }
                    }
                }
                */

                return [closerColor[0], closerColor[1], closerColor[2], PICBIT.config.alphaValue];
            }
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

            distanceDivided : function(v, dividend) {
                var r = v / dividend;
                return r * r;
            }
        },

        palette : {

            /**
             * Return top N must used colors from an image using RgbQuant.js
             *
             * Source: https://github.com/leeoniya/RgbQuant.js
             */
            getOriginalColors : function(initialImageData, topColorsCount) {
                var rgbQuant = new RgbQuant({ colors: topColorsCount });
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
             * Show current palette.
             */
            showPalette : function() {

                var toHex = function(rgbColor) {
                    var hexR = rgbColor[0].toString(16).toUpperCase();
                    var hexG = rgbColor[1].toString(16).toUpperCase();
                    var hexB = rgbColor[2].toString(16).toUpperCase();
                    return '#' +
                        (hexR.length == 1 ? '0' + hexR : hexR) +
                        (hexG.length == 1 ? '0' + hexG : hexG) +
                        (hexB.length == 1 ? '0' + hexB : hexB);
                }

                var html = '';
                var count = PICBIT.config.state.selectedPalette.length;
                var width = (100 / count).toFixed(2);

                for (var i = 0; i < count; i++)
                {
                    var color = PICBIT.config.state.selectedPalette[i];
                    var hexColor = toHex(color);
                    html += '<span class="color" style="background: '+hexColor+'; width: '+width+'%" title="'+hexColor+'"></span>';
                }

                $(PICBIT.config.paletteListElement).html(html);
            },

            /**
             * Convert a point from RGB to LAB color space.
             *
             * Source: http://stackoverflow.com/a/8433985
             */
            rgb2lab : function(rgbColor) {
                var r = rgbColor[0]/255.0;
                var g = rgbColor[1]/255.0;
                var b = rgbColor[2]/255.0;

                r = (r > 0.04045 ? Math.pow(((r + 0.055) / 1.055), 2.4) : r / 12.92) * 100.;
                g = (g > 0.04045 ? Math.pow(((g + 0.055) / 1.055), 2.4) : g / 12.92) * 100.;
                b = (b > 0.04045 ? Math.pow(((b + 0.055) / 1.055), 2.4) : b / 12.92) * 100.;

                var x = ((r * 0.4124) + (g * 0.3576) + (b * 0.1805)) / 95.047;
                var y = ((r * 0.2126) + (g * 0.7152) + (b * 0.0722)) / 100.000;
                var z = ((r * 0.0193) + (g * 0.1192) + (b * 0.9505)) / 108.883;

                x = x > 0.008856 ? Math.pow(x, 1./3.) : (7.787 * x) + (16. / 116.);
                y = y > 0.008856 ? Math.pow(y, 1./3.) : (7.787 * y) + (16. / 116.);
                z = z > 0.008856 ? Math.pow(z, 1./3.) : (7.787 * z) + (16. / 116.);

                return [
                    (116. * y) - 16., // l
                    500. * (x - y), // a
                    200. * (y - z), // b
                ];
            }
        }
    }

};
