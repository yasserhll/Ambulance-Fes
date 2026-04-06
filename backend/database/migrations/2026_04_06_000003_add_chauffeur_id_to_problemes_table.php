<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('problemes', function (Blueprint $table) {
            $table->foreignId('chauffeur_id')->nullable()->after('ambulance_id')
                  ->constrained('chauffeurs')->nullOnDelete();
        });
        // Make ambulance_id nullable (chauffeur may not have one)
        Schema::table('problemes', function (Blueprint $table) {
            $table->unsignedBigInteger('ambulance_id')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('problemes', function (Blueprint $table) {
            $table->dropForeign(['chauffeur_id']);
            $table->dropColumn('chauffeur_id');
        });
    }
};
