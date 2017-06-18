<?php

$middlewares = ['auth.jwtKeyChangerByModule', 'wala.jwt.header.parser', 'wala.jwt.header.validation',
    'auth.db.groupOverwrite'];

Route::group(['prefix' => 'api', 'namespace' => 'Api'], function() use ($middlewares) {

    Route::group(['prefix' => 'area'], function() {
        Route::get('/', ['uses' => 'AreaController@index']);
        Route::get('kelurahan', ['uses' => 'AreaController@kelurahan']);
    });

    Route::group(['middleware' => $middlewares], function() {

        Route::group(['prefix' => 'entity'], function() {

            Route::get('/', ['uses' => 'EntityController@index']);
            Route::get('{id}', ['uses' => 'EntityController@get']);

            Route::post('/', ['uses' => 'EntityController@store', 'middleware' => 'auth.jwt_tumr:CREATE_CONTACT']);

            Route::post('edit-lock/{id}', ['uses' => 'EntityController@updateEditLock', 'middleware' => 'auth.jwt_tumr:UPDATE_EDIT_LOCK']);
            Route::post('request-delete/{id}', ['uses' => 'EntityController@updateRequestDelete', 'middleware' => 'auth.jwt_tumr:UPDATE_CONTACT']);

            Route::post('{id}', ['uses' => 'EntityController@update', 'middleware' => 'auth.jwt_tumr:UPDATE_CONTACT']);

            Route::delete('{id}', ['uses' => 'EntityController@delete', 'middleware' => 'auth.jwt_tumr:DELETE_CONTACT']);
        });

        Route::group(['prefix' => 'relationship'], function() {

            Route::get('/', ['uses' => 'RelationshipController@index']);
            Route::get('{id}', ['uses' => 'RelationshipController@get']);
            Route::post('/', ['uses' => 'RelationshipController@store', 'middleware' => 'auth.jwt_tumr:WRITE_RELATIONSHIP']);
            Route::post('{id}', ['uses' => 'RelationshipController@update', 'middleware' => 'auth.jwt_tumr:WRITE_RELATIONSHIP']);
        });

        Route::group(['prefix' => 'entity-relationship'], function() {

            Route::get('/', ['uses' => 'EntityRelationshipController@index']);
            Route::post('/', ['uses' => 'EntityRelationshipController@store', 'middleware' => 'auth.jwt_tumr:UPDATE_CONTACT']);
            Route::delete('/', ['uses' => 'EntityRelationshipController@delete', 'middleware' => 'auth.jwt_tumr:UPDATE_CONTACT']);
        });
    });
});

