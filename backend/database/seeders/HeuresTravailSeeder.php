<?php

namespace Database\Seeders;

use App\Models\HeureTravail;
use Illuminate\Database\Seeder;

class HeuresTravailSeeder extends Seeder
{
    public function run(): void
    {
        $heures = [
            // Semaine du 13 janvier 2025
            ['ambulance_id' => 1, 'conducteur' => 'Khalid Benali',  'date' => '2025-01-13', 'heure_debut' => '08:00', 'heure_fin' => '20:00', 'heures_total' => 12.0, 'type_service' => 'urgence',    'nombre_interventions' => 4, 'notes' => '4 appels urgence dont 1 CHU Hassan II'],
            ['ambulance_id' => 2, 'conducteur' => 'Hassan Zouaki',  'date' => '2025-01-13', 'heure_debut' => '20:00', 'heure_fin' => '08:00', 'heures_total' => 12.0, 'type_service' => 'permanence', 'nombre_interventions' => 2, 'notes' => 'Garde de nuit secteur Médina'],
            ['ambulance_id' => 4, 'conducteur' => 'Mohamed Tazi',   'date' => '2025-01-13', 'heure_debut' => '07:00', 'heure_fin' => '15:00', 'heures_total' => 8.0,  'type_service' => 'transfert',  'nombre_interventions' => 1, 'notes' => 'Transfert Fès → Casablanca'],
            ['ambulance_id' => 5, 'conducteur' => 'Rachid Filali',  'date' => '2025-01-13', 'heure_debut' => '09:00', 'heure_fin' => '17:00', 'heures_total' => 8.0,  'type_service' => 'urgence',    'nombre_interventions' => 3, 'notes' => ''],

            ['ambulance_id' => 1, 'conducteur' => 'Khalid Benali',  'date' => '2025-01-14', 'heure_debut' => '08:00', 'heure_fin' => '20:00', 'heures_total' => 12.0, 'type_service' => 'urgence',    'nombre_interventions' => 5, 'notes' => ''],
            ['ambulance_id' => 2, 'conducteur' => 'Hassan Zouaki',  'date' => '2025-01-14', 'heure_debut' => '08:00', 'heure_fin' => '16:00', 'heures_total' => 8.0,  'type_service' => 'transfert',  'nombre_interventions' => 2, 'notes' => ''],
            ['ambulance_id' => 4, 'conducteur' => 'Mohamed Tazi',   'date' => '2025-01-14', 'heure_debut' => '16:00', 'heure_fin' => '00:00', 'heures_total' => 8.0,  'type_service' => 'permanence', 'nombre_interventions' => 1, 'notes' => ''],
            ['ambulance_id' => 5, 'conducteur' => 'Rachid Filali',  'date' => '2025-01-14', 'heure_debut' => '09:00', 'heure_fin' => '21:00', 'heures_total' => 12.0, 'type_service' => 'urgence',    'nombre_interventions' => 6, 'notes' => 'Journée intense'],

            ['ambulance_id' => 1, 'conducteur' => 'Khalid Benali',  'date' => '2025-01-15', 'heure_debut' => '08:00', 'heure_fin' => '20:00', 'heures_total' => 12.0, 'type_service' => 'urgence',    'nombre_interventions' => 3, 'notes' => ''],
            ['ambulance_id' => 2, 'conducteur' => 'Hassan Zouaki',  'date' => '2025-01-15', 'heure_debut' => '20:00', 'heure_fin' => '08:00', 'heures_total' => 12.0, 'type_service' => 'permanence', 'nombre_interventions' => 1, 'notes' => ''],
            ['ambulance_id' => 4, 'conducteur' => 'Mohamed Tazi',   'date' => '2025-01-15', 'heure_debut' => '07:00', 'heure_fin' => '19:00', 'heures_total' => 12.0, 'type_service' => 'transfert',  'nombre_interventions' => 2, 'notes' => 'Transfert Fès → Meknès'],
            ['ambulance_id' => 5, 'conducteur' => 'Rachid Filali',  'date' => '2025-01-15', 'heure_debut' => '09:00', 'heure_fin' => '17:00', 'heures_total' => 8.0,  'type_service' => 'urgence',    'nombre_interventions' => 2, 'notes' => ''],
        ];

        foreach ($heures as $data) {
            HeureTravail::create($data);
        }

        $this->command->info('✅ 12 entrées heures de travail créées.');
    }
}
