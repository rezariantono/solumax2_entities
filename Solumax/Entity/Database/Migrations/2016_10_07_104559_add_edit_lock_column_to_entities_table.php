<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddEditLockColumnToEntitiesTable extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::table('entities', function (Blueprint $table) {
            $table->string('edit_lock')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::table('entities', function (Blueprint $table) {
            $table->dropColumn('edit_lock');
        });
    }

}
