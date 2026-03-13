<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Ambulance extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'immatriculation',
        'marque',
        'modele',
        'annee',
        'statut',
        'conducteur',
        'telephone_conducteur',
        'kilometrage',
        'derniere_revision',
        'prochaine_revision',
        'notes',
    ];

    protected $casts = [
        'derniere_revision'  => 'date',
        'prochaine_revision' => 'date',
        'annee'              => 'integer',
        'kilometrage'        => 'integer',
    ];

    public function maintenances()
    {
        return $this->hasMany(Maintenance::class);
    }

    public function problemes()
    {
        return $this->hasMany(Probleme::class);
    }

    public function heuresTravail()
    {
        return $this->hasMany(HeureTravail::class);
    }
}
