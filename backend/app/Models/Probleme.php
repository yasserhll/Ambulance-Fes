<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Probleme extends Model
{
    use SoftDeletes;

    protected $table = 'problemes';

    protected $fillable = [
        'ambulance_id',
        'chauffeur_id',
        'titre',
        'description',
        'priorite',
        'statut',
        'rapporte_par',
        'date_rapport',
        'date_resolution',
        'solution',
    ];

    protected $casts = [
        'date_rapport'    => 'date:Y-m-d',
        'date_resolution' => 'date:Y-m-d',
    ];

    public function ambulance()
    {
        return $this->belongsTo(Ambulance::class);
    }

    public function chauffeur()
    {
        return $this->belongsTo(Chauffeur::class);
    }
}
