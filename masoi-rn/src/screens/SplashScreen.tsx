import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Colors, Spacing, FontSizes, BorderRadius } from '../theme/colors';
import { ROLE_CARD_IMAGES } from '../theme/images';

const LOADING_PHRASES = [
  'Đang tải dữ liệu thẻ bài và đồng bộ voice server...',
  'Khởi tạo phòng phán quyết và bài vị Tiên Tri...',
  'Thanh tẩy linh hồn & giải mã phong ấn huyết nguyệt...',
  'Sẵn sàng gia nhập bầy sói cõi mộng...',
];

export default function SplashScreen({ navigation }: { navigation?: any }) {
  const [progress, setProgress] = useState(78);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [ritualActivated, setRitualActivated] = useState(false);

  const rotateAnim = useRef(new Animated.Value(0)).current;
  const spinIconAnim = useRef(new Animated.Value(0)).current;
  const pingAnim = useRef(new Animated.Value(0)).current;
  const progressWidth = useRef(new Animated.Value(78)).current;

  useEffect(() => {
    // Rotating outer sigil runes
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 24000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Spinning loader icon
    Animated.loop(
      Animated.timing(spinIconAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Pulsing ping dot & glows
    Animated.loop(
      Animated.sequence([
        Animated.timing(pingAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(pingAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
      ])
    ).start();

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 99) {
          clearInterval(interval);
          if (navigation) navigation.replace('Home');
          return 100;
        }
        const next = Math.min(prev + Math.floor(Math.random() * 3) + 1, 99);

        if (next > 85 && phraseIndex === 0) setPhraseIndex(1);
        else if (next > 94 && phraseIndex === 1) setPhraseIndex(2);

        return next;
      });
    }, 450);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    Animated.timing(progressWidth, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const spinIcon = spinIconAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const pingOpacity = pingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1],
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />
      
      {/* Background Glow Blobs */}
      <View style={styles.crimsonGlow} pointerEvents="none" />
      <View style={styles.cyanGlow} pointerEvents="none" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Top System Utility Strip */}
        <View style={styles.topStrip}>
          <View style={styles.serverBadge}>
            <Animated.View style={[styles.pingDot, { opacity: pingOpacity }]} />
            <Text style={styles.serverText}>HN-GATEWAY 24ms</Text>
          </View>
          <View style={styles.topActions}>
            <TouchableOpacity style={styles.iconBtn}>
              <Text style={styles.iconText}>🔊</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Text style={styles.iconText}>❓</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Center Sigil & Branding Section */}
        <View style={styles.brandingSection}>
          <View style={styles.sigilContainer}>
            <Animated.View style={{ position: 'absolute', transform: [{ rotate }] }}>
              <Svg width={144} height={144} viewBox="0 0 100 100">
                <Circle
                  cx="50" cy="50" r="46"
                  stroke="#8a121a" strokeWidth="1"
                  strokeDasharray="4 6" fill="none" opacity={0.6}
                />
                <Circle
                  cx="50" cy="50" r="41"
                  stroke="#72d4ee" strokeWidth="0.75"
                  strokeDasharray="2 8" fill="none" opacity={0.4}
                />
              </Svg>
            </Animated.View>

            <View style={styles.sigilCore}>
              <Image
                source={{ uri: ROLE_CARD_IMAGES.seer }}
                style={styles.sigilImage}
                resizeMode="cover"
              />
              <View style={styles.sigilOverlay} />
            </View>

            <View style={styles.bloodmoonBadge}>
              <Text style={styles.bloodmoonText}>BLOODMOON</Text>
            </View>
          </View>

          <Text style={styles.titleMain}>Nightfall Realm</Text>
          <View style={styles.subtitleRow}>
            <View style={styles.divider} />
            <Text style={styles.subtitleText}>Cõi Đêm Huyền Bí • Kỳ Án Ma Sói</Text>
            <View style={styles.divider} />
          </View>
          <Text style={styles.tagline}>
            Đấu trí đỉnh cao • Giao lưu cõi mộng • Voice chat thời gian thực
          </Text>
        </View>

        {/* Loading Card */}
        <View style={styles.loadingCard}>
          <View style={styles.loadingHeader}>
            <View style={styles.loadingHeaderLeft}>
              <Animated.View style={[styles.loadingPingDot, { opacity: pingOpacity }]} />
              <Text style={styles.loadingLabel}>ĐANG NẠP THỰC CẢNH</Text>
            </View>
            <Text style={styles.progressPercent}>{progress}%</Text>
          </View>

          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progressWidth.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>

          <Text style={styles.loadingSubtext} numberOfLines={1}>
            {LOADING_PHRASES[phraseIndex]} [{progress}%]
          </Text>

          <View style={styles.checklist}>
            <View style={styles.checkItem}>
              <Text style={styles.checkIconGreen}>✓</Text>
              <Text style={styles.checkText}>Kết nối WebSocket Gateway (Hà Nội Server)</Text>
              <Text style={styles.checkBadge}>24ms</Text>
            </View>
            <View style={styles.checkItem}>
              <Text style={styles.checkIconGreen}>✓</Text>
              <Text style={styles.checkText}>Tài nguyên hình ảnh HD & Âm thanh cõi mộng</Text>
              <Text style={styles.checkBadge}>HOÀN TẤT</Text>
            </View>
            <View style={[styles.checkItem, styles.checkItemActive]}>
              <Animated.Text style={[styles.checkIconSpinning, { transform: [{ rotate: spinIcon }] }]}>
                ⟳
              </Animated.Text>
              <Text style={[styles.checkText, { fontWeight: '600' }]}>
                Kiểm tra phiên đăng nhập & Túi đồ
              </Text>
              <Animated.Text style={[styles.checkBadgePrimary, { opacity: pingOpacity }]}>
                ĐANG NẠP...
              </Animated.Text>
            </View>
          </View>
        </View>

        {/* Tip Card */}
        <View style={styles.tipCard}>
          <View style={styles.tipIcon}>
            <Text style={{ fontSize: 16 }}>💡</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.tipLabel}>MẸO QUẢN TRÒ</Text>
            <Text style={styles.tipText}>
              Bật tai nghe để cảm nhận rõ nhất tiếng thì thầm cõi mộng và hướng hơi thở của bầy sói trong đêm.
            </Text>
          </View>
        </View>

        {/* Interactive Secret Ritual Trigger */}
        <TouchableOpacity
          style={[styles.ritualBtn, ritualActivated && styles.ritualBtnActive]}
          onPress={() => {
            setRitualActivated(true);
            setTimeout(() => setRitualActivated(false), 2200);
          }}
          activeOpacity={0.8}
        >
          <Text style={[styles.ritualBtnText, ritualActivated && styles.ritualBtnTextActive]}>
            {ritualActivated
              ? '✨ ẤN CHƯƠNG ĐÃ MỞ • TIẾNG VỌNG KÍCH HOẠT'
              : '✦ CHẠM NIỆM ẤN KÍCH HOẠT ÂM THANH'}
          </Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Phiên bản v2.4.1 (Build 890) • Secure Peer-to-Peer Voice Engine
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.surface, position: 'relative' },
  crimsonGlow: {
    position: 'absolute', top: -40, left: '20%', width: 280, height: 280,
    borderRadius: 140, backgroundColor: 'rgba(138,18,26,0.3)',
  },
  cyanGlow: {
    position: 'absolute', top: 200, right: -50, width: 220, height: 220,
    borderRadius: 110, backgroundColor: 'rgba(50,157,182,0.15)',
  },
  container: { flex: 1 },
  content: { paddingHorizontal: Spacing.marginMobile, paddingBottom: Spacing.lg, paddingTop: 8 },
  topStrip: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: Spacing.sm },
  serverBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: `${Colors.surfaceContainerHigh}CC`,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: BorderRadius.full,
  },
  pingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.secondary },
  serverText: { color: Colors.secondary, fontSize: FontSizes.bodySm, fontWeight: '600', letterSpacing: 1 },
  topActions: { flexDirection: 'row', gap: 6 },
  iconBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: `${Colors.surfaceContainerHigh}B3`,
    alignItems: 'center', justifyContent: 'center',
  },
  iconText: { fontSize: 16 },
  brandingSection: { alignItems: 'center', paddingTop: Spacing.md, paddingBottom: Spacing.lg },
  sigilContainer: { width: 144, height: 144, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md, position: 'relative' },
  sigilCore: {
    width: 112, height: 112, borderRadius: 56,
    backgroundColor: Colors.primaryContainer, alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden', borderWidth: 2, borderColor: Colors.primary,
  },
  sigilImage: { width: '100%', height: '100%' },
  sigilOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(17,19,23,0.3)',
  },
  bloodmoonBadge: {
    position: 'absolute', top: -6,
    backgroundColor: Colors.surfaceContainerLowest,
    paddingHorizontal: 10, paddingVertical: 2, borderRadius: BorderRadius.full,
    borderWidth: 1, borderColor: `${Colors.primary}40`,
  },
  bloodmoonText: { color: Colors.primary, fontSize: FontSizes.labelSm, fontWeight: '700', letterSpacing: 2 },
  titleMain: {
    color: Colors.onSurface, fontSize: FontSizes.headlineLgMobile,
    fontWeight: '700', textTransform: 'uppercase', letterSpacing: 2,
    marginBottom: Spacing.xs,
  },
  subtitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  divider: { height: 1, width: 24, backgroundColor: Colors.outlineVariant },
  subtitleText: { color: Colors.tertiary, fontSize: FontSizes.labelSm, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase' },
  tagline: { color: Colors.onSurfaceVariant, fontSize: FontSizes.bodySm, textAlign: 'center', lineHeight: 18, maxWidth: 280 },
  loadingCard: {
    backgroundColor: `${Colors.surfaceContainer}F2`, borderRadius: BorderRadius.lg,
    padding: Spacing.md, marginBottom: Spacing.md,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
  },
  loadingHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.xs },
  loadingHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  loadingPingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary },
  loadingLabel: { color: Colors.onSurface, fontSize: FontSizes.labelSm, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase' },
  progressPercent: { color: Colors.primary, fontSize: FontSizes.timerDisplayMobile, fontWeight: '700' },
  progressTrack: {
    height: 10, borderRadius: 5, backgroundColor: Colors.surfaceContainerLowest,
    overflow: 'hidden', marginBottom: Spacing.sm, padding: 2,
  },
  progressFill: { height: '100%', borderRadius: 4, backgroundColor: Colors.primary },
  loadingSubtext: { color: Colors.onSurfaceVariant, fontSize: FontSizes.bodySm, marginBottom: Spacing.md },
  checklist: { gap: 6 },
  checkItem: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 8,
    paddingHorizontal: Spacing.sm, borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceContainerLow, gap: 8,
  },
  checkItemActive: { backgroundColor: `${Colors.surfaceContainerHigh}E6` },
  checkIconGreen: { color: Colors.secondary, fontSize: 16, fontWeight: '700' },
  checkIconSpinning: { color: Colors.primary, fontSize: 16, fontWeight: '700' },
  checkText: { color: Colors.onSurface, fontSize: FontSizes.bodySm, flex: 1 },
  checkBadge: { color: Colors.secondary, fontSize: FontSizes.labelSm, fontWeight: '700' },
  checkBadgePrimary: { color: Colors.primary, fontSize: FontSizes.labelSm, fontWeight: '700' },
  tipCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm,
    backgroundColor: `${Colors.surfaceContainerLow}E6`, borderRadius: BorderRadius.md,
    padding: Spacing.sm, marginBottom: Spacing.md,
  },
  tipIcon: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: `${Colors.tertiaryContainer}66`, alignItems: 'center', justifyContent: 'center', marginTop: 2,
  },
  tipLabel: { color: Colors.tertiary, fontSize: FontSizes.labelSm, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 2 },
  tipText: { color: Colors.onSurfaceVariant, fontSize: FontSizes.bodySm, lineHeight: 16 },
  ritualBtn: {
    alignSelf: 'center', paddingHorizontal: Spacing.md, paddingVertical: 10,
    borderRadius: BorderRadius.full, backgroundColor: Colors.surfaceContainerHigh, marginBottom: Spacing.md,
    borderWidth: 1, borderColor: `${Colors.outline}40`,
  },
  ritualBtnActive: { backgroundColor: Colors.primaryContainer, borderColor: Colors.primary },
  ritualBtnText: { color: Colors.outline, fontSize: FontSizes.labelSm, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase' },
  ritualBtnTextActive: { color: Colors.onPrimary },
  footer: { alignItems: 'center' },
  footerText: { color: Colors.outline, fontSize: FontSizes.bodySm, textAlign: 'center' },
});
