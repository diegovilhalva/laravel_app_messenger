<x-mail::message>
Olá {{$user-name}},

Sua conta foi registrada com sucesso.
** Aqui estão suas credenciais ** <br>
Email: {{$user->email}} <br>
Senha: {{$password}}

Por favor entre no sistema e muda sua senha.
<x-mail::button url="{{route('login)}}">
        Clique aqui para fazer login
</x-mail::button>

Atenciosamente, <br>
{{config('app.name')}}
</x-mail::message>