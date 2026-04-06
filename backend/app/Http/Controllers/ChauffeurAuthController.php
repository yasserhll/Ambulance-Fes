<?php

namespace App\Http\Controllers;

use App\Models\Chauffeur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class ChauffeurAuthController extends Controller
{
    /**
     * POST /api/chauffeur/login
     */
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $chauffeur = Chauffeur::where('email', $request->email)->first();

        if (!$chauffeur || !$chauffeur->password || !Hash::check($request->password, $chauffeur->password)) {
            throw ValidationException::withMessages([
                'email' => ['Email ou mot de passe incorrect.'],
            ]);
        }

        $token = $chauffeur->createToken('chauffeur-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'chauffeur' => [
                'id'        => $chauffeur->id,
                'nom'       => $chauffeur->nom,
                'prenom'    => $chauffeur->prenom,
                'email'     => $chauffeur->email,
                'statut'    => $chauffeur->statut,
                'ambulance' => $chauffeur->ambulance?->only(['id', 'immatriculation']),
            ],
        ]);
    }

    /**
     * POST /api/chauffeur/logout
     */
    public function logout(Request $request)
    {
        $request->user('chauffeur')->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnecté.']);
    }

    /**
     * GET /api/chauffeur/me
     */
    public function me(Request $request)
    {
        $c = $request->user('chauffeur')->load('ambulance');
        return response()->json([
            'id'        => $c->id,
            'nom'       => $c->nom,
            'prenom'    => $c->prenom,
            'email'     => $c->email,
            'statut'    => $c->statut,
            'ambulance' => $c->ambulance?->only(['id', 'immatriculation']),
        ]);
    }

    /**
     * GET /api/chauffeur/dashboard
     */
    public function dashboard(Request $request)
    {
        $c = $request->user('chauffeur');

        $taches    = $c->taches();
        $problemes = $c->problemes();
        $heures    = $c->heuresTravail();

        $now   = now();
        $debut = $now->copy()->startOfMonth();
        $fin   = $now->copy()->endOfMonth();

        return response()->json([
            'taches' => [
                'total'      => $taches->count(),
                'en_attente' => $taches->clone()->where('statut', 'en_attente')->count(),
                'en_cours'   => $taches->clone()->where('statut', 'en_cours')->count(),
                'terminee'   => $taches->clone()->where('statut', 'terminee')->count(),
                'confirmees' => $taches->clone()->where('confirme_par_admin', true)->count(),
            ],
            'problemes' => [
                'total'  => $problemes->count(),
                'ouvert' => $problemes->clone()->whereIn('statut', ['ouvert', 'en_cours'])->count(),
                'resolu' => $problemes->clone()->where('statut', 'resolu')->count(),
            ],
            'heures' => [
                'total_mois'           => round($heures->clone()->whereBetween('date', [$debut, $fin])->sum('duree_heures'), 1),
                'interventions_mois'   => $heures->clone()->whereBetween('date', [$debut, $fin])->count(),
            ],
            'ambulance' => $c->ambulance?->only(['immatriculation', 'statut']),
        ]);
    }
}
