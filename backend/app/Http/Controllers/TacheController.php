<?php

namespace App\Http\Controllers;

use App\Models\Tache;
use Illuminate\Http\Request;

class TacheController extends Controller
{
    // Admin: liste toutes les tâches
    public function index(Request $request)
    {
        $q = Tache::with(['chauffeur', 'ambulance']);
        if ($request->chauffeur_id) {
            $q->where('chauffeur_id', $request->chauffeur_id);
        }
        if ($request->statut) {
            $q->where('statut', $request->statut);
        }
        return $q->latest()->get();
    }

    // Admin: créer une tâche
    public function store(Request $request)
    {
        $data = $request->validate([
            'chauffeur_id'       => 'required|exists:chauffeurs,id',
            'ambulance_id'       => 'nullable|exists:ambulances,id',
            'titre'              => 'required|string|max:255',
            'description'        => 'nullable|string',
            'statut'             => 'in:en_attente,en_cours,terminee',
            'confirme_par_admin' => 'boolean',
            'date_debut'         => 'required|date',
            'date_fin'           => 'nullable|date',
            'notes_admin'        => 'nullable|string',
        ]);
        return Tache::create($data)->load(['chauffeur', 'ambulance']);
    }

    // Admin: modifier une tâche
    public function update(Request $request, Tache $tache)
    {
        $data = $request->validate([
            'chauffeur_id'       => 'exists:chauffeurs,id',
            'ambulance_id'       => 'nullable|exists:ambulances,id',
            'titre'              => 'string|max:255',
            'description'        => 'nullable|string',
            'statut'             => 'in:en_attente,en_cours,terminee',
            'confirme_par_admin' => 'boolean',
            'date_debut'         => 'date',
            'date_fin'           => 'nullable|date',
            'notes_admin'        => 'nullable|string',
        ]);
        $tache->update($data);
        return $tache->fresh(['chauffeur', 'ambulance']);
    }

    // Admin: supprimer
    public function destroy(Tache $tache)
    {
        $tache->delete();
        return response()->noContent();
    }

    // Admin: confirmer/déconfirmer
    public function confirmer(Request $request, Tache $tache)
    {
        $tache->update(['confirme_par_admin' => $request->boolean('confirme')]);
        return $tache->fresh();
    }

    // Chauffeur: ses tâches
    public function mesTaches(Request $request)
    {
        $q = $request->user('chauffeur')->taches()->with('ambulance');
        if ($request->statut) {
            $q->where('statut', $request->statut);
        }
        return $q->latest()->get();
    }

    // Chauffeur: changer son statut
    public function updateStatut(Request $request, Tache $tache)
    {
        $chauffeur = $request->user('chauffeur');

        if ($tache->chauffeur_id !== $chauffeur->id) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        if (!$tache->confirme_par_admin) {
            return response()->json(['message' => 'Tâche non confirmée par l\'admin.'], 403);
        }

        $request->validate(['statut' => 'required|in:en_cours,terminee']);
        $tache->update(['statut' => $request->statut]);
        return $tache->fresh();
    }
}
