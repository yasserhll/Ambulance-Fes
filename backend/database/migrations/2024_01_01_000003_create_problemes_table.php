<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('problemes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ambulance_id')->constrained('ambulances')->onDelete('cascade');
            $table->string('titre');
            $table->text('description');
            $table->enum('priorite', ['faible', 'normale', 'haute', 'critique'])->default('normale');
            $table->enum('statut', ['ouvert', 'en_cours', 'resolu', 'ferme'])->default('ouvert');
            $table->string('rapporte_par')->nullable();
            $table->date('date_rapport');
            $table->date('date_resolution')->nullable();
            $table->text('solution')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('problemes');
    }
};
