<?php

Route::group(['namespace' => '\Solumax\Entity\Http\Controllers', 'prefix' => 'entity', 'middleware' => ['cors']], function() {
    
    include('Routes/Api.php');
    include('Routes/Report.php');
});

Route::group(['namespace' => '\Solumax\Entity\Http\Controllers'], function() {
    
    include('Routes/RedirectApp.php');
});

include('Routes/Html.php');