<?php

namespace Solumax\Entity\App\Entity\Managers\Validators;

use Solumax\Entity\App\Entity\EntityModel;

class OnCreateAndUpdate {
    
    protected $entity;
    
    public function __construct(EntityModel $entity) {
        $this->entity = $entity;
    }
    
    public function validate() {
        
        $attr = $this->validateAttributes();
        if ($attr->fails()) {
            return $attr->errors()->all();
        }
        
        return true;
    }
    
    protected function validateAttributes() {
        
        return \Validator::make($this->entity->toArray(),
                [
                    'name' => 'required',
                    'email' => 'email',
                    'ktp' => 'unique:entities,ktp,' . $this->entity->id,
                    'npwp' => 'unique:entities,npwp,' . $this->entity->id,
                ]);
    }
}
