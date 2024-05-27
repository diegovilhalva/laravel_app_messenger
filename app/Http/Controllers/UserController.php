<?php

namespace App\Http\Controllers;

use App\Mail\UserBlockedUnblocked;
use App\Mail\UserCreated;
use App\Mail\UserRoleChanged;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
class UserController extends Controller
{
    public function store(Request $request) 
    {
        $data = request()->validate([
            'name' => 'required|string',
            'email' => ['required','email','unique:users,email'],
            'is_admin' => 'boolean'
        ]);
       // $rawPassword = Str::random(8);
       $rawPassword = '12345678';
        $data['password'] = bcrypt($rawPassword);
        $data['email_verified_at'] = now();
         $user = User::create($data);

         Mail::to($user)->send(new UserCreated($user,$rawPassword));
        return redirect()->back();
    }

    public function changeRole(User $user)
    {
        $user->update(['is_admin' => !(bool) $user->is_admin]);

        $message = 'Usuáro mudou para  ' . ($user->is_admin ? 'Admin' : 'Usuário comum');

        Mail::to($user)->send(new UserRoleChanged($user));
        return response()->json(['message' => $message]);

    }

    public function blockUnblock(User $user)
    {
            if ($user->blocked_at) {
                $user->blocked_at = null;
                $message = 'Conta desbloaqueada';
            }else{
                $user->blocked_at = now();
                $message = 'Conta bloqueada';
            }
            $user->save();

            Mail::to($user)->send(new UserBlockedUnblocked($user));

            return response()->json(['message' => $message]);

    }
}
