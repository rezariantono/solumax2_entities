<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeColumnDescriptionAndSubpathToNullableOnFilesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        \DB::statement('ALTER TABLE `files` CHANGE COLUMN `description` `description` VARCHAR(255) NULL ;');
        \DB::statement('ALTER TABLE `files` CHANGE COLUMN `subpath` `subpath` VARCHAR(255) NULL ;');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('files', function (Blueprint $table) {
            //
        });
    }
}
