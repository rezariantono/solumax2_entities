<?php

namespace Solumax\EntityBase\App\TenantData\Managers;

use Solumax\EntityBase\App\TenantData\TenantDataModel;

class Validator {
    
    protected $tenantData;
    
    public function __construct(TenantDataModel $tenantData) {
        $this->tenantData = $tenantData;
    }
    
    public function onCreateAndUpdate() {
        $validator = new Validators\OnCreateAndUpdate($this->tenantData);
        return $validator->validate();
    }
    
}
