<?php

namespace Solumax\Entity\Http\Controllers\Api;

use Solumax\PhpHelper\Http\Controllers\ApiBaseV1Controller as Controller;
use Illuminate\Http\Request;

class EntityRelationshipController extends Controller {

    protected $entityRelationship;

    public function __construct() {
        parent::__construct();
        $this->entityRelationship = new \Solumax\Entity\App\EntityRelationship\EntityRelationshipModel();

        $this->transformer = new \Solumax\Entity\App\EntityRelationship\Transformers\EntityRelationshipTransformer;
        $this->dataName = 'entity_relationships';
    }

    public function index(Request $request) {

        $query = $this->entityRelationship->newQuery();

        if ($request->has('entity_id')) {
            $query->where('entity_id', $request->get('entity_id'));
        }

        if ($request->has('relationship_id')) {
            $query->where('relationship_id', $request->get('relationship_id'));
        }

        $entityRelationships = $query->get();
        return $this->formatCollection($entityRelationships);
    }

    public function store(Request $request) {

        $entityRelationship = $this->entityRelationship->assign()->fromRequest($request);

        $entityRelationship->save();

        return $this->formatItem($entityRelationship);
    }

    public function delete(Request $request) {

        $this->entityRelationship
                ->where('entity_id', $request->get('entity_id'))
                ->where('relationship_id', $request->get('relationship_id'))
                ->delete();

        return $this->formatData([true]);
    }

}
