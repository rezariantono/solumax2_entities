<?php

$middlewares = ['auth.jwtKeyChangerByModule', 'wala.jwt.autoParse.parser', 'wala.jwt.autoParse.validation',
    'auth.db.groupOverwrite'];

Route::group(['prefix' => 'report', 'namespace' => 'Report', 'middleware' => $middlewares], function() use ($middlewares) {

    Route::group(['prefix' => 'entity'], function() {
        Route::get('/', ['uses' => 'EntityController@index', 'middleware' => 'auth.jwt_tumr:VIEW_CONTACT']);
    });
});

