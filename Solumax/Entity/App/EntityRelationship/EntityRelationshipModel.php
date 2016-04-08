<?php

namespace Solumax\Entity\App\EntityRelationship;

use Solumax\PhpHelper\App\BaseModel as Model;

class EntityRelationshipModel extends Model {
    
    protected $table = 'entities';
    
    // Managers
    
    public function action() {
        return new Managers\Actioner($this);
    }
}
