<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Tache extends Model
{
    protected $fillable = [
        'chauffeur_id',
        'ambulance_id',
        'titre',
        'description',
        'statut',
        'confirme_par_admin',
        'date_debut',
        'date_fin',
        'notes_admin',
    ];

    protected $casts = [
        'confirme_par_admin' => 'boolean',
        'date_debut' => 'date:Y-m-d',
        'date_fin' => 'date:Y-m-d',
    ];

    public function chauffeur(): BelongsTo
    {
        return $this->belongsTo(Chauffeur::class);
    }

    public function ambulance(): BelongsTo
    {
        return $this->belongsTo(Ambulance::class);
    }
}
