<?php

namespace Database\Seeders;

use App\Models\Maintenance;
use Illuminate\Database\Seeder;

class MaintenanceSeeder extends Seeder
{
    public function run(): void
    {
        $maintenances = [
            [
                'ambulance_id' => 1,
                'type'         => 'revision',
                'description'  => 'Révision générale 45 000 km — vidange, filtres, plaquettes de frein',
                'date_debut'   => '2024-10-15',
                'date_fin'     => '2024-10-15',
                'statut'       => 'terminee',
                'cout'         => 1850.00,
                'technicien'   => 'Ali Mechanics',
                'garage'       => 'Garage Central Fès',
                'notes'        => 'RAS — véhicule en bon état.',
            ],
            [
                'ambulance_id' => 2,
                'type'         => 'reparation',
                'description'  => 'Remplacement alternateur défectueux',
                'date_debut'   => '2024-09-01',
                'date_fin'     => '2024-09-02',
                'statut'       => 'terminee',
                'cout'         => 2400.00,
                'technicien'   => 'Omar El Fassi',
                'garage'       => 'Auto Service Fès Nord',
                'notes'        => 'Pièce importée — délai 1 jour.',
            ],
            [
                'ambulance_id' => 3,
                'type'         => 'controle_technique',
                'description'  => 'Contrôle technique annuel + visite sanitaire',
                'date_debut'   => '2025-01-10',
                'date_fin'     => null,
                'statut'       => 'en_cours',
                'cout'         => null,
                'technicien'   => 'Centre Technique Agréé',
                'garage'       => 'CTA Fès',
                'notes'        => 'En attente résultats inspection sanitaire.',
            ],
            [
                'ambulance_id' => 4,
                'type'         => 'revision',
                'description'  => 'Révision 110 000 km — courroie de distribution, pompe à eau',
                'date_debut'   => '2024-11-20',
                'date_fin'     => '2024-11-22',
                'statut'       => 'terminee',
                'cout'         => 3200.00,
                'technicien'   => 'Karim Auto',
                'garage'       => 'Garage Ville Nouvelle',
                'notes'        => 'Courroie remplacée préventive.',
            ],
            [
                'ambulance_id' => 5,
                'type'         => 'revision',
                'description'  => 'Première révision 10 000 km',
                'date_debut'   => '2024-12-05',
                'date_fin'     => '2024-12-05',
                'statut'       => 'terminee',
                'cout'         => 650.00,
                'technicien'   => 'Mercedes Official',
                'garage'       => 'Concessionnaire MB Fès',
                'notes'        => 'Garantie constructeur.',
            ],
            [
                'ambulance_id' => 1,
                'type'         => 'autre',
                'description'  => 'Désinfection complète + remplacement consommables médicaux',
                'date_debut'   => '2025-01-20',
                'date_fin'     => '2025-01-20',
                'statut'       => 'planifiee',
                'cout'         => 400.00,
                'technicien'   => null,
                'garage'       => null,
                'notes'        => 'Procédure mensuelle obligatoire.',
            ],
        ];

        foreach ($maintenances as $data) {
            Maintenance::create($data);
        }

        $this->command->info('✅ 6 maintenances créées.');
    }
}
