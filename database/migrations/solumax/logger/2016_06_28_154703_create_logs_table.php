<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateLogsTable extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::create('logs', function (Blueprint $table) {
            $table->increments('id');
            
            $table->string('type')->nullable();
            
            $table->string('loggable_type')->nullable()->index();
            $table->string('loggable_id')->nullable()->index();
            
            $table->text('data_one')->nullable();
            $table->text('data_two')->nullable();
            
            $table->integer('user_id')->unsigned()->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::drop('logs');
    }

}
