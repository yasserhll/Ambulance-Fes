<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class HeureTravail extends Model
{
    use SoftDeletes;

    protected $table = 'heures_travail';

    protected $fillable = [
        'ambulance_id',
        'conducteur',
        'date',
        'heure_debut',
        'heure_fin',
        'heures_total',
        'type_service',
        'nombre_interventions',
        'notes',
    ];

    protected $casts = [
        'date'                 => 'date',
        'heures_total'         => 'float',
        'nombre_interventions' => 'integer',
    ];

    public function ambulance()
    {
        return $this->belongsTo(Ambulance::class);
    }
}
