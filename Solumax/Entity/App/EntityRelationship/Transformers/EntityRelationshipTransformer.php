<?php

namespace Solumax\Entity\App\EntityRelationship\Transformers;

use Solumax\Entity\App\EntityRelationship\EntityRelationshipModel;
use League\Fractal;

class EntityRelationshipTransformer extends Fractal\TransformerAbstract {

    public function transform(EntityRelationshipModel $entityRelationship) {

        return [
            'id' => $entityRelationship->id,
            'entity_id' => (int) $entityRelationship->entity_id,
            'relationship_id' => (int) $entityRelationship->relationship_id,
        ];
    }

}
