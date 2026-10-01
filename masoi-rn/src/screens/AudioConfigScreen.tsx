import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Animated,
  Switch,
} from 'react-native';
import { Colors, Spacing, FontSizes, BorderRadius } from '../theme/colors';

type SliderLevel = 0 | 1 | 2 | 3 | 4 | 5;

export default function AudioConfigScreen({ onNavigate }: { onNavigate?: (screen: string) => void }) {
  const [micEnabled, setMicEnabled] = useState(true);
  const [speakerEnabled, setSpeakerEnabled] = useState(true);
  const [noiseCancel, setNoiseCancel] = useState(true);
  const [pushToTalk, setPushToTalk] = useState(false);
  const [spatialAudio, setSpatialAudio] = useState(true);
  const [dualChannel, setDualChannel] = useState(true);
  const [micVolume, setMicVolume] = useState(4 as SliderLevel);
  const [speakerVolume, setSpeakerVolume] = useState(3 as SliderLevel);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'idle' | 'good' | 'bad'>('idle');
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const levelAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isTesting) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.3, duration: 400, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        ])
      ).start();
      Animated.loop(
        Animated.sequence([
          Animated.timing(levelAnim, { toValue: 1, duration: 300, useNativeDriver: false }),
          Animated.timing(levelAnim, { toValue: 0.3, duration: 300, useNativeDriver: false }),
          Animated.timing(levelAnim, { toValue: 0.8, duration: 200, useNativeDriver: false }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
      levelAnim.setValue(0);
    }
  }, [isTesting]);

  const handleTestMic = () => {
    setIsTesting(true);
    setTestResult('idle');
    setTimeout(() => {
      setIsTesting(false);
      setTestResult('good');
    }, 3000);
  };

  const renderVolumeSlider = (
    label: string,
    icon: string,
    level: SliderLevel,
    onChange: (v: SliderLevel) => void,
    accentColor: string
  ) => (
    <View style={styles.sliderBlock}>
      <View style={styles.sliderHeader}>
        <Text style={styles.sliderIcon}>{icon}</Text>
        <Text style={styles.sliderLabel}>{label}</Text>
        <Text style={[styles.sliderValue, { color: accentColor }]}>{level}/5</Text>
      </View>
      <View style={styles.sliderDots}>
        {([0, 1, 2, 3, 4, 5] as SliderLevel[]).map((v) => (
          <TouchableOpacity
            key={v}
            style={[
              styles.sliderDot,
              {
                backgroundColor: v <= level ? accentColor : Colors.surfaceContainerHighest,
                width: v === 0 ? 10 : 10 + v * 3,
                height: v === 0 ? 10 : 10 + v * 3,
              },
            ]}
            onPress={() => onChange(v)}
          />
        ))}
      </View>
    </View>
  );

  const ToggleRow = ({
    icon, label, desc, value, onChange, accent,
  }: {
    icon: string; label: string; desc?: string; value: boolean;
    onChange: (v: boolean) => void; accent: string;
  }) => (
    <View style={styles.toggleRow}>
      <View style={[styles.toggleIcon, { backgroundColor: accent + '22' }]}>
        <Text style={styles.toggleIconText}>{icon}</Text>
      </View>
      <View style={styles.toggleInfo}>
        <Text style={styles.toggleLabel}>{label}</Text>
        {desc ? <Text style={styles.toggleDesc}>{desc}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: Colors.surfaceContainerHighest, true: accent + '66' }}
        thumbColor={value ? accent : Colors.outline}
        ios_backgroundColor={Colors.surfaceContainerHighest}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => onNavigate?.('GameHall')}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>The Ritual Circle</Text>
          <Text style={[styles.headerSub, { color: Colors.secondary }]}>🎤 VOICE LIVE</Text>
        </View>
        <View style={styles.timerBadge}>
          <Text style={styles.timerText}>00:45</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Night Status Bar */}
        <View style={styles.nightStatus}>
          <View style={styles.nightLeft}>
            <View style={[styles.nightIcon, { backgroundColor: Colors.primaryContainer + '66' }]}>
              <Text style={styles.nightIconText}>🌙</Text>
            </View>
            <View>
              <Text style={styles.nightTitle}>ĐÊM 1 • LÀNG SAY NGỦ</Text>
              <View style={styles.nightSubRow}>
                <View style={[styles.nightPulse, { backgroundColor: Colors.tertiary }]} />
                <Text style={styles.nightSub}>Quản trò đang triệu hồi chức năng ngầm...</Text>
              </View>
            </View>
          </View>
          <View style={styles.nightTimer}>
            <Text style={styles.nightTimerLabel}>Thời gian</Text>
            <Text style={styles.nightTimerValue}>00:35</Text>
          </View>
        </View>

        {/* Dual Channel Banner */}
        <View style={styles.dualChannelCard}>
          <View style={styles.channelRow}>
            <View style={[styles.channelIcon, { backgroundColor: Colors.secondary + '22' }]}>
              <Text style={styles.channelIconText}>📡</Text>
            </View>
            <View style={styles.channelInfo}>
              <View style={styles.channelTitleRow}>
                <Text style={[styles.channelTitle, { color: Colors.secondary }]}>Kênh Thoại Cõi Mộng</Text>
                <View style={[styles.channelBadge, { backgroundColor: Colors.secondary + '30' }]}>
                  <Text style={[styles.channelBadgeText, { color: Colors.secondary }]}>ĐANG MỞ</Text>
                </View>
              </View>
              <Text style={styles.channelDesc}>
                Chỉ có thể trò chuyện và nghe tiếng thì thầm mờ ảo của những linh hồn đang say ngủ.
              </Text>
            </View>
          </View>
          <View style={styles.isolationAlert}>
            <Text style={styles.isolationIcon}>🔒</Text>
            <Text style={styles.isolationText}>
              CÁCH LY TUYỆT ĐỐI: Hoàn toàn không nghe thấy người được Quản trò gọi dậy.
            </Text>
          </View>
        </View>

        {/* Mic Test Panel */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionIcon}>🎙</Text>
            <Text style={styles.sectionTitle}>Kiểm Tra Micro</Text>
            {testResult === 'good' && (
              <View style={[styles.testResultBadge, { backgroundColor: Colors.secondary + '30' }]}>
                <Text style={[styles.testResultText, { color: Colors.secondary }]}>✓ HOẠT ĐỘNG TỐT</Text>
              </View>
            )}
          </View>

          {/* Visualizer */}
          <View style={styles.visualizerBox}>
            <Animated.View style={[styles.pulseRing, { transform: [{ scale: pulseAnim }] }]} />
            <View style={styles.visualizerCenter}>
              <Text style={styles.visualizerMicIcon}>{isTesting ? '🔴' : '⚫'}</Text>
              {isTesting && (
                <View style={styles.levelBars}>
                  {[1, 2, 3, 4, 5, 6].map((_, i) => (
                    <Animated.View
                      key={i}
                      style={[
                        styles.levelBar,
                        {
                          height: Animated.multiply(levelAnim, (i % 3 + 1) * 12) as any,
                          backgroundColor: Colors.secondary,
                          opacity: levelAnim,
                        },
                      ]}
                    />
                  ))}
                </View>
              )}
            </View>
            <Text style={styles.visualizerStatus}>
              {isTesting ? 'Đang ghi âm... hãy nói gì đó' : 'Nhấn để kiểm tra micro'}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.testMicBtn, isTesting && styles.testMicBtnActive]}
            onPress={handleTestMic}
            disabled={isTesting}
          >
            <Text style={styles.testMicBtnText}>
              {isTesting ? '⏺ ĐANG THỬ...' : '▶ THỬ MICRO NGAY'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Volume Controls */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionIcon}>🔊</Text>
            <Text style={styles.sectionTitle}>Điều Chỉnh Âm Lượng</Text>
          </View>
          {renderVolumeSlider('Micro Đầu Vào', '🎙', micVolume, setMicVolume, Colors.primary)}
          <View style={styles.divider} />
          {renderVolumeSlider('Loa Đầu Ra', '🔊', speakerVolume, setSpeakerVolume, Colors.secondary)}
        </View>

        {/* Audio Settings */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionIcon}>⚙️</Text>
            <Text style={styles.sectionTitle}>Thiết Lập Âm Thanh</Text>
          </View>
          <ToggleRow
            icon="🎤"
            label="Bật Micro"
            desc="Cho phép người khác nghe giọng nói của bạn"
            value={micEnabled}
            onChange={setMicEnabled}
            accent={Colors.primary}
          />
          <View style={styles.toggleDivider} />
          <ToggleRow
            icon="🔈"
            label="Loa / Tai Nghe"
            desc="Nghe giọng nói và âm thanh trò chơi"
            value={speakerEnabled}
            onChange={setSpeakerEnabled}
            accent={Colors.secondary}
          />
          <View style={styles.toggleDivider} />
          <ToggleRow
            icon="🚫"
            label="Lọc Tiếng Ồn (AI)"
            desc="Loại bỏ tiếng nền, giúp giọng nói rõ ràng hơn"
            value={noiseCancel}
            onChange={setNoiseCancel}
            accent={Colors.tertiary}
          />
          <View style={styles.toggleDivider} />
          <ToggleRow
            icon="🖐"
            label="Push-to-Talk"
            desc="Giữ nút để nói. Tắt nếu muốn open mic"
            value={pushToTalk}
            onChange={setPushToTalk}
            accent={Colors.primary}
          />
        </View>

        {/* Dual Audio Channel */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionIcon}>🌐</Text>
            <Text style={styles.sectionTitle}>Kênh Thoại Hai Cõi</Text>
            <View style={[styles.exclusiveBadge]}>
              <Text style={styles.exclusiveBadgeText}>ĐỘC QUYỀN</Text>
            </View>
          </View>
          <Text style={styles.dualDesc}>
            Hệ thống âm thanh tách biệt: Kênh Cõi Mộng (sleeping village) và Kênh Cõi Tỉnh (active roles) — ngăn chặn hoàn toàn rò rỉ thông tin.
          </Text>
          <ToggleRow
            icon="🌙"
            label="Kênh Cõi Mộng"
            desc="Kênh thì thầm cho người ngủ (giọng mờ ảo)"
            value={dualChannel}
            onChange={setDualChannel}
            accent={Colors.secondary}
          />
          <View style={styles.toggleDivider} />
          <ToggleRow
            icon="🔮"
            label="Âm Thanh Không Gian 3D"
            desc="Định vị giọng nói theo vị trí ghế ngồi"
            value={spatialAudio}
            onChange={setSpatialAudio}
            accent={Colors.tertiary}
          />
        </View>

        {/* Channel Status */}
        <View style={styles.channelStatusCard}>
          <Text style={styles.channelStatusTitle}>Trạng Thái Kênh Âm Thanh</Text>
          {[
            { name: 'Kênh Cõi Mộng', status: 'ACTIVE', color: Colors.secondary, ping: '12ms', icon: '🌙' },
            { name: 'Kênh Cõi Tỉnh', status: 'STANDBY', color: Colors.outline, ping: '---', icon: '👁' },
            { name: 'Kênh Riêng Tư (P2P)', status: 'READY', color: Colors.tertiary, ping: '8ms', icon: '🔐' },
          ].map((ch, i) => (
            <View key={i} style={styles.channelStatusRow}>
              <View style={styles.channelStatusLeft}>
                <Text style={styles.channelStatusIcon}>{ch.icon}</Text>
                <Text style={styles.channelStatusName}>{ch.name}</Text>
              </View>
              <View style={styles.channelStatusRight}>
                <Text style={[styles.channelStatusBadge, { color: ch.color }]}>{ch.status}</Text>
                <Text style={styles.channelPing}>{ch.ping}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={() => onNavigate?.('GameHall')}
          >
            <Text style={styles.saveBtnText}>💾 LƯU CẤU HÌNH</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.resetBtn}
            onPress={() => {
              setMicVolume(4); setSpeakerVolume(3);
              setNoiseCancel(true); setPushToTalk(false);
              setSpatialAudio(true); setDualChannel(true);
            }}
          >
            <Text style={styles.resetBtnText}>🔄 Mặc Định</Text>
          </TouchableOpacity>
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
  header: {
    height: 56,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surface + 'D9',
    borderBottomWidth: 0.5,
    borderBottomColor: '#59413f40',
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 22,
    color: Colors.onSurface,
  },
  headerTitle: {
    fontFamily: 'Cinzel-SemiBold',
    fontSize: 16,
    color: Colors.onSurface,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  headerSub: {
    fontSize: 11,
    fontFamily: 'Cinzel-SemiBold',
    letterSpacing: 1,
  },
  timerBadge: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surfaceContainerHigh,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  timerText: {
    fontFamily: 'JetBrainsMono-Bold',
    fontSize: 16,
    color: Colors.tertiary,
    letterSpacing: 1,
  },
  scroll: { flex: 1 },
  scrollContent: {
    padding: 12,
    gap: 12,
    paddingBottom: 32,
  },

  // Night Status
  nightStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceContainerLow,
    padding: 12,
    borderRadius: 12,
  },
  nightLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  nightIcon: {
    width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  nightIconText: { fontSize: 16 },
  nightTitle: {
    fontFamily: 'Cinzel-SemiBold',
    fontSize: 13,
    color: Colors.onSurface,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  nightSubRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  nightPulse: { width: 6, height: 6, borderRadius: 3 },
  nightSub: { fontSize: 10, color: Colors.onSurfaceVariant, fontFamily: 'Inter-Regular', flex: 1 },
  nightTimer: { alignItems: 'flex-end' },
  nightTimerLabel: { fontSize: 10, fontFamily: 'Cinzel-SemiBold', color: Colors.primary, textTransform: 'uppercase', letterSpacing: 0.5 },
  nightTimerValue: { fontFamily: 'JetBrainsMono-Bold', fontSize: 18, color: Colors.primary, fontWeight: '700' },

  // Dual Channel Card
  dualChannelCard: {
    backgroundColor: Colors.surfaceContainerHigh + 'E6',
    borderRadius: 12,
    padding: 12,
    gap: 10,
    borderWidth: 0.5,
    borderColor: '#59413f40',
  },
  channelRow: { flexDirection: 'row', gap: 10 },
  channelIcon: {
    width: 36, height: 36, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center', marginTop: 2,
  },
  channelIconText: { fontSize: 18 },
  channelInfo: { flex: 1 },
  channelTitleRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 4,
  },
  channelTitle: {
    fontFamily: 'Cinzel-SemiBold', fontSize: 13,
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  channelBadge: {
    paddingHorizontal: 6, paddingVertical: 2, borderRadius: 20,
  },
  channelBadgeText: {
    fontFamily: 'Cinzel-Bold', fontSize: 9,
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  channelDesc: {
    fontSize: 11, color: Colors.onSurfaceVariant, fontFamily: 'Inter-Regular', lineHeight: 16,
  },
  isolationAlert: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: Colors.errorContainer + '30',
    padding: 8, borderRadius: 8,
  },
  isolationIcon: { fontSize: 14, marginTop: 1 },
  isolationText: {
    flex: 1, fontSize: 11, color: Colors.error,
    fontFamily: 'Cinzel-SemiBold', lineHeight: 16, letterSpacing: 0.3,
  },

  // Section Card
  sectionCard: {
    backgroundColor: Colors.surfaceContainer,
    borderRadius: 12,
    padding: 12,
    gap: 10,
    borderWidth: 0.5,
    borderColor: '#59413f30',
  },
  sectionTitleRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4,
  },
  sectionIcon: { fontSize: 18 },
  sectionTitle: {
    fontFamily: 'Cinzel-SemiBold', fontSize: 13,
    color: Colors.primary, textTransform: 'uppercase', letterSpacing: 0.5, flex: 1,
  },

  // Visualizer
  visualizerBox: {
    alignItems: 'center', padding: 20, position: 'relative',
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 12, gap: 12, overflow: 'hidden',
  },
  pulseRing: {
    position: 'absolute',
    width: 80, height: 80, borderRadius: 40,
    borderWidth: 2, borderColor: Colors.secondary + '40',
  },
  visualizerCenter: { alignItems: 'center', gap: 8 },
  visualizerMicIcon: { fontSize: 40 },
  levelBars: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 3, height: 40,
  },
  levelBar: {
    width: 4, borderRadius: 2,
  },
  visualizerStatus: {
    fontSize: 12, color: Colors.onSurfaceVariant,
    fontFamily: 'Inter-Regular', textAlign: 'center',
  },
  testMicBtn: {
    paddingVertical: 12, borderRadius: 10,
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
  },
  testMicBtnActive: {
    backgroundColor: Colors.error + '30',
    borderWidth: 1, borderColor: Colors.error,
  },
  testMicBtnText: {
    fontFamily: 'Cinzel-Bold', fontSize: 13,
    color: Colors.onPrimaryContainer, textTransform: 'uppercase', letterSpacing: 1,
  },
  testResultBadge: {
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20,
  },
  testResultText: {
    fontSize: 10, fontFamily: 'Cinzel-Bold',
    textTransform: 'uppercase', letterSpacing: 0.5,
  },

  // Slider
  sliderBlock: { gap: 8 },
  sliderHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
  },
  sliderIcon: { fontSize: 16 },
  sliderLabel: {
    flex: 1, fontFamily: 'Cinzel-SemiBold', fontSize: 12, color: Colors.onSurface,
  },
  sliderValue: {
    fontFamily: 'JetBrainsMono-Bold', fontSize: 13, fontWeight: '700',
  },
  sliderDots: {
    flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 4,
  },
  sliderDot: {
    borderRadius: 20, minWidth: 10, minHeight: 10,
  },
  divider: {
    height: 0.5, backgroundColor: '#59413f40', marginVertical: 4,
  },

  // Toggle
  toggleRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
  },
  toggleIcon: {
    width: 36, height: 36, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  toggleIconText: { fontSize: 18 },
  toggleInfo: { flex: 1 },
  toggleLabel: {
    fontFamily: 'Cinzel-SemiBold', fontSize: 13, color: Colors.onSurface,
  },
  toggleDesc: {
    fontSize: 10, color: Colors.onSurfaceVariant, fontFamily: 'Inter-Regular', marginTop: 1,
  },
  toggleDivider: {
    height: 0.5, backgroundColor: '#59413f30', marginVertical: 2,
  },

  // Dual Audio
  dualDesc: {
    fontSize: 11, color: Colors.onSurfaceVariant,
    fontFamily: 'Inter-Regular', lineHeight: 16,
  },
  exclusiveBadge: {
    backgroundColor: Colors.primaryContainer,
    paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4,
  },
  exclusiveBadgeText: {
    fontFamily: 'Cinzel-Bold', fontSize: 9,
    color: Colors.onPrimaryContainer, textTransform: 'uppercase', letterSpacing: 0.5,
  },

  // Channel Status
  channelStatusCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 12, padding: 12, gap: 10,
    borderWidth: 0.5, borderColor: '#59413f30',
  },
  channelStatusTitle: {
    fontFamily: 'Cinzel-SemiBold', fontSize: 12,
    color: Colors.onSurfaceVariant, textTransform: 'uppercase',
    letterSpacing: 0.5, marginBottom: 2,
  },
  channelStatusRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 6, borderBottomWidth: 0.5, borderBottomColor: '#59413f20',
  },
  channelStatusLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  channelStatusIcon: { fontSize: 16 },
  channelStatusName: {
    fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurface,
  },
  channelStatusRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  channelStatusBadge: {
    fontFamily: 'JetBrainsMono-Bold', fontSize: 11, fontWeight: '700',
  },
  channelPing: {
    fontFamily: 'JetBrainsMono-Bold', fontSize: 10,
    color: Colors.onSurfaceVariant, fontWeight: '700',
  },

  // Bottom
  bottomActions: { flexDirection: 'row', gap: 8 },
  saveBtn: {
    flex: 1, paddingVertical: 14, borderRadius: 12,
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    shadowColor: Colors.primaryContainer,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 4,
  },
  saveBtnText: {
    fontFamily: 'Cinzel-Bold', fontSize: 13,
    color: Colors.onPrimaryContainer, textTransform: 'uppercase', letterSpacing: 1,
  },
  resetBtn: {
    paddingHorizontal: 16, paddingVertical: 14, borderRadius: 12,
    backgroundColor: Colors.surfaceContainer,
    alignItems: 'center',
    borderWidth: 0.5, borderColor: '#59413f40',
  },
  resetBtnText: {
    fontFamily: 'Cinzel-SemiBold', fontSize: 12,
    color: Colors.onSurface, letterSpacing: 0.5,
  },
});
