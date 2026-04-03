<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Chauffeur;
use App\Models\Ambulance;

class ChauffeurSeeder extends Seeder
{
    public function run(): void
    {
        $ambulances = Ambulance::pluck('id')->toArray();

        $chauffeurs = [
            ['nom' => 'Benali',    'prenom' => 'Youssef',  'telephone' => '+212661100001', 'statut' => 'en_mission'],
            ['nom' => 'Idrissi',   'prenom' => 'Rachid',   'telephone' => '+212661100002', 'statut' => 'repos'],
            ['nom' => 'Cherkaoui', 'prenom' => 'Hamza',    'telephone' => '+212661100003', 'statut' => 'maintenance'],
            ['nom' => 'Tazi',      'prenom' => 'Omar',     'telephone' => '+212661100004', 'statut' => 'en_mission'],
            ['nom' => 'Fassi',     'prenom' => 'Khalid',   'telephone' => '+212661100005', 'statut' => 'conge'],
            ['nom' => 'Alaoui',    'prenom' => 'Mehdi',    'telephone' => '+212661100006', 'statut' => 'repos'],
        ];

        foreach ($chauffeurs as $i => $data) {
            Chauffeur::create([
                ...$data,
                'ambulance_id' => $ambulances[$i % count($ambulances)] ?? null,
            ]);
        }
    }
}
