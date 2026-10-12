# Entrega — Laboratório 01

**Enzo Fernandes Alcantara — nz**

## Links

- GitHub: https://github.com/enzofernandesnz/portfolio-nz
- Endereço previsto no GitHub Pages (ativação pendente): https://enzofernandesnz.github.io/portfolio-nz/
- Protótipos: https://www.figma.com/design/NjzgMxO5X7h9xFp9uEPsMC
- Documentação: [README.md](README.md)
- Planejamento: [docs/PLANEJAMENTO.md](docs/PLANEJAMENTO.md)
- Roteiro de apresentação: [docs/APRESENTACAO.md](docs/APRESENTACAO.md)

## Material preparado

| Etapa | Material |
|---|---|
| Sprint 01 — 4 pontos | Requisitos, wireframes editáveis, estrutura do site, navegação e README |
| Sprint 02 — 4 pontos | PT/EN, seis projetos, timeline, filtros, experiências, contatos e formulário com validações |
| Sprint 03 — 7 pontos | Versão para nuvem, imagens reais, layout responsivo, README final e roteiro de apresentação |

O código está na pasta `dist`. Para executar localmente, abra um terminal na raiz `portfolio-enzo` e use `npm start`.

## Verificação técnica

Conferidos no navegador: seis projetos, filtros, alternância PT/EN, modal, validação do formulário, menu móvel e ausência de rolagem horizontal em 320, 390, 768 e 1440 pixels. Nenhum erro JavaScript foi encontrado no fluxo testado.

As imagens de Delivery e Display Grid mostram os arquivos HTML originais executados localmente. Blazor e MEchanic foram compilados/executados em ambientes locais isolados. O projeto TSE usa seu CSV original; as fotos ausentes de candidatos são uma limitação do repositório original. O projeto Oficina usa saída real de console, sem interface gráfica inventada.

## Publicação no GitHub Pages

O código e o workflow estão no GitHub. A primeira tentativa de publicação não foi concluída porque o Pages ainda precisa ser habilitado para GitHub Actions em Settings → Pages → Build and deployment → Source. Após habilitar, execute novamente o workflow e confira o endereço publicado antes de enviar no Canvas.

## Ações que dependem da conta do autor

1. **Ativação do e-mail:** enviar pelo formulário e confirmar a mensagem de ativação do FormSubmit em `enzofalcantara@gmail.com`; depois realizar novo envio e confirmar recebimento. O formulário foi validado localmente, mas não houve teste de entrega real na caixa postal.

Essa ativação deve ser concluída antes da avaliação. A presença do formulário e do código não comprova, sozinha, o recebimento de e-mail. A criação do repositório e a publicação do site são etapas diferentes.

## Como publicar em outra hospedagem

Há configuração pronta para Vercel (`vercel.json`) e GitHub Pages (`.github/workflows/pages.yml`). As instruções estão no README. O destino previsto desta entrega é o GitHub Pages da conta `enzofernandesnz`.
