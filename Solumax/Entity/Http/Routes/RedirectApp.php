<?php

Route::group(['prefix' => 'redirect-app'], function() {
    
    Route::get('entity/new', function() {
       return redirect('/tenant/index.html#/entity/create'); 
    });
     
    Route::get('entity/{id}', function($id) {
        
        if (request()->has('jwt')) {
            
            $params = http_build_query([
                'state' => '#/entity/show/' . $id,
                'jwt' => request()->get('jwt')
            ]);
            
            return redirect('/tenant/index.html?' . $params);
            
        } else {
            
            return redirect('/tenant/index.html#/entity/show/' . $id);
        } 
    });
});