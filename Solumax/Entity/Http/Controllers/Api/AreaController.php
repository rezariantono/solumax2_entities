<?php

namespace Solumax\Entity\Http\Controllers\Api;

use Solumax\PhpHelper\Http\Controllers\ApiBaseV1Controller as Controller;
use Illuminate\Http\Request;

class AreaController extends Controller {

    protected $area;

    public function __construct() {
        parent::__construct();
        $this->area = new \Solumax\Entity\App\Area\AreaModel();

        $this->transformer = new \Solumax\Entity\App\Entity\Transformers\EntityTransformer();
        $this->dataName = 'entities';
    }

    public function index(Request $request) {

        $query = $this->area->newQuery();

        if ($request->has('filter')) {
            $query->where($request->get('filter'), $request->get('value'));
        }

        switch ($request->get('filter')):
            case 'provinsi':
                $query->groupBy('kota')->select('kota', 'jenis_kota');
                break;
            case 'kota':
                $query->groupBy('kecamatan')->select('kecamatan');
                break;
            case 'kecamatan':
                $query->groupBy('kelurahan')->select('kelurahan', 'kode_pos');
                break;
            default:
                $query->groupBy('provinsi')->select('provinsi');
                break;
        endswitch;

        $areas = $query->get();

        return $this->formatData($areas);
    }
    
    public function kelurahan(Request $request) {
        
        $query = $this->area->newQuery();
        
        if ($request->has('kelurahan')) {
            $query->where('kelurahan', $request->get('kelurahan'));
        }
        
        $area = $query->first();
        
        return $this->formatData($area);
    }

}

