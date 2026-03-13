<?php

namespace App\Http\Controllers;

use App\Models\HeureTravail;
use Illuminate\Http\Request;

class HeureTravailController extends Controller
{
    public function index(Request $request)
    {
        $query = HeureTravail::with('ambulance');

        if ($request->ambulance_id) {
            $query->where('ambulance_id', $request->ambulance_id);
        }
        if ($request->conducteur) {
            $query->where('conducteur', 'like', '%' . $request->conducteur . '%');
        }
        if ($request->date_debut && $request->date_fin) {
            $query->whereBetween('date', [$request->date_debut, $request->date_fin]);
        }

        return response()->json($query->orderBy('date', 'desc')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'ambulance_id'         => 'required|exists:ambulances,id',
            'conducteur'           => 'required|string',
            'date'                 => 'required|date',
            'heure_debut'          => 'required|date_format:H:i',
            'heure_fin'            => 'nullable|date_format:H:i',
            'heures_total'         => 'nullable|numeric|min:0|max:24',
            'type_service'         => 'required|in:urgence,transfert,permanence,autre',
            'nombre_interventions' => 'nullable|integer|min:0',
            'notes'                => 'nullable|string',
        ]);

        // Auto-calculate heures_total if both times provided
        if (!empty($data['heure_fin']) && empty($data['heures_total'])) {
            $debut = strtotime($data['heure_debut']);
            $fin   = strtotime($data['heure_fin']);
            if ($fin < $debut) {
                $fin += 86400; // overnight shift
            }
            $data['heures_total'] = round(($fin - $debut) / 3600, 2);
        }

        $heure = HeureTravail::create($data);

        return response()->json($heure->load('ambulance'), 201);
    }

    public function show(HeureTravail $heureTravail)
    {
        return response()->json($heureTravail->load('ambulance'));
    }

    public function update(Request $request, HeureTravail $heureTravail)
    {
        $data = $request->validate([
            'ambulance_id'         => 'sometimes|exists:ambulances,id',
            'conducteur'           => 'sometimes|string',
            'date'                 => 'sometimes|date',
            'heure_debut'          => 'sometimes|date_format:H:i',
            'heure_fin'            => 'nullable|date_format:H:i',
            'heures_total'         => 'nullable|numeric|min:0|max:24',
            'type_service'         => 'sometimes|in:urgence,transfert,permanence,autre',
            'nombre_interventions' => 'nullable|integer|min:0',
            'notes'                => 'nullable|string',
        ]);

        $heureTravail->update($data);

        return response()->json($heureTravail->load('ambulance'));
    }

    public function destroy(HeureTravail $heureTravail)
    {
        $heureTravail->delete();

        return response()->json(['message' => 'Entrée supprimée.']);
    }
}
