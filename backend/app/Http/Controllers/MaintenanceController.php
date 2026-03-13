<?php

namespace App\Http\Controllers;

use App\Models\Maintenance;
use Illuminate\Http\Request;

class MaintenanceController extends Controller
{
    public function index(Request $request)
    {
        $query = Maintenance::with('ambulance');

        if ($request->statut) {
            $query->where('statut', $request->statut);
        }
        if ($request->ambulance_id) {
            $query->where('ambulance_id', $request->ambulance_id);
        }

        return response()->json($query->orderBy('date_debut', 'desc')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'ambulance_id' => 'required|exists:ambulances,id',
            'type'         => 'required|in:revision,reparation,controle_technique,autre',
            'description'  => 'required|string',
            'date_debut'   => 'required|date',
            'date_fin'     => 'nullable|date|after_or_equal:date_debut',
            'statut'       => 'required|in:planifiee,en_cours,terminee',
            'cout'         => 'nullable|numeric|min:0',
            'technicien'   => 'nullable|string',
            'garage'       => 'nullable|string',
            'notes'        => 'nullable|string',
        ]);

        $maintenance = Maintenance::create($data);

        return response()->json($maintenance->load('ambulance'), 201);
    }

    public function show(Maintenance $maintenance)
    {
        return response()->json($maintenance->load('ambulance'));
    }

    public function update(Request $request, Maintenance $maintenance)
    {
        $data = $request->validate([
            'ambulance_id' => 'sometimes|exists:ambulances,id',
            'type'         => 'sometimes|in:revision,reparation,controle_technique,autre',
            'description'  => 'sometimes|string',
            'date_debut'   => 'sometimes|date',
            'date_fin'     => 'nullable|date',
            'statut'       => 'sometimes|in:planifiee,en_cours,terminee',
            'cout'         => 'nullable|numeric|min:0',
            'technicien'   => 'nullable|string',
            'garage'       => 'nullable|string',
            'notes'        => 'nullable|string',
        ]);

        $maintenance->update($data);

        return response()->json($maintenance->load('ambulance'));
    }

    public function destroy(Maintenance $maintenance)
    {
        $maintenance->delete();

        return response()->json(['message' => 'Maintenance supprimée.']);
    }
}
