<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddIdColumnsToEntitiesTable extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::table('entities', function (Blueprint $table) {
            $table->string('ktp')->nullable()->unique();
            $table->string('npwp')->nullable()->unique();
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
