<?php

namespace Solumax\Entity\App\Relationship\Managers\Actioners;

use Solumax\Entity\App\Relationship\RelationshipModel;

class OnCreateAndUpdate {
    
    protected $relationship;
    
    public function __construct(RelationshipModel $relationship) {
        $this->relationship = $relationship;
    }
    
    public function action() {
        
        $this->relationship->save();
        
    }
}
