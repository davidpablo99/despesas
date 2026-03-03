import React, { createContext, useContext } from 'react';
import { Platform } from 'react-native';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import { migrateDbIfNeeded } from './schema';

// Contexto unificado
const DatabaseContext = createContext<any>(null);

// Provider para Web
function WebDatabaseProvider({ children }: { children: React.ReactNode }) {
  // Na web não precisamos de inicialização complexa por enquanto
  return <DatabaseContext.Provider value={null}>{children}</DatabaseContext.Provider>;
}

// Wrapper que decide qual provider usar
export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  if (Platform.OS === 'web') {
    return <WebDatabaseProvider>{children}</WebDatabaseProvider>;
  }

  return (
    <SQLiteProvider databaseName="despesas.db" onInit={migrateDbIfNeeded}>
      {children}
    </SQLiteProvider>
  );
}

// Hook customizado para acessar o DB (seguro para Web)
export function useDatabase() {
  if (Platform.OS === 'web') {
    return null;
  }
  return useSQLiteContext();
}
