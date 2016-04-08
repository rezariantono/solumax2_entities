<?php

Route::group(['prefix' => 'base', 'namespace' => '\Solumax\EntityBase\Http\Controllers'], function() {
    
    include('Routes/Api.php');
});