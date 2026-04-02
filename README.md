# Creche ERP

Sistema integrado para um colegio da creche a educacao infantil, cobrindo:

- Bercario
- Maternal 1
- Maternal 2
- Pre 1
- Pre 2
- Turmas
- Cadastro de alunos
- Cadastro de funcionarios
- Mensalidades
- Inadimplencia
- Atividades extras
- Contas a pagar
- Contas a receber
- Impostos
- Boletins
- Relatorios executivos
- Perfis operacionais

## Estrutura

- `index.html`: shell da aplicacao e areas principais.
- `app.css`: identidade visual, responsividade e impressao.
- `js/app.js`: modulos, dashboard, edicao, perfis e relatorios.
- `js/store.js`: persistencia local, seeds e adaptador para Firebase.
- `js/firebase-config.js`: configuracao do projeto `creche-5900b`.

## Como usar

Abra `index.html` no navegador. O sistema funciona sem build e persiste os dados em `localStorage`.

## Modulos disponiveis

- Turmas
- Alunos
- Funcionarios
- Mensalidades
- Inadimplencia
- Atividades Extras
- Contas a Receber
- Contas a Pagar
- Impostos
- Boletins

## Recursos implementados

- Dashboard com KPIs academicos e financeiros.
- Centro rapido de relatorios no topo da tela.
- Perfis ativos de Direcao, Secretaria e Financeiro.
- Criacao, edicao, exclusao e mudanca de status dos registros.
- Botao de impressao para relatorios operacionais.

## Firebase

O projeto ja esta apontado para:

- `projectId`: `creche-5900b`
- `projectNumber`: `681463851405`

Nesta versao, o sistema foi ajustado para funcionar no plano `Spark`, sem Cloud Functions. O fluxo usa apenas SDK web, Authentication por e-mail e senha e Firestore.

Para ativar Firestore:

1. Preencha `apiKey` e `appId` em `js/firebase-config.js`.
2. Troque `enabled` para `true`.
3. Habilite o metodo Email/Password em Firebase Authentication no console do projeto.
4. Publique as regras de `firestore.rules`.
5. Se os MCPs forem habilitados em outra sessao, use o mesmo `projectId` `creche-5900b`.

## Integracao atual

- `js/firebase-client.js`: inicializa Firebase, autentica usuarios e sincroniza dados por colecao no Firestore.
- `js/store.js`: escolhe automaticamente entre Firebase e `localStorage`.
- `js/app.js`: reage ao estado de autenticacao e mostra o status da sincronizacao na interface.
- `firestore.rules`: regras iniciais de seguranca para o namespace da escola.
- `firebase.json`: aponta o deploy do Firebase para o arquivo de regras.

## Autenticacao atual

- Fluxo de login por e-mail e senha na barra lateral.
- Cadastro inicial segue dois caminhos:
- `bootstrap admin`: apenas o e-mail definido em `bootstrapAdminEmail`.
- `convite`: exige codigo criado previamente pela Direcao.
- O papel do usuario autenticado (`direcao`, `secretaria`, `financeiro`) passa a definir o perfil ativo na interface.

## Estrutura atual no Firestore

Inferencia de arquitetura: nesta versao, a escola fica isolada em `schools/creche-5900b`.

- `schools/creche-5900b/system/meta`
- `schools/creche-5900b/students/{id}`
- `schools/creche-5900b/staff/{id}`
- `schools/creche-5900b/tuition/{id}`
- `schools/creche-5900b/delinquency/{id}`
- `schools/creche-5900b/extras/{id}`
- `schools/creche-5900b/receivables/{id}`
- `schools/creche-5900b/payables/{id}`
- `schools/creche-5900b/taxes/{id}`
- `schools/creche-5900b/reportCards/{id}`
- `schools/creche-5900b/classes/{id}`
- `schools/creche-5900b/profiles/{id}`
- `schools/creche-5900b/users/{uid}`
- `schools/creche-5900b/invites/{code}`

## Regras iniciais

As regras atuais usam o documento do usuario autenticado em `users/{uid}` para liberar modulos por papel e exigem convite para novos usuarios, exceto no bootstrap inicial:

- `direcao`: acesso total
- `secretaria`: alunos, turmas, boletins, perfis e funcionarios
- `financeiro`: mensalidades, inadimplencia, extras, contas e impostos

Ponto de atencao: o bootstrap inicial depende do e-mail fixado em `bootstrapAdminEmail` e em `firestore.rules`. Esses dois pontos precisam bater exatamente.

Para producao, o proximo endurecimento recomendado e:

1. Mover o bootstrap e a emissao de convites para um backend dedicado.
2. Trocar a comparacao do e-mail bootstrap por autorizacao de backend.
3. Adicionar expiracao e auditoria de convites.

## Proxima evolucao recomendada

1. Publicar `firestore.rules` e validar o bootstrap do admin.
2. Relatorios PDF e emissao de recibos e boletos.
3. Diario de classe, frequencia e historico pedagogico.
4. Painel de pais ou responsaveis.
5. Migrar para backend dedicado se precisar endurecer seguranca de convites.

## Deploy no Spark

Use apenas:

1. `firebase use creche-5900b`
2. `firebase deploy --only firestore`

Para testar localmente a interface:

1. `python -m http.server 5500`
2. abra `http://localhost:5500`
