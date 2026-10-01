import { useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme';

export default function TerminalScreen() {
  const [lines, setLines] = useState<string[]>([
    'rey30-ide $ agente --status',
    '✓ Agente listo · modelo: LLM Local',
    '✓ 3 skills activos · 2 servidores MCP',
    '',
  ]);
  const [cmd, setCmd] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  const run = () => {
    const c = cmd.trim();
    if (!c) return;
    setCmd('');
    setLines((prev) => [...prev, `rey30-ide $ ${c}`, `→ (demo) comando recibido: ${c}`, '']);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🖥️ TERMINAL</Text>
      </View>
      <ScrollView
        ref={scrollRef}
        style={styles.term}
        contentContainerStyle={{ padding: 12 }}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {lines.map((l, i) => (
          <Text key={i} style={styles.line}>
            {l === '' ? ' ' : l}
          </Text>
        ))}
      </ScrollView>
      <View style={styles.inputRow}>
        <Text style={styles.prompt}>$</Text>
        <TextInput
          style={styles.input}
          value={cmd}
          onChangeText={setCmd}
          onSubmitEditing={run}
          returnKeyType="go"
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="escribe un comando..."
          placeholderTextColor="#3a4a6b"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#05070f' },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: { color: colors.accent, fontSize: 15, fontWeight: '700', letterSpacing: 1 },
  term: { flex: 1 },
  line: { color: colors.green, fontSize: 14, fontFamily: 'monospace', marginVertical: 2 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  prompt: { color: colors.green, fontSize: 16, fontFamily: 'monospace', marginRight: 8 },
  input: {
    flex: 1,
    color: colors.green,
    fontSize: 15,
    fontFamily: 'monospace',
  },
});
