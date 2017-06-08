<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterRelationshipCodeToRelationshipIdOnEntityRelationshipsTable extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::table('entity_relationships', function (Blueprint $table) {
            $table->dropColumn('relationship_code');
            $table->integer('relationship_id')->nullable()->unsigned();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::table('entity_relationships', function (Blueprint $table) {
            $table->foreign('relationship_id')->references('id')->on('relationships');
        });
    }

}
