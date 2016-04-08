<?php

namespace Solumax\Entity\BaseApp\TenantSetting;

use Solumax\PhpHelper\App\BaseModel as Model;

class TenantSettingModel extends Model {
    
    protected $table = 'tenant_settings';
    
    protected $guarded = ['created_at', 'updated_at'];
}
