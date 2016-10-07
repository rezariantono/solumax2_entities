<?php

namespace Solumax\Entity\App\Entity\Managers\Assigners;

use Solumax\Entity\App\Entity\EntityModel;

class OnEditLock {
    
    protected $entity;
    
    public function __construct(EntityModel $entity) {
        $this->entity = $entity;
    }
    
    public function assign($editLock) {
        
        if ($editLock) {
            
            $this->entity->edit_lock = json_encode([
                'time' => \Carbon\Carbon::now()->toDateTimeString(),
                'name' => \ParsedJwt::getByKey('name'),
                'id' => \ParsedJwt::getByKey('sub')
            ]);
            
        } else {
            
            $this->entity->edit_lock = null;
            
        }
    }
}
