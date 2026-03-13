<?php

namespace App\Http\Controllers;

use App\Models\Ambulance;
use Illuminate\Http\Request;

class AmbulanceController extends Controller
{
    public function index(Request $request)
    {
        $query = Ambulance::query();

        if ($request->statut) {
            $query->where('statut', $request->statut);
        }
        if ($request->search) {
            $q = $request->search;
            $query->where(function ($q2) use ($q) {
                $q2->where('immatriculation', 'like', "%$q%")
                   ->orWhere('conducteur', 'like', "%$q%")
                   ->orWhere('marque', 'like', "%$q%")
                   ->orWhere('modele', 'like', "%$q%");
            });
        }

        return response()->json($query->orderBy('immatriculation')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'immatriculation'       => 'required|string|unique:ambulances,immatriculation',
            'marque'                => 'required|string',
            'modele'                => 'required|string',
            'annee'                 => 'required|integer|min:1990|max:2030',
            'statut'                => 'required|in:disponible,en_service,maintenance,hors_service',
            'conducteur'            => 'nullable|string',
            'telephone_conducteur'  => 'nullable|string',
            'kilometrage'           => 'nullable|integer|min:0',
            'derniere_revision'     => 'nullable|date',
            'prochaine_revision'    => 'nullable|date',
            'notes'                 => 'nullable|string',
        ]);

        $ambulance = Ambulance::create($data);

        return response()->json($ambulance, 201);
    }

    public function show(Ambulance $ambulance)
    {
        return response()->json($ambulance->load(['maintenances', 'problemes', 'heuresTravail']));
    }

    public function update(Request $request, Ambulance $ambulance)
    {
        $data = $request->validate([
            'immatriculation'       => 'sometimes|string|unique:ambulances,immatriculation,' . $ambulance->id,
            'marque'                => 'sometimes|string',
            'modele'                => 'sometimes|string',
            'annee'                 => 'sometimes|integer|min:1990|max:2030',
            'statut'                => 'sometimes|in:disponible,en_service,maintenance,hors_service',
            'conducteur'            => 'nullable|string',
            'telephone_conducteur'  => 'nullable|string',
            'kilometrage'           => 'nullable|integer|min:0',
            'derniere_revision'     => 'nullable|date',
            'prochaine_revision'    => 'nullable|date',
            'notes'                 => 'nullable|string',
        ]);

        $ambulance->update($data);

        return response()->json($ambulance);
    }

    public function destroy(Ambulance $ambulance)
    {
        $ambulance->delete();

        return response()->json(['message' => 'Ambulance supprimée.']);
    }
}
