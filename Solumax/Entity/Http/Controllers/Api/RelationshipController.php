<?php

namespace Solumax\Entity\Http\Controllers\Api;

use Solumax\PhpHelper\Http\Controllers\ApiBaseV1Controller as Controller;
use Illuminate\Http\Request;

class RelationshipController extends Controller {

    protected $relationship;

    public function __construct() {
        parent::__construct();
        $this->relationship = new \Solumax\Entity\App\Relationship\RelationshipModel();

        $this->transformer = new \Solumax\Entity\App\Relationship\Transformers\RelationshipTransformer();
        $this->dataName = 'relationships';
    }

    public function index(Request $request) {

        $query = $this->relationship->newQuery();

        if ($request->has('name')) {
            $query->where('name', 'LIKE', '%' . $request->get('name') . '%');
        }

        $relationships = $query->get();
        return $this->formatCollection($relationships);
    }

    public function get($id) {

        $relationship = $this->relationship->find($id);

        return $this->formatItem($relationship);
    }

    public function store(Request $request) {

        $relationship = $this->relationship->assign()->fromRequest($request);

        $validation = $relationship->validate()->onCreateAndUpdate();
        if ($validation !== true) {
            return $this->formatErrors($validation);
        }

        $relationship->action()->onCreateAndUpdate();

        return $this->formatItem($relationship);
    }

    public function update($id, Request $request) {

        $relationship = $this->relationship->find($id);
        $relationship->assign()->fromRequest($request);

        $validation = $relationship->validate()->onCreateAndUpdate();
        if ($validation !== true) {
            return $this->formatErrors($validation);
        }

        $relationship->action()->onCreateAndUpdate();

        return $this->formatItem($relationship);
    }

    public function delete($id) {

        $relationship = $this->$relationship->find($id);
        $relationship->delete();

        return response()->json(true);
    }

}
