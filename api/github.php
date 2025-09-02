<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$username = '0xProfound';

// GitHub API endpoints
$endpoints = [
    'user' => "https://api.github.com/users/{$username}",
    'repos' => "https://api.github.com/users/{$username}/repos?sort=updated&per_page=100",
    'events' => "https://api.github.com/users/{$username}/events?per_page=30"
];

// Initialize cURL multi handle
$mh = curl_multi_init();
$handles = [];

// Create requests for each endpoint
foreach ($endpoints as $key => $url) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_USERAGENT, '0xProfound-Portfolio');
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Accept: application/vnd.github.v3+json'
    ]);
    
    curl_multi_add_handle($mh, $ch);
    $handles[$key] = $ch;
}

// Execute all requests simultaneously
$running = null;
do {
    curl_multi_exec($mh, $running);
} while ($running);

// Process responses
$responses = [];
foreach ($handles as $key => $ch) {
    $response = curl_multi_getcontent($ch);
    $responses[$key] = json_decode($response, true);
    curl_multi_remove_handle($mh, $ch);
    curl_close($ch);
}

curl_multi_close($mh);

// Process user data
$userData = $responses['user'];
$user = [
    'username' => $userData['login'],
    'name' => $userData['name'] ?? $userData['login'],
    'avatar' => $userData['avatar_url'],
    'bio' => $userData['bio'],
    'followers' => $userData['followers'],
    'following' => $userData['following'],
    'public_repos' => $userData['public_repos'],
    'public_gists' => $userData['public_gists'],
    'profile_url' => $userData['html_url'],
    'created_at' => $userData['created_at']
];

// Process repositories
$repos = [];
foreach ($responses['repos'] as $repo) {
    // Skip forks if desired
    // if ($repo['fork']) continue;
    
    $repos[] = [
        'name' => $repo['name'],
        'description' => $repo['description'],
        'url' => $repo['html_url'],
        'language' => $repo['language'],
        'stars' => $repo['stargazers_count'],
        'forks' => $repo['forks_count'],
        'watchers' => $repo['watchers_count'],
        'size' => $repo['size'],
        'created_at' => $repo['created_at'],
        'updated_at' => $repo['updated_at'],
        'pushed_at' => $repo['pushed_at'],
        'is_fork' => $repo['fork']
    ];
}

// Process recent activity
$activity = [];
foreach ($responses['events'] as $event) {
    $activity[] = [
        'type' => $event['type'],
        'repo' => $event['repo']['name'],
        'created_at' => $event['created_at'],
        'payload' => $event['payload']
    ];
}

// Prepare final response
$result = [
    'user' => $user,
    'repositories' => $repos,
    'recent_activity' => $activity,
    'last_updated' => date('c')
];

echo json_encode($result, JSON_PRETTY_PRINT);
?>
