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
import { Colors, Spacing, FontSizes } from '../theme/colors';

export default function DayPhaseTransitionScreen({ onNavigate }: { onNavigate?: (screen: string) => void }) {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.9);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      if (onNavigate) onNavigate('DayPhase');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#111317" />
      <View style={styles.sunGlow} />

      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <Text style={styles.sunSymbol}>🌅</Text>
        <Text style={styles.phaseLabel}>PHONG ẤN BAN ĐÊM KHÉP LẠI</Text>
        <Text style={styles.phaseTitle}>BÌNH MINH HẰNG ĐÔNG</Text>
        <Text style={styles.phaseSubtitle}>Sương mù Hắc Tùng tan biến • Dân làng tỉnh giấc</Text>

        <View style={styles.loadingBarTrack}>
          <View style={styles.loadingBarFill} />
        </View>

        <TouchableOpacity style={styles.skipBtn} onPress={() => onNavigate && onNavigate('DayPhase')}>
          <Text style={styles.skipBtnText}>Vào Thảo Luận ›</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#111317', alignItems: 'center', justifyContent: 'center' },
  sunGlow: {
    position: 'absolute', width: 300, height: 300, borderRadius: 150,
    backgroundColor: 'rgba(241,190,102,0.15)', top: '30%',
  },
  content: { alignItems: 'center', padding: 24, gap: 12 },
  sunSymbol: { fontSize: 56, marginBottom: 8 },
  phaseLabel: { color: Colors.tertiary, fontSize: 11, fontWeight: '700', letterSpacing: 2 },
  phaseTitle: { color: '#FFFFFF', fontSize: 26, fontWeight: '700', letterSpacing: 1 },
  phaseSubtitle: { color: Colors.onSurfaceVariant, fontSize: 12, textAlign: 'center' },
  loadingBarTrack: {
    width: 200, height: 4, backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 2, marginTop: 16, overflow: 'hidden',
  },
  loadingBarFill: {
    width: '100%', height: '100%', backgroundColor: Colors.tertiary,
  },
  skipBtn: { marginTop: 20, paddingHorizontal: 16, paddingVertical: 8 },
  skipBtnText: { color: Colors.secondary, fontSize: 12, fontWeight: '600' },
});
