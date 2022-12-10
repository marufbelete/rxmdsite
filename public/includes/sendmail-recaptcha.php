<?php

/*
+-----------------------------------------------------+
| GOOGLE  YOUR PUBLIC AND PRIVATE KEY        |
| You can collect public and secret key from here:    |
| https://www.google.com//admin              |
+-----------------------------------------------------+
*/
$_secretkey = "6Ldkpm0jAAAAAFp40P-xYLSBQyTMLzBn21EWXTI8";

// GOOGLE  Validation Check
ini_set('display_errors',1);  error_reporting(E_ALL);


$message = "";
$status = "false";

if( isset( $_POST['submit'] ) ) {
    $userIP = $_SERVER["REMOTE_ADDR"];
    $Response = $_POST['g--response'];
    $secretKey = $_secretkey;
    $request = file_get_contents("https://www.google.com//api/siteverify?secret={$secretKey}&response={$Response}&remoteip={$userIP}");

    if( !strstr( $request, "true" ) ) {
        $message = '<strong>Error!</strong>There was a problem with the Captcha, you lied to us! you are a robot! or you just didnt click it :)';
        $status = "false";
    } else {
        require_once('phpmailer/class.phpmailer.php');
        require_once('phpmailer/class.smtp.php');

        $mail = new PHPMailer();


        //$mail->SMTPDebug = 3;                               // Enable verbose debug output
        $mail->isSMTP();                                      // Set mailer to use SMTP
        $mail->Host = 'just55.justhost.com';                  // Specify main and backup SMTP servers
        $mail->SMTPAuth = true;                               // Enable SMTP authentication
        $mail->Username = 'themeforest@ismail-hossain.me';    // SMTP username
        $mail->Password = 'AsDf12**';                         // SMTP password
        $mail->SMTPSecure = 'ssl';                            // Enable TLS encryption, `ssl` also accepted
        $mail->Port = 465;                                    // TCP port to connect to


        if( $_SERVER['REQUEST_METHOD'] == 'POST' ) {
            if( $_POST['form_name'] != '' AND $_POST['form_email'] != '' AND $_POST['form_subject'] != '' ) {

                $name = $_POST['form_name'];
                $email = $_POST['form_email'];
                $subject = $_POST['form_subject'];
                $phone = $_POST['form_phone'];
                $message = $_POST['form_message'];

                $subject = isset($subject) ? $subject : 'New Message | Contact Form';

                $botcheck = $_POST['form_botcheck'];

                $toemail = 'info@testrxmd.com'; // Your Email Address
                $toname = 'TestRxMD'; // Your Name

                if( $botcheck == '' ) {

                    $mail->SetFrom( $toemail , $toname );
                    $mail->AddReplyTo( $email , $name );
                    $mail->AddAddress( $toemail , $toname );
                    $mail->Subject = $subject;

                    $name = isset($name) ? "Name: $name<br><br>" : '';
                    $email = isset($email) ? "Email: $email<br><br>" : '';
                    $phone = isset($phone) ? "Phone: $phone<br><br>" : '';
                    $message = isset($message) ? "Message: $message<br><br>" : '';

                    $referrer = $_SERVER['HTTP_REFERER'] ? '<br><br><br>This Form was submitted from: ' . $_SERVER['HTTP_REFERER'] : '';

                    $body = "$name $email $phone $message $referrer";

                    $mail->MsgHTML( $body );
                    $sendEmail = $mail->Send();

                    if( $sendEmail == true ):
                        $message = 'We have <strong>successfully</strong> received your Message and will get Back to you as soon as possible.';
                        $status = "true";
                    else:
                        $message = 'Email <strong>could not</strong> be sent due to some Unexpected Error. Please Try Again later.<br /><br /><strong>Reason:</strong><br />' . $mail->ErrorInfo . '';
                        $status = "false";
                    endif;
                } else {
                    $message = 'Bot <strong>Detected</strong>.! Clean yourself Botster.!';
                    $status = "false";
                }
            } else {
                $message = 'Please <strong>Fill up</strong> all the Fields and Try Again.';
                $status = "false";
            }
        } else {
            $message = 'An <strong>unexpected error</strong> occured. Please Try Again later.';
            $status = "false";
        }
    }
    $status_array = array( 'message' => $message, 'status' => $status);
    echo json_encode($status_array);
}
?>
