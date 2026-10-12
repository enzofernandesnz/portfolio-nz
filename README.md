# nz | Portfólio Profissional — Enzo Fernandes Alcantara

Portfólio desenvolvido para o **Laboratório 01 de Desenvolvimento e Integração de Aplicações Web (DIAW)**, do curso de Engenharia de Software da PUC Minas. Professor: João Paulo Carneiro Aramuni.

Apresenta minha formação, experiência com dados e administração, conhecimentos técnicos, projetos e canais de contato em uma interface responsiva, com conteúdo em português e inglês.

## Status e links úteis

- **Prévia local:** `http://localhost:4173`, depois de executar `npm start`.
- **Endereço previsto no GitHub Pages (ativação pendente):** https://enzofernandesnz.github.io/portfolio-nz/ — [informações da entrega](ENTREGA.md).
- **Wireframes editáveis:** [Figma — LAB01](https://www.figma.com/design/NjzgMxO5X7h9xFp9uEPsMC).
- **Perfil do autor:** [GitHub](https://github.com/enzofernandesnz) · [LinkedIn](https://www.linkedin.com/in/enzo-fernandes-dev).
- **Repositório deste portfólio:** [enzofernandesnz/portfolio-nz](https://github.com/enzofernandesnz/portfolio-nz).
- **Formulário:** integração implementada; a primeira utilização exige confirmar o e-mail do FormSubmit. Entrega real de e-mail ainda precisa ser testada pelo destinatário.

## Índice

1. [Sobre o projeto](#sobre-o-projeto)
2. [Funcionalidades](#funcionalidades)
3. [Tecnologias e dependências](#tecnologias-e-dependências)
4. [Arquitetura](#arquitetura)
5. [Instalação e execução](#instalação-e-execução)
6. [Deploy](#deploy)
7. [Estrutura de pastas](#estrutura-de-pastas)
8. [Protótipos e demonstração](#protótipos-e-demonstração)
9. [Projetos e fontes de conteúdo](#projetos-e-fontes-de-conteúdo)
10. [Testes](#testes)

## Sobre o projeto

O site centraliza minha apresentação profissional, meus projetos e os meios de contato. É voltado a recrutadores, professores, colegas e pessoas interessadas em conhecer meu trabalho.

O nome curto escolhido é **nz**. O visual combina fundo verde escuro, tipografia clara, detalhes em verde-lima e uma seção de projetos em fundo claro. A página inicial prioriza texto e não utiliza retrato nem ilustração decorativa.

## Funcionalidades

- Navegação por âncoras: Sobre Mim, Projetos, Experiências e Contato.
- Conteúdo em português e inglês; preferência de idioma persistida no navegador.
- Linha do tempo gerada a partir de dados JavaScript, em ordem cronológica crescente.
- Filtros por Front-end, Full stack e Java.
- Imagens reais dos projetos disponíveis e ampliação em janela acessível.
- Histórico profissional e formação acadêmica.
- Links de e-mail, WhatsApp, LinkedIn e GitHub.
- Formulário com nome, e-mail e mensagem, validação nativa e envio pelo FormSubmit.
- Menu móvel, foco visível, link para pular ao conteúdo, estrutura semântica e respeito à preferência de movimento reduzido.

## Tecnologias e dependências

| Camada | Tecnologia | Uso |
|---|---|---|
| Front-end | HTML5 | Conteúdo e estrutura semântica |
| Estilos | CSS3, Grid e Flexbox | Layout, identidade visual e responsividade |
| Interatividade | JavaScript ES moderno | Idiomas, filtros, timeline, menu e modal |
| Back-end de contato | FormSubmit, serviço externo | Recebimento do POST, captcha e entrega por e-mail |
| Servidor de desenvolvimento | Node.js 20+ | Servir a pasta `dist` localmente |
| Bibliotecas em produção | Nenhuma | Sem dependências npm no navegador |
| APIs nativas | LocalStorage, IntersectionObserver, Dialog, Constraint Validation | Preferências, navegação, modal e validação |
| Protótipos | Figma | Wireframes de média fidelidade, editáveis |
| Hospedagem | GitHub Pages; configuração alternativa para Vercel | Distribuição dos arquivos estáticos |
| Verificação | Playwright e Microsoft Edge | Testes de interface e capturas durante o desenvolvimento |

**Não há banco de dados nem servidor de aplicação próprio em produção.** Os projetos ficam em uma lista no código; o serviço externo implementa o processamento do formulário. Essa escolha reduz a complexidade de manutenção de um portfólio pessoal e atende ao envio de contato previsto na atividade. O Node.js local não envia e-mails.

## Arquitetura

```text
Visitante
  ├── Hospedagem estática → index.html + style.css + app.js + assets
  │                         ├── renderização dos projetos e filtros
  │                         ├── idioma PT/EN e preferência local
  │                         └── navegação e janelas de detalhes
  └── Formulário POST → FormSubmit → caixa de e-mail de Enzo
```

O conteúdo permanece disponível sem uma consulta ao GitHub em tempo real. Assim, limites da API ou indisponibilidade do GitHub não impedem a leitura do portfólio. Os links para os repositórios continuam disponíveis.

### Formulário e privacidade

O destinatário está configurado no atributo `action` do formulário em `dist/index.html`. Não há senha nem chave secreta no código. O formulário utiliza captcha do serviço e um campo honeypot. A página informa que nome, e-mail e mensagem são processados pelo FormSubmit.

**Ativação:** abrir o site hospedado, preencher o formulário e enviar uma mensagem de teste; em seguida, confirmar a ativação recebida em `enzofalcantara@gmail.com`. Verificar também a pasta de spam. Depois da confirmação, realizar um segundo envio e conferir o recebimento. A tela não apresenta sucesso simulado: a confirmação é responsabilidade da resposta do serviço.

## Instalação e execução

### Pré-requisitos

- Node.js 20 ou superior.
- Navegador atualizado.
- Internet para abrir links externos e enviar o formulário.

### Como executar

1. Extraia a pasta `portfolio-enzo` do pacote ou clone o repositório depois de publicado.
2. Abra um terminal nessa pasta.
3. Execute:

```sh
npm start
```

4. Acesse `http://localhost:4173`.

Não é necessário executar `npm install`: o servidor utiliza apenas módulos nativos do Node.js. Também é possível abrir `dist/index.html` para inspecionar o layout; para testar o formulário, utilize o site servido por HTTP ou HTTPS.

### Verificação de sintaxe

```sh
npm run check
```

### Personalização

- **Textos e experiência:** `dist/index.html`.
- **Projetos, datas e tecnologias:** lista `projects` no início de `dist/app.js`.
- **Identidade visual:** variáveis de cor e regras em `dist/style.css`.
- **Imagens:** `dist/assets`.
- **Novo idioma:** atributos `data-pt`/`data-en` no HTML e textos dos projetos.

Ao incluir um projeto, preencha nome, data de referência, categoria, tecnologias, descrições nos dois idiomas, link do repositório e imagem real. As datas atuais representam criação dos repositórios; não são datas declaradas de conclusão dos trabalhos.

## Deploy

### Hospedagem desta entrega

A publicação usa a pasta `dist` e o workflow `.github/workflows/pages.yml`. O endereço previsto é https://enzofernandesnz.github.io/portfolio-nz/. A ativação do GitHub Pages e a conclusão do primeiro deploy ainda estão pendentes; acompanhe a situação em [ENTREGA.md](ENTREGA.md).

### GitHub Pages

1. Acesse o repositório `enzofernandesnz/portfolio-nz`.
2. O código, o README, `docs`, `dist` e `.github` já estão na branch `main`.
3. Em **Settings → Pages → Build and deployment**, selecione **GitHub Actions**.
4. Execute o workflow `Publicar portfolio no GitHub Pages`, ou faça um envio para a branch `main`.
5. Copie o endereço fornecido pelo deploy para a seção de links úteis deste README.

O workflow já está em `.github/workflows/pages.yml`. Os caminhos dos recursos são relativos para funcionar em um subdiretório do GitHub Pages.

### Vercel

1. Importe o repositório do portfólio na sua conta Vercel.
2. Selecione o preset **Other** e o diretório de saída `dist`.
3. Deixe os comandos de instalação e build vazios.
4. Publique e atualize o link deste README com o endereço fornecido.

A configuração está em `vercel.json`. Nenhuma variável de ambiente é necessária para esta versão.

## Estrutura de pastas

```text
portfolio-enzo/
├── .github/workflows/pages.yml   # Publicação no GitHub Pages
├── dist/
│   ├── index.html                # Página com as quatro seções
│   ├── style.css                 # Estilos e regras responsivas
│   ├── app.js                    # Conteúdo dinâmico e interações
│   └── assets/                   # Imagens reais e ícone nz
├── docs/
│   ├── wireframes.webp            # Visão geral exportada do Figma
│   ├── inicio.webp                # Captura do site
│   ├── desktop.webp               # Página completa em desktop
│   ├── mobile.webp                # Página completa em celular
│   ├── PLANEJAMENTO.md           # Requisitos, sprints e decisões
│   └── APRESENTACAO.md            # Roteiro de demonstração
├── ENTREGA.md                    # Situação e ações finais
├── README.md
├── package.json
├── server.mjs                    # Servidor local sem dependências
└── vercel.json
```

## Protótipos e demonstração

### Wireframes de média fidelidade

[Abrir os protótipos editáveis no Figma](https://www.figma.com/design/NjzgMxO5X7h9xFp9uEPsMC).

![Wireframes: Sobre Mim, Projetos, Experiências e Contato](docs/wireframes.webp)

Os wireframes organizam hierarquia, navegação, conteúdo e versão móvel. O tratamento monocromático e os espaços reservados para imagens são intencionais nesta etapa. A implementação final aplica as cores escolhidas e amplia a timeline com os demais projetos do autor.

### Site implementado

![Página inicial](docs/inicio.webp)

Capturas completas: [Desktop](docs/desktop.webp) · [Celular](docs/mobile.webp).

## Projetos e fontes de conteúdo

| Data do repositório | Projeto | Tecnologias verificadas | Origem |
|---|---|---|---|
| 13/08/2024 | Delivery | HTML, CSS | [Repositório](https://github.com/enzofernandesnz/delivery) |
| 28/10/2024 | Display Grid | HTML, CSS Grid | [Repositório](https://github.com/enzofernandesnz/Display-grid) |
| 08/08/2025 | Gerenciamento de Pedidos | C#, .NET 8, Blazor Server, Bootstrap | [Repositório](https://github.com/enzofernandesnz/atv6_blazor) |
| 06/08/2026 | MEchanic | PHP, Laravel, Blade, SQLite | [Repositório](https://github.com/enzofernandesnz/MEchanic-dev) |
| 28/09/2026 | Perfil dos Candidatos — MG | Java, Spring Boot, Thymeleaf, OpenCSV | [Repositório](https://github.com/enzofernandesnz/Projeto-Candidatos-TSE-2) |
| 28/09/2026 | Gestão de Oficina | Java, POO, ArrayList, Scanner | [Repositório](https://github.com/enzofernandesnz/prova1) |

As descrições foram conferidas no código dos repositórios públicos. MEchanic é explicitamente apresentado como projeto em equipe. Display Grid é um exercício inspirado no layout Ogani. Repositórios de templates copiados por fork não foram apresentados como projetos próprios.

Formação e contatos vêm do currículo fornecido por Enzo. A experiência como analista de dados e administração, o uso de IA e a preferência por manter a empresa anônima foram informados diretamente pelo autor. O período `2026 – atual` evita inventar um dia exato de admissão.

## Testes

Verificações realizadas durante o desenvolvimento:

- Navegação entre as quatro seções e menu móvel.
- Alternância PT/EN e persistência da preferência.
- Filtros e ordem cronológica dos projetos.
- Abertura e fechamento do modal de imagens/detalhes.
- Campos obrigatórios, endereço de e-mail inválido e comprimentos mínimos.
- Layout em larguras de 320, 390, 768 e 1440 pixels.
- Verificação de erros JavaScript no navegador.

Os resultados finais e limitações estão em [ENTREGA.md](ENTREGA.md). Teste do recebimento real de e-mail depende da ativação do destinatário; não foi simulado.

## Autor

**Enzo Fernandes Alcantara — nz**  
Engenharia de Software, PUC Minas  
E-mail: enzofalcantara@gmail.com

## Referências e agradecimentos

- Estrutura deste README adaptada ao [template do professor João Paulo Aramuni](https://github.com/joaopauloaramuni/desenvolvimento-e-integracao-de-aplicacoes-web/blob/main/TEMPLATES/template_README.md).
- [Documentação do FormSubmit](https://formsubmit.co/documentation).
- [Documentação do GitHub Pages](https://docs.github.com/en/pages).
- [Documentação da Vercel](https://vercel.com/docs).
- Os projetos, imagens e bibliotecas de terceiros mantêm suas atribuições e licenças originais.
