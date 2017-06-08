<?php

namespace Solumax\Entity\App\Relationship\Managers\Assigners;

use Solumax\Entity\App\Relationship\RelationshipModel;

class FromRequest {
    
    protected $relationship;
    
    public function __construct(RelationshipModel $relationship) {
        $this->relationship = $relationship;
    }
    
    public function assign(\Illuminate\Http\Request $request) {
        
        $this->relationship->fill($request->only('name'));
        
        return $this->relationship;
    }
}
