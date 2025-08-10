<?php
// contact.php — simple mail handler with basic validation and honeypot
header('Content-Type: application/json');

// Allow only POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['success' => false, 'message' => 'Method not allowed']);
  exit;
}

// Honeypot
if (!empty($_POST['website'])) {
  echo json_encode(['success' => true, 'message' => 'OK']);
  exit;
}

// Sanitize
$name    = trim(filter_input(INPUT_POST, 'name', FILTER_SANITIZE_FULL_SPECIAL_CHARS));
$email   = trim(filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL));
$message = trim(filter_input(INPUT_POST, 'message', FILTER_SANITIZE_FULL_SPECIAL_CHARS));

// Validate
if (empty($name) || empty($email) || empty($message)) {
  echo json_encode(['success' => false, 'message' => 'Please complete all fields.']);
  exit;
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  echo json_encode(['success' => false, 'message' => 'Please provide a valid email.']);
  exit;
}

// Injection guard
$pattern = "/(content-type|bcc:|cc:|to:)/i";
if (preg_match($pattern, $name) || preg_match($pattern, $email)) {
  echo json_encode(['success' => false, 'message' => 'Invalid input.']);
  exit;
}

// Configure
$to       = 'prasenjit9619@gmail.com'; // set to your address
$subject  = "New message from {$name} (website)";
$body     = "Name: {$name}\nEmail: {$email}\n\nMessage:\n{$message}\n";
$headers  = "From: {$name} <{$email}>\r\n";
$headers .= "Reply-To: {$email}\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Send
$sent = @mail($to, $subject, $body, $headers);

if ($sent) {
  echo json_encode(['success' => true, 'message' => 'Message sent']);
} else {
  http_response_code(500);
  echo json_encode(['success' => false, 'message' => 'Email failed to send. Please try later.']);
}
