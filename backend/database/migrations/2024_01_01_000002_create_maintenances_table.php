<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('maintenances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ambulance_id')->constrained('ambulances')->onDelete('cascade');
            $table->enum('type', ['revision', 'reparation', 'controle_technique', 'autre']);
            $table->string('description');
            $table->date('date_debut');
            $table->date('date_fin')->nullable();
            $table->enum('statut', ['planifiee', 'en_cours', 'terminee'])->default('planifiee');
            $table->decimal('cout', 10, 2)->nullable();
            $table->string('technicien')->nullable();
            $table->string('garage')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('maintenances');
    }
};
