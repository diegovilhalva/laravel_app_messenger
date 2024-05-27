<x-mail::message>
    Olá {{$user->name}},
    @if ($user->blocked_at)
    Estamos escrevendo para informá-lo(a) que sua conta no nosso sistema foi  suspensa. 
    Você não poderá acessar os serviços associados à sua conta.

    Agradecemos sua compreensão e estamos à disposição para ajudar a resolver qualquer questão.
    @else
    Estamos felizes em informá-lo(a) que sua conta no nosso sistema foi reativada com sucesso. Você já pode acessar todos os serviços e funcionalidades normalmente.
    <x-mail::button url="{{route('login)}}">
        Clique aqui para fazer login
    </x-mail::button>
    @endif
    <br>
    Atenciosamente,<br>
    {{config('app.name')}}
</x-mail::message>