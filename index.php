<?php require_once('private/include.php'); ?>
<!DOCTYPE HTML>
<html>
<head>
    <title><?php echo $config->getProjectName(); ?></title>

    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="description" content="<?php echo $config->getProjectDescription(); ?>"/>
    <meta name="keywords" content="<?php echo $tags; ?>"/>
    <meta name="author" content="pmav"/>

    <link type="text/css" href="assets/css/style.css" rel="stylesheet">

    <!-- Picbit -->
    <link type="text/css" href="picbit-assets/picbit.css" rel="stylesheet">

    <script src="picbit-assets/jquery-2.1.3.min.js"></script>
    <script src="picbit-assets/picbit.js"></script>
</head>
<body>

<div id="wrapper">
    <div id="header">
        <h1><a href="."><?php echo $config->getProjectName(); ?></a></h1>
    </div>

    <div id="main">

        <div class="box">
            <h2>What is?</h2>

            <p>Picbit is a javascript image processing experiment. This can be used to give you some ideas on how to use the HTML 5 Canvas element to process images in real time and run basic filters.</p>

            <p>All the processing being made is pixel oriented and no frameworks are used, except jQuery for basic manipulation of UI elements.</p>
        </div>

        <div class="box">

            <div id="canvas-container">
                <img id="original-image" src="test-images/01.png" />
                
                <img id="export-image" />
                <canvas id="canvas"></canvas>
            </div>

            <div id="controls">
                <div class="form">
                    <span title="Size of pixels after processing, 4x4px means that a square with 16 pixels in the original image are transformed into one.">Pixel Size</span>&nbsp;
                    <select id="select-pixel-size">
                        <option value="1">1x1px</option>
                        <option value="2">2x2px</option>
                        <option value="4" selected="selected">4x4px</option>
                        <option value="8">8x8px</option>
                        <option value="12">12x12px</option>
                    </select>
                </div>
<br>
                <div class="form">
                    <span title="Function to select a color from the pixels to aggregate. E.G.: Average will get the average color from each 16 pixels in the original image.">Pixel Aggregation</span>&nbsp;
                    <select id="select-pixel-aggregation-method">
                        <option value="1" selected="selected">Average</option>
                        <option value="2">Lighter</option>
                        <option value="3">Darker</option>
                        <option value="4">First Pixel</option>
                        <option value="5">Last Pixel</option>
                    </select>
                </div>
<br>
                <div class="form">
                    <span title="xx">Palette</span>&nbsp;
                    <select id="select-palette">
                        <optgroup label="2 Colors">
                        <option value="blackAndWhite">Black &amp; White</option>

                        <optgroup label="4 Colors">
                        <option value="cga">CGA</option>
                        <option value="gameBoy">Game Boy</option>

                        <optgroup label="8 Colors">
                        <option value="teletext">Teletext</option>

                        <optgroup label="16 Colors">
                        <option value="appleII" selected="selected">Apple II</option>
                        <option value="ega">EGA</option>
                        <option value="msWindows">MS Windows</option>
                        
                        <optgroup label="Original">
                        <option value="original16">16 Colors</option>
                    </select>
                </div>
<br>
                <div class="form">
                    <span title="xx">Color Selection</span>&nbsp;
                    <select id="select-color-selection">
                        <option value="1" selected="selected">Euclidean</option>
                        <option value="2">CIE76</option>
                        <option value="3">CIE94</option>
                    </select>
                </div>
            </div>

            <div id="drop-zone">
                Drop and image here!
            </div>

            <div class="cl"></div>
        </div>

        <div class="box">
            <h2>Source Code</h2>
            Source code is online at <a href="http://github.com/pmav/picbit">http://github.com/pmav/picbit</a>.
        </div>

        <div class="box">
            <h2>Feedback</h2>
            All feedback is welcome: pedrovam@gmail.com or <a href="http://twitter.com/pmav">@pmav</a>.
        </div>

    </div>
    <div id="footer"><?php echo $config->getProjectName(); ?> | <?php echo $config->getProjectVersion(); ?>  | <a href="http://pmav.eu">pmav.eu</a> | <?php echo $config->getProjectDate(); ?> | HTML 5 | This work is licensed under a <a rel="license" href="assets/LICENSE">MIT License</a>.
    </div>
</div>

<a href="https://github.com/pmav/picbit"><img style="position: absolute; top: 0; right: 0; border: 0;" src="https://camo.githubusercontent.com/38ef81f8aca64bb9a64448d0d70f1308ef5341ab/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f6461726b626c75655f3132313632312e706e67" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png"></a>

</body>
</html>
