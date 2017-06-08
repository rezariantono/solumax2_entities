<?php

namespace Solumax\Entity\App\Entity;

use Solumax\PhpHelper\App\BaseModel as Model;

class EntityModel extends Model {

    protected $table = 'entities';
    protected $guarded = ['created_at', 'updated_at'];

    // Managers

    public function action() {
        return new Managers\Actioner($this);
    }

    public function assign() {
        return new Managers\Assigner($this);
    }

    public function validate() {
        return new Managers\Validator($this);
    }

    // Managers

    public function entityRelationships() {
        return $this->hasMany('\Solumax\Entity\App\EntityRelationship\EntityRelationshipModel', 'entity_id');
    }

}
