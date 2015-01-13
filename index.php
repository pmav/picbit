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

            <div class="form">
                <span title="xx">Pixel Size</span>&nbsp;
                <select id="select-pixel-size">
                    <option value="1">1px</option>
                    <option value="2">2px</option>
                    <option value="4" selected="selected">4px</option>
                    <option value="8">8px</option>
                    <option value="12">12px</option>
                </select>
            </div>

            <div class="form">
                <span title="xx">Palette</span>&nbsp;
                <select id="select-palette">
                    <option value="blackAndWhite">Black &amp; White</option>
                    <option value="gameBoy">Game Boy</option>
                    <option value="teletext">Teletext</option>
                    <option value="cga">CGA</option>
                    <option value="ega" selected="selected">EGA</option>
                    <option value="msWindows">MS Windows</option>
                    <option value="appleII">Apple II</option>
                    
                    <option value="original16">Original (16)</option>
                </select>
            </div>

            <div class="form">
                <span title="xx">Pixel Aggregation</span>&nbsp;
                <select id="select-pixel-aggregation-method">
                    <option value="1" selected="selected">Average</option>
                    <option value="2">Lighter</option>
                    <option value="3">Darker</option>
                </select>
            </div>

            <div class="form">
                <span title="xx">Color Selection</span>&nbsp;
                <select id="select-color-selection">
                    <option value="1" selected="selected">Euclidean</option>
                    <option value="2">CIE76</option>
                    <option value="3">CIE94</option>
                </select>
            </div>

            <div id="drop-zone">
                Drop and image here!
            </div>
        </div>

        <div class="remove" style="border: 1px dashed red;">
            <button id="draw">Draw</button>
            <button id="draw">Random</button>
            <span id="time"></span>
            <div id="palette"></div>
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
    <div id="footer"><?php echo $config->getProjectName(); ?> | <a href="http://pmav.eu">pmav.eu</a>
        | <?php echo $config->getProjectDate(); ?> | HTML 5 | This work is licensed under a <a rel="license" href="assets/LICENSE">MIT License</a>.
    </div>
</div>

</body>
</html>
