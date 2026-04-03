<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AmbulanceController;
use App\Http\Controllers\ChauffeurController;
use App\Http\Controllers\MaintenanceController;
use App\Http\Controllers\ProblemeController;
use App\Http\Controllers\HeureTravailController;
use App\Http\Controllers\DashboardController;

/*
|--------------------------------------------------------------------------
| Ambulance Fès — API Routes
|--------------------------------------------------------------------------
*/

// Auth (public)
Route::prefix('auth')->group(function () {
    Route::post('login', [AuthController::class, 'login']);
});

// Routes protégées par Sanctum
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('auth/logout', [AuthController::class, 'logout']);
    Route::get('auth/me',      [AuthController::class, 'me']);

    // Dashboard
    Route::get('dashboard', [DashboardController::class, 'index']);

    // Ambulances
    Route::apiResource('ambulances', AmbulanceController::class);

    // Chauffeurs
    Route::apiResource('chauffeurs', ChauffeurController::class);

    // Maintenance
    Route::apiResource('maintenance', MaintenanceController::class);

    // Problèmes
    Route::apiResource('problems', ProblemeController::class);

    // Heures de travail
    Route::apiResource('work-hours', HeureTravailController::class);
});
