<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEntitiesTable extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::create('entities', function (Blueprint $table) {
            $table->increments('id');
            
            $table->string('name');
            $table->string('phone_number')->nullable();
            $table->string('phone_number_2')->nullable();
            $table->string('email')->nullable();
            
            $table->text('address')->nullable();
            
            $table->integer('user_id')->unsigned()->nullable();
            $table->integer('creator_tenant_id')->unsigned()->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::drop('entities');
    }

}
