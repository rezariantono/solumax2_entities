<?php

namespace Solumax\Entity\App\EntityRelationship;

use Solumax\PhpHelper\App\BaseModel as Model;

class EntityRelationshipModel extends Model {

    protected $table = 'entity_relationships';
    
    protected $guarded = ['created_at', 'updated_at'];

    // Managers

    public function assign() {
        return new Managers\Assigner($this);
    }

}
