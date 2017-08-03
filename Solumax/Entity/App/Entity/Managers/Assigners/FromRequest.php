<?php

namespace Solumax\Entity\App\Entity\Managers\Assigners;

use Solumax\Entity\App\Entity\EntityModel;

class FromRequest {

    protected $entity;

    public function __construct(EntityModel $entity) {
        $this->entity = $entity;
    }

    public function assign(\Illuminate\Http\Request $request) {

        $params = ['name', 'phone_number', 'phone_number_2',
            'provinsi', 'kota', 'kecamatan', 'kelurahan', 'kode_pos',
            'email', 'address', 'address_lng', 'address_lat',
            'ktp', 'ktp_file_uuid', 'npwp', 'user_id'];

        foreach ($params as $param) {
            if (!empty($request->get($param))) {
                $this->entity->$param = $request->get($param);
            }
        }
        
        $this->entity->area = json_encode($request->get('area', []));

        if (!empty($request->get('dob', null))) {
            $this->entity->dob = \Carbon\Carbon::createFromFormat('Y-m-d', $request->get('dob'));
        }

        return $this->entity;
    }

}
