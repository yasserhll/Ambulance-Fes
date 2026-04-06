<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Chauffeur extends Authenticatable
{
    use HasApiTokens;

    protected $fillable = [
        'nom',
        'prenom',
        'telephone',
        'statut',
        'ambulance_id',
        'email',
        'password',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $appends = ['has_account'];

    public function ambulance(): BelongsTo
    {
        return $this->belongsTo(Ambulance::class);
    }

    public function taches(): HasMany
    {
        return $this->hasMany(Tache::class);
    }

    public function problemes(): HasMany
    {
        return $this->hasMany(Probleme::class);
    }

    public function heuresTravail(): HasMany
    {
        return $this->hasMany(HeureTravail::class);
    }

    public function getHasAccountAttribute(): bool
    {
        return !is_null($this->email) && !is_null($this->password);
    }
}
