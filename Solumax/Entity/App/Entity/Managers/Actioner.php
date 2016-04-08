<?php

namespace Solumax\Entity\App\Entity\Managers;

use Solumax\PhpHelper\App\ManagerBase as ManagerBase;

use Solumax\Entity\App\Entity\EntityModel;

class Actioner extends ManagerBase {
    
    protected $entity;
    
    public function __construct(EntityModel $entity) {
        $this->entity = $entity;
    }
    
    public function __call($name, $arguments) {
        return $this->managerCaller($name, $arguments, $this->entity,
                __NAMESPACE__, 'Actioners', 'action');
    }
}
