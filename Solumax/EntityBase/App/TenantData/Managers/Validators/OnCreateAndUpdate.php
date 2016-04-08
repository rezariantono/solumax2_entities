<?php

namespace Solumax\EntityBase\App\TenantData\Managers\Validators;

use Solumax\EntityBase\App\TenantData\TenantDataModel;


class OnCreateAndUpdate {
    
    protected $tenantData;
    
    public function __construct(TenantDataModel $tenantData) {
        $this->tenantData = $tenantData;
    }
    
    public function validate() {
        return true;
    }
}
