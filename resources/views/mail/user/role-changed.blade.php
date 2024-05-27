<x-mail::message>
Olá {{$user->name}},
@if ($user->is_admin)
Temos o prazer de informá-lo(a) que sua conta foi atualizada para o status de Administrador. Agora, você tem acesso a funcionalidades e permissões adicionais no nosso sistema.
Parabéns pela nova posição!
@else
Informamos que sua conta foi atualizada para o status de Usuário Comum. Você continuará a ter acesso às funcionalidades básicas do nosso sistema.
Agradecemos pela sua compreensão.
@endif
<br>
Atenciosamente, <br>
{{config('app.name')}}
</x-mail::message>