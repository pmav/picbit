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
         * DOM elements IDs.
         */
        originalImageElement : '#original-image',
        exportImageElement : '#export-image',
        dropZoneElement : '#drop-zone',
        canvasElement : '#draw-canvas',
        processingTimeElement : '#processing-time',
        paletteListElement : '#palette-list',
        
        /**
         * CSS classes.
         */
        dropZoneHoverClass : 'drop-zone-hover',

        /**
         * DOM form elements IDs.
         */
        pixelSizeSelect : '#select-pixel-size',
        paletteSelect : '#select-palette',
        colorSelectionSelect : '#select-color-selection',
        pixelAggregationMethodSelect : '#select-pixel-aggregation-method',
        firstTransformationSelect : '#select-first-transformation',
        randomButtonElement : '#button-random',
        redrawButtonElement : '#button-redraw',
        exportButtonElement : '#button-export',
        
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

            /**
             * First transformation to apply:
             * 1: aggregation,
             * 2: reduce palette,
             * 3: Fake color #1
             */
            firstTransformation : 1,
        },

        /**
         *
         */
        palette : {

            // 2 colors

            blackAndWhite : [
                [  0,   0,   0],
                [255, 255, 255]
            ],

            // 4 colors

            gameBoy : [
                [ 17,  56, 17],
                [ 50,  98, 50],
                [139, 171, 36],
                [155, 187, 39]
            ],

            cga : [
                [  0,   0,   0],
                [ 85, 255, 255],
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
                [  0,   0,   0],
                [  0,  39, 251],
                [255,  48,  22],
                [255,  63, 252],
                [  0, 249,  44],
                [  0, 252, 254],
                [255, 253,  51],
                [255, 255, 255]
            ],

            // 16 colors

            ega : [
                [  0,   0,   0],
                [  0,   0, 170],
                [  0, 170,   0],
                [  0, 170, 170],
                [170,   0,   0],
                [170,   0, 170],
                [170,  85,   0],
                [170, 170, 170],
                [ 85,  85,  85],
                [ 85,  85, 255],
                [ 85, 255,  85],
                [ 85, 255, 255],
                [255,  85,  85],
                [255,  85, 255],
                [255, 255,  85],
                [255, 255, 255]
            ],
            
            appleII : [
                [  0,   0,   0],
                [132,  59,  81],
                [ 81,  73, 136],
                [232,  97, 238],
                [  0, 104,  82],
                [146, 146, 146],
                [  0, 169, 238],
                [203, 196, 246],
                [ 81, 92,   23],
                [232, 126,  48],
                [146, 146, 146],
                [244, 185, 202],
                [  0, 200,  53],
                [202, 210, 158],
                [157, 220, 203],
                [255, 255, 255]
            ],

            webColors : [
                [  0,   0,   0],
                [128,   0,   0],
                [  0, 128,   0],
                [128, 128,   0],
                [  0,   0, 128],
                [128,   0, 128],
                [  0, 128, 128],
                [192, 192, 192],
                [128, 128, 128],
                [255,   0,   0],
                [  0, 255,   0],
                [255, 255,   0],
                [  0,   0, 255],
                [255,   0, 255],
                [  0, 255, 255],
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

    cache  : {},

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
        $(PICBIT.config.firstTransformationSelect).change(PICBIT.handlers.draw);
        
        // Register button events.
        $(PICBIT.config.randomButtonElement).click(PICBIT.handlers.random);
        $(PICBIT.config.redrawButtonElement).click(PICBIT.handlers.draw);
        $(PICBIT.config.exportButtonElement).click(PICBIT.handlers.exportImage);

        // Load initial image.
        var image = new Image();
        image.onload = function () {
          PICBIT.handlers.draw();
        }
        image.src = $(PICBIT.config.originalImageElement).attr('src');
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
                PICBIT.cache = {}; // Reset cache.
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
            setRandomOption(PICBIT.config.firstTransformationSelect);

            // Draw.
            PICBIT.handlers.draw();
        },

        exportImage : function() {
            $.ajax({
                url: 'https://api.imgur.com/3/upload',
                type: 'POST',
                dataType: 'json',
                headers: { "Authorization": "Client-ID 8da63dc6d4d03e7" },
                data: {
                    image: $(PICBIT.config.canvasElement).get(0).toDataURL("image/png").split(',')[1],
                    title: 'Made with Picbit',
                    description: 'Picbit - http://pmav.eu/stuff/picbit'
                },
                success: function (response) {
                    var win = window.open('http://imgur.com/' + response.data.id, '_blank');
                    win.focus();
                },
                error: function (error) {
                    alert('Error: ' + error.data);
                }
            });
        },

        draw : function() {
            // Load current state from form.
            var img = $(PICBIT.config.originalImageElement).get(0);

            // Pixel size.
            PICBIT.config.state.pixelSize = parseInt($(PICBIT.config.pixelSizeSelect).val(), 10);

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
                case 5:
                    PICBIT.config.state.colorSelectionMethod = PICBIT.process.distance.distanceCIEDE2000;
                    break;
            }

            // First transformation.
            PICBIT.config.state.firstTransformation = parseInt($(PICBIT.config.firstTransformationSelect).val(), 10);

            // Process image.
            var time = new Date().getTime();
            PICBIT.process.main(img);
            time = (new Date().getTime()) - time;

            // Show process time.
            $(PICBIT.config.processingTimeElement).html(time);

            // Update used palette on DOM.
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

                if (PICBIT.config.state.firstTransformation === 3) {
                    PICBIT.cache['c'] = PICBIT.process.palette.getOriginalColors(initialImageData, PICBIT.config.state.selectedPalette.length);
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

                if (PICBIT.config.state.firstTransformation === 1)
                {
                    // Aggregate points (pixelate).
                    var newPoint = PICBIT.config.state.pixelAggregationMethod(points);

                    // Select point color (reduce palette).
                    return PICBIT.process.distance.closerColor(newPoint);
                }
                else if (PICBIT.config.state.firstTransformation === 2)
                {
                    var newPoints = [];

                    // Select point color (reduce palette).
                    for (var j = 0; j < points.length; j++)
                        newPoints.push(PICBIT.process.distance.closerColor(points[j]));

                    // Aggregate points (pixelate).
                    return PICBIT.process.distance.closerColor(PICBIT.config.state.pixelAggregationMethod(newPoints));
                }
                else if (PICBIT.config.state.firstTransformation === 3)
                {
                    // Aggregate points (pixelate).
                    var newPoint = PICBIT.config.state.pixelAggregationMethod(points);

                    // Select point color (reduce palette).
                    return PICBIT.process.distance.fakeColor1(newPoint);
                }
            }

        },

        aggregation : {

            average : function(points) {
                var r = 0, g = 0, b = 0, t = points.length;

                for (var i = 0; i < t; i++)
                {
                    r += points[i][0];
                    g += points[i][1];
                    b += points[i][2];
                }

                r = Math.ceil(r / t);
                g = Math.ceil(g / t);
                b = Math.ceil(b / t);

                return [r, g, b];
            },
            
            darker : function(points) {
                var c, cs = 256, t = points.length;

                for (var i = 0; i < t; i++)
                {
                    var t1 = (points[i][0] + points[i][1] + points[i][2]) / 3;
                    if (t1 < cs)
                    {
                        c = points[i];
                        cs = t1;
                    }
                }

                return [c[0], c[1], c[2]];
            },
            
            lighter : function(points) {
                var c, cs = -1, t = points.length;

                for (var i = 0; i < t; i++)
                {
                    var t1 = (points[i][0] + points[i][1] + points[i][2]) / 3;
                    if (t1 > cs)
                    {
                        c = points[i];
                        cs = t1;
                    }
                }

                return [c[0], c[1], c[2]];
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
             * Get the closest color to a point from a palette based on distance using diferent algorithms.
             */
            closerColor : function(point) {

                var palette = PICBIT.config.state.selectedPalette;
                var closerColor, closerColorDistance = 999999999;

                for (var i = 0; i < palette.length; i++)
                {
                    var currentColorDistance = PICBIT.config.state.colorSelectionMethod(point, palette[i]);

                    if (currentColorDistance < closerColorDistance)
                    {
                        closerColorDistance = currentColorDistance;
                        closerColor = palette[i];
                    }
                }

                return closerColor;
            },

            fakeColor1 : function(point) {

                var palette = PICBIT.cache['c'];
                var closerColor, closerColorDistance = 999999999;

                for (var i = 0; i < palette.length; i++)
                {
                    var currentColorDistance = PICBIT.config.state.colorSelectionMethod(point, palette[i]);

                    if (currentColorDistance < closerColorDistance)
                    {
                        closerColorDistance = currentColorDistance;
                        closerColor = palette[i];
                    }
                }

                point = closerColor;

                for (var i = 0; i < palette.length; i++)
                {
                    if (palette[i][0] === point[0] && palette[i][1] === point[1] && palette[i][2] === point[2])
                        return PICBIT.config.state.selectedPalette[i];
                }
            },

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
             * CIE94 algorithm in Graphic Arts mode (LAB color space).
             * 
             * Source: http://html5hub.com/exploring-color-matching-in-javascript/
             */
            distanceCIE94 : function(p1, p2) {
                var x = PICBIT.process.helpers.rgb2lab(p1);
                var y = PICBIT.process.helpers.rgb2lab(p2);

                var x = { l: x[0], a: x[1], b: x[2] };
                var y = { l: y[0], a: y[1], b: y[2] };

                // Graphic Arts values.
                var k2 = 0.015;
                var k1 = 0.045;
                var kl = 1;
             
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
                
                var kh = 1;
                var kc = 1;

                return Math.pow((dl/(kl * sl)),2) + Math.pow((dc/(kc * sc)), 2) + Math.pow((dh/(kh * sh)), 2);
            },

            /**
             * CIEDE2000 algorithm (LAB color space).
             *
             * Source: https://github.com/markusn/color-diff
             */
            distanceCIEDE2000 : function (p1, p2) {
                var c1 = PICBIT.process.helpers.rgb2lab(p1);
                var c2 = PICBIT.process.helpers.rgb2lab(p2);

                var radians = PICBIT.process.distance.radians;
                var hp_f = PICBIT.process.distance.hp_f;
                var dhp_f = PICBIT.process.distance.dhp_f;
                var a_hp_f = PICBIT.process.distance.a_hp_f;

                var L1 = c1[0], a1 = c1[1], b1 = c1[2];
                var L2 = c2[0], a2 = c2[1], b2 = c2[2];
                var kL = 1, kC = 1, kH = 1; // Weight factors

                // Step 1: Calculate C1p, C2p, h1p, h2p
                var C1 = Math.sqrt(Math.pow(a1, 2) + Math.pow(b1, 2));
                var C2 = Math.sqrt(Math.pow(a2, 2) + Math.pow(b2, 2));

                var a_C1_C2 = (C1 + C2) / 2.0;
                var G = 0.5 * (1 - Math.sqrt(Math.pow(a_C1_C2, 7.0) / (Math.pow(a_C1_C2, 7.0) + Math.pow(25.0, 7.0))));

                var a1p = (1.0 + G) * a1;
                var a2p = (1.0 + G) * a2;

                var C1p = Math.sqrt(Math.pow(a1p, 2) + Math.pow(b1, 2));
                var C2p = Math.sqrt(Math.pow(a2p, 2) + Math.pow(b2, 2));

                var h1p = hp_f(b1, a1p);
                var h2p = hp_f(b2, a2p);

                // Step 2: Calculate dLp, dCp, dHp
                var dLp = L2 - L1;
                var dCp = C2p - C1p;

                var dhp = dhp_f(C1, C2, h1p, h2p);
                var dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin(radians(dhp) / 2.0);

                // Step 3: Calculate CIEDE2000 Color-Difference
                var a_L = (L1 + L2) / 2.0;
                var a_Cp = (C1p + C2p) / 2.0;

                var a_hp = a_hp_f(C1, C2, h1p, h2p);
                var T = 1 - 0.17 * Math.cos(radians(a_hp - 30)) + 0.24 * Math.cos(radians(2 * a_hp)) + 0.32 * Math.cos(radians(3 * a_hp + 6)) - 0.20 * Math.cos(radians(4 * a_hp - 63));
                var d_ro = 30 * Math.exp(-(Math.pow((a_hp - 275) / 25, 2)));
                var RC = Math.sqrt((Math.pow(a_Cp, 7.0)) / (Math.pow(a_Cp, 7.0) + Math.pow(25.0, 7.0)));
                var SL = 1 + ((0.015 * Math.pow(a_L - 50, 2)) / Math.sqrt(20 + Math.pow(a_L - 50, 2.0)));
                var SC = 1 + 0.045 * a_Cp;
                var SH = 1 + 0.015 * a_Cp * T;
                var RT = -2 * RC * Math.sin(radians(2 * d_ro));
                var dE = Math.sqrt(Math.pow(dLp / (SL * kL), 2) + Math.pow(dCp / (SC * kC), 2) + Math.pow(dHp / (SH * kH), 2) + RT * (dCp / (SC * kC)) * (dHp / (SH * kH)));

                return dE;
            },

            hp_f : function(x, y) {
                if (x == 0 && y == 0)
                    return 0;

                var tmphp = PICBIT.process.distance.degrees(Math.atan2(x,y));
                if(tmphp >= 0)
                    return tmphp
                else
                    return tmphp + 360;
            },

            dhp_f : function(C1, C2, h1p, h2p) {
                if (C1 * C2 == 0)
                    return 0;
                if (Math.abs(h2p - h1p) <= 180)
                    return h2p - h1p;
                if ((h2p - h1p) > 180)
                    return (h2p - h1p) - 360;
                if ((h2p - h1p) < -180)
                    return (h2p - h1p) + 360;
                throw (new Error());
            },

            a_hp_f : function(C1, C2, h1p, h2p) {
                if (C1 * C2 == 0)
                    return h1p + h2p;
                if (Math.abs(h1p - h2p) <= 180)
                    return (h1p + h2p) / 2.0;
                if ((Math.abs(h1p - h2p) > 180) && ((h1p + h2p) < 360))
                    return (h1p + h2p + 360) / 2.0;
                if ((Math.abs(h1p - h2p) > 180) && ((h1p + h2p) >= 360))
                    return (h1p + h2p - 360) / 2.0;
                throw (new Error());
            },

            degrees : function (n) {
                return n * (180 / Math.PI);
            },
            
            radians : function (n) {
                return n * (Math.PI / 180);
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
                var key = 'getOriginalColors_' + topColorsCount;
                
                if (PICBIT.cache[key] === undefined)
                {
                    var rgbQuant = new RgbQuant({ colors: topColorsCount });
                    rgbQuant.sample(initialImageData);
                    PICBIT.cache[key] = rgbQuant.palette(true);
                }

                return PICBIT.cache[key];
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
                    imageData.data[index + 2]
                ];
            },

            /**
             * Set RGBA values at image index.
             */
            setPoint : function(imageData, index, p) {
                imageData.data[index + 0] = p[0];
                imageData.data[index + 1] = p[1];
                imageData.data[index + 2] = p[2];
                imageData.data[index + 3] = PICBIT.config.alphaValue;
            },

            /**
             * Show current palette.
             */
            showPalette : function() {
                var html = '';
                var count = PICBIT.config.state.selectedPalette.length;
                var width = (100 / count).toFixed(2);
                var sortedPalette = PICBIT.process.helpers.sortColors(PICBIT.config.state.selectedPalette);
                
                for (var i = 0; i < count; i++)
                {
                    var color = sortedPalette[i];
                    var hexColor = PICBIT.process.helpers.rgb2Hex(color);
                    html += '<span class="color" style="background: ' + hexColor + '; width: ' + width + '%" title="' + hexColor + '"></span>';
                }

                $(PICBIT.config.paletteListElement).html(html);
            },

            /**
             * Convert a color from RGB to LAB color space.
             *
             * Source: http://stackoverflow.com/a/8433985
             */
            rgb2lab : function(rgbColor) {
                var r = rgbColor[0] / 255.0;
                var g = rgbColor[1] / 255.0;
                var b = rgbColor[2] / 255.0;

                r = (r > 0.04045 ? Math.pow(((r + 0.055) / 1.055), 2.4) : r / 12.92) * 100.;
                g = (g > 0.04045 ? Math.pow(((g + 0.055) / 1.055), 2.4) : g / 12.92) * 100.;
                b = (b > 0.04045 ? Math.pow(((b + 0.055) / 1.055), 2.4) : b / 12.92) * 100.;

                var x = ((r * 0.4124) + (g * 0.3576) + (b * 0.1805)) / 95.047;
                var y = ((r * 0.2126) + (g * 0.7152) + (b * 0.0722)) / 100.000;
                var z = ((r * 0.0193) + (g * 0.1192) + (b * 0.9505)) / 108.883;

                x = x > 0.008856 ? Math.pow(x, 1. / 3.) : (7.787 * x) + (16. / 116.);
                y = y > 0.008856 ? Math.pow(y, 1. / 3.) : (7.787 * y) + (16. / 116.);
                z = z > 0.008856 ? Math.pow(z, 1. / 3.) : (7.787 * z) + (16. / 116.);

                return [
                    (116. * y) - 16., // l
                    500. * (x - y), // a
                    200. * (y - z), // b
                ];
            },

            /**
             * Convert a color from RGB to Hex format.
             */
            rgb2Hex : function(rgbColor) {
                var hexR = rgbColor[0].toString(16).toUpperCase();
                var hexG = rgbColor[1].toString(16).toUpperCase();
                var hexB = rgbColor[2].toString(16).toUpperCase();
                return '#' +
                    (hexR.length == 1 ? '0' + hexR : hexR) +
                    (hexG.length == 1 ? '0' + hexG : hexG) +
                    (hexB.length == 1 ? '0' + hexB : hexB);
            },

            rgb2hsv : function(rgbColor, add) {
                add = add || false;

                // Get the RGB values to calculate the Hue.
                var r = rgbColor[0];
                var g = rgbColor[1];
                var b = rgbColor[2];

                // Getting the Max and Min values for Chroma.
                var max = Math.max.apply(Math, rgbColor);
                var min = Math.min.apply(Math, rgbColor);

                // Variables for HSV value of hex color.
                var chr = max - min;
                var hue = 0;
                var val = max;
                var sat = 0;

                if (val > 0)
                {
                    // Calculate Saturation only if Value isn't 0.
                    sat = chr / val;

                    if (sat > 0)
                    {
                        if (r == max)
                        {
                            hue = 60 * (((g - min) - (b - min)) / chr);
                            if (hue < 0)
                                hue += 360;
                        }
                        else if (g == max)
                        {
                            hue = 120 + 60 * (((b - min) - (r - min)) / chr);
                        }
                        else if (b == max)
                        {
                            hue = 240 + 60 * (((r - min) - (g - min)) / chr);
                        }
                    }
                }

                if (add)
                {
                    rgbColor[3] = hue;
                    rgbColor[4] = sat;
                    rgbColor[5] = val;

                    return rgbColor;
                }
                else
                {
                    return [hue, sat, val];
                }
            },

            sortColors : function(colors) {
                for(var i = 0; i < colors.length; i++)
                    colors[i] = PICBIT.process.helpers.rgb2hsv(colors[i], true);

                colors.sort(function(a, b) {
                    return a[3] - b[3]; // Sort by hue;
                });

                var sortedColors = [];
                for(var i = 0; i < colors.length; i++)
                {
                    sortedColors[i] = [colors[i][0], colors[i][1], colors[i][2]];
                }

                return sortedColors;
            }
        }
    }

};
