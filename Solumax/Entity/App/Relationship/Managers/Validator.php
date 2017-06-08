<?php

namespace Solumax\Entity\App\Relationship\Managers;

use Solumax\PhpHelper\App\ManagerBase as Manager;
use Solumax\Entity\App\Relationship\RelationshipModel;

class Validator extends Manager {

    protected $relationship;

    public function __construct(RelationshipModel $relationship) {
        $this->relationship = $relationship;
    }

    public function __call($name, $arguments) {
        return $this->managerCaller($name, $arguments, $this->relationship, __NAMESPACE__, 'Validators', 'validate');
    }

}
