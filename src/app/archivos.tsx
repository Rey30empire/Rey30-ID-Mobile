import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors } from '../theme';

type Node = { name: string; type: 'dir' | 'file'; children?: Node[] };

const TREE: Node[] = [
  {
    name: 'proyecto-app',
    type: 'dir',
    children: [
      {
        name: 'src',
        type: 'dir',
        children: [
          { name: 'index.html', type: 'file' },
          { name: 'styles.css', type: 'file' },
          { name: 'components', type: 'dir', children: [] },
          { name: 'utils', type: 'dir', children: [] },
          { name: 'main.js', type: 'file' },
        ],
      },
    ],
  },
];

function NodeRow({
  node,
  path,
  depth,
  expanded,
  onToggle,
}: {
  node: Node;
  path: string;
  depth: number;
  expanded: Set<string>;
  onToggle: (p: string) => void;
}) {
  const router = useRouter();
  const isOpen = expanded.has(path);
  return (
    <View>
      <Pressable
        style={[styles.row, { paddingLeft: 16 + depth * 22 }]}
        onPress={() => (node.type === 'dir' ? onToggle(path) : router.push('/editor'))}
      >
        <Text style={styles.rowIcon}>{node.type === 'dir' ? (isOpen ? '📂' : '📁') : '📄'}</Text>
        <Text style={styles.rowName}>{node.name}</Text>
        {node.type === 'dir' && <Text style={styles.chev}>{isOpen ? '▾' : '▸'}</Text>}
      </Pressable>
      {node.type === 'dir' &&
        isOpen &&
        node.children?.map((c) => (
          <NodeRow
            key={c.name}
            node={c}
            path={`${path}/${c.name}`}
            depth={depth + 1}
            expanded={expanded}
            onToggle={onToggle}
          />
        ))}
    </View>
  );
}

export default function ArchivosScreen() {
  const [expanded, setExpanded] = useState<Set<string>>(
    new Set(['proyecto-app', 'proyecto-app/src'])
  );

  const toggle = (p: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(p)) next.delete(p);
      else next.add(p);
      return next;
    });

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📁 EXPLORADOR</Text>
      </View>
      <ScrollView style={styles.tree}>
        {TREE.map((n) => (
          <NodeRow
            key={n.name}
            node={n}
            path={n.name}
            depth={0}
            expanded={expanded}
            onToggle={toggle}
          />
        ))}
      </ScrollView>
      <View style={styles.footer}>
        <Text style={styles.footerText}>✨ Agente IA · 3 cambios recientes</Text>
      </View>
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
  tree: { flex: 1, paddingVertical: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingRight: 16,
  },
  rowIcon: { fontSize: 18, marginRight: 10 },
  rowName: { color: colors.text, fontSize: 16, flex: 1 },
  chev: { color: colors.muted, fontSize: 14 },
  footer: {
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerText: { color: colors.violet, fontSize: 13 },
});
