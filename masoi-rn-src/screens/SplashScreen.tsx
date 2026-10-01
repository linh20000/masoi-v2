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
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Colors, Spacing, FontSizes, BorderRadius } from '../theme/colors';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const LOADING_PHRASES = [
  'Đang tải dữ liệu thẻ bài và đồng bộ voice server...',
  'Khởi tạo phòng phán quyết và bài vị Tiên Tri...',
  'Thanh tẩy linh hồn & giải mã phong ấn huyết nguyệt...',
  'Sẵn sàng gia nhập bầy sói cõi mộng...',
];

export default function SplashScreen({ navigation }: Props) {
  const [progress, setProgress] = useState(78);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [ritualActivated, setRitualActivated] = useState(false);

  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pingAnim = useRef(new Animated.Value(0)).current;
  const progressWidth = useRef(new Animated.Value(78)).current;

  useEffect(() => {
    // Spin animation for rune circle
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 24000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pingAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(pingAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
      ])
    ).start();

    // Progress simulation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 99) {
          clearInterval(interval);
          setTimeout(() => navigation.replace('Home'), 500);
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

  const pingOpacity = pingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1],
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Top utility strip */}
        <View style={styles.topStrip}>
          <View style={styles.serverBadge}>
            <Animated.View style={[styles.pingDot, { opacity: pingOpacity }]} />
            <Text style={styles.serverText}>HN-GATEWAY 24ms</Text>
          </View>
          <View style={styles.topActions}>
            <TouchableOpacity style={styles.iconBtn}>
              <Text style={styles.icon}>🔊</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Text style={styles.icon}>❓</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Center Crest & Branding */}
        <View style={styles.brandingSection}>
          {/* Sigil badge */}
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
              <View style={styles.sigilInner}>
                <Text style={styles.sigilIcon}>🛡️</Text>
              </View>
            </View>
            <View style={styles.bloodmoonBadge}>
              <Text style={styles.bloodmoonText}>BLOODMOON</Text>
            </View>
          </View>

          {/* Title hierarchy */}
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

          {/* Progress bar */}
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

          {/* Checklist */}
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
              <Text style={styles.checkIconSpinning}>⟳</Text>
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
            <Text style={styles.tipIconText}>💡</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.tipLabel}>MẸO QUẢN TRÒ</Text>
            <Text style={styles.tipText}>
              Bật tai nghe để cảm nhận rõ nhất tiếng thì thầm cõi mộng và hướng hơi thở của bầy sói trong đêm.
            </Text>
          </View>
        </View>

        {/* Ritual button */}
        <TouchableOpacity
          style={[styles.ritualBtn, ritualActivated && styles.ritualBtnActive]}
          onPress={() => {
            setRitualActivated(true);
            setTimeout(() => setRitualActivated(false), 2200);
          }}
        >
          <Text style={styles.ritualBtnText}>
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
  safeArea: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  content: {
    paddingHorizontal: Spacing.marginMobile,
    paddingBottom: Spacing.lg,
    paddingTop: 8,
  },
  topStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  serverBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: `${Colors.surfaceContainerHigh}CC`,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  pingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.secondary,
  },
  serverText: {
    color: Colors.secondary,
    fontSize: FontSizes.bodySm,
    fontWeight: '600',
    letterSpacing: 1,
  },
  topActions: {
    flexDirection: 'row',
    gap: 4,
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${Colors.surfaceContainerHigh}B3`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 16,
  },
  brandingSection: {
    alignItems: 'center',
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  sigilContainer: {
    width: 144,
    height: 144,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  sigilCore: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  sigilInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sigilIcon: {
    fontSize: 48,
  },
  bloodmoonBadge: {
    position: 'absolute',
    top: 0,
    backgroundColor: Colors.surfaceContainerLowest,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  bloodmoonText: {
    color: Colors.primary,
    fontSize: FontSizes.labelSm,
    fontWeight: '700',
    letterSpacing: 2,
  },
  titleMain: {
    color: Colors.onSurface,
    fontSize: FontSizes.headlineLgMobile,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 2,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    marginBottom: Spacing.xs,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  divider: {
    height: 1,
    width: 24,
    backgroundColor: Colors.outlineVariant,
  },
  subtitleText: {
    color: Colors.tertiary,
    fontSize: FontSizes.labelSm,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  tagline: {
    color: Colors.onSurfaceVariant,
    fontSize: FontSizes.bodySm,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 280,
  },
  loadingCard: {
    backgroundColor: `${Colors.surfaceContainer}F2`,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  loadingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  loadingHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  loadingPingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  loadingLabel: {
    color: Colors.onSurface,
    fontSize: FontSizes.labelSm,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  progressPercent: {
    color: Colors.primary,
    fontSize: FontSizes.timerDisplayMobile,
    fontWeight: '700',
    letterSpacing: 0,
  },
  progressTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.surfaceContainerLowest,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
    padding: 2,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
  },
  loadingSubtext: {
    color: Colors.onSurfaceVariant,
    fontSize: FontSizes.bodySm,
    marginBottom: Spacing.md,
  },
  checklist: {
    gap: 4,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceContainerLow,
    gap: 8,
  },
  checkItemActive: {
    backgroundColor: `${Colors.surfaceContainerHigh}E6`,
  },
  checkIconGreen: {
    color: Colors.secondary,
    fontSize: 16,
    fontWeight: '700',
  },
  checkIconSpinning: {
    color: Colors.primary,
    fontSize: 16,
  },
  checkText: {
    color: Colors.onSurface,
    fontSize: FontSizes.bodySm,
    flex: 1,
  },
  checkBadge: {
    color: Colors.secondary,
    fontSize: FontSizes.labelSm,
    fontWeight: '700',
  },
  checkBadgePrimary: {
    color: Colors.primary,
    fontSize: FontSizes.labelSm,
    fontWeight: '700',
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    backgroundColor: `${Colors.surfaceContainerLow}E6`,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
  },
  tipIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${Colors.tertiaryContainer}66`,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  tipIconText: { fontSize: 16 },
  tipLabel: {
    color: Colors.tertiary,
    fontSize: FontSizes.labelSm,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  tipText: {
    color: Colors.onSurfaceVariant,
    fontSize: FontSizes.bodySm,
    lineHeight: 16,
  },
  ritualBtn: {
    alignSelf: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceContainerHigh,
    marginBottom: Spacing.md,
  },
  ritualBtnActive: {
    backgroundColor: Colors.primaryContainer,
  },
  ritualBtnText: {
    color: Colors.outline,
    fontSize: FontSizes.labelSm,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    color: Colors.outline,
    fontSize: FontSizes.bodySm,
    textAlign: 'center',
  },
});
