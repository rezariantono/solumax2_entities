<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEntityMetaTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('entity_meta', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('tenant_id')->unsigned()->nullable();
            
            $table->integer('entity_id')->unsigned()->nullable();
            $table->string('meta_key');
            $table->text('meta_value');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('entity_meta');
    }
}
