<?php

namespace Solumax\Entity\App\Entity\Managers\Validators;

use Solumax\Entity\App\Entity\EntityModel;

class OnCreateAndUpdate {

    protected $entity;

    public function __construct(EntityModel $entity) {
        $this->entity = $entity;
    }

    public function validate() {

        $attr = $this->validateAttributes();
        if ($attr->fails()) {
            return $attr->errors()->all();
        }

        if (request()->get('bypass_existing_validation') != 'true') {
            $foundEntity = $this->validateExistingEntity();
            if (!empty($foundEntity)) {
                return [
                    [
                        'type' => 'confirm',
                        'text' => "Ditemukan data entity dengan data berikut \n" .
                        "Nama: " . $foundEntity->name . "\n" .
                        "Telp: " . $foundEntity->phone_number . "\n" .
                        "ID: " . $foundEntity->id . "\n" .
                        "Yakin mau lanjutkan?",
                        'if_confirmed' => 'bypass_existing_validation'
                    ]
                ];
            }
        }

        return true;
    }

    protected function validateAttributes() {

        return \Validator::make($this->entity->toArray(), [
                    'name' => 'required',
                    'email' => 'email',
                    'ktp' => 'unique:entities,ktp,' . $this->entity->id,
                    'npwp' => 'unique:entities,npwp,' . $this->entity->id,
        ]);
    }

    protected function validateExistingEntity() {

        $query = $this->entity->newQuery();
        return $query->where('phone_number', 'LIKE', '%' . substr($this->entity->phone_number, -5))
                        ->where('name', 'LIKE', '%' . $this->entity->name . '%')
                        ->first();
    }

}
