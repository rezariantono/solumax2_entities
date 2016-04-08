<?php

namespace Solumax\Entity\App\Entity\Managers\Assigners;

use Solumax\Entity\App\Entity\EntityModel;

class FromRequest {
    
    protected $entity;
    
    public function __construct(EntityModel $entity) {
        $this->entity = $entity;
    }
    
    public function assign(\Illuminate\Http\Request $request) {
        
        $this->entity->fill($request->only('name', 'phone_number', 'phone_number_2',
                'email', 'address', 'ktp', 'npwp'));
        
        return $this->entity;
    }
}
