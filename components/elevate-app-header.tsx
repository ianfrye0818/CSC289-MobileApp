import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ui/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';

const LOGO = require('@/assets/images/icon.png');

export function ElevateAppHeader() {
  const colorScheme = useColorScheme() ?? 'light';
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor =
    colorScheme === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)';

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.safe, { backgroundColor, borderBottomColor: borderColor }]}
    >
      <View style={styles.shell}>
        <View style={styles.row}>
          <View style={styles.third}>
            <Image
              source={LOGO}
              style={styles.logo}
              contentFit='contain'
              accessibilityRole='image'
              accessibilityLabel='Elevate Retail logo'
            />
          </View>
          <View style={styles.third} />
          <View style={styles.third} />
        </View>
        <View style={styles.titleLayer} pointerEvents='none'>
          <ThemedText type='defaultSemiBold' style={styles.title}>
            Elevate Retail
          </ThemedText>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  shell: {
    position: 'relative',
    minHeight: 44,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    paddingHorizontal: 16,
  },
  third: {
    flex: 1,
    justifyContent: 'center',
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  titleLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 17,
  },
});
