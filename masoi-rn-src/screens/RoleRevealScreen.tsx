import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Animated,
} from 'react-native';

export const RoleRevealScreen: React.FC<{ onNavigate?: (screen: string) => void }> = ({ onNavigate }) => {
  const [timeLeft, setTimeLeft] = useState(8);
  const [showGuide, setShowGuide] = useState(false);
  const [isFlipped, setIsFlipped] = useState(true);

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
      <StatusBar barStyle="light-content" backgroundColor="#111317" />

      {/* HEADER */}
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
        {/* COUNTDOWN BADGE */}
        <View style={styles.statusBadge}>
          <View style={styles.pingDot} />
          <Text style={styles.statusBadgeText}>LỄ THỨC THỨC TỈNH</Text>
          <Text style={styles.statusDot}>•</Text>
          <Text style={styles.statusTimerText}>⏳ 00:0{timeLeft}</Text>
        </View>

        <Text style={styles.flavorQuote}>
          "Tiếng gầm rú xa xăm trong màn sương đêm..."
        </Text>

        {/* ROLE CARD CARD WRAPPER */}
        <View style={styles.cardContainer}>
          <View style={styles.cardFrame}>
            {/* CORNER RUNES */}
            <Text style={[styles.rune, styles.runeTopLeft]}>᚛ ᚱ ᚜</Text>
            <Text style={[styles.rune, styles.runeTopRight]}>᚛ ᛏ ᚜</Text>
            <Text style={[styles.rune, styles.runeBottomLeft]}>᚛ ᛟ ᚜</Text>
            <Text style={[styles.rune, styles.runeBottomRight]}>᚛ ᛹ ᚜</Text>

            {/* FACTION HEADER */}
            <View style={styles.factionRow}>
              <View style={styles.factionBadge}>
                <Text style={styles.factionShieldIcon}>🛡️</Text>
                <Text style={styles.factionBadgeText}>PHE DÂN LÀNG</Text>
              </View>

              <View style={styles.arcanaBadge}>
                <Text style={styles.arcanaText}>✨ Lá Bài Số II</Text>
              </View>
            </View>

            {/* ARTWORK DISPLAY BOX */}
            <View style={styles.cardArtBox}>
              <View style={styles.eyeBadge}>
                <Text style={styles.eyeBadgeIcon}>👁️</Text>
              </View>
              <Text style={styles.tarotEmblem}>🔮</Text>
              <Text style={styles.artCaptionText}>Gothic Divine Clairvoyant</Text>
            </View>

            {/* ROLE NAME TITLE */}
            <View style={styles.roleTitleGroup}>
              <Text style={styles.roleNameText}>TIÊN TRI</Text>
              <View style={styles.titleUnderline} />
              <Text style={styles.englishRoleName}>The Clairvoyant Seer</Text>
            </View>

            {/* CORE SKILL SPEC */}
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

        {/* PRIVACY WARNING */}
        <View style={styles.warningStrip}>
          <Text style={styles.lockIcon}>🔒</Text>
          <View style={styles.warningTextGroup}>
            <Text style={styles.warningTitle}>THÔNG TIN TUYỆT MẬT</Text>
            <Text style={styles.warningDesc}>
              Chỉ duy nhất bạn nhìn thấy lá bài này. Hãy giữ bí mật để bảo toàn mạng sống trước móng vuốt bầy Sói.
            </Text>
          </View>
        </View>

        {/* CONFIRM BUTTON */}
        <TouchableOpacity
          style={styles.confirmBtn}
          onPress={handleConfirm}
          activeOpacity={0.8}
        >
          <Text style={styles.confirmBtnCheck}>✓</Text>
          <Text style={styles.confirmBtnText}>TÔI ĐÃ HIỂU VAI TRÒ</Text>
          <Text style={styles.confirmBtnTimer}>({timeLeft}s)</Text>
        </TouchableOpacity>

        {/* GUIDE EXPANDER */}
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

            <View style={styles.tipCard}>
              <Text style={styles.tipNum}>03</Text>
              <View style={styles.tipTextGroup}>
                <Text style={styles.tipHeading}>Để lại Di chúc rõ ràng</Text>
                <Text style={styles.tipBody}>
                  Ghi chép danh sách kết quả soi từng đêm vào sổ tay. Khi bị đưa lên giàn treo, hãy công bố toàn bộ chuỗi soi chính xác.
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111317',
  },
  header: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(30, 32, 35, 0.85)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(167, 138, 137, 0.2)',
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: '#e2e2e6',
    fontWeight: '300',
  },
  headerTitleGroup: {
    alignItems: 'center',
  },
  headerCategory: {
    fontSize: 9,
    color: '#a78a87',
    letterSpacing: 1.5,
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#282a2d',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircleText: {
    fontSize: 14,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    alignItems: 'center',
    gap: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#282a2d',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffb3ae',
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#e0bfbc',
    letterSpacing: 1,
  },
  statusDot: {
    fontSize: 10,
    color: '#a78a87',
  },
  statusTimerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffb3ae',
  },
  flavorQuote: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#f1be66',
    textAlign: 'center',
  },
  cardContainer: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#0c0e11',
    borderRadius: 16,
    padding: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 179, 174, 0.25)',
  },
  cardFrame: {
    backgroundColor: '#1e2023',
    borderRadius: 12,
    padding: 16,
    position: 'relative',
    gap: 12,
  },
  rune: {
    position: 'absolute',
    fontSize: 10,
    color: '#59413f',
  },
  runeTopLeft: { top: 6, left: 6 },
  runeTopRight: { top: 6, right: 6 },
  runeBottomLeft: { bottom: 6, left: 6 },
  runeBottomRight: { bottom: 6, right: 6 },
  factionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  factionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(50, 157, 182, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  factionShieldIcon: {
    fontSize: 12,
  },
  factionBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#72d4ee',
    letterSpacing: 1,
  },
  arcanaBadge: {
    backgroundColor: '#282a2d',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  arcanaText: {
    fontSize: 10,
    color: '#f1be66',
  },
  cardArtBox: {
    height: 180,
    backgroundColor: '#111317',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(114, 212, 238, 0.3)',
  },
  eyeBadge: {
    position: 'absolute',
    bottom: -14,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#282a2d',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#72d4ee',
    zIndex: 10,
  },
  eyeBadgeIcon: {
    fontSize: 18,
  },
  tarotEmblem: {
    fontSize: 54,
  },
  artCaptionText: {
    fontSize: 10,
    color: '#a78a87',
    marginTop: 8,
    fontStyle: 'italic',
  },
  roleTitleGroup: {
    alignItems: 'center',
    marginTop: 8,
  },
  roleNameText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 2,
  },
  titleUnderline: {
    width: 80,
    height: 2,
    backgroundColor: '#ffb3ae',
    marginVertical: 4,
  },
  englishRoleName: {
    fontSize: 11,
    color: '#e0bfbc',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  skillBox: {
    backgroundColor: '#0c0e11',
    borderRadius: 10,
    padding: 12,
    gap: 8,
  },
  skillHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skillHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  skillIcon: {
    fontSize: 14,
  },
  skillTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
  cooldownBadge: {
    fontSize: 9,
    fontWeight: '700',
    color: '#f1be66',
    backgroundColor: '#5c3f00',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  skillDesc: {
    fontSize: 11,
    color: '#e2e2e6',
    lineHeight: 16,
  },
  highlightGood: {
    color: '#72d4ee',
    fontWeight: '700',
  },
  highlightEvil: {
    color: '#ffb3ae',
    fontWeight: '700',
  },
  skillPrivilegeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  privilegeIcon: {
    fontSize: 12,
  },
  privilegeText: {
    fontSize: 10,
    color: '#a78a87',
    fontStyle: 'italic',
    flex: 1,
  },
  warningStrip: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#1a1c1f',
    padding: 12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderWidth: 1,
    borderColor: '#8a121a',
  },
  lockIcon: {
    fontSize: 18,
  },
  warningTextGroup: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffb3ae',
    letterSpacing: 1,
  },
  warningDesc: {
    fontSize: 11,
    color: '#e0bfbc',
    marginTop: 2,
    lineHeight: 15,
  },
  confirmBtn: {
    width: '100%',
    maxWidth: 360,
    height: 50,
    backgroundColor: '#8a121a',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#8a121a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmBtnCheck: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '700',
  },
  confirmBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 1,
  },
  confirmBtnTimer: {
    fontSize: 12,
    color: '#ffb3ae',
    fontWeight: '700',
  },
  guideToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#1e2023',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    width: '100%',
    maxWidth: 360,
    justifyContent: 'center',
  },
  guideToggleIcon: {
    fontSize: 14,
  },
  guideToggleText: {
    fontSize: 12,
    color: '#f1be66',
    fontWeight: '600',
  },
  guideToggleChevron: {
    fontSize: 10,
    color: '#a78a87',
  },
  guideContentBox: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#1a1c1f',
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  guideSectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#f1be66',
  },
  tipCard: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#111317',
    padding: 10,
    borderRadius: 8,
  },
  tipNum: {
    fontSize: 14,
    fontWeight: '700',
    color: '#72d4ee',
  },
  tipTextGroup: {
    flex: 1,
  },
  tipHeading: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  tipBody: {
    fontSize: 11,
    color: '#a78a87',
    marginTop: 2,
    lineHeight: 15,
  },
});

export default RoleRevealScreen;
