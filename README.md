# ClimbaCore - CRUD de Clientes

## Tecnologias Utilizadas

### Front-end
- **React (Vite)**: Framework principal pela performance e agilidade no desenvolvimento.
- **Material UI (MUI)**: Biblioteca de componentes utilizada para implementar o Material Design.
- **Axios**: Cliente HTTP para consumo da API.
- **Dayjs**: Manipulação e formatação de datas.

### Back-end
- **Node.js**: Ambiente de execução para o servidor.
- **Express**: Framework para criação de rotas e middleware.
- **MySQL**: Banco de dados relacional para persistência dos dados.


## Funcionalidades e Regras de Negócio

- **CRUD Completo**: Criação, Listagem, Edição e Exclusão de clientes.
- **Busca Dinâmica**: Filtro por nome ou e-mail conforme o usuário digita.
- **Validações Implementadas**:
  - E-mail com formato válido (Regex).
  - Bloqueio de e-mails duplicados no banco de dados.
  - Data de nascimento obrigatória e obrigatoriamente anterior à data atual.
  - Nome e Profissão como campos obrigatórios.
- **Interface Dark Mode**: Design personalizado focado em usabilidade e estética moderna.


## Como rodar o projeto
Crie um banco de dados chamado `climba` (ou o nome que você definiu) e execute a seguinte query:

```sql
CREATE TABLE clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  data_nascimento DATE NOT NULL,
  profissao ENUM('Programador', 'Consultor de Vendas', 'SDR', 'Suporte ao Cliente') NOT NULL,
  observacoes TEXT
);