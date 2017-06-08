<?php

namespace Solumax\Entity\App\Entity\Transformers;

use Solumax\Entity\App\Entity\EntityModel;
use League\Fractal;

class EntityTransformer extends Fractal\TransformerAbstract {
    
    protected $defaultIncludes = ['entityRelationships'];
    
    public function transform(EntityModel $entity) {
        
        return [
            'id' => (int) $entity->id,
            'user_id' => $entity->user_id ? (int) $entity->user_id : null,
            
            'name' => $entity->name,
            
            'phone_number' => (string) $entity->phone_number,
            'phone_number_2' => (string) $entity->phone_number_2,
            
            'email' => (string) $entity->email,
            'address' => (string) $entity->address,
            
            'ktp' => (string) $entity->ktp,
            'ktp_file_uuid' => $entity->ktp_file_uuid,
            'npwp' => (string) $entity->npwp,
            
            'deletion_request' => $entity->deletion_request ? json_decode($entity->deletion_request) : null,
            'edit_lock' => $entity->edit_lock ? json_decode($entity->edit_lock) : null, 
            
            'creator_tenant_id' => (int) $entity->creator_tenant_id,
        ];
    }
    
    public function includeEntityRelationships(EntityModel $entity) {
        
        $entityRelationships = $entity->entityRelationships;
        
        return $this->collection($entityRelationships,
                new \Solumax\Entity\App\EntityRelationship\Transformers\EntityRelationshipTransformer,
                'entity_relationships');
    }
}
