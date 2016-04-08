<?php

namespace Solumax\EntityBase\Http\Controllers\Api;

use Solumax\PhpHelper\Http\Controllers\ApiBaseV1Controller as Controller;
use Illuminate\Http\Request;


class TenantDataController extends Controller {
    
    protected $tenantData;
    
    public function __construct() {
        parent::__construct();
        $this->tenantData = new \Solumax\EntityBase\App\TenantData\TenantDataModel;
        
        $this->transformer = new \Solumax\EntityBase\App\TenantData\Transformers\TenantDataTransformer();
        $this->dataName = 'tenant_data';
    }
    
    public function index(Request $request) {
        
        $tenantData = $this->tenantData->get();
        
        return $this->formatCollection($tenantData);
    }
    
    public function store(Request $request) {
        
        $tenantData = $this->tenantData->fill($request->only('tenant_id', 'data_id', 'read', 'write'));
        
        $validation = $tenantData->validate()->onCreateAndUpdate();
        if ($validation !== true) {
            return $this->formatErrors($validation);
        }
        
        $tenantData->save();
        
        return $this->formatItem($tenantData);
    }
        
}
