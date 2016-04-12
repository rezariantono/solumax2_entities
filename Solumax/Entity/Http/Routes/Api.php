<?php

$middlewares = ['wala.jwt.header.parser', 'wala.jwt.header.validation',
    'multi_tenants.group_database_overwriter_by_jwt'];

Route::group(['prefix' => 'api', 'namespace' => 'Api', 'middleware' => $middlewares], function() {
    
    Route::group(['prefix' => 'entity'], function() {
        
        Route::get('/', ['uses' => 'EntityController@index']);
        Route::get('{id}', ['uses' => 'EntityController@get']);
        Route::post('/', ['uses' => 'EntityController@store', 'middleware' => 'auth.jwt_tumr:CREATE_CONTACT']);
        Route::post('{id}', ['uses' => 'EntityController@update', 'middleware' => 'auth.jwt_tumr:UPDATE_CONTACT']);
    });
});