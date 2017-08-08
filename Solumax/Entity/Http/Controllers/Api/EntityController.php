<?php

namespace Solumax\Entity\Http\Controllers\Api;

use Solumax\PhpHelper\Http\Controllers\ApiBaseV1Controller as Controller;
use Illuminate\Http\Request;
use Solumax\Entity\Http\Controllers\Api\Entity\EditLock;
use Solumax\Entity\Http\Controllers\Api\Entity\RequestDelete;

class EntityController extends Controller {

    use EditLock,
        RequestDelete;

    protected $entity;

    public function __construct() {
        parent::__construct();
        $this->entity = new \Solumax\Entity\App\Entity\EntityModel();

        $this->transformer = new \Solumax\Entity\App\Entity\Transformers\EntityTransformer();
        $this->dataName = 'entities';
    }

    public function index(Request $request) {

        $query = $this->entity->queryBuild()->build($request);
        
        if ($request->has('paginate')) {

            $entities = $query->paginate($request->get('paginate'));
            return $this->formatCollection($entities, [], $entities);
        } else {

            $entities = $query->get();
            return $this->formatCollection($entities);
        }
    }

    public function get($id) {

        $entity = $this->entity->find($id);

        return $this->formatItem($entity);
    }

    public function store(Request $request) {

        $entity = $this->entity->assign()->fromRequest($request);

        $validation = $entity->validate()->onCreateAndUpdate();
        if ($validation !== true) {
            return $this->formatErrors($validation);
        }

        $entity->action()->onCreateAndUpdate('CREATE');

        return $this->formatItem($entity);
    }

    public function update($id, Request $request) {

        $entity = $this->entity->find($id);
        $entity->assign()->fromRequest($request);

        $validation = $entity->validate()->onCreateAndUpdate();
        if ($validation !== true) {
            return $this->formatErrors($validation);
        }

        $validation = $entity->validate()->onUpdate();
        if ($validation !== true) {
            return $this->formatErrors($validation);
        }

        $entity->action()->onCreateAndUpdate('UPDATE');

        return $this->formatItem($entity);
    }

    public function delete($id) {

        $entity = $this->entity->find($id);
        $entity->delete();

        return response()->json(true);
    }

}
