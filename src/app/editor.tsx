import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme';

type Seg = { t: string; c?: string };

// Resaltado simple: etiquetas en azul, atributos en amarillo, strings en verde.
function hl(line: string): Seg[] {
  const segs: Seg[] = [];
  const re = /("[^"]*")|(<\/?[a-zA-Z][a-zA-Z0-9]*|\/>|>)|([\w-]+(?==))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    if (m.index > last) segs.push({ t: line.slice(last, m.index) });
    const tok = m[0];
    const color = tok.startsWith('"')
      ? colors.green
      : tok.startsWith('<') || tok === '/>' || tok === '>'
        ? colors.accent
        : colors.yellow;
    segs.push({ t: tok, c: color });
    last = m.index + tok.length;
  }
  if (last < line.length) segs.push({ t: line.slice(last) });
  return segs;
}

const FILES: Record<string, string[]> = {
  'index.html': [
    '<!DOCTYPE html>',
    '<html lang="es">',
    '  <head>',
    '    <meta charset="UTF-8" />',
    '    <title>Mi App</title>',
    '    <link rel="stylesheet" href="styles.css" />',
    '  </head>',
    '  <body>',
    '    <div id="app">',
    '      <h1>Bienvenido</h1>',
    '    </div>',
    '  </body>',
    '</html>',
  ],
  'styles.css': [
    'body {',
    '  background: #0b0e1a;',
    '  color: #f2f4ff;',
    '  font-family: sans-serif;',
    '}',
    '',
    '#app {',
    '  padding: 2rem;',
    '}',
  ],
};

const DIFF = [
  { t: '- background: #ffffff;', c: colors.red },
  { t: '+ background: #0d1117; /* fondo oscuro */', c: colors.green },
  { t: '+ color: #e6e6ff; /* mejor contraste */', c: colors.green },
  { t: '+ padding: 2rem; /* espaciado ajustado */', c: colors.green },
];

export default function EditorScreen() {
  const names = Object.keys(FILES);
  const [active, setActive] = useState(names[0]);
  const [showDiff, setShowDiff] = useState(true);
  const [confirmed, setConfirmed] = useState(false);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>✨ Agente IA · Editor</Text>
      </View>

      <View style={styles.tabs}>
        {names.map((n) => (
          <Pressable
            key={n}
            style={[styles.tab, active === n && styles.tabActive]}
            onPress={() => setActive(n)}
          >
            <Text style={[styles.tabText, active === n && styles.tabTextActive]}>{n}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView style={styles.code} contentContainerStyle={{ paddingBottom: 16 }}>
        {FILES[active].map((line, i) => (
          <View key={i} style={styles.line}>
            <Text style={styles.lineNo}>{i + 1}</Text>
            <Text style={styles.codeText}>
              {hl(line).map((s, j) => (
                <Text key={j} style={s.c ? { color: s.c } : undefined}>
                  {s.t}
                </Text>
              ))}
            </Text>
          </View>
        ))}
      </ScrollView>

      {showDiff && (
        <View style={styles.diffCard}>
          <Text style={styles.diffTitle}>✨ CAMBIOS DEL AGENTE IA</Text>
          <Text style={styles.diffSub}>Sugerencias aplicadas · 3 cambios</Text>
          <Text style={styles.diffFile}>📄 DIFF · styles.css</Text>
          {DIFF.map((d, i) => (
            <Text key={i} style={[styles.diffLine, { color: d.c }]}>
              {d.t}
            </Text>
          ))}
          <View style={styles.diffBtns}>
            <Pressable
              style={styles.confirmBtn}
              onPress={() => {
                setShowDiff(false);
                setConfirmed(true);
              }}
            >
              <Text style={styles.confirmText}>✓ Confirmar cambios</Text>
            </Pressable>
            <Pressable style={styles.discardBtn} onPress={() => setShowDiff(false)}>
              <Text style={styles.discardText}>✕ Descartar</Text>
            </Pressable>
          </View>
        </View>
      )}

      {confirmed && (
        <View style={styles.note}>
          <Text style={styles.noteText}>IA: styles.css actualizado con tema oscuro ✓</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: { color: colors.text, fontSize: 18, fontWeight: '700' },
  tabs: { flexDirection: 'row', paddingHorizontal: 12, paddingTop: 12, gap: 8 },
  tab: {
    backgroundColor: colors.card,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tabActive: { borderColor: colors.accent },
  tabText: { color: colors.muted, fontSize: 14, fontWeight: '600' },
  tabTextActive: { color: colors.text },
  code: { flex: 1, marginTop: 12, paddingHorizontal: 12 },
  line: { flexDirection: 'row', paddingVertical: 3 },
  lineNo: { color: colors.muted, width: 28, fontSize: 13, fontFamily: 'monospace' },
  codeText: { color: colors.text, fontSize: 13, fontFamily: 'monospace', flex: 1 },
  diffCard: {
    margin: 12,
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },
  diffTitle: { color: colors.violet, fontSize: 14, fontWeight: '700' },
  diffSub: { color: colors.muted, fontSize: 13, marginTop: 2 },
  diffFile: { color: colors.text, fontSize: 13, marginTop: 10, marginBottom: 6 },
  diffLine: { fontSize: 13, fontFamily: 'monospace', marginVertical: 2 },
  diffBtns: { flexDirection: 'row', gap: 10, marginTop: 12 },
  confirmBtn: {
    flex: 1,
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  confirmText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  discardBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.violet,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  discardText: { color: colors.violet, fontWeight: '700', fontSize: 15 },
  note: {
    marginHorizontal: 12,
    marginBottom: 12,
    backgroundColor: colors.card2,
    borderRadius: 12,
    padding: 12,
  },
  noteText: { color: colors.muted, fontSize: 13 },
});
