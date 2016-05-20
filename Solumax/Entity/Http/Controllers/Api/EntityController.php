<?php

namespace Solumax\Entity\Http\Controllers\Api;

use Solumax\PhpHelper\Http\Controllers\ApiBaseV1Controller as Controller;
use Illuminate\Http\Request;

class EntityController extends Controller {
    
    protected $entity;
    
    public function __construct() {
        parent::__construct();
        $this->entity = new \Solumax\Entity\App\Entity\EntityModel();
        
        $this->transformer = new \Solumax\Entity\App\Entity\Transformers\EntityTransformer();
        $this->dataName = 'entities';
    }
    
    public function index(Request $request) {
        
        $query = $this->entity->newQuery();
        
        if ($request->has('id')) {
            $query->where('id', $request->get('id'));
        }
        
        if ($request->has('name')) {
            $query->where('name', 'LIKE', '%' . $request->get('name') . '%');
        }
        
        if ($request->has('phone_number')) {
            $query->where('phone_number', '=', $request->get('phone_number'));
        }
        
        if ($request->has('email')) {
            $query->where('email', '=', $request->get('email'));
        }
        
        if ($request->has('ktp')) {
            $query->where('ktp', '=', $request->get('ktp'));
        }
        
        if ($request->has('npwp')) {
            $query->where('npwp', '=', $request->get('npwp'));
        }
        
        if ($request->get('order') == 'asc') {
            
            $query->orderBy('id', 'asc');
        } else if ($request->get('order') == 'desc') {
            
            $query->orderBy('id', 'desc');
        } else {
            
            $name = $request->get('name');
            $query->orderByRaw("
                (CASE WHEN `name` = '".$name."' THEN 0
                WHEN `name` like '".$name."%' THEN 1
                WHEN `name` like '% %".$name."% %' THEN 2
                WHEN `name` like '%".$name."' THEN 3
                ELSE 4 END), `name`");
        }
        
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
        
        $entity->action()->onCreateAndUpdate();
        
        return $this->formatItem($entity);
    }
    
    public function update($id, Request $request) {
        
        $entity = $this->entity->find($id);
        $entity->assign()->fromRequest($request);
        
        $validation = $entity->validate()->onCreateAndUpdate();
        if ($validation !== true) {
            return $this->formatErrors($validation);
        }
        
        $entity->action()->onCreateAndUpdate();
        
        return $this->formatItem($entity);
    }
}
