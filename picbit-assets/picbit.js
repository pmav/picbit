
$(document).ready(function() {
    PICBIT.main();
});

var palette2 = [ [0, 0, 0, 255], [255, 255, 255, 255] ];

var palette = [
    [17, 56, 17],
    [50, 98, 50],
    [139, 171, 36],
    [155, 187, 39]
];

var PICBIT = {

    constants : {
        dropZoneElement : '#drop-zone',
        dropZoneHoverClass : '.drop-zone-hover',

        maxImageSize : 786,
        pixelSize : 4
    },

    main : function() {
        if(window.FileReader) {
            var e = $('#drop-zone'); // TODO Move ref.
            e.on('dragenter', PICBIT.handlers.dragEnterExit);
            e.on('dragexit', PICBIT.handlers.dragEnterExit);
            e.on('dragover', PICBIT.handlers.dragOver);
            e.on('drop', PICBIT.handlers.dragDrop);
        }
    },

    handlers : {

        dragEnterExit : function(e) {
            e.preventDefault();
            $('#drop-zone').toggleClass('drop-zone-hover'); // TODO Move ref.
            return false;
        },

        dragOver : function(e) {
            e.preventDefault();
            return false;
        },

        dragDrop : function(e) {
            e.preventDefault();

            $('#drop-zone').toggleClass('drop-zone-hover'); // TODO Move ref.
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
            
            img.onload = function()
            {
                var newW = img.width;
                var newH = img.height;
                
                // Resize image, if needed.

                var s = PICBIT.constants.maxImageSize;

                if (newW > s)
                {
                    newW = s;
                    newH = Math.ceil(img.height * (newW / img.width)); // Ajust height.
                }

                if (newH > s)
                {
                    newH = s;
                    newW = Math.ceil(img.width * (newH / img.height)); // Ajust width.
                }

                // Crop image to be a multiple of step.

                newW = newW - (newW % PICBIT.constants.pixelSize);
                newH = newH - (newH % PICBIT.constants.pixelSize);

                // Set loaded image.

                var canvas = document.getElementById('c'); // TODO Ref.
                var context = canvas.getContext('2d');
                context.canvas.width = newW;
                context.canvas.height = newH;
                context.drawImage(img, 0, 0, newW, newH);

                PICBIT.transform.main(img, context);
            }
        }
    },

    transform : {
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
            var step = PICBIT.constants.pixelSize;

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

            return this.getCloserColor([r, g, b, 255]);
        },

        getCloserColor : function(p)
        {
            var closerColor, closerColorDistance = Number.MAX_VALUE;

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



