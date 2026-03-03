import { useCallback, useState } from 'react';
import { View, FlatList, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Transaction, createTransactionRepository } from '../src/database/transactionRepository';
import { useDatabase } from '../src/database/DatabaseProvider';
import { SummaryCard } from '../src/components/SummaryCard';
import { TransactionItem } from '../src/components/TransactionItem';
import { Header } from '../src/components/Header';
import { FAB } from '../src/components/FAB';
import { Colors } from '../src/constants/Colors';

export default function Home() {
  const db = useDatabase();
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState({ income: 0, expense: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      // createTransactionRepository lida com db sendo null na web
      const repository = createTransactionRepository(db);
      const [allTransactions, summaryData] = await Promise.all([
        repository.getAll(),
        repository.getSummary()
      ]);
      setTransactions(allTransactions);
      setSummary(summaryData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []) // Removido 'db' das dependências pois pode ser null e estável
  );

  const handleDelete = async (id: number) => {
    const repository = createTransactionRepository(db);
    await repository.delete(id);
    loadData();
  };

  if (loading && transactions.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      
      <View style={styles.content}>
        <SummaryCard 
          income={summary.income} 
          expense={summary.expense} 
          total={summary.total} 
        />

        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Últimas Transações</Text>
        </View>

        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TransactionItem transaction={item} onDelete={handleDelete} />
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Nenhuma transação encontrada</Text>
            </View>
          }
        />
      </View>

      <Text style={styles.footerText}>Desenvolvido por David Queiroz</Text>
      <FAB onPress={() => router.push('/add')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    marginTop: -20, // Pull up to overlap header slightly if desired, or just 0
  },
  listHeader: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  listContent: {
    paddingBottom: 80,
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
  footerText: {
    textAlign: 'center',
    color: '#ccc',
    fontSize: 12,
    marginBottom: 10,
    marginTop: 5,
  },
});
