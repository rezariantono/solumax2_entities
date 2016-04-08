<?php

Route::group(['prefix' => 'api', 'namespace' => 'Api', 'middleware' => ['wala.jwt.header.parser', 'wala.jwt.header.validation', 'entity_base.tenant_data']], function() {
    
    Route::group(['prefix' => 'entity'], function() {
        
        Route::get('/', ['uses' => 'EntityController@index']);
        Route::get('{id}', ['uses' => 'EntityController@get']);
        Route::post('/', ['uses' => 'EntityController@store', 'middleware' => 'auth.jwt_tumr:CREATE_CONTACT']);
        Route::post('{id}', ['uses' => 'EntityController@update', 'middleware' => 'auth.jwt_tumr:UPDATE_CONTACT']);
    });
});