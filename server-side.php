<?php

  //get data pushed
  $studyid=$_POST['put-studyid-here'];
  $sscode=$_POST['put-sscode-here'];
  $data=$_POST['put-data-here'];

// write data to file
    file_put_contents('data/' . $studyid . '-' . $sscode . '-data.txt', $data, FILE_APPEND);

// write ss code to list
    file_put_contents('data/data-submit-list.txt', $sscode . PHP_EOL, FILE_APPEND);

//direct to questionnaires
    header('Location: feedback-letter.html');
    exit;
?>

