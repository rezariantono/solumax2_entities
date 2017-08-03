<?php

Route::group(['prefix' => 'plugins', 'middleware' => 'cors'], function() {
    Route::get('v2/files/{file}', function($file) {
        return response(file_get_contents(public_path('plugins/v2/' . $file)));
    });
});

Route::group(['middleware' => ['cors']], function() {

    Route::get('finder-template', function() {

        $html = file_get_contents(public_path('plugins/entity-finder/modal.html'));
        return response($html);
    });

    Route::get('template', function() {

        $html = file_get_contents(public_path('plugins/entity-finder/modal.html'));
        return response($html);
    });

    Route::get('entity-finder-modal.html', function() {

        $html = file_get_contents(public_path('plugins/entity-finder/modal.html'));
        return response($html);
    });

    Route::get('entity-updater-modal.html', function() {

        $html = file_get_contents(public_path('plugins/entity-updater/modal.html'));
        return response($html);
    });
});

Route::get('/tenant/index.html', function() {
    return view('solumax.entity::tenantIndex');
});