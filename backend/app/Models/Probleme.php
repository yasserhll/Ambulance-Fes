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
        'date_rapport'    => 'date',
        'date_resolution' => 'date',
    ];

    public function ambulance()
    {
        return $this->belongsTo(Ambulance::class);
    }
}
