<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('heures_travail', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ambulance_id')->constrained('ambulances')->onDelete('cascade');
            $table->string('conducteur');
            $table->date('date');
            $table->time('heure_debut');
            $table->time('heure_fin')->nullable();
            $table->decimal('heures_total', 5, 2)->nullable(); // calculé
            $table->enum('type_service', ['urgence', 'transfert', 'permanence', 'autre'])->default('permanence');
            $table->integer('nombre_interventions')->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('heures_travail');
    }
};
