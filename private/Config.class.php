<?php

class Config {

  private $configFilePath;

  private $projectName;
  private $projectDate;
  private $projectDescription;
  private $projectTags;

  function __construct($configFilePath) {
    $this->configFilePath = $configFilePath;

    $this->loadConfig();
  }


  private function loadConfig() {

    $xml = @simplexml_load_file($this->configFilePath);

    if ($xml === false) {
      throw new Exception('Config::loadConfig() - unable to load "'.$this->configFilePath.'"');
    }

    foreach ($xml->children() as $child) {

      if ($child->getName() === 'name') {
        $this->projectName = $child;
      } else if ($child->getName() === 'date') {
          $this->projectDate = $child;
        } else if ($child->getName() === 'description') {
            $this->projectDescription = $child;
          } else if ($child->getName() === 'tags') {
              $this->projectTags = array();
              foreach ($child as $tag) {
                $this->projectTags[] = $tag;
              }
            }
    }
  }

  public function getProjectName() {
    return $this->projectName;
  }

  public function getProjectDate() {
    return $this->projectDate;
  }

  public function getProjectDescription() {
    return $this->projectDescription;
  }

  public function getProjectTags() {
    return $this->projectTags;
  }

}
?>
