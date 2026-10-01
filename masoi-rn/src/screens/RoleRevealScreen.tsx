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
import { ROLE_CARD_IMAGES } from '../theme/images';

export default function RoleRevealScreen({ onNavigate }: { onNavigate?: (screen: string) => void }) {
  const [timeLeft, setTimeLeft] = useState(8);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleConfirm = () => {
    if (onNavigate) {
      onNavigate('NightPhase');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => onNavigate && onNavigate('Home')}
        >
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>

        <View style={styles.headerTitleGroup}>
          <Text style={styles.headerCategory}>RITUAL ASSEMBLY</Text>
          <Text style={styles.headerTitle}>LẬT BÀI NHẬN VAI</Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconCircle}>
            <Text style={styles.iconCircleText}>🎙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        <View style={styles.statusBadge}>
          <View style={styles.pingDot} />
          <Text style={styles.statusBadgeText}>LỄ THỨC THỨC TỈNH</Text>
          <Text style={styles.statusDot}>•</Text>
          <Text style={styles.statusTimerText}>⏳ 00:0{timeLeft}</Text>
        </View>

        <Text style={styles.flavorQuote}>
          "Tiếng gầm rú xa xăm trong màn sương đêm..."
        </Text>

        <View style={styles.cardContainer}>
          <View style={styles.cardFrame}>
            <Text style={[styles.rune, styles.runeTopLeft]}>᚛ ᚱ ᚜</Text>
            <Text style={[styles.rune, styles.runeTopRight]}>᚛ ᛏ ᚜</Text>
            <Text style={[styles.rune, styles.runeBottomLeft]}>᚛ ᛟ ᚜</Text>
            <Text style={[styles.rune, styles.runeBottomRight]}>᚛ ᛹ ᚜</Text>

            <View style={styles.factionRow}>
              <View style={styles.factionBadge}>
                <Text style={styles.factionShieldIcon}>🛡️</Text>
                <Text style={styles.factionBadgeText}>PHE DÂN LÀNG</Text>
              </View>

              <View style={styles.arcanaBadge}>
                <Text style={styles.arcanaText}>✨ Lá Bài Số II</Text>
              </View>
            </View>

            {/* Role Card Image Hero Art */}
            <View style={styles.cardArtBox}>
              <Image
                source={{ uri: ROLE_CARD_IMAGES.seer }}
                style={styles.cardArtImage}
                resizeMode="contain"
              />
              <View style={styles.eyeBadge}>
                <Text style={styles.eyeBadgeIcon}>👁️</Text>
              </View>
            </View>

            <View style={styles.roleTitleGroup}>
              <Text style={styles.roleNameText}>TIÊN TRI</Text>
              <View style={styles.titleUnderline} />
              <Text style={styles.englishRoleName}>The Clairvoyant Seer</Text>
            </View>

            <View style={styles.skillBox}>
              <View style={styles.skillHeader}>
                <View style={styles.skillHeaderLeft}>
                  <Text style={styles.skillIcon}>✨</Text>
                  <Text style={styles.skillTitle}>Soi Danh Tính</Text>
                </View>
                <Text style={styles.cooldownBadge}>1 lần / đêm</Text>
              </View>

              <Text style={styles.skillDesc}>
                Mỗi đêm, bạn thức giấc và chỉ định 1 người chơi để kiểm tra danh tính thật của họ là{' '}
                <Text style={styles.highlightGood}>Phe Thiện (Dân Làng)</Text> hay{' '}
                <Text style={styles.highlightEvil}>Phe Ác (Ma Sói)</Text>.
              </Text>

              <View style={styles.skillPrivilegeRow}>
                <Text style={styles.privilegeIcon}>🛡️</Text>
                <Text style={styles.privilegeText}>
                  Đặc quyền: Chỉ duy nhất bạn và Quản Trò thấy kết quả soi linh hồn.
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.warningStrip}>
          <Text style={styles.lockIcon}>🔒</Text>
          <View style={styles.warningTextGroup}>
            <Text style={styles.warningTitle}>THÔNG TIN TUYỆT MẬT</Text>
            <Text style={styles.warningDesc}>
              Chỉ duy nhất bạn nhìn thấy lá bài này. Hãy giữ bí mật để bảo toàn mạng sống trước móng vuốt bầy Sói.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.confirmBtn}
          onPress={handleConfirm}
          activeOpacity={0.8}
        >
          <Text style={styles.confirmBtnCheck}>✓</Text>
          <Text style={styles.confirmBtnText}>TÔI ĐÃ HIỂU VAI TRÒ</Text>
          <Text style={styles.confirmBtnTimer}>({timeLeft}s)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.guideToggleBtn}
          onPress={() => setShowGuide(!showGuide)}
        >
          <Text style={styles.guideToggleIcon}>📖</Text>
          <Text style={styles.guideToggleText}>Chi Tiết Bí Thuật & Mẹo Chơi Tiên Tri</Text>
          <Text style={styles.guideToggleChevron}>{showGuide ? '▲' : '▼'}</Text>
        </TouchableOpacity>

        {showGuide && (
          <View style={styles.guideContentBox}>
            <Text style={styles.guideSectionTitle}>🧠 Chiến Thuật Tiên Tri Cổ Điển</Text>

            <View style={styles.tipCard}>
              <Text style={styles.tipNum}>01</Text>
              <View style={styles.tipTextGroup}>
                <Text style={styles.tipHeading}>Ẩn mình qua đêm đầu</Text>
                <Text style={styles.tipBody}>
                  Đừng vội lộ diện nếu chưa có thông tin quan trọng hoặc khi chưa có Bảo Vệ bảo kê. Tiên Tri lộ diện sớm là mục tiêu hạ sát số một của Bầy Sói.
                </Text>
              </View>
            </View>

            <View style={styles.tipCard}>
              <Text style={styles.tipNum}>02</Text>
              <View style={styles.tipTextGroup}>
                <Text style={styles.tipHeading}>Soi người dẫn dắt thảo luận</Text>
                <Text style={styles.tipBody}>
                  Ưu tiên soi những người chơi hoạt ngôn nhất làng để xác thực họ là Ngọn Hải Đăng dẫn lối hay Sói đầu đàn đang thao túng tâm lý.
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  header: {
    height: 56, paddingHorizontal: 16, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: `${Colors.surfaceContainer}D9`,
    borderBottomWidth: 1, borderBottomColor: `${Colors.outline}33`,
  },
  backButton: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  backButtonText: { fontSize: 24, color: Colors.onSurface },
  headerTitleGroup: { alignItems: 'center' },
  headerCategory: { fontSize: 9, color: Colors.outline, letterSpacing: 1.5, fontWeight: '700' },
  headerTitle: { fontSize: 14, fontWeight: '700', color: Colors.onSurface, letterSpacing: 0.5 },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  iconCircle: {
    width: 34, height: 34, borderRadius: 17, backgroundColor: Colors.surfaceContainerHigh,
    justifyContent: 'center', alignItems: 'center',
  },
  iconCircleText: { fontSize: 14 },
  scrollArea: { flex: 1 },
  scrollContent: { padding: 16, alignItems: 'center', gap: 12 },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.surfaceContainerHigh, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20,
  },
  pingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary },
  statusBadgeText: { fontSize: 10, fontWeight: '700', color: Colors.onSurfaceVariant, letterSpacing: 1 },
  statusDot: { fontSize: 10, color: Colors.outline },
  statusTimerText: { fontSize: 12, fontWeight: '700', color: Colors.primary },
  flavorQuote: { fontSize: 12, fontStyle: 'italic', color: Colors.tertiary, textAlign: 'center' },
  cardContainer: {
    width: '100%', maxWidth: 360, backgroundColor: Colors.surfaceContainerLowest, borderRadius: 16,
    padding: 6, borderWidth: 1, borderColor: `${Colors.primary}40`,
  },
  cardFrame: { backgroundColor: Colors.surfaceContainer, borderRadius: 12, padding: 16, position: 'relative', gap: 12 },
  rune: { position: 'absolute', fontSize: 10, color: Colors.outlineVariant },
  runeTopLeft: { top: 6, left: 6 },
  runeTopRight: { top: 6, right: 6 },
  runeBottomLeft: { bottom: 6, left: 6 },
  runeBottomRight: { bottom: 6, right: 6 },
  factionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  factionBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: `${Colors.secondaryContainer}33`, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12,
  },
  factionShieldIcon: { fontSize: 12 },
  factionBadgeText: { fontSize: 10, fontWeight: '700', color: Colors.secondary, letterSpacing: 1 },
  arcanaBadge: { backgroundColor: Colors.surfaceContainerHigh, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  arcanaText: { fontSize: 10, color: Colors.tertiary },
  cardArtBox: {
    height: 200, backgroundColor: '#0c0e11', borderRadius: 10,
    justifyContent: 'center', alignItems: 'center', position: 'relative',
    borderWidth: 1, borderColor: `${Colors.secondary}40`, overflow: 'hidden',
  },
  cardArtImage: { width: '100%', height: '100%' },
  eyeBadge: {
    position: 'absolute', bottom: 8, right: 8, width: 34, height: 34, borderRadius: 17,
    backgroundColor: Colors.surfaceContainerHigh, justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: Colors.secondary, zIndex: 10,
  },
  eyeBadgeIcon: { fontSize: 16 },
  roleTitleGroup: { alignItems: 'center', marginTop: 4 },
  roleNameText: { fontSize: 24, fontWeight: '700', color: Colors.onSurface, letterSpacing: 2 },
  titleUnderline: { width: 80, height: 2, backgroundColor: Colors.primary, marginVertical: 4 },
  englishRoleName: { fontSize: 11, color: Colors.onSurfaceVariant, letterSpacing: 1, textTransform: 'uppercase' },
  skillBox: { backgroundColor: Colors.surfaceContainerLowest, borderRadius: 10, padding: 12, gap: 8 },
  skillHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  skillHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  skillIcon: { fontSize: 14 },
  skillTitle: { fontSize: 13, fontWeight: '700', color: Colors.onSurface },
  cooldownBadge: {
    fontSize: 9, fontWeight: '700', color: Colors.tertiary,
    backgroundColor: Colors.tertiaryContainer, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4,
  },
  skillDesc: { fontSize: 11, color: Colors.onSurface, lineHeight: 16 },
  highlightGood: { color: Colors.secondary, fontWeight: '700' },
  highlightEvil: { color: Colors.primary, fontWeight: '700' },
  skillPrivilegeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  privilegeIcon: { fontSize: 12 },
  privilegeText: { fontSize: 10, color: Colors.outline, fontStyle: 'italic', flex: 1 },
  warningStrip: {
    width: '100%', maxWidth: 360, backgroundColor: Colors.surfaceContainerLow, padding: 12, borderRadius: 10,
    flexDirection: 'row', alignItems: 'flex-start', gap: 10, borderWidth: 1, borderColor: Colors.primaryContainer,
  },
  lockIcon: { fontSize: 18 },
  warningTextGroup: { flex: 1 },
  warningTitle: { fontSize: 10, fontWeight: '700', color: Colors.primary, letterSpacing: 1 },
  warningDesc: { fontSize: 11, color: Colors.onSurfaceVariant, marginTop: 2, lineHeight: 15 },
  confirmBtn: {
    width: '100%', maxWidth: 360, height: 50, backgroundColor: Colors.primaryContainer, borderRadius: 12,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  confirmBtnCheck: { fontSize: 18, color: Colors.onPrimaryContainer, fontWeight: '700' },
  confirmBtnText: { fontSize: 14, fontWeight: '700', color: Colors.onPrimaryContainer, letterSpacing: 1 },
  confirmBtnTimer: { fontSize: 12, color: Colors.primary, fontWeight: '700' },
  guideToggleBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.surfaceContainer,
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, width: '100%', maxWidth: 360, justifyContent: 'center',
  },
  guideToggleIcon: { fontSize: 14 },
  guideToggleText: { fontSize: 12, color: Colors.tertiary, fontWeight: '600' },
  guideToggleChevron: { fontSize: 10, color: Colors.outline },
  guideContentBox: {
    width: '100%', maxWidth: 360, backgroundColor: Colors.surfaceContainerLow, borderRadius: 12, padding: 14, gap: 10,
  },
  guideSectionTitle: { fontSize: 13, fontWeight: '700', color: Colors.tertiary },
  tipCard: { flexDirection: 'row', gap: 10, backgroundColor: Colors.surface, padding: 10, borderRadius: 8 },
  tipNum: { fontSize: 14, fontWeight: '700', color: Colors.secondary },
  tipTextGroup: { flex: 1 },
  tipHeading: { fontSize: 12, fontWeight: '600', color: Colors.onSurface },
  tipBody: { fontSize: 11, color: Colors.outline, marginTop: 2, lineHeight: 15 },
});
