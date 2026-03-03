import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Transaction } from '../database/transactionRepository';

interface TransactionItemProps {
  transaction: Transaction;
  onDelete: (id: number) => void;
}

export function TransactionItem({ transaction, onDelete }: TransactionItemProps) {
  const isIncome = transaction.type === 'income';

  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        <View style={[styles.iconBox, { backgroundColor: isIncome ? '#e8f5e9' : '#ffebee' }]}>
          <Ionicons 
            name={isIncome ? "arrow-up" : "arrow-down"} 
            size={20} 
            color={isIncome ? Colors.income : Colors.expense} 
          />
        </View>
        <View>
          <View style={styles.descriptionRow}>
            <Text style={styles.description}>{transaction.description}</Text>
            {transaction.is_fixed && (
              <View style={styles.fixedBadge}>
                <Ionicons name="repeat" size={12} color={Colors.primary} />
                <Text style={styles.fixedText}>Fixa</Text>
              </View>
            )}
          </View>
          <Text style={styles.category}>{transaction.category} • {new Date(transaction.date).toLocaleDateString()}</Text>
        </View>
      </View>
      <View style={styles.rightContent}>
        <Text style={[styles.amount, { color: isIncome ? Colors.income : Colors.expense }]}>
          {isIncome ? '+' : '-'} R$ {transaction.amount.toFixed(2)}
        </Text>
        <TouchableOpacity onPress={() => onDelete(transaction.id)} style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.surface,
    marginBottom: 8,
    borderRadius: 12,
    marginHorizontal: 16,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  descriptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  fixedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ede7f6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  fixedText: {
    fontSize: 10,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  category: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  rightContent: {
    alignItems: 'flex-end',
    gap: 4,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    padding: 4,
  },
});
