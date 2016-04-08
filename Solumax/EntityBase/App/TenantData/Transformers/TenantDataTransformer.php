<?php

namespace Solumax\EntityBase\App\TenantData\Transformers;

use League\Fractal;
use Solumax\EntityBase\App\TenantData\TenantDataModel;

class TenantDataTransformer extends Fractal\TransformerAbstract {
    
    public function transform(TenantDataModel $tenantData) {
        
        return [
            'tenant_id' => (int) $tenantData->tenant_id,
            'data_id' => (string) $tenantData->data_id,
            'read' => (boolean) $tenantData->read,
            'write' => (boolean) $tenantData->write,
        ];
    }
    
}
