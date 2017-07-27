<?php

Route::group(['prefix' => 'plugins', 'middleware' => 'cors'], function() {
    Route::group(['prefix' => 'v2/files'], function() {

        Route::get('entity-finder-modal.html', function() {
            return response(file_get_contents(public_path('plugins/v2/entity-finder-modal.html')));
        });

        Route::get('entity-updater-modal.html', function() {
            return response(file_get_contents(public_path('plugins/v2/entity-updater-modal.html')));
        });
        
        Route::get('area-selector.html', function() {
            return response(file_get_contents(public_path('plugins/v2/area-selector.html')));
        });
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