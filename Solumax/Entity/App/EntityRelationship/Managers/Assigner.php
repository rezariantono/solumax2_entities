<?php

namespace Solumax\Entity\App\EntityRelationship\Managers;

use Solumax\PhpHelper\App\ManagerBase as Manager;
use Solumax\Entity\App\EntityRelationship\EntityRelationshipModel;

class Assigner extends Manager {

    protected $entityRelationship;

    public function __construct(EntityRelationshipModel $entityRelationship) {
        $this->entityRelationship = $entityRelationship;
    }

    public function __call($name, $arguments) {
        return $this->managerCaller($name, $arguments, $this->entityRelationship, __NAMESPACE__, 'Assigners', 'assign');
    }

}
