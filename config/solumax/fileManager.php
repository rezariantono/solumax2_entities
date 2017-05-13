<?php

return [
    
    'middleware' => [
        'replacement' => ['auth.jwtKeyChangerByModule', 'wala.jwt.header.parser',
            'wala.jwt.header.validation', 'auth.db.groupOverwrite'],
        'additional' => []
    ],
    
    'aws' => [
        'region' => env('AWS_REGION'),
        'bucket' => env('AWS_S3_BUCKET'),
        'key' => env('AWS_KEY'),
        'secret' => env('AWS_SECRET'),
    ],
    
    'b2' => [
        'bucket_name' => env('B2_BUCKET_NAME'),
        'bucket_id' => env('B2_BUCKET_ID'),
        'account_id' => env('B2_ACCOUNT_ID'),
        'application_key' => env('B2_APPLICATION_KEY'),
    ],
    
    'storage_type' => 'S3'
];
