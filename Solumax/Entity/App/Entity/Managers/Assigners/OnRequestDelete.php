<?php

namespace Solumax\Entity\App\Entity\Managers\Assigners;

use Solumax\Entity\App\Entity\EntityModel;

class OnRequestDelete {
    
    protected $entity;
    
    public function __construct(EntityModel $entity) {
        $this->entity = $entity;
    }
    
    public function assign() {
        
        $this->entity->deletion_request = json_encode([
            'time' => \Carbon\Carbon::now()->toDateTimeString(),
            'name' => \ParsedJwt::getByKey('name'),
            'id' => \ParsedJwt::getByKey('sub')
        ]);
        
        return $this->entity;
    }
}
