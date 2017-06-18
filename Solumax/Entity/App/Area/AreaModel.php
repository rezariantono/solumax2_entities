<?php

namespace Solumax\Entity\App\Area;

use Illuminate\Database\Eloquent\Model;

class AreaModel extends Model {

    public function __construct(array $attributes = array(), $area = 'indonesia') {
        parent::__construct([]);

        config(['database.connections.sqliteAreas' => [
                'driver' => 'sqlite',
                'database' => storage_path('areas/' . $area . '.db'),
        ]]);
    }

    protected $connection = 'sqliteAreas';
    protected $table = 'areas';

}
