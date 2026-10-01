import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme';

type Skill = { name: string; desc: string; icon: string; on: boolean };

export default function SkillsScreen() {
  const [skills, setSkills] = useState<Skill[]>([
    { name: 'GitHub', desc: 'Crear repos y subir código', icon: '🐙', on: true },
    { name: 'Navegador', desc: 'Buscar y leer páginas web', icon: '🌐', on: true },
    { name: 'Base de datos', desc: 'Guardar datos del proyecto', icon: '🗄️', on: false },
  ]);

  const toggle = (name: string) =>
    setSkills((prev) => prev.map((s) => (s.name === name ? { ...s, on: !s.on } : s)));

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🧩 SKILLS & MCP</Text>
      </View>
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.section}>Mis skills</Text>
        {skills.map((s) => (
          <View key={s.name} style={styles.card}>
            <Text style={styles.skillIcon}>{s.icon}</Text>
            <View style={styles.skillInfo}>
              <Text style={styles.skillName}>{s.name}</Text>
              <Text style={styles.skillDesc}>{s.desc}</Text>
            </View>
            <Switch
              value={s.on}
              onValueChange={() => toggle(s.name)}
              trackColor={{ false: colors.border, true: colors.accent }}
            />
          </View>
        ))}

        <Text style={styles.section}>Servidores MCP</Text>
        {['github-mcp', 'filesystem-mcp'].map((m) => (
          <View key={m} style={styles.card}>
            <Text style={styles.dot} />
            <View style={styles.skillInfo}>
              <Text style={styles.skillName}>{m}</Text>
              <Text style={styles.skillDesc}>conectado</Text>
            </View>
          </View>
        ))}

        <Pressable
          style={styles.actionBtn}
          onPress={() =>
            setSkills((p) => [
              ...p,
              { name: `Skill ${p.length + 1}`, desc: 'Creado desde el chat', icon: '✨', on: true },
            ])
          }
        >
          <Text style={styles.actionText}>＋ Crear skill</Text>
        </Pressable>
        <Pressable
          style={[styles.actionBtn, styles.ghostBtn]}
          onPress={() =>
            setSkills((p) => [
              ...p,
              { name: 'Plugin instalado', desc: 'Desde el instalador de plugins', icon: '🔌', on: true },
            ])
          }
        >
          <Text style={[styles.actionText, styles.ghostText]}>＋ Instalar plugin</Text>
        </Pressable>
      </ScrollView>
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
  headerTitle: { color: colors.accent, fontSize: 15, fontWeight: '700', letterSpacing: 1 },
  body: { padding: 16, gap: 12 },
  section: { color: colors.text, fontSize: 16, fontWeight: '700', marginTop: 4 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    gap: 12,
  },
  skillIcon: { fontSize: 26 },
  skillInfo: { flex: 1 },
  skillName: { color: colors.text, fontSize: 16, fontWeight: '600' },
  skillDesc: { color: colors.muted, fontSize: 13, marginTop: 2 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.green },
  actionBtn: {
    backgroundColor: colors.accent,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  actionText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  ghostBtn: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.violet },
  ghostText: { color: colors.violet },
});
