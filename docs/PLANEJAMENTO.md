# Planejamento — LAB01

**Aluno:** Enzo Fernandes Alcantara  
**Curso:** Engenharia de Software — PUC Minas  
**Disciplina:** Desenvolvimento e Integração de Aplicações Web  
**Professor:** João Paulo Carneiro Aramuni

## Objetivo e público

Criar um portfólio profissional responsivo que apresente formação, habilidades, projetos e experiência de Enzo, com meios de contato acessíveis. Público: professores, recrutadores, colegas e potenciais colaboradores.

## Escopo e requisitos

| ID | Requisito | Critério de aceitação |
|---|---|---|
| RF01 | Sobre Mim em PT e EN | Alternar idioma e conferir formação, atuação, interesses e objetivos |
| RF02 | Projetos em faixa horizontal | Cartões compactos, do mais recente ao mais antigo |
| RF03 | Dados de cada projeto | Nome, descrição, tecnologias, GitHub e imagem/GIF real |
| RF04 | Experiências | Instituição/empresa, atividade, período e descrição |
| RF05 | Contato direto | Links funcionais para e-mail, WhatsApp, LinkedIn e GitHub |
| RF06 | Formulário | Validar nome, e-mail e mensagem; receber e-mail real após ativação |
| RNF01 | Responsividade | Ausência de rolagem horizontal em celular, tablet e desktop |
| RNF02 | Acessibilidade básica | Navegar por teclado; foco visível; labels; idioma do documento correto |
| RNF03 | Hospedagem | URL HTTPS acessível ao avaliador |
| RNF04 | Documentação | README com tecnologias, dependências, pastas, execução e link publicado |

## Arquitetura de informação

Página única com cabeçalho fixo, quatro âncoras e rodapé. O primeiro bloco apresenta Enzo e direciona aos projetos. A seção Sobre Mim reúne biografia e habilidades. A faixa horizontal oferece filtros e mantém a ordem do mais recente ao mais antigo. Experiências agrupa atividade profissional e formação. Contato reúne links e formulário.

## Design e prototipação

- Identidade textual `nz`, escolhida por Enzo.
- Fundo escuro e verde-lima; projetos em superfície clara para separar conteúdos.
- Sem retrato obrigatório e sem a ilustração decorativa inicialmente proposta.
- Capturas reais de projetos; nunca apresentar um mockup como tela em funcionamento.
- Wireframes no Figma: quatro telas de desktop e uma referência móvel, com textos e componentes editáveis.
- Tipografia Inter nos wireframes de média fidelidade; fontes de sistema no site, reduzindo dependências externas.

## Sprint 01 — Planejamento e protótipo (4 pontos)

Entregáveis: requisitos, wireframes, estrutura inicial HTML/CSS/JS, navegação, layout e README inicial. Repositório de entrega: https://github.com/enzofernandesnz/portfolio-nz.

## Sprint 02 — Funcionalidades (4 pontos)

Entregáveis: versões PT/EN, timeline dinâmica, filtros, experiências organizadas, links de contato, formulário e validações. O envio por e-mail usa o back-end externo FormSubmit e depende da ativação do endereço destinatário.

## Sprint 03 — Hospedagem e finalização (7 pontos)

Entregáveis: publicação HTTPS, ajustes responsivos, capturas reais dos projetos, README final e demonstração. A situação verificada de cada item está em `ENTREGA.md`.

## Decisões e limites

1. HTML/CSS/JS sem framework: escopo simples, carregamento leve e facilidade de apresentação do código.
2. Dados de projetos locais: evita depender da API do GitHub em cada visita.
3. Datas da timeline: criação dos repositórios públicos, identificada explicitamente.
4. FormSubmit: oferece processamento de e-mail sem expor senha; depende de serviço externo e ativação.
5. Empresa privada: nome não publicado por preferência expressa do autor.
6. Não há métricas de resultado, tempo de experiência exato ou habilidades atribuídas sem fonte.

## Checklist de apresentação

- Abrir URL hospedada em janela sem sessão para conferir acesso público.
- Demonstrar PT/EN, filtros, menu móvel e formulário.
- Mostrar wireframes e comparar a estrutura com a implementação.
- Abrir README no GitHub e explicar a arquitetura.
- Confirmar recebimento real do formulário antes da avaliação.
