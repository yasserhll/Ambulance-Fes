<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Chauffeur extends Model
{
    protected $fillable = [
        'nom',
        'prenom',
        'telephone',
        'statut',
        'ambulance_id',
    ];

    public function ambulance(): BelongsTo
    {
        return $this->belongsTo(Ambulance::class);
    }
}
