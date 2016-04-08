<?php

return [
    
    'use_auth_client_user' => true,
    
    'tenant_id' => '',
    
    'module_id' => '10777',
    
    'url' => [
        
        'base_server_domain' => env('BASE_SERVER_DOMAIN'),
        
        'module_role' => env('BASE_SERVER_DOMAIN') . 'api-auth/module-role/',
        'tumr' => env('BASE_SERVER_DOMAIN') . 'api-auth/tumr/',
        
        'login' => env('BASE_SERVER_DOMAIN') . 'base/user/authentication/login',
    ]
];