<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFilesTable extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::create('files', function (Blueprint $table) {
            $table->increments('id');
            
            $table->string('storage_type');
            $table->string('domain');
            
            $table->string('path');
            $table->string('subpath');
            $table->string('file');
            
            $table->text('variants')->nullable();
            
            $table->string('mime_type')->nullable();
            
            $table->string('document_type')->nullable()->unique()->index();
            $table->string('name');
            $table->string('description');
            
            $table->timestamps();
            $table->integer('creator_id')->unsigned()->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::drop('files');
    }

}
