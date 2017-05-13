<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeColumnNameToNullableOnFilesTable extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::table('files', function (Blueprint $table) {
            \DB::statement("ALTER TABLE `files` CHANGE COLUMN `name` `name` VARCHAR(255) NULL ;");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::table('files', function (Blueprint $table) {
            //
        });
    }

}
