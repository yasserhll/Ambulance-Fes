<?php

namespace App\Http\Controllers;

use App\Models\Chauffeur;
use App\Models\Probleme;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ChauffeurController extends Controller
{
    public function index(Request $request)
    {
        $q = Chauffeur::with('ambulance');
        if ($request->search) {
            $q->where(function($query) use ($request) {
                $query->where('nom', 'like', '%'.$request->search.'%')
                      ->orWhere('prenom', 'like', '%'.$request->search.'%');
            });
        }
        if ($request->statut) {
            $q->where('statut', $request->statut);
        }
        return $q->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nom'          => 'required|string|max:100',
            'prenom'       => 'required|string|max:100',
            'telephone'    => 'required|string|max:20',
            'statut'       => 'required|in:en_mission,repos,conge,formation,maintenance,hors_service',
            'ambulance_id' => 'nullable|exists:ambulances,id',
        ]);
        return Chauffeur::create($data)->load('ambulance');
    }

    public function show(Chauffeur $chauffeur)
    {
        return $chauffeur->load('ambulance');
    }

    public function update(Request $request, Chauffeur $chauffeur)
    {
        $data = $request->validate([
            'nom'          => 'string|max:100',
            'prenom'       => 'string|max:100',
            'telephone'    => 'string|max:20',
            'statut'       => 'in:en_mission,repos,conge,formation,maintenance,hors_service',
            'ambulance_id' => 'nullable|exists:ambulances,id',
        ]);
        $chauffeur->update($data);
        return $chauffeur->fresh('ambulance');
    }

    public function destroy(Chauffeur $chauffeur)
    {
        $chauffeur->delete();
        return response()->noContent();
    }

    // Admin: créer un compte (email + password) pour un chauffeur
    public function createAccount(Request $request, Chauffeur $chauffeur)
    {
        $request->validate([
            'email'    => 'required|email|unique:chauffeurs,email,'.$chauffeur->id,
            'password' => 'required|string|min:6',
        ]);

        $chauffeur->update([
            'email'    => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return response()->json(['message' => 'Compte créé avec succès.', 'chauffeur' => $chauffeur->fresh()]);
    }

    // Admin: réinitialiser le mot de passe
    public function resetAccount(Request $request, Chauffeur $chauffeur)
    {
        $request->validate([
            'password' => 'required|string|min:6',
        ]);

        $chauffeur->update(['password' => Hash::make($request->password)]);
        return response()->json(['message' => 'Mot de passe mis à jour.']);
    }

    // Admin: supprimer le compte (email + password)
    public function deleteAccount(Chauffeur $chauffeur)
    {
        $chauffeur->tokens()->delete();
        $chauffeur->update(['email' => null, 'password' => null]);
        return response()->json(['message' => 'Compte supprimé.']);
    }

    // Chauffeur: ses problèmes
    public function mesProblemes(Request $request)
    {
        return $request->user('chauffeur')
            ->problemes()
            ->with('ambulance')
            ->latest()
            ->get();
    }

    // Chauffeur: signaler un problème
    public function signalerProbleme(Request $request)
    {
        $chauffeur = $request->user('chauffeur');

        $data = $request->validate([
            'titre'       => 'required|string|max:255',
            'description' => 'required|string',
            'priorite'    => 'in:faible,normale,haute,critique',
        ]);

        $probleme = Probleme::create([
            'titre'         => $data['titre'],
            'description'   => $data['description'],
            'priorite'      => $data['priorite'] ?? 'normale',
            'statut'        => 'ouvert',
            'chauffeur_id'  => $chauffeur->id,
            'ambulance_id'  => $chauffeur->ambulance_id,
            'rapporte_par'  => $chauffeur->prenom . ' ' . $chauffeur->nom,
            'date_rapport'  => now()->toDateString(),
        ]);

        return $probleme->load('ambulance');
    }

    // Chauffeur: ses heures
    public function mesHeures(Request $request)
    {
        return $request->user('chauffeur')
            ->heuresTravail()
            ->latest('date')
            ->get();
    }
}
