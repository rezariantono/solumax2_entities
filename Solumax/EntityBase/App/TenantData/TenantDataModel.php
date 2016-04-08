<?php

namespace Solumax\EntityBase\App\TenantData;

use Solumax\PhpHelper\App\BaseModel as Model;

class TenantDataModel extends Model {
    
    protected $table = 'tenant_data';
    
    protected $guarded = ['created_at', 'updated_at'];
    
    // Managers
    
    public function validate() {
        return new Managers\Validator($this);
    }
}
