<?php

namespace Solumax\Entity\Http\Controllers\Api\Entity;

use Illuminate\Http\Request;

trait RequestDelete {
    
    public function updateRequestDelete($id, Request $request) {
        
        $entity = $this->entity->find($id);
        $entity->assign()->onRequestDelete($request->get('request_delete', 'true'));
        
        $entity->action()->onCreateAndUpdate('REQUEST DELETE ' . $request->get('request_delete', 'true'));
        
        return $this->formatItem($entity);
    }
}