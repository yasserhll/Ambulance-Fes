<?php

namespace App\Http\Controllers;

use App\Models\Probleme;
use Illuminate\Http\Request;

class ProblemeController extends Controller
{
    public function index(Request $request)
    {
        $query = Probleme::with('ambulance');

        if ($request->statut) {
            $query->where('statut', $request->statut);
        }
        if ($request->priorite) {
            $query->where('priorite', $request->priorite);
        }
        if ($request->ambulance_id) {
            $query->where('ambulance_id', $request->ambulance_id);
        }

        $priorityOrder = ['critique' => 0, 'haute' => 1, 'normale' => 2, 'faible' => 3];

        return response()->json(
            $query->orderByRaw("FIELD(priorite, 'critique','haute','normale','faible')")
                  ->orderBy('date_rapport', 'desc')
                  ->get()
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'ambulance_id'    => 'required|exists:ambulances,id',
            'titre'           => 'required|string|max:255',
            'description'     => 'required|string',
            'priorite'        => 'required|in:faible,normale,haute,critique',
            'statut'          => 'required|in:ouvert,en_cours,resolu,ferme',
            'rapporte_par'    => 'nullable|string',
            'date_rapport'    => 'required|date',
            'date_resolution' => 'nullable|date|after_or_equal:date_rapport',
            'solution'        => 'nullable|string',
        ]);

        $probleme = Probleme::create($data);

        return response()->json($probleme->load('ambulance'), 201);
    }

    public function show(Probleme $probleme)
    {
        return response()->json($probleme->load('ambulance'));
    }

    public function update(Request $request, Probleme $probleme)
    {
        $data = $request->validate([
            'ambulance_id'    => 'sometimes|exists:ambulances,id',
            'titre'           => 'sometimes|string|max:255',
            'description'     => 'sometimes|string',
            'priorite'        => 'sometimes|in:faible,normale,haute,critique',
            'statut'          => 'sometimes|in:ouvert,en_cours,resolu,ferme',
            'rapporte_par'    => 'nullable|string',
            'date_rapport'    => 'sometimes|date',
            'date_resolution' => 'nullable|date',
            'solution'        => 'nullable|string',
        ]);

        $probleme->update($data);

        return response()->json($probleme->load('ambulance'));
    }

    public function destroy(Probleme $probleme)
    {
        $probleme->delete();

        return response()->json(['message' => 'Problème supprimé.']);
    }
}
