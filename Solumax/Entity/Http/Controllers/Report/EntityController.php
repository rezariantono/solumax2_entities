<?php

namespace Solumax\Entity\Http\Controllers\Report;

use Solumax\PhpHelper\Http\Controllers\ApiBaseV1Controller as Controller;
use Solumax\PhpHelper\Http\ControllerExtensions\CsvParseAndCreate;
use Illuminate\Http\Request;

class EntityController extends Controller {
    
    use CsvParseAndCreate;

    protected $entity;

    public function __construct() {
        parent::__construct();
        $this->entity = new \Solumax\Entity\App\Entity\EntityModel();

        $this->transformer = new \Solumax\Entity\App\Entity\Transformers\EntityTransformer();
        $this->dataName = 'entities';
    }

    public function index(Request $request) {

        $query = $this->entity->queryBuild()->build($request);
        
        $entities = $query
                ->select('id', 'name', 'phone_number', 'phone_number_2', 'email', 'address',
                        'created_at', 'ktp', 'npwp', 'dob', 'address_lng', 'address_lat')
                ->get();
        
        $entities->each(function($entity) {
            $phoneNumber = str_replace('+', '', $entity->phone_number);
            $phoneNumber = str_replace('0', '62', $phoneNumber);
            $entity->whatsapp = 'https://api.whatsapp.com/send?phone=' . $phoneNumber;
        });
        
        return $this->createCsv($entities->toArray(), 'entity');
        
    }

}
