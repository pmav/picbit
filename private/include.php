<?php

require_once(dirname(__FILE__).'/Config.class.php');

try {
  $config = new Config(dirname(__FILE__).'/config.xml');

  $tagList = $config->getProjectTags();

  $tags = '';
  foreach ($tagList as $tag) {
    $tags .= $tag . ', ';
  }

  $tags = rtrim($tags, ', ');

} catch (Exception $e) {
  echo $e->getMessage();
  exit;
}

?>
