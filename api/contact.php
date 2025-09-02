<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validate input
    if (!isset($input['name']) || !isset($input['email']) || !isset($input['message'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required fields']);
        exit;
    }
    
    // Sanitize input
    $name = filter_var($input['name'], FILTER_SANITIZE_STRING);
    $email = filter_var($input['email'], FILTER_SANITIZE_EMAIL);
    $message = filter_var($input['message'], FILTER_SANITIZE_STRING);
    $subject = isset($input['subject']) ? filter_var($input['subject'], FILTER_SANITIZE_STRING) : 'New message from portfolio contact form';
    
    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid email address']);
        exit;
    }
    
    // Email configuration (adjust these values)
    $to = '0xprofound@protonmail.com';
    $headers = [
        'From' => $email,
        'Reply-To' => $email,
        'X-Mailer' => 'PHP/' . phpversion(),
        'Content-type' => 'text/plain; charset=utf-8'
    ];
    
    // Prepare email content
    $email_content = "Name: $name\n";
    $email_content .= "Email: $email\n\n";
    $email_content .= "Message:\n$message\n";
    
    // Send email
    if (mail($to, $subject, $email_content, $headers)) {
        // Log the message (optional)
        $log_data = [
            'timestamp' => date('c'),
            'name' => $name,
            'email' => $email,
            'subject' => $subject,
            'message' => $message,
            'ip' => $_SERVER['REMOTE_ADDR'],
            'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown'
        ];
        
        file_put_contents('contact_log.json', json_encode($log_data, JSON_PRETTY_PRINT) . "\n", FILE_APPEND | LOCK_EX);
        
        // Return success response
        echo json_encode([
            'success' => true,
            'message' => 'Your message has been sent successfully!'
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to send message. Please try again later.']);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>
