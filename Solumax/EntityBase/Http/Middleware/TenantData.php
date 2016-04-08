<?php

namespace Solumax\EntityBase\Http\Middleware;

use Closure;

use Solumax\EntityBase\App\TenantData\TenantDataModel;

class TenantData {
    
    public function handle($request, Closure $next) {
        
        if (empty(\ParsedJwt::getByKey('selected_tenant_id'))) {
            
            return response('Tenant Is Not Selected', 400);
        }
        
        $tenantDatabase = \Cache::remember('tenant_databases', 60, function() {
            
            $x = TenantDataModel::get(['tenant_id', 'data_id', 'read', 'write']);
            \DB::disconnect();
            return $x;
            
        })->whereLoose('tenant_id', \ParsedJwt::getByKey('selected_tenant_id'))->first();
        
        if (empty($tenantDatabase)) {
            
            return response('Tenant Data Not Found', 404);
        }
        
        $usedSetting = config('database.default');
        
        $initialDatabase = config('database.connections.' . $usedSetting . '.database');
        
        config(['database.connections.' . $usedSetting . '.database' => $initialDatabase . '_' . $tenantDatabase->data_id]);
        
        return $next($request);
    }
}

