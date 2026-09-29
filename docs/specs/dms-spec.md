## Plano: Criar especificação DMS

A especificação será criada somente em `docs/specs/dms-spec.md`, seguindo o modelo existente e documentando requisitos, dados, APIs, arquitetura, armazenamento local e etapas futuras de execução. Nenhum arquivo de back-end, front-end ou teste será implementado nesta etapa.

**Etapas**

1. Reutilizar as seções de `spec-template.md`: objetivo, escopo, requisitos funcionais e não funcionais, modelo de dados, contratos de API, decisões arquiteturais e plano de execução.
2. Registrar o estado atual do projeto:
   - Express/CommonJS com apenas `/health`.
   - Rotas, controllers, services e repositories ainda sem implementação.
   - Frontend React/Vite ainda estático.
   - Testes backend limitados ao smoke test existente.
3. Especificar os requisitos de:
   - Upload via `POST /upload`.
   - Listagem via `GET /documents`.
   - Download via `GET /documents/:id/download`.
4. Definir o modelo dos documentos com `id`, `originalName`, `size`, `uploadedAt` e `owner`.
5. Documentar os contratos completos de API, incluindo:
   - Entrada multipart.
   - Respostas de sucesso.
   - Status HTTP.
   - Formato padronizado de erros.
   - Headers de download.
   - IDs inexistentes e arquivos ausentes.
6. Formalizar a Clean Architecture simples: `routes -> controllers -> services -> repositories`.
7. Especificar o armazenamento estritamente local:
   - `storage`.
   - `multer` com `diskStorage`.
   - Metadados em memória.
   - Nenhum provedor externo.
8. Definir validações, limites configuráveis, proteção contra path traversal e tratamento de arquivos órfãos.
9. Registrar decisões provisórias:
   - `owner` controlado pelo backend até existir autenticação.
   - Listagem completa ordenada por `uploadedAt` decrescente.
   - Paginação, busca e filtros fora do escopo inicial.
   - Perda dos metadados após reinício.
10. Organizar a implementação futura em fases independentes:
    - Configuração.
    - Repositórios.
    - Upload.
    - Listagem e download.
    - Frontend.
    - Testes e hardening.

**Arquivos relevantes**

- `app.js` — Express e `/health`.
- `package.json` — dependências e scripts.
- `app.test.js` — teste existente.
- `App.jsx` — seed atual do frontend.
- `vite.config.js` — proxy `/api`.
- `routes` — rotas futuras.
- `controllers` — controllers futuros.
- `services` — regras de negócio futuras.
- `repositories` — persistência futura.

**Verificação**

1. Confirmar que `dms-spec.md` contém todas as seções do modelo.
2. Confirmar que cada endpoint possui entrada, saída, status, erros e exemplos de dados.
3. Separar claramente funcionalidades existentes de requisitos futuros.
4. Validar que o armazenamento externo está explicitamente proibido.
5. Validar que o plano futuro respeita a Clean Architecture simples.
6. Não executar alterações funcionais nesta etapa.

O plano foi salvo em `/memories/session/plan.md`. Nesta sessão de planejamento, o arquivo `docs/specs/dms-spec.md` ainda não foi criado.