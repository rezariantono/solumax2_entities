<?php

namespace Solumax\Entity\Http\Controllers\Api\Entity;

use Illuminate\Http\Request;

trait EditLock {
    
    public function updateEditLock($id, Request $request) {
        
        $entity = $this->entity->find($id);
        $entity->assign()->onEditLock($request->get('edit_lock', 'true'));
        
        $entity->action()->onCreateOrUpdate('EDIT LOCK ' . $request->get('edit_lock', 'true'));
        
        return $this->formatItem($entity);
    }
}