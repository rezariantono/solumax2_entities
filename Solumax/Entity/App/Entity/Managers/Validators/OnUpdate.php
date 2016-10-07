<?php

namespace Solumax\Entity\App\Entity\Managers\Validators;

use Solumax\Entity\App\Entity\EntityModel;

class OnUpdate {
    protected $entity;
    
    public function __construct(EntityModel $entity) {
        $this->entity = $entity;
    }
    
    public function validate() {
        
        if (!is_null($this->entity->edit_lock)) {
            return ['Data ini sedang dikunci. Tidak dapat diedit.'];
        }
        
        return true;
    }
}
