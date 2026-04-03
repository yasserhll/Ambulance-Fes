<?php

namespace App\Http\Controllers;

use App\Models\Chauffeur;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ChauffeurController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Chauffeur::with('ambulance');

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('nom', 'like', "%{$s}%")
                  ->orWhere('prenom', 'like', "%{$s}%")
                  ->orWhere('telephone', 'like', "%{$s}%");
            });
        }

        if ($request->filled('statut')) {
            $query->where('statut', $request->statut);
        }

        return response()->json($query->orderBy('nom')->get());
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'nom'          => 'required|string|max:100',
            'prenom'       => 'required|string|max:100',
            'telephone'    => 'required|string|max:20',
            'statut'       => 'required|in:en_mission,repos,conge,formation,maintenance,hors_service',
            'ambulance_id' => 'nullable|exists:ambulances,id',
        ]);

        $chauffeur = Chauffeur::create($data);

        return response()->json($chauffeur->load('ambulance'), 201);
    }

    public function update(Request $request, Chauffeur $chauffeur): JsonResponse
    {
        $data = $request->validate([
            'nom'          => 'sometimes|required|string|max:100',
            'prenom'       => 'sometimes|required|string|max:100',
            'telephone'    => 'sometimes|required|string|max:20',
            'statut'       => 'sometimes|required|in:en_mission,repos,conge,formation,maintenance,hors_service',
            'ambulance_id' => 'nullable|exists:ambulances,id',
        ]);

        $chauffeur->update($data);

        return response()->json($chauffeur->load('ambulance'));
    }

    public function destroy(Chauffeur $chauffeur): JsonResponse
    {
        $chauffeur->delete();

        return response()->json(['message' => 'Chauffeur supprimé.']);
    }
}
