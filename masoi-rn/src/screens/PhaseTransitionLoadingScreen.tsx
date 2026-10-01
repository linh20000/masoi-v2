import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { Colors } from '../theme/colors';

export default function PhaseTransitionLoadingScreen({ onNavigate }: { onNavigate?: (screen: string) => void }) {
  const spinValue = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();

    const timer = setTimeout(() => {
      if (onNavigate) onNavigate('NightPhase');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#111317" />
      <View style={styles.bgGlow} />

      <View style={styles.content}>
        <Animated.View style={[styles.runeCircle, { transform: [{ rotate: spin }] }]}>
          <Text style={{ fontSize: 44 }}>🔮</Text>
        </Animated.View>

        <Text style={styles.tag}>NGHI THỨC PHONG ẤN</Text>
        <Text style={styles.title}>ĐÊM 1 BUÔNG XUỐNG</Text>
        <Text style={styles.sub}>Vòng tròn Ma Quái mở rộng • Toàn làng chìm vào giấc ngủ</Text>

        <TouchableOpacity style={styles.skipBtn} onPress={() => onNavigate && onNavigate('NightPhase')}>
          <Text style={styles.skipBtnText}>Vào Ban Đêm ›</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#111317', alignItems: 'center', justifyContent: 'center' },
  bgGlow: {
    position: 'absolute', width: 280, height: 280, borderRadius: 140,
    backgroundColor: 'rgba(114,212,238,0.12)', top: '32%',
  },
  content: { alignItems: 'center', padding: 24, gap: 10 },
  runeCircle: {
    width: 90, height: 90, borderRadius: 45, backgroundColor: Colors.surfaceContainerHigh,
    alignItems: 'center', justifyContent: 'center', marginBottom: 10,
    borderWidth: 2, borderColor: Colors.secondary,
  },
  tag: { color: Colors.secondary, fontSize: 11, fontWeight: '700', letterSpacing: 2 },
  title: { color: '#FFFFFF', fontSize: 24, fontWeight: '700', letterSpacing: 1 },
  sub: { color: Colors.onSurfaceVariant, fontSize: 11, textAlign: 'center' },
  skipBtn: { marginTop: 16, paddingHorizontal: 16, paddingVertical: 8 },
  skipBtnText: { color: Colors.secondary, fontSize: 12, fontWeight: '600' },
});
