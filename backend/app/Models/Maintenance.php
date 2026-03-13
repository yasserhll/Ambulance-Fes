<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Maintenance extends Model
{
    use SoftDeletes;

    protected $table = 'maintenances';

    protected $fillable = [
        'ambulance_id',
        'type',
        'description',
        'date_debut',
        'date_fin',
        'statut',
        'cout',
        'technicien',
        'garage',
        'notes',
    ];

    protected $casts = [
        'date_debut' => 'date',
        'date_fin'   => 'date',
        'cout'       => 'float',
    ];

    public function ambulance()
    {
        return $this->belongsTo(Ambulance::class);
    }
}
