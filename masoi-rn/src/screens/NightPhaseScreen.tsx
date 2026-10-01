import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
  Easing,
  Modal,
  Image,
  ScrollView,
  TextInput,
  DimensionValue,
  Alert,
} from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Filter,
  FeGaussianBlur,
  FeColorMatrix,
  FeMerge,
  FeMergeNode,
  Path,
  Circle,
  G,
  Polygon,
  Line,
  Rect,
  Text as SvgText,
  TextPath,
} from 'react-native-svg';
import { Colors, Spacing, FontSizes, BorderRadius } from '../theme/colors';
import { SEAT_AVATAR_IMAGES, ROLE_CARD_IMAGES } from '../theme/images';
import { mockServer } from '../engine/mockStepCallServer';
import { StepCallQueueItem } from '../engine/stepCallEngine';
import RoleActionModals from '../components/RoleActionModals';
import { playRungChuongSound } from '../utils/soundPlayer';
import { bgmPlayer } from '../utils/bgmPlayer';

export interface ActionEffectItem {
  key: string;
  label: string;
  color: string;
  icon: string;
}

interface SeatItem {
  id: string;
  name: string;
  roleName?: string;
  faction?: 'VILLAGER' | 'WEREWOLF' | 'NEUTRAL';
  loverPair?: string;
  inspectResult?: string;
  isDead?: boolean;
  effects?: ActionEffectItem[];
  pos: {
    top?: DimensionValue;
    bottom?: DimensionValue;
    left?: DimensionValue;
    right?: DimensionValue;
  };
  translateX?: number;
  isYou?: boolean;
}

/**
 * Concentric Rainbow Action Rings Overlay around Avatar Circles (Cầu vồng viền đồng tâm xếp lớp)
 * Renders nested concentric colored circle rings for each active target effect
 */
