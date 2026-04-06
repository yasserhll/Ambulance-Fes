<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('heures_travail', function (Blueprint $table) {
            $table->foreignId('chauffeur_id')->nullable()->after('ambulance_id')
                  ->constrained('chauffeurs')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('heures_travail', function (Blueprint $table) {
            $table->dropForeign(['chauffeur_id']);
            $table->dropColumn('chauffeur_id');
        });
    }
};
