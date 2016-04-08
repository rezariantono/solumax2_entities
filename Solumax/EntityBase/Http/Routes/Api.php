<?php

Route::group(['prefix' => 'api', 'namespace' => 'Api', 'middleware' => ['wala.jwt.header.parser', 'wala.jwt.header.validation']], function() {
    
    Route::group(['prefix' => 'tenant-data'], function() {
        
        Route::get('/', ['uses' => 'TenantDataController@index']);
        Route::post('/', ['uses' => 'TenantDataController@store']);
    });
});