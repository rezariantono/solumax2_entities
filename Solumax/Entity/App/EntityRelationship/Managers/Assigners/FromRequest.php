<?php

namespace Solumax\Entity\App\EntityRelationship\Managers\Assigners;

use Solumax\Entity\App\EntityRelationship\EntityRelationshipModel;

class FromRequest {

    protected $entityRelationship;

    public function __construct(EntityRelationshipModel $entityRelationship) {
        $this->entityRelationship = $entityRelationship;
    }

    public function assign(\Illuminate\Http\Request $request) {

        $this->entityRelationship->fill($request->only('entity_id', 'relationship_id'));

        return $this->entityRelationship;
    }

}
