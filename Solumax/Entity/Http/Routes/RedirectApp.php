<?php

Route::group(['prefix' => 'redirect-app'], function() {
    
    Route::get('entity/new', function() {
       return redirect('/tenant/index.html#/entity/create'); 
    });
     
    Route::get('entity/{id}', function($id) {
       return redirect('/tenant/index.html#/entity/show/' . $id); 
    });
});