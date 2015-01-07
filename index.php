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

            <p>Picbit is an ...</p>

        </div>

        <div class="box">

            <div id="canvas-container">
                <img id="export-image" />
                <canvas id="c" style="display:none"></canvas>
            </div>

            <div id="drop-zone">Drop an image here</div>
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

<script
    type="text/javascript">var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
    document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));</script>
<script type="text/javascript">try {
        var pageTracker = _gat._getTracker("UA-284702-17");
        pageTracker._trackPageview();
    } catch (err) {
    }</script>
</body>
</html>
