<?php

namespace Solumax\Entity\App\Entity\Transformers;

use Solumax\Entity\App\Entity\EntityModel;
use League\Fractal;

class EntityTransformer extends Fractal\TransformerAbstract {
    
    public function transform(EntityModel $entity) {
        
        return [
            'id' => (int) $entity->id,
            'user_id' => (int) $entity->user_id,
            
            'name' => $entity->name,
            
            'phone_number' => (string) $entity->phone_number,
            'phone_number_2' => (string) $entity->phone_number_2,
            
            'email' => (string) $entity->email,
            'address' => (string) $entity->address,
            
            'ktp' => (string) $entity->ktp,
            'npwp' => (string) $entity->npwp,
            
            'deletion_request' => $entity->deletion_request ? json_decode($entity->deletion_request) : null, 
            
            'creator_tenant_id' => (int) $entity->creator_tenant_id,
        ];
    }
}
