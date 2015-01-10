
$(document).ready(function() {
    PICBIT.main();
    PICBIT.loadInitialImage();
});

var PICBIT = {

    config : {
        /**
         *
         */
        initialImageElement : '#initial-image',

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
        palette : {
            blackAndWhite : [
                [0,     0,   0],
                [255, 255, 255]
            ],

            gameBoy : [
                [17,   56, 17],
                [50,   98, 50],
                [139, 171, 36],
                [155, 187, 39]
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
    },

    loadInitialImage : function() {
        var img = $(PICBIT.config.initialImageElement).get(0);
        img.onload = function() {
            PICBIT.transform.main1(img);
        }
    },

    handlers : {

        dragEnter : function(e) {
            e.preventDefault();
            $('#drop-zone').addClass('drop-zone-hover'); // TODO Move ref.
            //$('#drop-zone').text('Drop your image!');
            return false;
        },

        dragExit : function(e) {
            e.preventDefault();
            $('#drop-zone').removeClass('drop-zone-hover'); // TODO Move ref.
            //$('#drop-zone').text('');
            return false;
        },

        dragOver : function(e) {
            e.preventDefault();
            return false;
        },

        dragDrop : function(e) {
            e.preventDefault();

            $('#drop-zone').removeClass('drop-zone-hover'); // TODO Move ref.
            //$('#drop-zone').text('');

            var files = e.originalEvent.dataTransfer.files;
            
            for (var i = 0; i < files.length; i++) {
                var file = files[i];

                var reader = new FileReader();
                $(reader).on('loadend', PICBIT.handlers.loadEnd);
                reader.readAsDataURL(file);

                break; // Only read the first file.
            }

            return false;
        },

        loadEnd : function(e, file) {
            var img = document.createElement('img');
            img.src = this.result;
            img.onload = function() {
                PICBIT.transform.main1(img);
            }

            var img1 = $(PICBIT.config.initialImageElement).get(0);
            img1.src = this.result;
        },

        redraw : function() {
            PICBIT.config.pixelSize = parseInt($('#select-pixel-size').val(), 10);
            PICBIT.config.pixelAggregationMethod = parseInt($('#select-pixel-aggregation-method').val(), 10);

            var img = $(PICBIT.config.initialImageElement).get(0);
            PICBIT.transform.main1(img);
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

        getCloserColor : function(p)
        {
            var closerColor, closerColorDistance = Number.MAX_VALUE;

            var palette = PICBIT.config.palette.gameBoy;

            for (var i = 0; i < palette.length; i++)
            {
                var currentColorDistance = this.distance(p, palette[i]);
                
                if (currentColorDistance < closerColorDistance)
                {
                    closerColorDistance = currentColorDistance;
                    closerColor = palette[i];
                }
            }

            return [closerColor[0], closerColor[1], closerColor[2], 255];
        },

        distance : function(p1, p2)
        {
            var r = Math.pow(p2[0] - p1[0], 2);
            var g = Math.pow(p2[1] - p1[1], 2);
            var b = Math.pow(p2[2] - p1[2], 2);

            return Math.sqrt(r + g + b);
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
        }
    }
};
