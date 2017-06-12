<?php

namespace Solumax\Entity;

use Illuminate\Support\ServiceProvider;
use Illuminate\Routing\Router;

class SolumaxEntityProvider extends ServiceProvider {

    public function boot(Router $router) {

        require __DIR__ . '/Http/routes.php';

        $this->loadViewsFrom(__DIR__ . '/Resources/Views', 'solumax.entity');

        $this->publishes([
            __DIR__ . '/Database/Migrations/' => database_path('migrations/entity')
                ], 'migrations');
    }

    public function register() {
        
    }

}
