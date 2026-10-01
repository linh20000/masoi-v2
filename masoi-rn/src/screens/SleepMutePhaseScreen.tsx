import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
} from 'react-native';
import { Colors, Spacing, FontSizes, BorderRadius } from '../theme/colors';
import { SEAT_AVATAR_IMAGES } from '../theme/images';

export default function SleepMutePhaseScreen({ onNavigate }: { onNavigate?: (screen: string) => void }) {
  const [timer, setTimer] = useState(35);
  const [isEavesdropOn, setIsEavesdropOn] = useState(true);
  const [isWhispering, setIsWhispering] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => onNavigate && onNavigate('Home')}>
          <Text style={styles.backBtnText}>‹ Rời Cõi Mộng</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>LÀNG SAY NGỦ • CÁCH LY</Text>
        <View style={styles.timerChip}>
          <Text style={styles.timerText}>00:{String(timer).padStart(2, '0')}</Text>
        </View>
      </View>

      <ScrollView style={styles.mainScroll} contentContainerStyle={styles.scrollContent}>
        {/* Sleeping Status Banner */}
        <View style={styles.statusCard}>
          <View style={styles.moonIconBox}>
            <Text style={{ fontSize: 20 }}>🌙</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.statusTitle}>ĐÊM 1 • TOÀN LÀNG SAY NGỦ</Text>
            <Text style={styles.statusSub}>Quản trò đang triệu hồi chức năng ngầm...</Text>
          </View>
        </View>

        {/* Audio Isolation Channel Notice */}
        <View style={styles.isolationCard}>
          <View style={styles.isolationHeader}>
            <View style={styles.eqIconBox}>
              <Text style={{ fontSize: 16 }}>📻</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.channelTitleRow}>
                <Text style={styles.channelTitle}>KÊNH THOẠI CÕI MỘNG</Text>
                <View style={styles.channelBadge}>
                  <Text style={styles.channelBadgeText}>ĐANG MỞ</Text>
                </View>
              </View>
              <Text style={styles.channelDesc}>
                Chỉ có thể trò chuyện và nghe tiếng thì thầm mờ ảo của những linh hồn đang say ngủ.
              </Text>
            </View>
          </View>

          <View style={styles.lockNotice}>
            <Text style={styles.lockIcon}>🔒</Text>
            <Text style={styles.lockText}>
              CÁCH LY TUYỆT ĐỐI: Hoàn toàn không nghe thấy người được Quản trò gọi thức giấc.
            </Text>
          </View>
        </View>

        {/* Sleeping Arena Illustration */}
        <View style={styles.sleepingHeroCard}>
          <Image
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbPiiOwngNuFfiRKb7aC73HOcyTVxOlBelFs4JLUM41VmJpsivlQ55JR32apVPxvY-GRC5wIt1MPl-K-MsdHxi6pD6rG6DFBp36_Skl1lEMkSpGHqH4UcnSfZ89GFwC92HuVqJXOc9u1nwuqUgVCCFcCI29EJV4B3MNzQZiolRIRzvX1o87Qy8EhbdSTrU8IMkKNwasSoUK-MpBVZqlPwQ5LubgsaJ1GEJ6JB8JbuYs9KGeOPA31xPMw' }}
            style={styles.sleepingHeroImg}
            resizeMode="cover"
          />
          <View style={styles.sleepingHeroOverlay}>
            <View style={styles.sleepingEyeIcon}>
              <Text style={{ fontSize: 24 }}>🙈</Text>
            </View>
            <Text style={styles.sleepingHeroTitle}>BẠN ĐANG NGỦ SAY</Text>
            <Text style={styles.sleepingHeroSub}>Giữ yên lặng • Đợi phong ấn thức giấc</Text>
          </View>
        </View>

        {/* Player Souls Grid */}
        <View style={styles.soulsGrid}>
          {[
            { seat: 'I', name: 'Bạn (Dân)', status: 'Thì thầm', isMe: true },
            { seat: 'II', name: 'LinhLan', status: 'Mộng nói', isMe: false },
            { seat: 'III', name: 'Hắc Phong', status: 'Say giấc', isMe: false },
            { seat: 'IV', name: 'Minh Dạ', status: 'Say giấc', isMe: false },
            { seat: 'V', name: 'Bách Hợp', status: 'Say giấc', isMe: false },
            { seat: 'VI', name: 'Lam Ca', status: 'Say giấc', isMe: false },
          ].map((item) => (
            <View key={item.seat} style={[styles.soulTile, item.isMe && styles.soulTileMe]}>
              <Image
                source={{ uri: SEAT_AVATAR_IMAGES[item.seat] }}
                style={styles.soulAvatar}
                resizeMode="cover"
              />
              <Text style={styles.soulSeat}>Ghế {item.seat}</Text>
              <Text style={styles.soulName} numberOfLines={1}>{item.name}</Text>
              <Text style={[styles.soulStatus, item.isMe && styles.soulStatusMe]}>{item.status}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Push To Whisper Controller */}
      <View style={styles.footerDeck}>
        <View style={styles.eavesdropRow}>
          <TouchableOpacity
            style={[styles.eavesdropBtn, !isEavesdropOn && styles.eavesdropBtnOff]}
            onPress={() => setIsEavesdropOn(!isEavesdropOn)}
          >
            <Text style={styles.eavesdropIcon}>{isEavesdropOn ? '🎧' : '🔇'}</Text>
            <Text style={styles.eavesdropText}>
              Tai Nghe Mộng: {isEavesdropOn ? 'BẬT' : 'TẮT'}
            </Text>
          </TouchableOpacity>

          <View style={styles.lockBadge}>
            <Text style={styles.lockBadgeText}>🔒 KÊNH THỨC: CÁCH LY</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.whisperBtn, isWhispering && styles.whisperBtnActive]}
          onPressIn={() => setIsWhispering(true)}
          onPressOut={() => setIsWhispering(false)}
          activeOpacity={0.9}
        >
          <Text style={styles.whisperBtnIcon}>🎙️</Text>
          <View>
            <Text style={styles.whisperBtnTitle}>
              {isWhispering ? 'ĐANG THÌ THẦM...' : 'NHẤN GIỮ ĐỂ THÌ THẦM'}
            </Text>
            <Text style={styles.whisperBtnSub}>Chỉ những người đang ngủ nghe thấy bạn</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.surface },
  header: {
    height: 50, paddingHorizontal: Spacing.marginMobile,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: `${Colors.surfaceContainer}E6`, borderBottomWidth: 1, borderBottomColor: `${Colors.outline}33`,
  },
  backBtn: {},
  backBtnText: { color: Colors.secondary, fontSize: 13, fontWeight: '700' },
  headerTitle: { color: Colors.primary, fontSize: 13, fontWeight: '700', letterSpacing: 1 },
  timerChip: { backgroundColor: Colors.tertiaryContainer, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  timerText: { color: Colors.tertiary, fontSize: 13, fontWeight: '700' },

  mainScroll: { flex: 1 },
  scrollContent: { padding: Spacing.marginMobile, gap: 12 },

  statusCard: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.surfaceContainerLow, padding: 12, borderRadius: 12,
  },
  moonIconBox: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primaryContainer,
    alignItems: 'center', justifyContent: 'center',
  },
  statusTitle: { color: Colors.primary, fontSize: 13, fontWeight: '700' },
  statusSub: { color: Colors.onSurfaceVariant, fontSize: 10, marginTop: 1 },

  isolationCard: {
    backgroundColor: Colors.surfaceContainer, padding: 12, borderRadius: 12, gap: 8,
    borderWidth: 1, borderColor: `${Colors.secondary}40`,
  },
  isolationHeader: { flexDirection: 'row', gap: 10 },
  eqIconBox: {
    width: 32, height: 32, borderRadius: 8, backgroundColor: `${Colors.secondaryContainer}40`,
    alignItems: 'center', justifyContent: 'center',
  },
  channelTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  channelTitle: { color: Colors.secondary, fontSize: 12, fontWeight: '700' },
  channelBadge: { backgroundColor: `${Colors.secondary}30`, paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4 },
  channelBadgeText: { color: Colors.secondary, fontSize: 8, fontWeight: '700' },
  channelDesc: { color: Colors.onSurfaceVariant, fontSize: 11, marginTop: 2, lineHeight: 15 },

  lockNotice: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: `${Colors.errorContainer}40`, padding: 8, borderRadius: 8,
  },
  lockIcon: { fontSize: 12 },
  lockText: { color: Colors.error, fontSize: 9, fontWeight: '700', flex: 1 },

  sleepingHeroCard: {
    height: 140, borderRadius: 12, overflow: 'hidden', position: 'relative',
    borderWidth: 1, borderColor: Colors.surfaceContainerHigh,
  },
  sleepingHeroImg: { width: '100%', height: '100%', opacity: 0.5 },
  sleepingHeroOverlay: {
    position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', gap: 4,
  },
  sleepingEyeIcon: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.surfaceContainerHigh,
    alignItems: 'center', justifyContent: 'center',
  },
  sleepingHeroTitle: { color: Colors.onSurface, fontSize: 16, fontWeight: '700', letterSpacing: 1 },
  sleepingHeroSub: { color: Colors.secondary, fontSize: 10 },

  soulsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'space-between' },
  soulTile: {
    width: '31%', backgroundColor: Colors.surfaceContainerLow, borderRadius: 10, padding: 8,
    alignItems: 'center', gap: 2,
  },
  soulTileMe: { borderWidth: 1, borderColor: Colors.secondary, backgroundColor: Colors.surfaceContainer },
  soulAvatar: { width: 36, height: 36, borderRadius: 18, marginBottom: 2 },
  soulSeat: { color: Colors.outline, fontSize: 9, fontWeight: '700' },
  soulName: { color: Colors.onSurface, fontSize: 11, fontWeight: '600' },
  soulStatus: { color: Colors.onSurfaceVariant, fontSize: 9 },
  soulStatusMe: { color: Colors.secondary, fontWeight: '700' },

  footerDeck: {
    backgroundColor: Colors.surfaceContainerLow, padding: 14, gap: 10,
    borderTopWidth: 1, borderTopColor: `${Colors.outline}33`,
  },
  eavesdropRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  eavesdropBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.surfaceContainerHigh, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8,
  },
  eavesdropBtnOff: { opacity: 0.6 },
  eavesdropIcon: { fontSize: 14 },
  eavesdropText: { color: Colors.secondary, fontSize: 10, fontWeight: '700' },
  lockBadge: { backgroundColor: `${Colors.errorContainer}40`, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  lockBadgeText: { color: Colors.error, fontSize: 9, fontWeight: '700' },

  whisperBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: Colors.secondaryContainer, paddingVertical: 14, borderRadius: 12,
  },
  whisperBtnActive: { backgroundColor: Colors.secondary },
  whisperBtnIcon: { fontSize: 20 },
  whisperBtnTitle: { color: Colors.onSecondaryContainer, fontSize: 13, fontWeight: '700', letterSpacing: 1 },
  whisperBtnSub: { color: Colors.onSecondaryContainer, fontSize: 9, opacity: 0.8 },
});
