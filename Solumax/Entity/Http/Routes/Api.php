<?php

$middlewares = ['auth.jwt_key_modifier', 'wala.jwt.header.parser', 'wala.jwt.header.validation',
    'auth.db.groupOverwrite'];

Route::group(['prefix' => 'api', 'namespace' => 'Api', 'middleware' => $middlewares], function() {
    
    Route::group(['prefix' => 'entity'], function() {
        
        Route::get('/', ['uses' => 'EntityController@index']);
        Route::get('{id}', ['uses' => 'EntityController@get']);
        
        Route::post('/', ['uses' => 'EntityController@store', 'middleware' => 'auth.jwt_tumr:CREATE_CONTACT']);
        
        Route::post('edit-lock/{id}', ['uses' => 'EntityController@updateEditLock', 'middleware' => 'auth.jwt_tumr:UPDATE_EDIT_LOCK']);
        Route::post('request-delete/{id}', ['uses' => 'EntityController@updateRequestDelete', 'middleware' => 'auth.jwt_tumr:UPDATE_CONTACT']);
        
        Route::post('{id}', ['uses' => 'EntityController@update', 'middleware' => 'auth.jwt_tumr:UPDATE_CONTACT']);
        
        Route::delete('{id}', ['uses' => 'EntityController@delete', 'middleware' => 'auth.jwt_tumr:DELETE_CONTACT']);
        
    });
});