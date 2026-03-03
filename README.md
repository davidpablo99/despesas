# Controle de Despesas (Expo + SQLite)

Este é um aplicativo de controle financeiro desenvolvido com Expo, React Native e SQLite.

## Funcionalidades

- **Dashboard**: Visualização rápida de receitas, despesas e saldo total.
- **Listagem**: Histórico de transações ordenadas por data.
- **Cadastro**: Adição de novas receitas e despesas com categoria.
- **Persistência**: Dados salvos localmente no dispositivo usando SQLite.

## Estrutura do Projeto

- `app/`: Rotas e telas do aplicativo (Expo Router).
- `src/components/`: Componentes reutilizáveis de UI.
- `src/database/`: Configuração do banco de dados e repositórios.
- `src/constants/`: Constantes globais como cores e estilos.

## Como Rodar

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Inicie o projeto:
   ```bash
   npx expo start
   ```

3. Escaneie o QR Code com o app Expo Go no seu dispositivo.
