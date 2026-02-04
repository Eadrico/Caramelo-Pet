// Tabs navigation layout for Caramelo
import { Tabs, useRouter, usePathname } from 'expo-router';
import { useColorScheme, Platform, View } from 'react-native';
import { Home, Settings } from 'lucide-react-native';
import { colors } from '@/components/design-system';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from '@/lib/i18n';
import * as Haptics from 'expo-haptics';

export default function TabsLayout() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const c = isDark ? colors.dark : colors.light;
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: c.accent,
        tabBarInactiveTintColor: c.textTertiary,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 28 : 12,
        },
        tabBarBackground: () => (
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
            {/* Gradient Light Effect on Top */}
            <LinearGradient
              colors={
                isDark
                  ? ['rgba(196, 167, 125, 0.25)', 'transparent']
                  : ['rgba(196, 167, 125, 0.15)', 'transparent']
              }
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 50,
              }}
            />

            {/* Glass Effect */}
            <BlurView
              intensity={isDark ? 80 : 100}
              tint={isDark ? 'dark' : 'light'}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: isDark
                  ? 'rgba(12, 10, 9, 0.5)'
                  : 'rgba(255, 255, 255, 0.5)',
                borderTopWidth: 1,
                borderTopColor: isDark
                  ? 'rgba(255, 255, 255, 0.15)'
                  : 'rgba(0, 0, 0, 0.08)',
              }}
            />
          </View>
        ),
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tab_home'),
          tabBarIcon: ({ color, size }) => (
            <Home size={size} color={color} strokeWidth={2} />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            // If already on home tab, trigger a reset by navigating to it again
            if (pathname === '/') {
              e.preventDefault();
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.replace('/');
            }
          },
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('tab_settings'),
          tabBarIcon: ({ color, size }) => (
            <Settings size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
    </Tabs>
  );
}
