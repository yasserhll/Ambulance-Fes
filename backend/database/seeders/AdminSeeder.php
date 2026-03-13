<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@ambulancefes.ma'],
            [
                'name'     => 'Administrateur',
                'email'    => 'admin@ambulancefes.ma',
                'password' => Hash::make('Admin@1234'),
            ]
        );

        $this->command->info('✅ Admin créé: admin@ambulancefes.ma / Admin@1234');
    }
}
