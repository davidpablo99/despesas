import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

interface SummaryCardProps {
  income: number;
  expense: number;
  total: number;
}

export function SummaryCard({ income, expense, total }: SummaryCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.item}>
          <View style={styles.iconContainer}>
            <Ionicons name="arrow-up-circle" size={24} color={Colors.income} />
            <Text style={styles.label}>Receitas</Text>
          </View>
          <Text style={[styles.value, { color: Colors.income }]}>
            R$ {income.toFixed(2)}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.item}>
          <View style={styles.iconContainer}>
            <Ionicons name="arrow-down-circle" size={24} color={Colors.expense} />
            <Text style={styles.label}>Despesas</Text>
          </View>
          <Text style={[styles.value, { color: Colors.expense }]}>
            R$ {expense.toFixed(2)}
          </Text>
        </View>
      </View>
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Saldo Total</Text>
        <Text style={[styles.totalValue, { color: total >= 0 ? Colors.income : Colors.expense }]}>
          R$ {total.toFixed(2)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    margin: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  item: {
    flex: 1,
    alignItems: 'center',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  label: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    width: 1,
    backgroundColor: Colors.border,
    marginHorizontal: 16,
  },
  totalContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
