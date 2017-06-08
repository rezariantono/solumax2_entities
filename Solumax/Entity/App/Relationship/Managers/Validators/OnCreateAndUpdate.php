<?php

namespace Solumax\Entity\App\Relationship\Managers\Validators;

use Solumax\Entity\App\Relationship\RelationshipModel;

class OnCreateAndUpdate {
    
    protected $relationship;
    
    public function __construct(RelationshipModel $relationship) {
        $this->relationship = $relationship;
    }
    
    public function validate() {
        
        $attrValidations = $this->validateAttributes();
        if ($attrValidations->fails()) {
            return $attrValidations->errors()->all();
        }
        
        return true;
    }
    
    protected function validateAttributes() {
        
        return \Validator::make($this->relationship->toArray(), [
            'name' => 'required|unique:relationships,name,' . $this->relationship->id,
        ]);
    }
}
