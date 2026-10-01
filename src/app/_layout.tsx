import { Tabs } from 'expo-router';
import { Text, type ColorValue } from 'react-native';
import { colors } from '../theme';

function TabEmoji({ emoji, color }: { emoji: string; color: ColorValue }) {
  return <Text style={{ fontSize: 22, color }}>{emoji}</Text>;
}

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.muted,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color }) => <TabEmoji emoji="💬" color={color} />,
        }}
      />
      <Tabs.Screen
        name="editor"
        options={{
          title: 'Editor',
          tabBarIcon: ({ color }) => <TabEmoji emoji="📝" color={color} />,
        }}
      />
      <Tabs.Screen
        name="archivos"
        options={{
          title: 'Archivos',
          tabBarIcon: ({ color }) => <TabEmoji emoji="📁" color={color} />,
        }}
      />
      <Tabs.Screen
        name="terminal"
        options={{
          title: 'Terminal',
          tabBarIcon: ({ color }) => <TabEmoji emoji="🖥️" color={color} />,
        }}
      />
      <Tabs.Screen
        name="skills"
        options={{
          title: 'Skills',
          tabBarIcon: ({ color }) => <TabEmoji emoji="🧩" color={color} />,
        }}
      />
    </Tabs>
  );
}
