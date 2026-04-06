<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AmbulanceController;
use App\Http\Controllers\ChauffeurController;
use App\Http\Controllers\ChauffeurAuthController;
use App\Http\Controllers\MaintenanceController;
use App\Http\Controllers\ProblemeController;
use App\Http\Controllers\HeureTravailController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TacheController;

/*
|--------------------------------------------------------------------------
| Ambulance Fès — API Routes
|--------------------------------------------------------------------------
*/

// ── Auth Admin (public) ────────────────────────────────────────────────────
Route::prefix('auth')->group(function () {
    Route::post('login', [AuthController::class, 'login']);
});

// ── Auth Chauffeur (public) ────────────────────────────────────────────────
Route::prefix('chauffeur')->group(function () {
    Route::post('login', [ChauffeurAuthController::class, 'login']);
});

// ── Routes Admin (protégées par Sanctum - guard users) ────────────────────
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('auth/logout', [AuthController::class, 'logout']);
    Route::get('auth/me',      [AuthController::class, 'me']);

    // Dashboard
    Route::get('dashboard', [DashboardController::class, 'index']);

    // Ambulances
    Route::apiResource('ambulances', AmbulanceController::class);

    // Chauffeurs (CRUD + account management)
    Route::apiResource('chauffeurs', ChauffeurController::class);
    Route::post('chauffeurs/{chauffeur}/account',       [ChauffeurController::class, 'createAccount']);
    Route::post('chauffeurs/{chauffeur}/account/reset', [ChauffeurController::class, 'resetAccount']);
    Route::delete('chauffeurs/{chauffeur}/account',     [ChauffeurController::class, 'deleteAccount']);

    // Maintenance
    Route::apiResource('maintenance', MaintenanceController::class);

    // Problèmes (admin)
    Route::apiResource('problems', ProblemeController::class);

    // Heures de travail (admin)
    Route::apiResource('work-hours', HeureTravailController::class);

    // Tâches (admin)
    Route::apiResource('taches', TacheController::class)->except(['show']);
    Route::patch('taches/{tache}/confirmer', [TacheController::class, 'confirmer']);
});

// ── Routes Chauffeur (protégées - guard chauffeur) ─────────────────────────
Route::middleware('auth:chauffeur')->prefix('chauffeur')->group(function () {

    Route::post('logout',    [ChauffeurAuthController::class, 'logout']);
    Route::get('me',         [ChauffeurAuthController::class, 'me']);
    Route::get('dashboard',  [ChauffeurAuthController::class, 'dashboard']);

    // Tâches du chauffeur
    Route::get('taches',                      [TacheController::class, 'mesTaches']);
    Route::patch('taches/{tache}/statut',     [TacheController::class, 'updateStatut']);

    // Problèmes du chauffeur
    Route::get('problemes',                   [ChauffeurController::class, 'mesProblemes']);
    Route::post('problemes',                  [ChauffeurController::class, 'signalerProbleme']);

    // Heures du chauffeur
    Route::get('heures',                      [ChauffeurController::class, 'mesHeures']);
});
