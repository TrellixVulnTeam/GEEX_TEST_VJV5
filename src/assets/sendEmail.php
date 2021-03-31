<?php

// My email
$hellodimianni = 'dmytro.anikin@gmail.com';

if ($_POST) {

    $name = trim(stripslashes($_POST['Name']));
    $email = trim(stripslashes($_POST['Email']));
    $contact_message = trim(stripslashes($_POST['Message']));

    // Check Name
    if (strlen($name) < 2 or !ctype_alpha($name)) {
        $error['name'] = "Name";
    }

    // Check Email
    if (!preg_match('/^[a-z0-9&\'\.\-_\+]+@[a-z0-9\-]+\.([a-z0-9\-]+\.)*+[a-z]{2}/is', $email)) {
        $error['email'] = "Email";
    }

    // Check Message
    // if (strlen($message) < 15) {
    //     $error['message'] = "Please, provide more information.";
    // }

    // Subject
    $subject = "Contact Form Submission";

    // Set Message
    // $message .= "<br /> ----- <br /> Пользователь связался с нами. <br />";
    $message .= "Email from: " . $name . " ";
    $message .= "Email address: " . $email . " ";
    $message .= "Message:" . $contact_message . " ";

    $txtnew = strval($message);


    // Set From: header
    $from = $name . " <" . $email . ">";

    // Email Headers
    $headers = "From: " . $from . "\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=utf-8\r\n";

    /* https://api.telegram.org/bot1641714069:AAFt4RiM9lbXpGd1WnZResjcA0nBx2NRZ7Q/getUpdates */

    $token = "1641714069:AAFt4RiM9lbXpGd1WnZResjcA0nBx2NRZ7Q";
    $chat_id = "-539216796";



    if (!$error) {

        ini_set("sendmail_from", $hellodimianni); // for windows server
        $mail = mail($hellodimianni, $subject, $message, $headers);

        $sendToTelegram = fopen("https://api.telegram.org/bot{$token}/sendMessage?chat_id={$chat_id}&parse_mode=html&text={$txtnew}", "r");

        if ($mail && $sendToTelegram) {echo "OK";} else {echo "Something went wrong. Please try again.";}


        // if ($sendToTelegram) {
        //     echo "OK";
        // } else {
        //     echo $txtnew;
        // }

    } # end if - no validation error

    else {

        $response = (isset($error['name'])) ? $error['name'] . "<br /> \n" : null;
        $response .= (isset($error['email'])) ? $error['email'] . "<br /> \n" : null;
        // $response .= (isset($error['message'])) ? $error['message'] . "<br />" : null;

        echo $response;

    } # end if - there was a validation error

}
