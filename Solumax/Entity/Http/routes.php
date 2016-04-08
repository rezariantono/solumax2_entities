<?php

Route::group(['namespace' => '\Solumax\Entity\Http\Controllers', 'prefix' => 'entity', 'middleware' => ['cors']], function() {
    
    include('Routes/Api.php');
});

Route::group(['namespace' => '\Solumax\Entity\Http\Controllers'], function() {
    
    include('Routes/RedirectApp.php');
});

Route::group(['middleware' => ['cors']], function() {
    
    Route::get('finder-template', function() {

        $html = file_get_contents(public_path('application-files/finder-modal.html'));

        return response($html);
    });
    
    Route::get('template', function() {

        $html = file_get_contents(public_path('application-files/finder-modal.html'));

        return response($html);
    });
    
    Route::get('create-template', function() {

        $html = file_get_contents(public_path('application-files/create-modal.html'));

        return response($html);
    });    
});

