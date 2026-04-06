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
        'chauffeur_id',
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

    public function chauffeur()
    {
        return $this->belongsTo(Chauffeur::class);
    }

    // Alias for frontend compatibility
    public function getDureeHeuresAttribute(): float
    {
        return $this->heures_total ?? 0;
    }

    public function getTypeAttribute(): string
    {
        return $this->type_service ?? 'service';
    }
}
