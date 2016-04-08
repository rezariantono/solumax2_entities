<?php

namespace Solumax\EntityBase;

use Illuminate\Support\ServiceProvider;
use Illuminate\Routing\Router;

class SolumaxEntityBaseProvider extends ServiceProvider {
    
    public function boot(Router $router) {
        
        require __DIR__ . '/Http/routes.php';
        
        $this->loadViewsFrom(__DIR__ . '/Resources/Views', 'entity-base');
        
        $this->publishes([
            __DIR__.'/Database/Migrations/' => database_path('migrations/entity-base')
        ], 'migrations');
        
        $router->middleware('entity_base.tenant_data', Http\Middleware\TenantData::class);
    }
    
    public function register() {
        
    }
}
