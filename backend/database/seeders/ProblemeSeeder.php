<?php

namespace Database\Seeders;

use App\Models\Probleme;
use Illuminate\Database\Seeder;

class ProblemeSeeder extends Seeder
{
    public function run(): void
    {
        $problemes = [
            [
                'ambulance_id'    => 2,
                'titre'           => 'Climatisation insuffisante',
                'description'     => 'La climatisation ne refroidit plus correctement l\'habitacle arrière. Problème détecté lors d\'un transfert le 05/01/2025.',
                'priorite'        => 'normale',
                'statut'          => 'ouvert',
                'rapporte_par'    => 'Hassan Zouaki',
                'date_rapport'    => '2025-01-05',
                'date_resolution' => null,
                'solution'        => null,
            ],
            [
                'ambulance_id'    => 6,
                'titre'           => 'Moteur — perte de puissance sévère',
                'description'     => 'Le véhicule perd de la puissance brusquement lors de montées. Voyant moteur allumé en permanence. Risque de panne totale.',
                'priorite'        => 'critique',
                'statut'          => 'en_cours',
                'rapporte_par'    => 'Mohamed Tazi',
                'date_rapport'    => '2024-12-10',
                'date_resolution' => null,
                'solution'        => 'Diagnostic informatique en attente — soupçon de turbo défectueux.',
            ],
            [
                'ambulance_id'    => 1,
                'titre'           => 'Gyrophare arrière gauche clignotant',
                'description'     => 'Le gyrophare arrière gauche clignote de manière irrégulière. Problème intermittent depuis 3 jours.',
                'priorite'        => 'haute',
                'statut'          => 'resolu',
                'rapporte_par'    => 'Khalid Benali',
                'date_rapport'    => '2025-01-08',
                'date_resolution' => '2025-01-10',
                'solution'        => 'Remplacement ampoule et nettoyage connecteur — problème résolu.',
            ],
            [
                'ambulance_id'    => 4,
                'titre'           => 'Civière — mécanisme de verrouillage difficile',
                'description'     => 'Le mécanisme de verrouillage de la civière principale est difficile à manipuler. Ralentit les interventions.',
                'priorite'        => 'haute',
                'statut'          => 'ouvert',
                'rapporte_par'    => 'Mohamed Tazi',
                'date_rapport'    => '2025-01-12',
                'date_resolution' => null,
                'solution'        => null,
            ],
            [
                'ambulance_id'    => 3,
                'titre'           => 'Fuite légère liquide de refroidissement',
                'description'     => 'Trace de liquide de refroidissement constatée sous le véhicule après stationnement. Niveau à surveiller.',
                'priorite'        => 'normale',
                'statut'          => 'en_cours',
                'rapporte_par'    => 'Youssef Chtaini',
                'date_rapport'    => '2025-01-09',
                'date_resolution' => null,
                'solution'        => 'Identifié lors du contrôle technique — joint de culasse à vérifier.',
            ],
            [
                'ambulance_id'    => 5,
                'titre'           => 'Application GPS — écran figé par temps froid',
                'description'     => 'L\'écran GPS intégré se fige pendant quelques secondes au démarrage par temps froid (< 5°C).',
                'priorite'        => 'faible',
                'statut'          => 'ouvert',
                'rapporte_par'    => 'Rachid Filali',
                'date_rapport'    => '2025-01-14',
                'date_resolution' => null,
                'solution'        => null,
            ],
        ];

        foreach ($problemes as $data) {
            Probleme::create($data);
        }

        $this->command->info('✅ 6 problèmes créés.');
    }
}
