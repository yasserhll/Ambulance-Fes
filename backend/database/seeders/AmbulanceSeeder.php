<?php

namespace Database\Seeders;

use App\Models\Ambulance;
use Illuminate\Database\Seeder;

class AmbulanceSeeder extends Seeder
{
    public function run(): void
    {
        $ambulances = [
            [
                'immatriculation'    => 'AM-001-FES',
                'marque'             => 'Mercedes-Benz',
                'modele'             => 'Sprinter 316',
                'annee'              => 2021,
                'statut'             => 'disponible',
                'conducteur'         => 'Khalid Benali',
                'telephone_conducteur' => '+212661234501',
                'kilometrage'        => 45200,
                'derniere_revision'  => '2024-10-15',
                'prochaine_revision' => '2025-04-15',
                'notes'              => 'Unité principale — équipée défibrillateur AED et oxygène portable.',
            ],
            [
                'immatriculation'    => 'AM-002-FES',
                'marque'             => 'Renault',
                'modele'             => 'Master L3H2',
                'annee'              => 2020,
                'statut'             => 'en_service',
                'conducteur'         => 'Hassan Zouaki',
                'telephone_conducteur' => '+212661234502',
                'kilometrage'        => 78900,
                'derniere_revision'  => '2024-09-01',
                'prochaine_revision' => '2025-03-01',
                'notes'              => 'Affectée au secteur Médina.',
            ],
            [
                'immatriculation'    => 'AM-003-FES',
                'marque'             => 'Ford',
                'modele'             => 'Transit Custom',
                'annee'              => 2022,
                'statut'             => 'maintenance',
                'conducteur'         => 'Youssef Chtaini',
                'telephone_conducteur' => '+212661234503',
                'kilometrage'        => 23100,
                'derniere_revision'  => '2025-01-10',
                'prochaine_revision' => '2025-07-10',
                'notes'              => 'En révision — retour prévu dans 3 jours.',
            ],
            [
                'immatriculation'    => 'AM-004-FES',
                'marque'             => 'Peugeot',
                'modele'             => 'Boxer L4H3',
                'annee'              => 2019,
                'statut'             => 'disponible',
                'conducteur'         => 'Mohamed Tazi',
                'telephone_conducteur' => '+212661234504',
                'kilometrage'        => 112400,
                'derniere_revision'  => '2024-11-20',
                'prochaine_revision' => '2025-05-20',
                'notes'              => 'Transport inter-villes principalement.',
            ],
            [
                'immatriculation'    => 'AM-005-FES',
                'marque'             => 'Mercedes-Benz',
                'modele'             => 'Vito 116 CDI',
                'annee'              => 2023,
                'statut'             => 'disponible',
                'conducteur'         => 'Rachid Filali',
                'telephone_conducteur' => '+212661234505',
                'kilometrage'        => 11800,
                'derniere_revision'  => '2024-12-05',
                'prochaine_revision' => '2025-06-05',
                'notes'              => 'Unité neuve — secteur Ville Nouvelle.',
            ],
            [
                'immatriculation'    => 'AM-006-FES',
                'marque'             => 'Toyota',
                'modele'             => 'HiAce LWB',
                'annee'              => 2018,
                'statut'             => 'hors_service',
                'conducteur'         => null,
                'telephone_conducteur' => null,
                'kilometrage'        => 198300,
                'derniere_revision'  => '2024-07-01',
                'prochaine_revision' => null,
                'notes'              => 'Hors service — en attente de décision de remplacement.',
            ],
        ];

        foreach ($ambulances as $data) {
            Ambulance::create($data);
        }

        $this->command->info('✅ 6 ambulances créées.');
    }
}
