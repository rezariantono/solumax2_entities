<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddAreaColumnsToEntitiesTable extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::table('entities', function (Blueprint $table) {
            $table->string('provinsi')->nullable();
            $table->string('kota')->nullable();
            $table->string('kecamatan')->nullable();
            $table->string('kelurahan')->nullable();
            $table->string('kode_pos')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::table('entities', function (Blueprint $table) {
            //
        });
    }

}
