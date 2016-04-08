<?php

namespace Solumax\Entity\App\Entity\Managers\Actioners;

use Solumax\Entity\App\Entity\EntityModel;

class OnCreateAndUpdate {
    
    protected $entity;
    
    public function __construct(EntityModel $entity) {
        $this->entity = $entity;
    }
    
    public function action() {
        
        $this->entity->save();
    }
}
