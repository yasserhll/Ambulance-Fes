<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ambulances', function (Blueprint $table) {
            $table->id();
            $table->string('immatriculation')->unique(); // ex: AM-001-FES
            $table->string('marque');                    // ex: Mercedes, Renault
            $table->string('modele');                   // ex: Sprinter, Master
            $table->integer('annee');
            $table->enum('statut', ['disponible', 'en_service', 'maintenance', 'hors_service'])
                  ->default('disponible');
            $table->string('conducteur')->nullable();
            $table->string('telephone_conducteur')->nullable();
            $table->integer('kilometrage')->default(0);
            $table->date('derniere_revision')->nullable();
            $table->date('prochaine_revision')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ambulances');
    }
};
