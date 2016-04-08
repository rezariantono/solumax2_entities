<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEntityTransactionsTable extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::create('entity_transactions', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('tenant_id')->unsigned()->nullable();

            $table->string('transaction_type');
            $table->string('transaction_id');
            
            $table->longText('transaction_data');
            $table->bigInteger('transaction_total');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::drop('entity_transactions');
    }

}
