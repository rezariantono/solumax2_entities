<?php

namespace Solumax\Entity\App\Relationship\Transformers;

use Solumax\Entity\App\Relationship\RelationshipModel;
use League\Fractal;

class RelationshipTransformer extends Fractal\TransformerAbstract {
    
    public function transform(RelationshipModel $relationship) {
        
        return [
            'id' => $relationship->id,
            
            'name' => $relationship->name,
        ];
    }
}
