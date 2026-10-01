import { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme';

const MODELS = ['✨ LLM Local', '☁️ OpenAI API', '☁️ Anthropic API'];

type Step = { title: string; detail: string };
type Message =
  | { id: string; kind: 'user'; text: string }
  | { id: string; kind: 'thinking'; steps: Step[] };

const INITIAL_STEPS: Step[] = [
  { title: '1. Planear estructura', detail: 'Definir páginas: inicio, menú, pedidos, contacto' },
  { title: '2. Crear archivos', detail: 'index.html, styles.css, script.js · diseño responsive' },
  { title: '3. Probar', detail: 'Vista previa en el navegador · validar formulario de pedidos' },
];

let nextId = 0;
const nid = () => `m${nextId++}`;

export default function ChatScreen() {
  const [modelIdx, setModelIdx] = useState(0);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: nid(), kind: 'user', text: 'créame una web para vender tamales' },
    { id: nid(), kind: 'thinking', steps: INITIAL_STEPS },
  ]);
  const scrollRef = useRef<ScrollView>(null);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    setMessages((prev) => [...prev, { id: nid(), kind: 'user', text }]);
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: nid(), kind: 'thinking', steps: INITIAL_STEPS }]);
    }, 900);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <Text style={styles.project}>mi-web</Text>
          <Pressable
            style={styles.modelPill}
            onPress={() => setModelIdx((i) => (i + 1) % MODELS.length)}
          >
            <Text style={styles.modelText}>{MODELS[modelIdx]} ▾</Text>
          </Pressable>
        </View>

        <ScrollView
          ref={scrollRef}
          style={styles.flex}
          contentContainerStyle={styles.messages}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((m) =>
            m.kind === 'user' ? (
              <View key={m.id} style={styles.userBubble}>
                <Text style={styles.userText}>{m.text}</Text>
              </View>
            ) : (
              <View key={m.id}>
                <Text style={styles.thinkingLabel}>✨ Agente de IA · Pensando...</Text>
                <View style={styles.thinkCard}>
                  <Text style={styles.thinkTitle}>💡 Plan de pensamiento</Text>
                  {m.steps.map((s) => (
                    <View key={s.title} style={styles.step}>
                      <Text style={styles.stepTitle}>{s.title}</Text>
                      <Text style={styles.stepDetail}>• {s.detail}</Text>
                    </View>
                  ))}
                  <Text style={styles.thinkFooter}>
                    ✓ Listo para generar el código cuando lo indiques →
                  </Text>
                </View>
              </View>
            )
          )}
        </ScrollView>

        <View style={styles.inputBar}>
          <Pressable style={styles.iconBtn}>
            <Text style={styles.iconText}>📎</Text>
          </Pressable>
          <TextInput
            style={styles.input}
            placeholder="Escribe un mensaje..."
            placeholderTextColor={colors.muted}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={send}
            returnKeyType="send"
          />
          <Pressable style={styles.iconBtn}>
            <Text style={styles.iconText}>🎙️</Text>
          </Pressable>
          <Pressable style={styles.sendBtn} onPress={send}>
            <Text style={styles.sendText}>➤</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  project: { color: colors.text, fontSize: 22, fontWeight: '700' },
  modelPill: {
    borderWidth: 1,
    borderColor: colors.violet,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  modelText: { color: colors.text, fontSize: 14, fontWeight: '600' },
  messages: { padding: 16, gap: 14 },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#2b3f7a',
    borderColor: colors.accent,
    borderWidth: 1,
    borderRadius: 18,
    borderBottomRightRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: '85%',
  },
  userText: { color: colors.text, fontSize: 16 },
  thinkingLabel: { color: colors.violet, fontSize: 13, marginBottom: 8, fontWeight: '600' },
  thinkCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  thinkTitle: { color: colors.text, fontSize: 18, fontWeight: '700', marginBottom: 12 },
  step: { marginBottom: 12 },
  stepTitle: { color: colors.text, fontSize: 16, fontWeight: '700', marginBottom: 4 },
  stepDetail: { color: colors.muted, fontSize: 14, lineHeight: 20 },
  thinkFooter: { color: colors.violet, fontSize: 14, marginTop: 4 },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 8,
  },
  iconBtn: { padding: 6 },
  iconText: { fontSize: 22 },
  input: {
    flex: 1,
    backgroundColor: colors.card2,
    color: colors.text,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
  },
  sendBtn: {
    backgroundColor: colors.accent,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendText: { color: '#fff', fontSize: 20 },
});
