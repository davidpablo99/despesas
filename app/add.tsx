import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Switch,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { createTransactionRepository } from "../src/database/transactionRepository";
import { useDatabase } from "../src/database/DatabaseProvider";
import { Colors } from "../src/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

const SCREEN_WIDTH = Dimensions.get("window").width;

const EXPENSE_CATEGORIES = [
  { id: "food", name: "Alimentação", icon: "fast-food", color: "#FF9800" },
  { id: "transport", name: "Transporte", icon: "car", color: "#2196F3" },
  { id: "home", name: "Moradia", icon: "home", color: "#9C27B0" },
  { id: "leisure", name: "Lazer", icon: "game-controller", color: "#E91E63" },
  { id: "health", name: "Saúde", icon: "medkit", color: "#F44336" },
  { id: "education", name: "Educação", icon: "school", color: "#009688" },
  { id: "shopping", name: "Compras", icon: "cart", color: "#795548" },
  {
    id: "others",
    name: "Outros",
    icon: "ellipsis-horizontal-circle",
    color: "#607D8B",
  },
] as const;

const INCOME_CATEGORIES = [
  { id: "salary", name: "Salário", icon: "cash", color: "#4CAF50" },
  {
    id: "investment",
    name: "Investimentos",
    icon: "trending-up",
    color: "#2196F3",
  },
  { id: "freelance", name: "Freelance", icon: "briefcase", color: "#FF9800" },
  { id: "gift", name: "Presente", icon: "gift", color: "#E91E63" },
  {
    id: "others",
    name: "Outros",
    icon: "ellipsis-horizontal-circle",
    color: "#607D8B",
  },
] as const;

export default function AddTransaction() {
  const db = useDatabase();
  const router = useRouter();

  const [amount, setAmount] = useState("0,00");
  const [rawValue, setRawValue] = useState(0); // Stores the numeric value
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [selectedCategory, setSelectedCategory] = useState(
    EXPENSE_CATEGORIES[7],
  ); // Outros default
  const [isFixed, setIsFixed] = useState(false);

  // Update categories when type changes
  useEffect(() => {
    if (type === "expense") {
      setSelectedCategory(EXPENSE_CATEGORIES.find((c) => c.id === "others")!);
    } else {
      setSelectedCategory(INCOME_CATEGORIES.find((c) => c.id === "others")!);
    }
  }, [type]);

  const currentCategories =
    type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  const mainColor = type === "expense" ? Colors.expense : Colors.income;

  const handleAmountChange = (text: string) => {
    // Remove tudo que não for número
    const numericValue = text.replace(/[^0-9]/g, "");

    if (!numericValue) {
      setAmount("0,00");
      setRawValue(0);
      return;
    }

    // Converte para float (ex: "1234" -> 12.34)
    const value = parseFloat(numericValue) / 100;

    // Formata para moeda BRL
    const formatted = value.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    setAmount(formatted);
    setRawValue(value);
  };

  const handleSave = async () => {
    if (rawValue <= 0 || !description) {
      Alert.alert("Erro", "Por favor, preencha valor e descrição.");
      return;
    }

    try {
      const repository = createTransactionRepository(db);
      await repository.create({
        amount: rawValue,
        description,
        category: selectedCategory.name,
        type,
        date: Date.now(),
        is_fixed: isFixed,
      });
      router.back();
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível salvar a transação.");
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: type === "income" ? "#e8f5e9" : "#ffebee" },
      ]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Type Selector */}
        <View style={styles.typeContainer}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              type === "income" && styles.selectedIncome,
            ]}
            onPress={() => setType("income")}
          >
            <Ionicons
              name="arrow-up-circle"
              size={20}
              color={type === "income" ? Colors.income : Colors.textSecondary}
            />
            <Text
              style={[
                styles.typeText,
                type === "income" && { color: Colors.income },
              ]}
            >
              Receita
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.typeButton,
              type === "expense" && styles.selectedExpense,
            ]}
            onPress={() => setType("expense")}
          >
            <Ionicons
              name="arrow-down-circle"
              size={20}
              color={type === "expense" ? Colors.expense : Colors.textSecondary}
            />
            <Text
              style={[
                styles.typeText,
                type === "expense" && { color: Colors.expense },
              ]}
            >
              Despesa
            </Text>
          </TouchableOpacity>
        </View>

        {/* Amount Input */}
        <View style={styles.amountContainer}>
          <Text style={[styles.currencySymbol, { color: mainColor }]}>R$</Text>
          <TextInput
            style={[styles.amountInput, { color: mainColor }]}
            placeholder="0,00"
            keyboardType="numeric"
            value={amount}
            onChangeText={handleAmountChange}
            placeholderTextColor={mainColor + "80"}
          />
        </View>

        <View style={styles.card}>
          {/* Description Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={styles.input}
              placeholder={
                type === "income" ? "Ex: Salário Mensal" : "Ex: Almoço"
              }
              value={description}
              onChangeText={setDescription}
            />
          </View>

          {/* Categories Grid */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Categoria</Text>
            <View style={styles.categoriesGrid}>
              {currentCategories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryItem,
                    selectedCategory.id === cat.id &&
                      styles.selectedCategoryItem,
                    selectedCategory.id === cat.id && {
                      borderColor: cat.color,
                    },
                  ]}
                  onPress={() => setSelectedCategory(cat as any)}
                >
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: cat.color + "20" },
                    ]}
                  >
                    <Ionicons
                      name={cat.icon as any}
                      size={24}
                      color={cat.color}
                    />
                  </View>
                  <Text
                    style={[
                      styles.categoryText,
                      selectedCategory.id === cat.id && {
                        color: cat.color,
                        fontWeight: "bold",
                      },
                    ]}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Recurring Switch */}
          <View style={styles.switchContainer}>
            <View style={styles.switchInfo}>
              <View
                style={[styles.iconBox, { backgroundColor: mainColor + "20" }]}
              >
                <Ionicons name="repeat" size={20} color={mainColor} />
              </View>
              <View>
                <Text style={styles.switchTitle}>
                  {type === "income" ? "Receita Fixa" : "Despesa Fixa"}
                </Text>
                <Text style={styles.switchSubtitle}>Repete todo mês</Text>
              </View>
            </View>
            <Switch
              value={isFixed}
              onValueChange={setIsFixed}
              trackColor={{ false: "#e0e0e0", true: mainColor + "80" }}
              thumbColor={isFixed ? mainColor : "#f4f3f4"}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.saveButton,
              { backgroundColor: mainColor, shadowColor: mainColor },
            ]}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>
              {type === "income" ? "Salvar Receita" : "Salvar Despesa"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  typeContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  typeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  selectedIncome: {
    backgroundColor: "#e8f5e9",
  },
  selectedExpense: {
    backgroundColor: "#ffebee",
  },
  typeText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
    marginTop: 10,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: "bold",
    marginRight: 8,
  },
  amountInput: {
    fontSize: 48,
    fontWeight: "bold",
    minWidth: 100,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  categoryItem: {
    width: (SCREEN_WIDTH - 40 - 40 - 36) / 4, // Card padding correction
    alignItems: "center",
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: "transparent",
    borderRadius: 12,
  },
  selectedCategoryItem: {
    backgroundColor: "#f5f5f5",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 16,
    marginBottom: 32,
  },
  switchInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  switchTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  switchSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  saveButton: {
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
