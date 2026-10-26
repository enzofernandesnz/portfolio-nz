# Entrega — Laboratório 01

**Enzo Fernandes Alcantara — nz**

## Links

- GitHub: https://github.com/enzofernandesnz/portfolio-nz
- Site publicado no GitHub Pages: https://enzofernandesnz.github.io/portfolio-nz/
- Protótipos: https://www.figma.com/design/NjzgMxO5X7h9xFp9uEPsMC
- Documentação: [README.md](README.md)
- Planejamento: [docs/PLANEJAMENTO.md](docs/PLANEJAMENTO.md)
- Roteiro de apresentação: [docs/APRESENTACAO.md](docs/APRESENTACAO.md)

## Material preparado

| Etapa | Material |
|---|---|
| Sprint 01 — 4 pontos | Requisitos, wireframes editáveis, estrutura do site, navegação e README |
| Sprint 02 — 4 pontos | PT/EN, sete projetos em cartões horizontais compactos, ordem do mais recente ao mais antigo, filtros, experiências, contatos e formulário com validações |
| Sprint 03 — 7 pontos | Versão para nuvem, imagens reais, layout responsivo, README final e roteiro de apresentação |

O código está na pasta `dist`. Para executar localmente, abra um terminal na raiz `portfolio-enzo` e use `npm start`.

## Verificação técnica

Conferidos no navegador: sete projetos, filtros, alternância PT/EN, modal, validação do formulário, menu móvel e ausência de rolagem horizontal em 320, 390, 768 e 1440 pixels. Nenhum erro JavaScript foi encontrado no fluxo testado.

A imagem do Estagi.ON vem da documentação original da equipe e mostra a listagem de vagas. O cartão destaca o projeto em grupo do 1º semestre de 2026 e o certificado de melhor projeto de Trabalho Interdisciplinar: Desenvolvimento de Aplicação Web, informado por Enzo.

As imagens de Delivery e Display Grid mostram os arquivos HTML originais executados localmente. Blazor e MEchanic foram compilados/executados em ambientes locais isolados. O projeto TSE usa seu CSV original; as fotos ausentes de candidatos são uma limitação do repositório original. O projeto Oficina usa saída real de console, sem interface gráfica inventada.

## Atualização visual — SplashCursor

Fumaça interativa verde-lima apenas nas seções Início e Sobre mim, incluindo suas margens laterais, adaptada do exemplo ReactBits do professor. Um único canvas fixo, recortado aos limites dessas seções, acompanha o mouse ou toque sem bloquear links ou a rolagem. O efeito fica oculto e pausado nas demais seções, durante a rolagem e quando o ponteiro está ocioso. Retoma com uma nova interação nas áreas permitidas, sem controlar a velocidade da rodinha. A animação respeita movimento reduzido e pausa quando a aba está oculta; o conteúdo continua disponível quando WebGL não está disponível. Licença e atribuição acompanham o código.

## Atualização visual — SkillsGlobe

Globo interativo abaixo do título de Sobre mim, com 14 tecnologias presentes no currículo e nos projetos. Adaptação do exemplo SkillsGlobe de João Paulo Aramuni com Canvas 2D e JavaScript nativo. Ícones Devicon armazenados no site; licenças MIT incluídas.

Verificado no navegador: rotação, pausa, arraste, lista alternativa, PT/EN, movimento reduzido, carregamento dos 14 ícones e ausência de transbordamento em 320, 390 e 1440 pixels.

## Publicação no GitHub Pages

Publicação concluída com sucesso em 12/10/2026 pelo workflow GitHub Actions. O site público está em https://enzofernandesnz.github.io/portfolio-nz/. A pasta publicada é `dist`; novos envios para a branch `main` atualizam o site automaticamente.

## Ações que dependem da conta do autor

1. **Ativação do e-mail:** enviar pelo formulário e confirmar a mensagem de ativação do FormSubmit em `enzofalcantara@gmail.com`; depois realizar novo envio e confirmar recebimento. O formulário foi validado localmente, mas não houve teste de entrega real na caixa postal.

Essa ativação deve ser concluída antes da avaliação. A presença do formulário e do código não comprova, sozinha, o recebimento de e-mail. A criação do repositório e a publicação do site são etapas diferentes.

## Como publicar em outra hospedagem

Há configuração pronta para Vercel (`vercel.json`) e GitHub Pages (`.github/workflows/pages.yml`). As instruções estão no README. A hospedagem desta entrega é o GitHub Pages da conta `enzofernandesnz`.
