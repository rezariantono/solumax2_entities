<?php

namespace Solumax\Entity\App\Entity\Managers;

use Solumax\PhpHelper\App\ManagerBase as ManagerBase;
use Solumax\Entity\App\Entity\EntityModel;

class QueryBuilder extends ManagerBase {

    protected $entity;

    public function __construct(EntityModel $entity) {
        $this->entity = $entity;
    }

    public function build(\Illuminate\Http\Request $request) {

        $query = $this->entity->newQuery();

        if ($request->has('id')) {
            $query->where('id', $request->get('id'));
        }
        
        if ($request->has('created_at_from')) {
            $query->where('created_at', '>=', \Carbon\Carbon::createFromFormat('Y-m-d', $request->get('created_at_from'))->startOfDay());
        }
        
        if ($request->has('created_at_until')) {
            $query->where('created_at', '<=', \Carbon\Carbon::createFromFormat('Y-m-d', $request->get('created_at_until'))->endOfDay());
        }


        if ($request->has('ids')) {
            $query->whereIn('id', explode(',', $request->get('ids')));
        }

        if ($request->has('name')) {
            if (strpos($request->get('name'), '|') !== false) {
                $strings = explode('|', $request->get('name'));
                foreach ($strings as $string) {
                    $query->where('name', 'LIKE', '%' . $string . '%');
                }
            } else {
                $query->where('name', 'LIKE', '%' . $request->get('name') . '%');
            }
        }

        if ($request->has('address')) {
            $query->where('address', 'LIKE', '%' . $request->get('address') . '%');
        }

        if ($request->has('phone_number')) {
            $query->where('phone_number', 'LIKE', '%' . $request->get('phone_number') . '%');
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

        if ($request->get('is_linked_to_user') == 'true') {
            $query->whereNotNull('user_id');
        }

        if ($request->get('deletion_request') == 'true') {
            $query->whereNotNull('deletion_request');
        }

        if ($request->has('relationship_id')) {
            $query->join('entity_relationships', 'entities.id', '=', 'entity_relationships.entity_id')
                    ->where('entity_relationships.relationship_id', $request->get('relationship_id'));
        } else if ($request->has('relationship_ids')) {
            $query->join('entity_relationships', 'entities.id', '=', 'entity_relationships.entity_id')
                    ->whereIn('entity_relationships.relationship_id', explode(',', $request->get('relationship_ids')));
        }
        
        if ($request->has('limit')) {
            $query->limit((int) $request->get('limit'));
        }

        $query->orderBy($request->get('order_by', 'id'), $request->get('order', 'asc'))
                ->select('entities.*');
        
        return $query;
    }

}
