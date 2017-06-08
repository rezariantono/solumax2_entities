<?php

namespace Solumax\Entity\App\Relationship;

use Solumax\PhpHelper\App\BaseModel as Model;

class RelationshipModel extends Model {

    protected $table = 'relationships';
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

}