function RainbowActionRings({
  effects,
  avatarSize = 44,
  strokeWidth = 3,
}: {
  effects?: ActionEffectItem[];
  avatarSize?: number;
  strokeWidth?: number;
}) {
  if (!effects || effects.length === 0) return null;

  const maxRings = effects.length;
  const ringGap = 3.5;
  const maxExpand = (maxRings - 1) * ringGap + strokeWidth;
  const svgSize = avatarSize + maxExpand * 2 + 8;
  const center = svgSize / 2;
  const baseRadius = avatarSize / 2 + strokeWidth / 2;

  return (
    <View
      style={{
        position: 'absolute',
        top: -(svgSize - avatarSize) / 2,
        left: -(svgSize - avatarSize) / 2,
        width: svgSize,
        height: svgSize,
        zIndex: 5,
      }}
      pointerEvents="none"
    >
      <Svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`}>
        {effects.map((eff, index) => {
          const currentRadius = baseRadius + index * ringGap;
          return (
            <Circle
              key={eff.key + index}
              cx={center}
              cy={center}
              r={currentRadius}
              stroke={eff.color}
              strokeWidth={strokeWidth}
              fill="none"
              opacity={0.95}
            />
          );
        })}
      </Svg>
    </View>
  );
}

// 12 Mystic Seats - Clean Oval Layout with Dynamic Action Effects & God-View Click-to-Inspect
const SEATS: SeatItem[] = [
  {
    id: 'I', name: 'TrưởngLàng', roleName: 'Dân Làng', faction: 'VILLAGER', loverPair: '#01 ♥ #06',
    effects: [{ key: 'lover', label: 'Tình Nhân (#01 ♥ #06)', color: '#e056fd', icon: '♥' }],
    pos: { top: 4, left: '50%' }, translateX: -28
  },
  { id: 'II', name: 'BảoKê', roleName: 'Tiên Tri', faction: 'VILLAGER', pos: { top: 24, right: 20 } },
  {
    id: 'III', name: 'ThuốcNam', roleName: 'Bảo Vệ', faction: 'VILLAGER',
    effects: [{ key: 'protected', label: 'Được Bảo Vệ', color: '#ffb300', icon: '🛡️' }],
    pos: { top: 108, right: 0 }
  },
  {
    id: 'IV', name: 'ThợSăn', roleName: 'Sói Thường', faction: 'WEREWOLF', inspectResult: 'SOI: SÓI!',
    effects: [{ key: 'attacked', label: 'Sói Cắn', color: '#ff4d4d', icon: '🐺' }],
    pos: { top: 204, right: -8 }
  },
  {
    id: 'V', name: 'BánhMì', roleName: 'Sói Lửa', faction: 'WEREWOLF', isDead: true,
    pos: { bottom: 108, right: 0 }
  },
  {
    id: 'VI', name: 'ThầnĐạo', roleName: 'Dân Làng', faction: 'VILLAGER', loverPair: '#06 ♥ #01',
    effects: [
      { key: 'protected', label: 'Bảo Vệ', color: '#ffb300', icon: '🛡️' },
      { key: 'lover', label: 'Tình Nhân', color: '#e056fd', icon: '♥' }
    ],
    pos: { bottom: 24, right: 20 }
  },
  { id: 'VII', name: 'Tiên Tri', roleName: 'Tiên Tri', faction: 'VILLAGER', pos: { bottom: 4, left: '50%' }, translateX: -28, isYou: true },
  { id: 'VIII', name: 'HiệpSĩ', roleName: 'Già Làng', faction: 'VILLAGER', pos: { bottom: 24, left: 20 } },
  {
    id: 'IX', name: 'HọcGiả', roleName: 'Cupid', faction: 'NEUTRAL',
    effects: [{ key: 'inspected', label: 'Tiên Tri Soi', color: '#72d4ee', icon: '👁️' }],
    pos: { bottom: 108, left: 0 }
  },
  {
    id: 'X', name: 'BáTước', roleName: 'Phù Thủy', faction: 'VILLAGER',
    effects: [
      { key: 'healed', label: 'Phù Thủy Cứu', color: '#2ecc71', icon: '🧪' },
      { key: 'attacked', label: 'Sói Cắn', color: '#ff4d4d', icon: '🐺' }
    ],
    pos: { top: 204, left: -8 }
  },
  { id: 'XI', name: 'CôĐảo', roleName: 'Dân Làng', faction: 'VILLAGER', pos: { top: 108, left: 0 } },
  { id: 'XII', name: 'NữTuSĩ', roleName: 'Thợ Săn', faction: 'VILLAGER', pos: { top: 24, left: 20 } },
];

export default function NightPhaseScreen({ onNavigate }: { onNavigate?: (screen: string) => void }) {
  const [selectedSeats, setSelectedSeats] = useState<string[]>(['VI']);
  const [micOn, setMicOn] = useState(true);
  const [audioOn, setAudioOn] = useState(true);
  const [showResultModal, setShowResultModal] = useState(false);
  const [drawerExpanded, setDrawerExpanded] = useState(true);
  const [chronicleOpen, setChronicleOpen] = useState(false);
  const [whisperOpen, setWhisperOpen] = useState(false);
  const [timer, setTimer] = useState(20);
  const [whisperMsg, setWhisperMsg] = useState('');
  const [wakeCallModalVisible, setWakeCallModalVisible] = useState(false);
  const [wakeCallTargetName, setWakeCallTargetName] = useState('Tiên Tri');

  // HOST / CLIENT Role Scope & Blood Moon State
  const [isHost, setIsHost] = useState(true); // Default to HOST mode (Quản Trò jumps directly into arena view)
  const [bloodMoonActive, setBloodMoonActive] = useState(false);

  // Quản Trò Click-to-Inspect Seat State (God-View Role Card & Action Effects Inspector)
  const [inspectedSeatId, setInspectedSeatId] = useState<string | null>('VI');
  const inspectedSeat = SEATS.find((s) => s.id === inspectedSeatId);

  // Player Role Scope (You are Seer / Tiên Tri on Seat VII)
  const myRoleId = 'seer';

  // Step Call Engine Integration State
  const [currentStep, setCurrentStep] = useState<StepCallQueueItem | null>(null);
  const [queue, setQueue] = useState<StepCallQueueItem[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [showActionModal, setShowActionModal] = useState(false);
  const [forceAwakeSim, setForceAwakeSim] = useState(false);
  const [completedActionsCount, setCompletedActionsCount] = useState<number>(0);

  // Check if player is woken (HOST is ALWAYS woken in God-View interactive table arena view, no sleep screen!)
  const isMyTurn = isHost || forceAwakeSim || (completedActionsCount > 0 && completedActionsCount < 2 && currentStep !== null);

  // Animation Values
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const wakeAnim = useRef(new Animated.Value(0)).current; // 0 = Sleep, 1 = Woken
  const wakeBannerAnim = useRef(new Animated.Value(0)).current;
  const [showWakeBanner, setShowWakeBanner] = useState(false);
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerSub, setBannerSub] = useState('');

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 6000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Subscribe to mockStepCallServer events
    const unsubscribe = mockServer.subscribe((event, payload) => {
      if (event === 'NIGHT_STARTED') {
        setLogs(payload.room.logs);
        setQueue(payload.queue || mockServer.getEngine().getQueue());
        setCompletedActionsCount(0);
        setForceAwakeSim(false);
      } else if (event === 'STEP_CALL_START') {
        setCurrentStep(payload.step);
        setTimer(payload.timeoutSeconds);
        setQueue(mockServer.getEngine().getQueue());
      } else if (event === 'STEP_WAKE_SIGNAL') {
        playRungChuongSound();
      } else if (event === 'STEP_ACTION_SUBMITTED') {
        if (!isHost) {
          setShowResultModal(true);
        }
      } else if (event === 'NIGHT_ENDED') {
        if (onNavigate) {
          setTimeout(() => onNavigate('DayPhase'), 1500);
        }
      }
    });

    mockServer.startNightPhase();

    const interval = setInterval(() => {
      setTimer((t: number) => {
        if (t <= 0) return 0;
        return t - 1;
      });
    }, 1000);

    // Start Dashboard BGM with smooth volume fade-in
    bgmPlayer.startDashboardBGM(0.5);

    return () => {
      unsubscribe();
      clearInterval(interval);
      bgmPlayer.stopBGM();
    };
  }, [isHost]);

  // Handle transition animation between Sleep State & Woken State
  useEffect(() => {
    Animated.timing(wakeAnim, {
      toValue: isMyTurn ? 1 : 0,
      duration: 650,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    setShowWakeBanner(true);
    if (isMyTurn) {
      setBannerTitle(isHost ? '👑 QUẢN TRÒ THẤU THỊ: BÀN CHƠI THỨC GIẤC!' : '👁️ QUẢN TRÒ GỌI: BẠN THỨC GIẤC!');
      setBannerSub(isHost ? 'Góc nhìn Quản Trò God-View • Điều khiển thứ tự gọi vai trò ban đêm' : 'Mắt thần Tiên Tri mở ra • Hãy soi linh hồn người chơi');
    } else {
      setBannerTitle('🌙 MÀN ĐÊM BUÔNG XUỐNG...');
      setBannerSub('Trở lại cõi mộng • Giữ yên lặng và nhắm mắt');
    }

    wakeBannerAnim.setValue(0);
    Animated.sequence([
      Animated.timing(wakeBannerAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.delay(1100),
      Animated.timing(wakeBannerAnim, { toValue: 0, duration: 350, useNativeDriver: true }),
    ]).start(() => setShowWakeBanner(false));
  }, [isMyTurn, isHost]);

  // Target seat limits & selection logic
  const currentRoleId = currentStep?.action.roleId || myRoleId;
  const maxTargets = currentRoleId === 'cupid' ? 2 : 1;

  const handleSelectSeat = (seatId: string) => {
    if (maxTargets === 1) {
      setSelectedSeats([seatId]);
    } else {
      if (selectedSeats.includes(seatId)) {
        setSelectedSeats(selectedSeats.filter((id) => id !== seatId));
      } else {
        if (selectedSeats.length >= maxTargets) {
          setSelectedSeats([selectedSeats[1], seatId]);
        } else {
          setSelectedSeats([...selectedSeats, seatId]);
        }
      }
    }
  };

  const getSeatNamesLabel = () => {
    if (selectedSeats.length === 0) return 'Chưa chọn';
    return selectedSeats
      .map((id) => {
        const s = SEATS.find((item) => item.id === id);
        return `Ghế ${id}${s ? `: ${s.name}` : ''}`;
      })
      .join(' & ');
  };

  const getActionBtnConfig = () => {
    const seatTag = selectedSeats.length > 0 ? selectedSeats.join(', ') : 'CHỌN GHẾ';
    switch (currentRoleId) {
      case 'seer':
        return {
          icon: '👁️',
          label: `SOI LINH HỒN (GHẾ ${seatTag})`,
          title: 'MỤC TIÊU SOI CĂN CƯỚC',
          bg: Colors.primaryContainer,
          border: Colors.primary,
        };
      case 'werewolf':
      case 'white_werewolf':
      case 'wolf_cub':
        return {
          icon: '🐺',
          label: `CẮN MỤC TIÊU (GHẾ ${seatTag})`,
          title: 'MỤC TIÊU TẤN CÔNG',
          bg: '#8a121a',
          border: '#e74c3c',
        };
      case 'defender':
        return {
          icon: '🛡️',
          label: `BẢO VỆ (GHẾ ${seatTag})`,
          title: 'MỤC TIÊU BẢO VỆ',
          bg: '#1b4d3e',
          border: '#2ecc71',
        };
      case 'cupid':
        return {
          icon: '💘',
          label: `KẾT ĐÔI TÌNH YÊU (GHẾ ${seatTag})`,
          title: 'CHỌN 2 MỤC TIÊU KẾT ĐÔI',
          bg: '#6c2c77',
          border: '#e056fd',
        };
      case 'witch':
        return {
          icon: '🧪',
          label: `SỬ DỤNG DƯỢC PHẨM (GHẾ ${seatTag})`,
          title: 'MỤC TIÊU DÙNG THUỐC',
          bg: '#4a235a',
          border: '#9b59b6',
        };
      case 'hunter':
        return {
          icon: '🏹',
          label: `GÀN SÚNG (GHẾ ${seatTag})`,
          title: 'MỤC TIÊU BẮT TRẮC',
          bg: '#784212',
          border: '#f39c12',
        };
      default:
        return {
          icon: '⚔️',
          label: `THỰC HIỆN HÀNH ĐỘNG (GHẾ ${seatTag})`,
          title: 'MỤC TIÊU HÀNH ĐỘNG',
          bg: Colors.primaryContainer,
          border: Colors.primary,
        };
    }
  };

  const handleActionConfirm = (targetId?: string) => {
    const targetPayload = targetId || selectedSeats.join(',');
    const actionId = currentStep?.action.id || `${currentRoleId}_action`;
    mockServer.submitStepAction('p7', actionId, targetPayload);
    if (!isHost) {
      setShowResultModal(true);
    }
    setCompletedActionsCount((prev) => prev + 1);
  };

  const btnConfig = getActionBtnConfig();

  // Calculate dynamic Next Call step in queue for Game Master
  const currentStepIdx = queue.findIndex((q) => q.order === currentStep?.order);
  const nextStepItem = currentStepIdx >= 0 && currentStepIdx < queue.length - 1 ? queue[currentStepIdx + 1] : null;
  const nextRoleName = nextStepItem ? nextStepItem.action.roleName : null;

  const timerStr = `00:${String(timer).padStart(2, '0')}`;
  const pulseOpacity = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] });
  const spinRotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Cross-fade & Scale Interpolations
  const sleepOpacity = wakeAnim.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [1, 0, 0],
  });
  const sleepScale = wakeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.94],
  });

  const wokenOpacity = wakeAnim.interpolate({
    inputRange: [0, 0.6, 1],
    outputRange: [0, 0, 1],
  });
  const wokenScale = wakeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1.06, 1],
  });

  return (
    <View style={styles.rootContainer}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Gothic Blood Moon Forest Background Image (Full Edge-to-Edge) */}
      <Image
        source={require('../../assets/screen.png')}
        style={styles.bgImage}
        resizeMode="stretch"
      />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(10, 12, 16, 0.40)' }]} pointerEvents="none" />

      <SafeAreaView style={styles.safeArea}>

        {/* TOP SYSTEM HEADER WITH HOST/CLIENT SWITCH & BLOOD MOON TOGGLE */}
        <View style={styles.topSystemHeader}>
          <View style={styles.topHeaderLeft}>
            <TouchableOpacity
              style={[styles.roleScopeBadge, isHost ? styles.roleScopeHost : styles.roleScopeClient]}
              onPress={() => setIsHost(!isHost)}
              activeOpacity={0.8}
            >
              <Text style={styles.roleScopeIcon}>{isHost ? '👑' : '👤'}</Text>
              <Text style={styles.roleScopeText}>{isHost ? 'QUẢN TRÒ' : 'NGƯỜI CHƠI'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.topHeaderRight}>
            <TouchableOpacity
              style={[styles.bloodMoonSwitchBtn, bloodMoonActive && styles.bloodMoonSwitchBtnActive]}
              onPress={() => setBloodMoonActive(!bloodMoonActive)}
              activeOpacity={0.8}
            >
              <Text style={styles.bloodMoonSwitchIcon}>🩸</Text>
              <Text style={[styles.bloodMoonSwitchText, bloodMoonActive && styles.bloodMoonSwitchTextActive]}>
                {bloodMoonActive ? 'TRĂNG MÁU: ON' : 'TRĂNG MÁU'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.topIconButton} onPress={() => setChronicleOpen(true)}>
              <Text style={styles.topIconText}>📖</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* BLOOD MOON ACTIVE BANNER */}
        {bloodMoonActive && (
          <View style={styles.bloodMoonBanner}>
            <Text style={styles.bloodMoonBannerIcon}>🩸</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.bloodMoonBannerTitle}>HUYẾT NGUYỆT TRĂNG MÁU KÍCH HOẠT!</Text>
              <Text style={styles.bloodMoonBannerSub}>Phe Sói tăng 200% sức mạnh • Hắc thuật thủ tiêu nhân đôi lượt cắn</Text>
            </View>
          </View>
        )}

        {/* ATMOSPHERIC TRANSITION BANNER OVERLAY */}
        {showWakeBanner && (
          <Animated.View
            style={[
              styles.wakeBannerOverlay,
              {
                opacity: wakeBannerAnim,
                transform: [
                  {
                    translateY: wakeBannerAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-24, 0],
                    }),
                  },
                ],
              },
            ]}
            pointerEvents="none"
          >
            <View style={[styles.wakeBannerBox, isMyTurn ? styles.wakeBannerBoxGold : styles.wakeBannerBoxDark]}>
              <Text style={isMyTurn ? styles.wakeBannerTitleGold : styles.wakeBannerTitleDark}>{bannerTitle}</Text>
              <Text style={styles.wakeBannerSubText}>{bannerSub}</Text>
            </View>
          </Animated.View>
        )}

        {/* CONDITIONAL CONTAINER WITH SMOOTH ANIMATED TRANSITIONS */}
        <View style={{ flex: 1, position: 'relative' }}>
          {/* =========================================================================
           STATE 1: SLEEPING STATE ("MÀN ĐÊM BUÔNG XUỐNG") — Animated Cross-Fade
           ========================================================================= */}
          {!isMyTurn && (
            <Animated.View
              style={[
                styles.stateContainerAnimated,
                { opacity: sleepOpacity, transform: [{ scale: sleepScale }] },
              ]}
            >
              <ScrollView style={styles.mainScroll} contentContainerStyle={styles.scrollContentSleep}>
                {/* Central Pentagram Ritual Circle Animation */}
                <View style={styles.pentagramContainer}>
                  <Animated.View style={[styles.pentagramRing, { transform: [{ rotate: spinRotation }] }]}>
                    <Svg width={220} height={220} viewBox="0 0 100 100">
                      <Circle cx="50" cy="50" r="46" stroke="#8a121a" strokeWidth="1" strokeDasharray="3 3" fill="none" opacity={0.6} />
                      <Polygon points="50,4 62,38 98,50 62,62 50,96 38,62 2,50 38,38" stroke={Colors.primary} strokeWidth="1" fill="none" opacity={0.5} />
                      <Polygon points="50,18 78,50 50,82 22,50" stroke={Colors.tertiary} strokeWidth="0.8" fill="none" opacity={0.5} />
                    </Svg>
                  </Animated.View>

                  <View style={styles.pentagramCenterImageWrap}>
                    <Image
                      source={{ uri: ROLE_CARD_IMAGES.seer }}
                      style={styles.pentagramCenterImage}
                      resizeMode="contain"
                    />
                    <View style={styles.phaseOverlayTag}>
                      <Text style={styles.phaseOverlayText}>PHASE I</Text>
                    </View>
                  </View>
                </View>

                {/* Main Sleeping Heading Section */}
                <View style={styles.sleepingHeadingBox}>
                  <View style={styles.bloodMoonPill}>
                    <Animated.View style={[styles.bloodDot, { opacity: pulseOpacity }]} />
                    <Text style={styles.bloodMoonPillText}>HUYẾT NGUYỆT THỨC TỈNH</Text>
                  </View>
                  <Text style={styles.sleepingTitle}>MÀN ĐÊM BUÔNG XUỐNG</Text>
                  <Text style={styles.sleepingSubTitle}>Khởi đầu Đêm 1 • Nghi Thức Huyết Tộc</Text>
                </View>

                {/* Status & Progress Card */}
                <View style={styles.sealStatusCard}>
                  <View style={styles.sealHeaderRow}>
                    <View style={styles.sealHeaderLeft}>
                      <Text style={styles.sealGearIcon}>⚙</Text>
                      <Text style={styles.sealTitleText}>PHONG ÂN KẾT GIỚI HOÀN TẤT!</Text>
                    </View>
                    <Text style={styles.sealPctText}>99%</Text>
                  </View>

                  <View style={styles.sealProgressBg}>
                    <View style={styles.sealProgressFill} />
                  </View>

                  <View style={styles.soulsRow}>
                    <Text style={styles.soulsLabel}>Linh hồn nhập cuộc:</Text>
                    <View style={styles.soulsAvatarsList}>
                      {['I', 'II', 'III'].map((id) => (
                        <Image key={id} source={{ uri: SEAT_AVATAR_IMAGES[id] }} style={styles.miniSoulAvatar} />
                      ))}
                      <View style={styles.soulMoreBadge}>
                        <Text style={styles.soulMoreText}>+9</Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Lore Quote Box */}
                <View style={styles.loreQuoteCard}>
                  <Text style={styles.quoteMark}>“</Text>
                  <Text style={styles.quoteText}>
                    "Một giọt độc của Tiên Tri có thể xé toạc màn sương ngàn năm."
                  </Text>
                  <Text style={styles.quoteAuthor}>
                    — BIÊN NIÊN SỬ LÀNG CỔ OAKVALE • NĂM HẮC NGUYỆT
                  </Text>
                </View>

                {/* Current Game Master Call Indicator & Simulation Toggle */}
                <View style={styles.narratorCallNoticeBox}>
                  <Text style={styles.narratorCallIcon}>🔊</Text>
                  <Text style={styles.narratorCallText}>
                    Quản trò đang gọi lượt: <Text style={{ color: Colors.secondary, fontWeight: '700' }}>[{currentStep?.action.roleName || 'Phe Ma Sói'}]</Text> thức giấc...
                  </Text>
                </View>

                {/* Simulated Wake Up Button (ONLY for Client users to simulate receiving GM call) */}
                {!isHost && (
                  <TouchableOpacity
                    style={styles.simulateWakeBtn}
                    onPress={() => setForceAwakeSim(true)}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.simulateWakeIcon}>🔮</Text>
                    <Text style={styles.simulateWakeText}>MÔ PHỎNG QUẢN TRÒ GỌI BẠN (TIÊN TRI THỨC GIẤC)</Text>
                  </TouchableOpacity>
                )}
              </ScrollView>
            </Animated.View>
          )}

          {/* =========================================================================
           STATE 2: WOKEN ROLE ACTION STATE (Interactive Arena Table) — Animated Scale & Fade
           ========================================================================= */}
          {isMyTurn && (
            <Animated.View
              style={[
                styles.stateContainerAnimated,
                { opacity: wokenOpacity, transform: [{ scale: wokenScale }] },
              ]}
            >
              <ScrollView style={styles.mainScroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* SUB-HEADER HUD STRIP */}
                {/* <View style={styles.subHeaderSection}>
                  <View style={styles.subHeaderCard}>
                    <View style={styles.subHeaderLeft}>
                      <View style={styles.nightTitleRow}>
                        <Animated.View style={[styles.nightDotPing, { opacity: pulseOpacity }]} />
                        <Text style={styles.nightTitle}>
                          {currentStep ? `LƯỢT #${currentStep.order}` : 'ĐÊM 1'}
                        </Text>
                        <View style={styles.roomCodeBadge}>
                          <Text style={styles.roomCodeBadgeText}>#8921</Text>
                        </View>
                      </View>
                      <View style={styles.roleSubRow}>
                        <Text style={styles.roleSubIcon}>👁️</Text>
                        <Text style={styles.roleSubLabel}>
                          QUẢN TRÒ GỌI: {currentStep ? currentStep.action.roleName.toUpperCase() : 'TIÊN TRI'} THỨC GIẤC!
                        </Text>
                      </View>
                    </View>

                    <View style={styles.timerBadgeCapsule}>
                      <Animated.Text style={[styles.timerCapsuleIcon, { opacity: pulseOpacity }]}>⏳</Animated.Text>
                      <Animated.Text style={[styles.timerCapsuleText, { opacity: pulseOpacity }]}>{timerStr}</Animated.Text>
                    </View>
                  </View>
                </View> */}

                {/* VERTICAL OVAL ARENA: 12 Mystic Seats */}
                <View style={styles.arenaContainer}>
                  <View style={styles.ovalBackdropRing}>
                    <Animated.View style={{ position: 'absolute', transform: [{ rotate: spinRotation }] }}>
                      <Svg width={280} height={280} viewBox="0 0 500 500">
                        <Defs>
                          <LinearGradient id="crimsonGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                            <Stop offset="0%" stopColor="#ff3b56" stopOpacity={0.95} />
                            <Stop offset="50%" stopColor="#8a121a" stopOpacity={0.8} />
                            <Stop offset="100%" stopColor="#ff1a35" stopOpacity={0.95} />
                          </LinearGradient>
                          <LinearGradient id="goldAccursed" x1="0%" y1="100%" x2="100%" y2="0%">
                            <Stop offset="0%" stopColor="#9a7b38" stopOpacity={0.9} />
                            <Stop offset="50%" stopColor="#e2ba62" stopOpacity={0.95} />
                            <Stop offset="100%" stopColor="#694d1b" stopOpacity={0.85} />
                          </LinearGradient>
                          <RadialGradient id="soulWispRadial" cx="50%" cy="50%" r="50%">
                            <Stop offset="0%" stopColor="#38bdf8" stopOpacity={0.6} />
                            <Stop offset="60%" stopColor="#0284c7" stopOpacity={0.2} />
                            <Stop offset="100%" stopColor="#0c0e11" stopOpacity={0} />
                          </RadialGradient>
                          <Filter id="bloodGlow" x="-30%" y="-30%" width="160%" height="160%">
                            <FeGaussianBlur stdDeviation={3.5} result="blur" />
                            <FeColorMatrix
                              type="matrix"
                              values="1 0 0 0 0.7  0 0 0 0 0.05  0 0 0 0 0.1  0 0 0 1.2 0"
                              result="coloredBlur"
                            />
                            <FeMerge>
                              <FeMergeNode in="coloredBlur" />
                              <FeMergeNode in="SourceGraphic" />
                            </FeMerge>
                          </Filter>
                          <Filter id="spectralGlow" x="-20%" y="-20%" width="140%" height="140%">
                            <FeGaussianBlur stdDeviation={2} result="blur" />
                            <FeMerge>
                              <FeMergeNode in="blur" />
                              <FeMergeNode in="SourceGraphic" />
                            </FeMerge>
                          </Filter>
                          <Path id="runeCircleOuter" d="M 250,250 m -218,0 a 218,218 0 1,1 436,0 a 218,218 0 1,1 -436,0" />
                          <Path id="runeCircleInner" d="M 250,250 m -175,0 a 175,175 0 1,0 350,0 a 175,175 0 1,0 -350,0" />
                        </Defs>

                        <Circle cx="250" cy="250" r="240" fill="none" stroke="#111317" strokeOpacity={0.7} strokeWidth={4} />

                        {/* Layer 1: Outer Accursed Thorns & Claws */}
                        <G>
                          <Circle cx="250" cy="250" r="236" fill="none" stroke="url(#crimsonGlow)" strokeDasharray="14 6 2 6" strokeWidth={1.8} />
                          <G fill="#8a121a" fillOpacity={0.35} stroke="url(#crimsonGlow)" strokeWidth={2}>
                            <Polygon points="250,6 242,22 258,22" />
                            <Polygon points="422,78 406,86 414,102" />
                            <Polygon points="494,250 478,242 478,258" />
                            <Polygon points="422,422 414,406 398,414" />
                            <Polygon points="250,494 258,478 242,478" />
                            <Polygon points="78,422 94,414 86,398" />
                            <Polygon points="6,250 22,258 22,242" />
                            <Polygon points="78,78 86,94 102,86" />
                          </G>
                          <G opacity={0.8} stroke="#ff3b56" strokeLinecap="round" strokeWidth={1.5}>
                            <Line transform="rotate(22.5 250 250)" x1="250" y1="14" x2="250" y2="24" />
                            <Line transform="rotate(67.5 250 250)" x1="250" y1="14" x2="250" y2="24" />
                            <Line transform="rotate(112.5 250 250)" x1="250" y1="14" x2="250" y2="24" />
                            <Line transform="rotate(157.5 250 250)" x1="250" y1="14" x2="250" y2="24" />
                            <Line transform="rotate(202.5 250 250)" x1="250" y1="14" x2="250" y2="24" />
                            <Line transform="rotate(247.5 250 250)" x1="250" y1="14" x2="250" y2="24" />
                            <Line transform="rotate(292.5 250 250)" x1="250" y1="14" x2="250" y2="24" />
                            <Line transform="rotate(337.5 250 250)" x1="250" y1="14" x2="250" y2="24" />
                          </G>
                        </G>

                        {/* Layer 2: Middle Elder Runes & Occult Sigils */}
                        <G>
                          <Circle cx="250" cy="250" r="224" fill="none" stroke="#5a0b12" strokeWidth={1.2} />
                          <Circle cx="250" cy="250" r="202" fill="none" stroke="#8a121a" strokeDasharray="32 4 8 4" strokeWidth={1.8} />
                          <SvgText fill="#e2ba62" fontSize="10.5" fontWeight="bold" letterSpacing={4.8} opacity={0.95}>
                            <TextPath href="#runeCircleOuter" startOffset="0%">
                              ᚛ ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ ᛚᚢᛈᚢᛋ • ᛚᚢᚾᚨ ᛋᚨᚾᚷᚢᛁᚾᛁᛋ • ᚦᛖ ᛒᛚᛟᛟᛞ ᛗᛟᛟᚾ ᚲᚨᛚᛚᛋ • ᚹᛟᛚᚠ ᚨᚹᚨᚲᛖᚾᛋ • ᛗᛟᚱᛏᛁᛋ ᚅᛟᚲᛏᚢᚱᚾᚨ ᚜
                            </TextPath>
                          </SvgText>
                          <G fill="none" opacity={0.75} stroke="url(#goldAccursed)" strokeWidth={1.2}>
                            <Rect x="94" y="94" width="312" height="312" rx="4" />
                            <Rect transform="rotate(45 250 250)" x="94" y="94" width="312" height="312" rx="4" />
                            <Circle cx="250" cy="250" r="190" stroke="#ff3b56" strokeDasharray="4 8" strokeWidth={0.8} />
                          </G>
                          <G fill="#ff1a35">
                            <Circle cx="250" cy="38" r="3.5" />
                            <Circle cx="400" cy="100" r="3.5" />
                            <Circle cx="462" cy="250" r="3.5" />
                            <Circle cx="400" cy="400" r="3.5" />
                            <Circle cx="250" cy="462" r="3.5" />
                            <Circle cx="100" cy="400" r="3.5" />
                            <Circle cx="38" cy="250" r="3.5" />
                            <Circle cx="100" cy="100" r="3.5" />
                          </G>
                        </G>

                        {/* Layer 3: Inner Ritual Moon Phases & Mystic Compass */}
                        <G>
                          <Circle cx="250" cy="250" r="172" fill="none" stroke="#38bdf8" strokeDasharray="18 6 4 6" strokeOpacity={0.85} strokeWidth={1.4} />
                          <Circle cx="250" cy="250" r="158" fill="none" stroke="#8a121a" strokeWidth={1.2} />
                          <Circle cx="250" cy="94" r="5" fill="#ff2a44" stroke="#ff8090" strokeWidth={1} />
                          <Path d="M 328,115 A 5,5 0 0,0 328,125 A 3,5 0 0,1 328,115" fill="#e2ba62" />
                          <Path d="M 385,172 A 5,5 0 0,0 385,182 A 3,5 0 0,1 385,172" fill="#e2ba62" />
                          <Circle cx="406" cy="250" r="4.5" fill="#38bdf8" fillOpacity={0.8} />
                          <Path d="M 385,318 A 5,5 0 0,1 385,328 A 3,5 0 0,0 385,318" fill="#e2ba62" />
                          <Path d="M 328,375 A 5,5 0 0,1 328,385 A 3,5 0 0,0 328,375" fill="#e2ba62" />
                          <Circle cx="250" cy="406" r="5" fill="#1e293b" stroke="#e2ba62" strokeWidth={1.2} />
                          <Path d="M 172,375 A 5,5 0 0,1 172,385 A 3,5 0 0,0 172,375" fill="#e2ba62" />
                          <Path d="M 115,318 A 5,5 0 0,1 115,328 A 3,5 0 0,0 115,318" fill="#e2ba62" />
                          <Circle cx="94" cy="250" r="4.5" fill="#38bdf8" fillOpacity={0.8} />
                          <Path d="M 115,172 A 5,5 0 0,0 115,182 A 3,5 0 0,1 115,172" fill="#e2ba62" />
                          <Path d="M 172,115 A 5,5 0 0,0 172,125 A 3,5 0 0,1 172,115" fill="#e2ba62" />
                          <SvgText fill="#ff6b7e" fontSize="9" letterSpacing={3} opacity={0.9}>
                            <TextPath href="#runeCircleInner" startOffset="0%">
                              ✦ NOX • SANGUIS • VENATIO • MALUM • LUPUS ✦
                            </TextPath>
                          </SvgText>
                        </G>

                        {/* Layer 4: Innermost Concentric Fangs & Target Reticle */}
                        <G>
                          <Circle cx="250" cy="250" r="148" fill="none" stroke="url(#crimsonGlow)" strokeDasharray="6 12 24 12" strokeWidth={2} />
                          <Circle cx="250" cy="250" r="138" fill="none" stroke="#2a080c" strokeWidth={3} />
                          <G fill="#ff1a35" stroke="#ffe5e8" strokeWidth={0.8}>
                            <Polygon points="250,138 245,124 255,124" />
                            <Polygon points="362,250 376,245 376,255" />
                            <Polygon points="250,362 255,376 245,376" />
                            <Polygon points="138,250 124,255 124,245" />
                          </G>
                          <G opacity={0.8} stroke="#38bdf8" strokeWidth={1.2}>
                            <Line x1="250" y1="134" x2="250" y2="142" />
                            <Line x1="250" y1="358" x2="250" y2="366" />
                            <Line x1="134" y1="250" x2="142" y2="250" />
                            <Line x1="358" y1="250" x2="366" y2="250" />
                          </G>
                        </G>

                        {/* Center Void */}
                        <Circle cx="250" cy="250" r="130" fill="none" stroke="#ff3b56" strokeDasharray="3 6" strokeOpacity={0.3} strokeWidth={1} />
                      </Svg>
                    </Animated.View>

                    {isHost ? (
                      <View style={styles.centerScriptBox}>
                        <View style={styles.centerScriptHeader}>
                          <Text style={styles.centerScriptHeaderIcon}>🎙️</Text>
                          <Text style={styles.centerScriptRoleTitle} numberOfLines={1}>
                            {currentStep?.action.roleName || 'Tiên Tri'}
                          </Text>
                          <View style={styles.centerScriptTurnBadge}>
                            <Text style={styles.centerScriptTurnText}>#{currentStep?.order || 1}</Text>
                          </View>
                        </View>
                        <View style={styles.centerScriptDivider} />
                        <ScrollView style={styles.centerScriptScroll} nestedScrollEnabled showsVerticalScrollIndicator={false}>
                          {(currentStep?.action.scriptLines || [
                            `"${currentStep?.action.roleName || 'Tiên Tri'}, thức dậy."`,
                            `"Hãy chọn 1 người để soi căn cước."`,
                            `"${currentStep?.action.roleName || 'Tiên Tri'}, nhắm mắt."`,
                          ]).map((line, idx) => (
                            <View key={idx} style={styles.centerScriptLineRow}>
                              <Text style={styles.centerScriptLineBullet}>✦</Text>
                              <Text style={styles.centerScriptLineText}>{line}</Text>
                            </View>
                          ))}
                        </ScrollView>
                      </View>
                    ) : (
                      <View style={styles.centerTextContainer}>
                        <Text style={styles.centerTitle}>TRẬN MA QUÁI</Text>
                        <Text style={styles.centerSubText}>Chạm vào ghế để chọn mục tiêu</Text>
                      </View>
                    )}
                  </View>

                  {/* 12 Seats Circle Grid */}
                  <View style={styles.seatsContainer}>
                    {SEATS.map((seat) => {
                      const isSelected = selectedSeats.includes(seat.id);
                      const isYou = seat.isYou;
                      const isInspected = inspectedSeatId === seat.id;

                      return (
                        <TouchableOpacity
                          key={seat.id}
                          style={[
                            styles.seatBtn,
                            seat.pos,
                            seat.translateX ? { marginLeft: seat.translateX } : {},
                          ]}
                          onPress={() => {
                            if (isHost) {
                              setInspectedSeatId(seat.id);
                            } else if (!isYou) {
                              handleSelectSeat(seat.id);
                            }
                          }}
                          activeOpacity={0.8}
                        >
                          <View style={[
                            styles.seatAvatarWrap,
                            isYou && styles.seatAvatarWrapYou,
                            isInspected && isHost && styles.seatAvatarWrapInspected,
                            isSelected && !isYou && !isHost && styles.seatAvatarWrapSelected,
                            seat.isDead && styles.seatAvatarWrapDead,
                          ]}>
                            {/* CONCENTRIC RAINBOW ACTION RINGS OVERLAY */}
                            <RainbowActionRings
                              effects={seat.effects}
                              avatarSize={44}
                              strokeWidth={3}
                            />

                            <Image
                              source={{ uri: SEAT_AVATAR_IMAGES[seat.id] }}
                              style={[styles.seatAvatarImg, seat.isDead && { opacity: 0.35 }]}
                              resizeMode="cover"
                            />

                            {seat.isDead && (
                              <View style={styles.deadCenterOverlay}>
                                <Text style={{ fontSize: 16 }}>💀</Text>
                              </View>
                            )}

                            {isYou && !isHost && (
                              <View style={styles.youTopBadge}>
                                <Text style={styles.youTopBadgeText}>✦ Bạn</Text>
                              </View>
                            )}

                            {isInspected && isHost && (
                              <View style={styles.inspectedTopBadge}>
                                <Text style={styles.inspectedTopBadgeText}>👁️ XEM</Text>
                              </View>
                            )}

                            {isSelected && !isYou && !isHost && (
                              <View style={styles.selectedEyeBadge}>
                                <Text style={styles.selectedEyeText}>
                                  {maxTargets > 1 ? selectedSeats.indexOf(seat.id) + 1 : '👁'}
                                </Text>
                              </View>
                            )}

                            <View style={[
                              styles.seatIdBadge,
                              isYou ? styles.seatIdBadgeYou : isInspected && isHost ? styles.seatIdBadgeInspected : isSelected ? styles.seatIdBadgeSelected : styles.seatIdBadgeDefault
                            ]}>
                              <Text style={[styles.seatIdText, (isYou || isSelected || (isInspected && isHost)) && styles.seatIdTextActive]}>{seat.id}</Text>
                            </View>
                          </View>

                          <Text
                            style={[
                              styles.seatName,
                              isYou && styles.seatNameYou,
                              isInspected && isHost && styles.seatNameInspected,
                              isSelected && !isYou && !isHost && styles.seatNameSelected,
                              seat.isDead && styles.seatNameDead,
                            ]}
                            numberOfLines={1}
                          >
                            {seat.name}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* QUẢN TRÒ SEAT INSPECTOR CARD (GOD-VIEW CLICK TO VIEW ROLE & EFFECTS) */}
                {isHost && inspectedSeat && (
                  <View style={styles.gmInspectorContainer}>
                    <View style={styles.gmInspectorCard}>
                      <View style={styles.gmInspectorHeader}>
                        <View style={styles.gmInspectorHeaderLeft}>
                          <View style={styles.gmSeatBadge}>
                            <Text style={styles.gmSeatBadgeText}>GHẾ {inspectedSeat.id}</Text>
                          </View>
                          <Text style={styles.gmPlayerNameText}>{inspectedSeat.name}</Text>
                        </View>

                        <View style={[
                          styles.gmFactionPill,
                          inspectedSeat.faction === 'WEREWOLF' ? styles.gmFactionWolf : styles.gmFactionVillager
                        ]}>
                          <Text style={styles.gmFactionPillText}>
                            {inspectedSeat.faction === 'WEREWOLF' ? '🐺 PHE MA SÓI' : inspectedSeat.faction === 'NEUTRAL' ? '💘 TRUNG LẬP' : '🛡️ PHE DÂN LÀNG'}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.gmRoleDetailsRow}>
                        <Text style={styles.gmRoleDetailIcon}>
                          {inspectedSeat.faction === 'WEREWOLF' ? '🐺' : inspectedSeat.faction === 'NEUTRAL' ? '💘' : '🛡️'}
                        </Text>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.gmRoleTitleText}>
                            VAI TRÒ THẬT: <Text style={{ color: '#f1be66', fontWeight: '800' }}>{inspectedSeat.roleName || 'Dân Làng'}</Text>
                          </Text>
                          {/* <Text style={styles.gmRoleDescText}>Chạm vào các ghế trên bàn để kiểm tra căn cước & thao tác đêm nay</Text> */}
                        </View>

                        {inspectedSeat.isDead && (
                          <View style={styles.deadStatusBadge}>
                            <Text style={styles.deadStatusBadgeText}>💀 ĐÃ TỬ NẠN</Text>
                          </View>
                        )}
                      </View>

                      {/* Action Effects Rings Legend */}
                      {inspectedSeat.effects && inspectedSeat.effects.length > 0 ? (
                        <View style={styles.gmEffectsListRow}>
                          <Text style={styles.gmEffectsLabel}>VÒNG VIỀN THAO TÁC (ACTION RINGS):</Text>
                          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
                            {inspectedSeat.effects.map((eff) => (
                              <View key={eff.key} style={[styles.effectChipBadge, { borderColor: eff.color, backgroundColor: `${eff.color}22` }]}>
                                <View style={[styles.effectDot, { backgroundColor: eff.color }]} />
                                <Text style={[styles.effectChipText, { color: eff.color }]}>{eff.icon} {eff.label}</Text>
                              </View>
                            ))}
                          </ScrollView>
                        </View>
                      ) : (
                        <View style={styles.gmNoEffectsRow}>
                          <Text style={styles.gmNoEffectsText}>✨ Không có thao tác đêm nào tác động lên người chơi này</Text>
                        </View>
                      )}
                    </View>
                  </View>
                )}

                {/* ACTION SHEET / BOTTOM DRAWER (CLIENT ONLY) */}
                {!isHost && (
                  <View style={styles.actionSheetContainer}>
                    <View style={styles.actionSheetCard}>
                      <View style={styles.actionSheetHeaderRow}>
                        <View style={styles.targetStatusLeft}>
                          <View style={[styles.targetEyeBox, { backgroundColor: btnConfig.bg }]}>
                            <Text style={styles.targetEyeIcon}>{btnConfig.icon}</Text>
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.targetLabelTitle}>{btnConfig.title}</Text>
                            <Text style={styles.targetNameValue}>{getSeatNamesLabel()}</Text>
                          </View>
                        </View>

                        <View style={styles.privacyShieldBadge}>
                          <Text style={styles.privacyShieldText}>🔒 Bảo mật tuyệt đối</Text>
                        </View>
                      </View>

                      <TouchableOpacity
                        style={[styles.confirmCtaBtn, { backgroundColor: btnConfig.bg, borderColor: btnConfig.border }]}
                        onPress={() => handleActionConfirm()}
                        activeOpacity={0.85}
                      >
                        <Text style={styles.confirmCtaIcon}>{btnConfig.icon}</Text>
                        <Text style={styles.confirmCtaText}>{btnConfig.label}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </ScrollView>
            </Animated.View>
          )}
        </View>

        {/* GAME MASTER CONTROLLER BAR FOR HOST */}
        {isHost ? (
          <View style={styles.gmControllerContainer}>
            <View style={styles.gmPrimaryActionRow}>
              {/* BUTTON 1: WAKE CALL SIGNAL BUTTON FOR CURRENT ROLE */}
              <TouchableOpacity
                style={styles.gmWakeCallBtn}
                onPress={() => {
                  const roleName = currentStep?.action.roleName || 'Tiên Tri';
                  playRungChuongSound();
                  mockServer.sendWakeUpSignal(roleName);
                  setWakeCallTargetName(roleName);
                  setWakeCallModalVisible(true);
                }}
                activeOpacity={0.85}
              >
                <Text style={styles.gmWakeCallIcon}>🔔</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.gmWakeCallText}>
                    GỌI {currentStep?.action.roleName ? currentStep.action.roleName.toUpperCase() : 'TIÊN TRI'} THỨC GIẤC
                  </Text>
                  <Text style={styles.gmWakeCallSub}>(Tín hiệu rung & chuông)</Text>
                </View>
              </TouchableOpacity>

              {/* BUTTON 2: ADVANCE NEXT ROLE BUTTON */}
              <TouchableOpacity
                style={styles.gmCallNextBtn}
                onPress={() => {
                  mockServer.submitStepAction('p7', 'gm_advance', selectedSeats.join(','));
                  setCompletedActionsCount((prev) => prev + 1);
                }}
                activeOpacity={0.85}
              >
                <Text style={styles.gmCallNextIcon}>⏩</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.gmCallNextText}>
                    {nextRoleName ? `${nextRoleName.toUpperCase()}` : 'KẾT THÚC ĐÊM'}
                  </Text>
                  <Text style={styles.gmCallNextSub}>(Mở lượt tiếp)</Text>
                </View>
                <Text style={styles.gmCallNextArrow}>➔</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          /* FIXED BOTTOM NAVIGATION BAR FOR CLIENT */
          <View style={styles.bottomNavBar}>
            <TouchableOpacity
              style={styles.navItem}
              onPress={() => setMicOn(!micOn)}
              activeOpacity={0.7}
            >
              <Text style={[styles.navItemIcon, !micOn && { color: Colors.error }]}>
                {micOn ? '🎙️' : '🔇'}
              </Text>
              <Text style={[styles.navItemLabel, micOn ? { color: Colors.primary, fontWeight: '700' } : { color: Colors.error }]}>
                {micOn ? 'Bật Mic' : 'Tắt Mic'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navItem}
              onPress={() => setAudioOn(!audioOn)}
              activeOpacity={0.7}
            >
              <Text style={[styles.navItemIcon, !audioOn && { color: Colors.error }]}>
                {audioOn ? '🔊' : '🔈'}
              </Text>
              <Text style={[styles.navItemLabel, audioOn ? { color: Colors.onSurface } : { color: Colors.error }]}>
                {audioOn ? 'Bật Loa' : 'Tắt Loa'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navItem} onPress={() => setWhisperOpen(true)}>
              <Text style={styles.navItemIcon}>💬</Text>
              <Text style={styles.navItemLabel}>Whispers</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navItem} onPress={() => setChronicleOpen(true)}>
              <Text style={styles.navItemIcon}>📖</Text>
              <Text style={styles.navItemLabel}>Nhật Ký</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* CHRONICLE DRAWER MODAL */}
        <Modal visible={chronicleOpen} animationType="slide" transparent>
          <View style={styles.modalBackdrop}>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => setChronicleOpen(false)} />
            <View style={styles.sideDrawerContent}>
              <View style={styles.drawerHeader}>
                <Text style={styles.drawerHeaderTitle}>📖 Nhật Ký Biên Niên Sử</Text>
                <TouchableOpacity onPress={() => setChronicleOpen(false)} style={styles.closeModalBtn}>
                  <Text style={styles.closeModalBtnText}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={{ flex: 1, padding: 12 }}>
                {logs.map((log, idx) => (
                  <View key={idx} style={styles.logCard}>
                    <Text style={styles.logTagCyan}>NIGHT LOG</Text>
                    <Text style={styles.logText}>{log}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* WHISPER CHAT MODAL */}
        <Modal visible={whisperOpen} animationType="slide" transparent>
          <View style={styles.modalBackdrop}>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => setWhisperOpen(false)} />
            <View style={styles.sideDrawerContent}>
              <View style={styles.drawerHeader}>
                <Text style={styles.drawerHeaderTitleCyan}>💬 Thầm Thì</Text>
                <TouchableOpacity onPress={() => setWhisperOpen(false)} style={styles.closeModalBtn}>
                  <Text style={styles.closeModalBtnText}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.whisperContent}>
                <View style={styles.sysMsgBox}>
                  <Text style={styles.sysMsgTitle}>Kênh Cõi Mộng</Text>
                  <Text style={styles.sysMsgText}>Đang ở trạng thái ngủ say. Bạn chỉ có thể trao đổi mộng với linh hồn ngủ.</Text>
                </View>
              </View>

              <View style={styles.whisperInputBar}>
                <TextInput
                  style={styles.whisperInput}
                  placeholder="Thầm thì..."
                  placeholderTextColor={Colors.outlineVariant}
                  value={whisperMsg}
                  onChangeText={setWhisperMsg}
                />
                <TouchableOpacity style={styles.whisperSendBtn} onPress={() => setWhisperMsg('')}>
                  <Text style={styles.whisperSendText}>➔</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* RESULT CONFIRMATION MODAL OVERLAY (CLIENT ONLY) */}
        {!isHost && (
          <Modal visible={showResultModal} animationType="fade" transparent>
            <View style={styles.divinationOverlay}>
              <View style={styles.divinationCard}>
                <View style={styles.divinationIconCircle}>
                  <Text style={{ fontSize: 32 }}>✨</Text>
                </View>

                <Text style={styles.divinationTitleTag}>
                  {completedActionsCount < 2 ? `LƯỢT #${currentStep?.order || 1} HOÀN TẤT` : 'CÁC LƯỢT BAN ĐÊM HOÀN TẤT'}
                </Text>
                <Text style={styles.divinationTargetTitle}>{getSeatNamesLabel()}</Text>

                <Text style={styles.divinationDesc}>
                  {completedActionsCount < 2
                    ? `Hành động của [${currentStep?.action.roleName || 'Tiên Tri'}] đã được báo về cho CHECKER & QUẢN TRÒ! Nhấn tiếp tục để chuyển sang lượt gọi tiếp theo.`
                    : 'Tất cả các vai trò ban đêm đã hoàn thành hành động! Đã hoàn tất lượt ban đêm, trở lại cõi mộng.'}
                </Text>

                <TouchableOpacity
                  style={styles.closeDivinationBtn}
                  onPress={() => {
                    setShowResultModal(false);
                    if (completedActionsCount >= 2) {
                      setForceAwakeSim(false);
                    }
                  }}
                >
                  <Text style={styles.closeDivinationText}>
                    {completedActionsCount < 2 ? 'CHUYỂN SANG LƯỢT TIẾP THEO ➔' : 'TRỞ LẠI GIẤC NGỦ 🌙'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}

        {/* QUẢN TRÒ WAKE CALL SIGNAL MODAL OVERLAY */}
        <Modal visible={wakeCallModalVisible} animationType="fade" transparent>
          <View style={styles.divinationOverlay}>
            <View style={styles.wakeCallModalCard}>
              <View style={styles.wakeCallIconCircle}>
                <Text style={{ fontSize: 32 }}>🔔</Text>
              </View>

              <Text style={styles.wakeCallModalTitle}>ĐÃ PHÁT LỆNH GỌI THỨC GIẤC!</Text>

              <Text style={styles.wakeCallModalDesc}>
                Quản trò đã phát tín hiệu rung & âm thanh gọi [<Text style={{ color: '#f1be66', fontWeight: '800' }}>{wakeCallTargetName}</Text>] thức giấc trên thiết bị người chơi!
              </Text>

              <TouchableOpacity
                style={styles.closeWakeCallBtn}
                onPress={() => setWakeCallModalVisible(false)}
                activeOpacity={0.85}
              >
                <Text style={styles.closeWakeCallText}>ĐÃ HIỂU / ĐÓNG ✦</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  bgImage: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, width: '100%', height: '100%' },
  rootContainer: { flex: 1, backgroundColor: '#0a0c10', position: 'relative' },
  safeArea: { flex: 1, backgroundColor: 'transparent' },

  stateContainerAnimated: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 },

  crimsonGlow: {
    position: 'absolute', top: -50, left: -50, width: 220, height: 220, borderRadius: 110,
    backgroundColor: '#8a121a', opacity: 0.2, transform: [{ scale: 1.5 }],
  },
  cyanGlow: {
    position: 'absolute', top: 200, right: -60, width: 220, height: 220, borderRadius: 110,
    backgroundColor: '#329db6', opacity: 0.2, transform: [{ scale: 1.5 }],
  },
  goldGlow: {
    position: 'absolute', bottom: -50, left: 30, width: 220, height: 220, borderRadius: 110,
    backgroundColor: '#5c3f00', opacity: 0.2, transform: [{ scale: 1.5 }],
  },

  // TOP SYSTEM HEADER
  topSystemHeader: {
    height: 44, paddingHorizontal: 16, backgroundColor: '#111317E6',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderBottomWidth: 1, borderBottomColor: '#33353840', zIndex: 10,
  },
  topHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  pingDotLive: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.secondary },
  liveRitualText: { color: Colors.secondary, fontSize: 13, fontWeight: '800', letterSpacing: 1.5 },

  topHeaderRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerPillBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#282a2d', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12,
  },
  headerPillIcon: { fontSize: 11 },
  headerPillText: { color: Colors.onSurface, fontSize: 11, fontWeight: '700' },
  topIconButton: {
    width: 28, height: 28, borderRadius: 8, backgroundColor: '#282a2d',
    alignItems: 'center', justifyContent: 'center',
  },
  topIconText: { fontSize: 12 },

  // TRANSITION BANNER OVERLAY
  wakeBannerOverlay: {
    position: 'absolute', top: 54, left: 16, right: 16, zIndex: 100, alignItems: 'center',
  },
  wakeBannerBox: {
    width: '100%', borderRadius: 12, paddingVertical: 10, paddingHorizontal: 14,
    alignItems: 'center', gap: 2, borderWidth: 1,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.6, shadowRadius: 8, elevation: 10,
  },
  wakeBannerBoxGold: { backgroundColor: '#2b210aE6', borderColor: Colors.tertiary },
  wakeBannerBoxDark: { backgroundColor: '#181a1dE6', borderColor: Colors.secondary },
  wakeBannerTitleGold: { color: Colors.tertiary, fontSize: 13, fontWeight: '800', letterSpacing: 1 },
  wakeBannerTitleDark: { color: Colors.secondary, fontSize: 13, fontWeight: '800', letterSpacing: 1 },
  wakeBannerSubText: { color: Colors.onSurfaceVariant, fontSize: 10 },

  mainScroll: { flex: 1 },
  scrollContent: { paddingBottom: 80 },

  // SLEEP STATE STYLES (MATCHES SCREENSHOT)
  scrollContentSleep: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 90, gap: 14, alignItems: 'center' },
  pentagramContainer: { width: 220, height: 220, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  pentagramRing: { position: 'absolute', width: 220, height: 220, alignItems: 'center', justifyContent: 'center' },
  pentagramCenterImageWrap: {
    width: 140, height: 140, borderRadius: 20, overflow: 'hidden',
    backgroundColor: '#0c0e11', borderWidth: 2, borderColor: '#8a121a',
    alignItems: 'center', justifyContent: 'center', position: 'relative',
  },
  pentagramCenterImage: { width: '100%', height: '100%' },
  phaseOverlayTag: {
    position: 'absolute', bottom: 8, backgroundColor: 'rgba(138, 18, 26, 0.9)',
    paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4,
  },
  phaseOverlayText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800', letterSpacing: 1 },

  sleepingHeadingBox: { alignItems: 'center', gap: 4 },
  bloodMoonPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#3d1217', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12,
    borderWidth: 1, borderColor: '#8a121a',
  },
  bloodDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.primary },
  bloodMoonPillText: { color: Colors.primary, fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  sleepingTitle: { color: Colors.onSurface, fontSize: 24, fontWeight: '700', letterSpacing: 1.5, marginTop: 2 },
  sleepingSubTitle: { color: Colors.onSurfaceVariant, fontSize: 11 },

  sealStatusCard: {
    width: '100%', backgroundColor: '#1e2023E6', borderRadius: 14, padding: 12, gap: 8,
    borderWidth: 1, borderColor: '#33353866',
  },
  sealHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sealHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sealGearIcon: { fontSize: 14, color: Colors.tertiary },
  sealTitleText: { color: Colors.onSurface, fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },
  sealPctText: { color: Colors.tertiary, fontSize: 16, fontWeight: '800' },
  sealProgressBg: { height: 4, borderRadius: 2, backgroundColor: '#0c0e11', overflow: 'hidden' },
  sealProgressFill: { width: '99%', height: '100%', backgroundColor: Colors.tertiary },

  soulsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  soulsLabel: { color: Colors.onSurfaceVariant, fontSize: 11 },
  soulsAvatarsList: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  miniSoulAvatar: { width: 22, height: 22, borderRadius: 11, borderWidth: 1, borderColor: '#333538' },
  soulMoreBadge: {
    width: 22, height: 22, borderRadius: 11, backgroundColor: Colors.primaryContainer,
    alignItems: 'center', justifyContent: 'center',
  },
  soulMoreText: { color: Colors.onPrimaryContainer, fontSize: 9, fontWeight: '800' },

  loreQuoteCard: {
    width: '100%', backgroundColor: '#181a1d', borderRadius: 12, padding: 14, gap: 6,
    borderWidth: 1, borderColor: '#33353840', position: 'relative',
  },
  quoteMark: { position: 'absolute', top: 6, left: 10, color: Colors.tertiary, fontSize: 24, opacity: 0.4 },
  quoteText: { color: Colors.onSurface, fontSize: 12, fontStyle: 'italic', lineHeight: 18, paddingLeft: 14 },
  quoteAuthor: { color: Colors.onSurfaceVariant, fontSize: 9, fontWeight: '700', letterSpacing: 0.5, paddingLeft: 14 },

  narratorCallNoticeBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#1e2023', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, width: '100%',
  },
  narratorCallIcon: { fontSize: 14 },
  narratorCallText: { color: Colors.onSurfaceVariant, fontSize: 11, flex: 1 },

  simulateWakeBtn: {
    width: '100%', height: 44, borderRadius: 12, backgroundColor: Colors.primaryContainer,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderWidth: 1, borderColor: Colors.primary,
  },
  simulateWakeIcon: { fontSize: 16 },
  simulateWakeText: { color: Colors.onPrimaryContainer, fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },

  // WOKEN STATE STYLES
  subHeaderSection: { paddingHorizontal: 12, paddingTop: 6, paddingBottom: 8 },
  subHeaderCard: {
    backgroundColor: '#1e2023E6', borderRadius: 14, padding: 10,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1, borderColor: '#33353866',
  },
  subHeaderLeft: { gap: 2 },
  nightTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  nightDotPing: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.secondary },
  nightTitle: { color: Colors.onSurface, fontSize: 15, fontWeight: '700', letterSpacing: 0.5 },
  roomCodeBadge: { backgroundColor: '#282a2d', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  roomCodeBadgeText: { color: Colors.primary, fontSize: 10, fontWeight: '700' },

  roleSubRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  roleSubIcon: { fontSize: 12 },
  roleSubLabel: { color: Colors.secondary, fontSize: 11, fontWeight: '700' },

  timerBadgeCapsule: {
    backgroundColor: '#0c0e11E6', paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 4,
    borderWidth: 1, borderColor: '#33353880',
  },
  timerCapsuleIcon: { fontSize: 14 },
  timerCapsuleText: { color: Colors.primary, fontSize: 14, fontWeight: '700' },

  controlBtnsRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  hudControlBtn: {
    width: 32, height: 32, borderRadius: 8, backgroundColor: '#282a2d',
    alignItems: 'center', justifyContent: 'center',
  },

  // OVAL ARENA
  arenaContainer: {
    marginHorizontal: 12, height: 470, alignItems: 'center', justifyContent: 'center',
    position: 'relative', marginVertical: 4,
  },
  ovalBackdropRing: {
    position: 'absolute', top: 10, bottom: 10, left: 16, right: 16,
    borderRadius: 120, backgroundColor: '#0c0e1180',
    borderWidth: 1, borderColor: '#1e2023',
    alignItems: 'center', justifyContent: 'center',
  },
  centerTextContainer: { alignItems: 'center', marginTop: 6 },
  centerTitle: { color: Colors.secondary, fontSize: 12, fontWeight: '700', letterSpacing: 2 },
  centerSubText: { color: `${Colors.onSurfaceVariant}B3`, fontSize: 10, marginTop: 2 },

  // SEATS GRID
  seatsContainer: { width: 380, height: 480, position: 'relative', marginTop: 30 },
  seatBtn: { position: 'absolute', alignItems: 'center', width: 68, height: 82, zIndex: 2 },
  seatAvatarWrap: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#282a2d',
    padding: 2, alignItems: 'center', justifyContent: 'center', position: 'relative',
  },
  seatAvatarWrapYou: {
    width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(92, 63, 0, 0.8)',
    borderWidth: 2, borderColor: '#f1be66',
    shadowColor: '#f1be66', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 10, elevation: 8,
  },
  seatAvatarWrapSelected: {
    width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(114, 212, 238, 0.3)',
    borderWidth: 2, borderColor: '#72d4ee',
    shadowColor: '#72d4ee', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 10, elevation: 8,
  },
  seatAvatarImg: { width: '100%', height: '100%', borderRadius: 22 },

  youTopBadge: {
    position: 'absolute', top: -10, backgroundColor: '#f1be66', paddingHorizontal: 6, paddingVertical: 1, borderRadius: 10,
  },
  youTopBadgeText: { color: '#271900', fontSize: 9, fontWeight: '800' },

  selectedEyeBadge: {
    position: 'absolute', top: -6, right: -4, width: 20, height: 20, borderRadius: 10, backgroundColor: '#72d4ee',
    alignItems: 'center', justifyContent: 'center',
  },
  selectedEyeText: { fontSize: 11 },

  seatIdBadge: {
    position: 'absolute', bottom: -6, paddingHorizontal: 6, paddingVertical: 1, borderRadius: 10,
  },
  seatIdBadgeDefault: { backgroundColor: '#111317' },
  seatIdBadgeYou: { backgroundColor: '#f1be66' },
  seatIdBadgeSelected: { backgroundColor: '#72d4ee' },

  seatIdText: { color: Colors.onSurface, fontSize: 10, fontWeight: '700' },
  seatIdTextActive: { color: '#111317' },

  seatName: { color: Colors.onSurfaceVariant, fontSize: 10, marginTop: 4, textAlign: 'center' },
  seatNameYou: { color: '#f1be66', fontWeight: '700' },
  seatNameSelected: { color: '#72d4ee', fontWeight: '700' },
  seatNameInspected: { color: '#329db6', fontWeight: '800' },
  seatNameDead: { color: '#777777', textDecorationLine: 'line-through' },

  seatAvatarWrapInspected: {
    width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(50, 157, 182, 0.4)',
    borderWidth: 2, borderColor: '#329db6',
    shadowColor: '#329db6', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.9, shadowRadius: 10, elevation: 8,
  },
  seatAvatarWrapDead: {
    borderColor: '#555555', opacity: 0.6,
  },
  deadCenterOverlay: {
    position: 'absolute', width: '100%', height: '100%', borderRadius: 22,
    alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 10,
  },
  inspectedTopBadge: {
    position: 'absolute', top: -16, alignSelf: 'center', backgroundColor: '#1b6375',
    paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10,
    borderWidth: 1, borderColor: '#329db6', zIndex: 20, elevation: 6,
  },
  inspectedTopBadgeText: { color: '#ffffff', fontSize: 9, fontWeight: '800' },
  seatIdBadgeInspected: { backgroundColor: '#329db6' },

  // GM SEAT INSPECTOR CARD STYLES
  gmInspectorContainer: { paddingHorizontal: 12, marginTop: 4, marginBottom: 8 },
  gmInspectorCard: {
    backgroundColor: '#1a1c1fF2', borderRadius: 16, padding: 12, gap: 8,
    borderWidth: 1, borderColor: '#333538',
  },
  gmInspectorHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  gmInspectorHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  gmSeatBadge: { backgroundColor: '#282a2d', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  gmSeatBadgeText: { color: Colors.primary, fontSize: 11, fontWeight: '800' },
  gmPlayerNameText: { color: Colors.onSurface, fontSize: 15, fontWeight: '700' },

  gmFactionPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, borderWidth: 1 },
  gmFactionWolf: { backgroundColor: '#4a0e14', borderColor: '#ff4d4d' },
  gmFactionVillager: { backgroundColor: '#0f343e', borderColor: '#329db6' },
  gmFactionPillText: { color: '#ffffff', fontSize: 10, fontWeight: '800' },

  gmRoleDetailsRow: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#11131766', padding: 8, borderRadius: 10 },
  gmRoleDetailIcon: { fontSize: 20 },
  gmRoleTitleText: { color: Colors.onSurface, fontSize: 12, fontWeight: '700' },
  gmRoleDescText: { color: Colors.onSurfaceVariant, fontSize: 10, marginTop: 1 },

  deadStatusBadge: { backgroundColor: '#3d1217', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, borderWidth: 1, borderColor: '#ff4d4d' },
  deadStatusBadgeText: { color: '#ff4d4d', fontSize: 9, fontWeight: '800' },

  gmEffectsListRow: { gap: 4 },
  gmEffectsLabel: { color: Colors.onSurfaceVariant, fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  effectChipBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, borderWidth: 1,
  },
  effectDot: { width: 6, height: 6, borderRadius: 3 },
  effectChipText: { fontSize: 10, fontWeight: '700' },

  gmNoEffectsRow: { paddingTop: 2 },
  gmNoEffectsText: { color: Colors.onSurfaceVariant, fontSize: 10, fontStyle: 'italic' },

  // ACTION SHEET
  actionSheetContainer: { paddingHorizontal: 12, marginTop: 4 },
  actionSheetCard: {
    backgroundColor: '#1a1c1fF2', borderRadius: 16, padding: 14, gap: 10,
    borderWidth: 1, borderColor: '#333538',
  },
  actionSheetHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  targetStatusLeft: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  targetEyeBox: {
    width: 32, height: 32, borderRadius: 8, backgroundColor: Colors.secondaryContainer,
    alignItems: 'center', justifyContent: 'center',
  },
  targetEyeIcon: { fontSize: 16 },
  targetLabelTitle: { color: Colors.onSurfaceVariant, fontSize: 9, fontWeight: '700', letterSpacing: 0.5 },
  targetNameValue: { color: Colors.secondary, fontSize: 15, fontWeight: '700' },

  privacyShieldBadge: { backgroundColor: '#282a2d', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  privacyShieldText: { color: Colors.onSurfaceVariant, fontSize: 10, fontWeight: '600' },

  confirmCtaBtn: {
    height: 48, borderRadius: 12, backgroundColor: Colors.primaryContainer,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderWidth: 1, borderColor: Colors.primary,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 6,
  },
  confirmCtaIcon: { fontSize: 16 },
  confirmCtaText: { color: Colors.onPrimary, fontSize: 13, fontWeight: '700', letterSpacing: 0.5 },

  // BOTTOM NAV BAR
  bottomNavBar: {
    height: 60, backgroundColor: '#111317F0', borderTopWidth: 1, borderTopColor: '#33353866',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
    paddingHorizontal: 8, zIndex: 10,
  },
  navItem: { alignItems: 'center', justifyContent: 'center', minWidth: 48 },
  navItemIconActive: { fontSize: 18 },
  navItemLabelActive: { color: Colors.primary, fontSize: 10, fontWeight: '700', marginTop: 2 },
  navItemIcon: { fontSize: 18 },
  navItemLabel: { color: Colors.onSurfaceVariant, fontSize: 10, marginTop: 2 },

  navActionElevatedBtn: {
    width: 52, height: 52, borderRadius: 16, backgroundColor: Colors.primaryContainer,
    alignItems: 'center', justifyContent: 'center', marginTop: -20,
    borderWidth: 2, borderColor: Colors.primary,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.6, shadowRadius: 8, elevation: 8,
  },
  navActionIcon: { fontSize: 20 },
  navActionLabel: { color: Colors.onPrimaryContainer, fontSize: 8, fontWeight: '800', marginTop: 1 },

  // MODALS & DRAWERS
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', flexDirection: 'row' },
  sideDrawerContent: { width: 280, backgroundColor: '#111317', borderLeftWidth: 1, borderLeftColor: '#333538' },
  drawerHeader: {
    height: 50, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderBottomWidth: 1, borderBottomColor: '#333538',
  },
  drawerHeaderTitle: { color: Colors.primary, fontSize: 15, fontWeight: '700' },
  drawerHeaderTitleCyan: { color: Colors.secondary, fontSize: 15, fontWeight: '700' },
  closeModalBtn: { padding: 4 },
  closeModalBtnText: { color: Colors.onSurfaceVariant, fontSize: 18 },

  logCard: { backgroundColor: '#1e2023', padding: 10, borderRadius: 8, marginBottom: 8, gap: 4 },
  logTagCyan: { color: Colors.secondary, fontSize: 10, fontWeight: '700' },
  logText: { color: Colors.onSurface, fontSize: 12, lineHeight: 17 },

  whisperContent: { flex: 1, padding: 12 },
  sysMsgBox: { backgroundColor: '#1e2023', padding: 10, borderRadius: 8 },
  sysMsgTitle: { color: Colors.secondary, fontSize: 11, fontWeight: '700' },
  sysMsgText: { color: Colors.onSurfaceVariant, fontSize: 11, marginTop: 2 },

  whisperInputBar: {
    padding: 8, flexDirection: 'row', alignItems: 'center', gap: 6,
    borderTopWidth: 1, borderTopColor: '#333538',
  },
  whisperInput: {
    flex: 1, height: 36, backgroundColor: '#0c0e11', borderRadius: 8,
    paddingHorizontal: 10, color: Colors.onSurface, fontSize: 12,
  },
  whisperSendBtn: {
    width: 36, height: 36, borderRadius: 8, backgroundColor: Colors.secondary,
    alignItems: 'center', justifyContent: 'center',
  },
  whisperSendText: { color: Colors.onSecondary, fontSize: 14, fontWeight: '700' },

  // DIVINATION RESULT OVERLAY
  divinationOverlay: {
    flex: 1, backgroundColor: 'rgba(12, 14, 17, 0.85)',
    alignItems: 'center', justifyContent: 'center', padding: 20,
  },
  divinationCard: {
    width: '100%', maxWidth: 300, backgroundColor: '#1a1c1f', borderRadius: 20,
    padding: 20, alignItems: 'center', gap: 12, borderWidth: 1, borderColor: Colors.secondaryContainer,
  },
  divinationIconCircle: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.secondaryContainer,
    alignItems: 'center', justifyContent: 'center',
  },
  divinationTitleTag: { color: Colors.secondary, fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  divinationTargetTitle: { color: Colors.onSurface, fontSize: 17, fontWeight: '700' },
  divinationDesc: { color: Colors.onSurfaceVariant, fontSize: 12, textAlign: 'center', lineHeight: 18 },

  closeDivinationBtn: {
    width: '100%', height: 42, borderRadius: 10, backgroundColor: '#282a2d',
    alignItems: 'center', justifyContent: 'center', marginTop: 4,
  },
  closeDivinationText: { color: Colors.onSurface, fontSize: 12, fontWeight: '700' },

  // ROLE SCOPE BADGES (HOST VS CLIENT)
  roleScopeBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 14,
    borderWidth: 1,
  },
  roleScopeHost: {
    backgroundColor: 'rgba(255, 179, 0, 0.15)',
    borderColor: '#ffb300',
  },
  roleScopeClient: {
    backgroundColor: '#282a2d',
    borderColor: '#333538',
  },
  roleScopeIcon: { fontSize: 12 },
  roleScopeText: { color: '#ffffff', fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },

  // BLOOD MOON SWITCH IN HEADER
  bloodMoonSwitchBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#282a2d', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 14,
    borderWidth: 1, borderColor: '#333538',
  },
  bloodMoonSwitchBtnActive: {
    backgroundColor: 'rgba(211, 47, 47, 0.25)',
    borderColor: '#d32f2f',
  },
  bloodMoonSwitchIcon: { fontSize: 12 },
  bloodMoonSwitchText: { color: Colors.onSurfaceVariant, fontSize: 10, fontWeight: '700' },
  bloodMoonSwitchTextActive: { color: '#ffb3ae', fontWeight: '800' },

  // BLOOD MOON ACTIVE BANNER
  bloodMoonBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: 'rgba(138, 18, 26, 0.95)',
    paddingHorizontal: 14, paddingVertical: 8,
    borderBottomWidth: 1, borderBottomColor: '#ff4d4d',
  },
  bloodMoonBannerIcon: { fontSize: 18 },
  bloodMoonBannerTitle: { color: '#ffffff', fontSize: 11, fontWeight: '900', letterSpacing: 0.8 },
  bloodMoonBannerSub: { color: 'rgba(255, 255, 255, 0.8)', fontSize: 10 },

  // GOD-VIEW SEAT BADGES (FOR HOST MODE)
  godRoleBadge: {
    position: 'absolute', top: -12, alignSelf: 'center', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8,
    borderWidth: 1, zIndex: 10, elevation: 6, width: 74, alignItems: 'center', justifyContent: 'center',
  },
  godRoleBadgeWolf: { backgroundColor: '#4a0e14', borderColor: '#ff4d4d' },
  godRoleBadgeVillager: { backgroundColor: '#0f343e', borderColor: '#329db6' },
  godRoleText: { color: '#ffffff', fontSize: 9, fontWeight: '800', textAlign: 'center' },

  loverBadge: {
    marginTop: 3, backgroundColor: '#4a1525', paddingHorizontal: 5, paddingVertical: 1.5, borderRadius: 6,
    borderWidth: 1, borderColor: '#e91e63', zIndex: 5, width: 72, alignItems: 'center', justifyContent: 'center',
  },
  loverBadgeText: { color: '#ff80ab', fontSize: 8.5, fontWeight: '800', textAlign: 'center' },

  gmInspectBadge: {
    marginTop: 3, backgroundColor: '#3d2600', paddingHorizontal: 5, paddingVertical: 1.5, borderRadius: 6,
    borderWidth: 1, borderColor: '#ff9800', zIndex: 5, width: 72, alignItems: 'center', justifyContent: 'center',
  },
  gmInspectText: { color: '#ffe0b2', fontSize: 8.5, fontWeight: '800', textAlign: 'center' },

  // CENTER ARENA SPEECH SCRIPT BOX STYLES (QUẢN TRÒ CENTER HUD)
  centerScriptBox: {
    position: 'absolute',
    width: 210, maxHeight: 165, backgroundColor: 'rgba(23, 19, 14, 0.90)',
    borderRadius: 14, borderWidth: 1.5, borderColor: '#f1be66',
    padding: 8, zIndex: 10, gap: 4,
    shadowColor: '#f1be66', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 10, elevation: 8,
  },
  centerScriptHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 4 },
  centerScriptHeaderIcon: { fontSize: 13 },
  centerScriptRoleTitle: { color: '#f1be66', fontSize: 12, fontWeight: '900', flex: 1, letterSpacing: 0.5 },
  centerScriptTurnBadge: { backgroundColor: '#3d2600', paddingHorizontal: 6, paddingVertical: 1, borderRadius: 6, borderWidth: 1, borderColor: '#ff9800' },
  centerScriptTurnText: { color: '#ffe0b2', fontSize: 9, fontWeight: '800' },
  centerScriptDivider: { height: 1, backgroundColor: '#f1be6640', width: '100%' },
  centerScriptScroll: { maxHeight: 130 },
  centerScriptLineRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, marginBottom: 4 },
  centerScriptLineBullet: { color: '#f1be66', fontSize: 9, marginTop: 2 },
  centerScriptLineText: { color: '#ffffff', fontSize: 11, fontWeight: '600', lineHeight: 16, flex: 1, fontStyle: 'italic' },

  // GM CONTROLLER BAR
  gmWakeSeatBtn: {
    marginTop: 6, height: 36, borderRadius: 10, backgroundColor: '#3d2600',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    borderWidth: 1, borderColor: '#ff9800',
  },
  gmWakeSeatIcon: { fontSize: 14 },
  gmWakeSeatText: { color: '#ffe0b2', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },

  gmControllerContainer: {
    backgroundColor: '#111317F8', borderTopWidth: 1, borderTopColor: '#333538',
    padding: 10, gap: 8, zIndex: 20,
  },
  gmPrimaryActionRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  gmWakeCallBtn: {
    flex: 1, height: 48, borderRadius: 12, backgroundColor: '#3d2600',
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, gap: 8,
    borderWidth: 1.5, borderColor: '#ff9800',
    shadowColor: '#ff9800', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.4, shadowRadius: 6, elevation: 6,
  },
  gmWakeCallIcon: { fontSize: 18 },
  gmWakeCallText: { color: '#ffe0b2', fontSize: 11, fontWeight: '900', letterSpacing: 0.5 },
  gmWakeCallSub: { color: '#f1be66B3', fontSize: 8.5, fontWeight: '600' },

  gmCallNextBtn: {
    flex: 1, height: 48, borderRadius: 12, backgroundColor: '#ff9800',
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, gap: 6,
    shadowColor: '#ff9800', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.4, shadowRadius: 6, elevation: 6,
  },
  gmCallNextIcon: { fontSize: 16 },
  gmCallNextText: { color: '#1a0e00', fontSize: 11, fontWeight: '900', letterSpacing: 0.5 },
  gmCallNextSub: { color: '#4d2b00', fontSize: 8.5, fontWeight: '600' },
  gmCallNextArrow: { color: '#1a0e00', fontSize: 12, fontWeight: '900' },

  gmAuxGrid: { flexDirection: 'row', gap: 6 },
  gmAuxBtn: {
    flex: 1, height: 38, borderRadius: 8, backgroundColor: '#1e2023',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4,
    borderWidth: 1, borderColor: '#333538',
  },
  gmAuxBtnBloodMoon: {
    backgroundColor: 'rgba(138, 18, 26, 0.4)',
    borderColor: '#ff4d4d',
  },
  gmAuxIcon: { fontSize: 12 },
  gmAuxText: { color: Colors.onSurface, fontSize: 10, fontWeight: '700' },

  // CUSTOM WAKE CALL MODAL STYLES
  wakeCallModalCard: {
    width: '100%', maxWidth: 310, backgroundColor: '#1b1712F8', borderRadius: 20,
    padding: 22, alignItems: 'center', gap: 12,
    borderWidth: 1.5, borderColor: '#f1be66',
    shadowColor: '#f1be66', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 16, elevation: 12,
  },
  wakeCallIconCircle: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(241, 190, 102, 0.15)',
    alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#f1be66',
  },
  wakeCallModalTitle: { color: '#f1be66', fontSize: 15, fontWeight: '900', letterSpacing: 0.8, textAlign: 'center' },
  wakeCallModalDesc: { color: Colors.onSurface, fontSize: 13, textAlign: 'center', lineHeight: 20 },
  closeWakeCallBtn: {
    width: '100%', height: 44, borderRadius: 12, backgroundColor: '#ff9800',
    alignItems: 'center', justifyContent: 'center', marginTop: 4,
    shadowColor: '#ff9800', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.4, shadowRadius: 6, elevation: 6,
  },
  closeWakeCallText: { color: '#1a0e00', fontSize: 12, fontWeight: '900', letterSpacing: 0.5 },
});
