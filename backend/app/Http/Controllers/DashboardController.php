<?php

namespace App\Http\Controllers;

use App\Models\Ambulance;
use App\Models\Maintenance;
use App\Models\Probleme;
use App\Models\HeureTravail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        // Flotte stats
        $flotte = [
            'total'         => Ambulance::count(),
            'disponible'    => Ambulance::where('statut', 'disponible')->count(),
            'en_service'    => Ambulance::where('statut', 'en_service')->count(),
            'maintenance'   => Ambulance::where('statut', 'maintenance')->count(),
            'hors_service'  => Ambulance::where('statut', 'hors_service')->count(),
        ];

        // Maintenance stats
        $maintenance = [
            'planifiee'  => Maintenance::where('statut', 'planifiee')->count(),
            'en_cours'   => Maintenance::where('statut', 'en_cours')->count(),
            'terminee'   => Maintenance::where('statut', 'terminee')->count(),
            'cout_mois'  => Maintenance::whereMonth('date_debut', now()->month)
                                ->whereYear('date_debut', now()->year)
                                ->sum('cout'),
        ];

        // Problèmes stats
        $problemes = [
            'ouvert'    => Probleme::where('statut', 'ouvert')->count(),
            'critique'  => Probleme::where('statut', '!=', 'resolu')
                                    ->where('statut', '!=', 'ferme')
                                    ->where('priorite', 'critique')->count(),
            'en_cours'  => Probleme::where('statut', 'en_cours')->count(),
            'resolu'    => Probleme::where('statut', 'resolu')->count(),
        ];

        // Heures de travail ce mois
        $heures = [
            'total_heures_mois'         => HeureTravail::whereMonth('date', now()->month)
                                              ->whereYear('date', now()->year)
                                              ->sum('heures_total'),
            'total_interventions_mois'  => HeureTravail::whereMonth('date', now()->month)
                                              ->whereYear('date', now()->year)
                                              ->sum('nombre_interventions'),
        ];

        // Dernières maintenances
        $dernieres_maintenances = Maintenance::with('ambulance')
            ->orderBy('updated_at', 'desc')
            ->take(5)
            ->get();

        // Problèmes critiques ouverts
        $problemes_critiques = Probleme::with('ambulance')
            ->whereIn('statut', ['ouvert', 'en_cours'])
            ->whereIn('priorite', ['critique', 'haute'])
            ->orderByRaw("FIELD(priorite, 'critique','haute')")
            ->take(5)
            ->get();

        return response()->json([
            'flotte'                 => $flotte,
            'maintenance'            => $maintenance,
            'problemes'              => $problemes,
            'heures'                 => $heures,
            'dernieres_maintenances' => $dernieres_maintenances,
            'problemes_critiques'    => $problemes_critiques,
        ]);
    }
}
