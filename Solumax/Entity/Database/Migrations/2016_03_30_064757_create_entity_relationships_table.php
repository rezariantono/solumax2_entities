<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEntityRelationshipsTable extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::create('entity_relationships', function (Blueprint $table) {
            $table->increments('id');
            
            $table->integer('tenant_id')->unsigned();
            $table->string('relationship_code');
            $table->integer('entity_id')->unsigned();
            
            $table->timestamps();
        });
        
        Schema::table('entity_relationships', function (Blueprint $table) {
            
            $table->foreign('entity_id')->references('id')->on('entities');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::drop('entity_relationships');
    }

}
