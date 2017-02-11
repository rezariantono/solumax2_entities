<?php

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
    
    Route::get('entity-updater-modal2.html', function() {

        $html = file_get_contents(public_path('plugins/entity-updater/modal2.html'));
        return response($html);
    });
});

