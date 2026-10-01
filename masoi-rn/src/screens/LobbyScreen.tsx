import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Image,
  Modal,
  Alert,
} from 'react-native';
import { Colors, Spacing, FontSizes, BorderRadius } from '../theme/colors';
import { SEAT_AVATAR_IMAGES } from '../theme/images';
import { CardSet } from '../engine/stepCallSchema';
import { mockServer } from '../engine/mockStepCallServer';
import { bgmPlayer } from '../utils/bgmPlayer';

export interface PlayerInfo {
  seat: string;
  name: string;
  level: number;
  ready: boolean;
  mic: boolean;
  isHost: boolean;
  isYou?: boolean;
}

const INITIAL_PLAYERS: PlayerInfo[] = [
  { seat: 'I', name: 'HuânTướcBóngĐêm', level: 28, ready: true, mic: true, isHost: true },
  { seat: 'II', name: 'BảoKê', level: 19, ready: true, mic: true, isHost: false },
  { seat: 'III', name: 'ThuốcNam', level: 22, ready: true, mic: false, isHost: false },
  { seat: 'IV', name: 'ThợSănBạc', level: 31, ready: true, mic: true, isHost: false },
  { seat: 'V', name: 'KẻMộngDu', level: 16, ready: true, mic: false, isHost: false },
  { seat: 'VI', name: 'ThầnĐạo', level: 25, ready: true, mic: false, isHost: false },
  { seat: 'VII', name: 'Hiệp Sĩ Đêm', level: 14, ready: true, mic: true, isHost: false, isYou: true },
  { seat: 'VIII', name: 'HiệpSĩ', level: 21, ready: false, mic: false, isHost: false },
];

const ALL_SEATS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

export interface RoleConfig {
  id: string;
  name: string;
  faction: 'WEREWOLF' | 'GOD' | 'VILLAGER' | 'NEUTRAL';
  factionLabel: string;
  icon: string;
  count: number;
  isBanned: boolean;
  desc: string;
}

// Default roles list: DEFAULT TO 0 PICKED ROLES AS REQUESTED
const INITIAL_ROLES_CATALOG: RoleConfig[] = [
  { id: 'wolf_normal', name: 'Ma Sói Thường', faction: 'WEREWOLF', factionLabel: 'Phe Sói', icon: '🐺', count: 0, isBanned: false, desc: 'Cắn 1 dân làng mỗi đêm cùng bầy sói' },
  { id: 'wolf_ice', name: 'Sói Băng', faction: 'WEREWOLF', factionLabel: 'Phe Sói', icon: '❄️', count: 0, isBanned: false, desc: 'Đóng băng kỹ năng mục tiêu 1 đêm' },
  { id: 'wolf_fire', name: 'Sói Lửa', faction: 'WEREWOLF', factionLabel: 'Phe Sói', icon: '🔥', count: 0, isBanned: false, desc: 'X2 sát thương cắn trong Đêm Trăng Máu' },
  { id: 'seer', name: 'Tiên Tri', faction: 'GOD', factionLabel: 'Phe Thần', icon: '👁️', count: 0, isBanned: false, desc: 'Soi bản ngã Dân hay Sói mỗi đêm' },
  { id: 'guard', name: 'Bảo Vệ', faction: 'GOD', factionLabel: 'Phe Thần', icon: '🛡️', count: 0, isBanned: false, desc: 'Bảo vệ 1 mục tiêu khỏi vết cắn ma sói' },
  { id: 'witch', name: 'Phù Thủy', faction: 'GOD', factionLabel: 'Phe Thần', icon: '🧪', count: 0, isBanned: false, desc: 'Sở hữu 1 bình Thuốc Cứu và 1 Thuốc Độc' },
  { id: 'hunter', name: 'Thợ Săn', faction: 'GOD', factionLabel: 'Phe Thần', icon: '🏹', count: 0, isBanned: false, desc: 'Kéo 1 người chết cùng khi hy sinh' },
  { id: 'elder', name: 'Già Làng', faction: 'GOD', factionLabel: 'Phe Thần', icon: '👴', count: 0, isBanned: false, desc: 'Chịu được 2 lần cắn của ma sói' },
  { id: 'cupid', name: 'Cupid', faction: 'GOD', factionLabel: 'Phe Thần', icon: '💘', count: 0, isBanned: false, desc: 'Ghép 2 người chơi thành cặp Tình Nhân' },
  { id: 'villager', name: 'Dân Làng', faction: 'VILLAGER', factionLabel: 'Dân Làng', icon: '🧑', count: 0, isBanned: false, desc: 'Bỏ phiếu treo cổ ma sói ban ngày' },
  { id: 'killer', name: 'Sát Thủ', faction: 'NEUTRAL', factionLabel: 'Trung Lập', icon: '🔪', count: 0, isBanned: false, desc: 'Thủ tiêu mục tiêu độc lập mỗi đêm' },
];

export default function LobbyScreen({ onNavigate }: { onNavigate?: (screen: string) => void }) {
  const [playersList, setPlayersList] = useState<PlayerInfo[]>(INITIAL_PLAYERS);
  useEffect(() => {
    bgmPlayer.startDashboardBGM(0.5);
    return () => {
      bgmPlayer.stopBGM();
    };
  }, []);
  const [micOn, setMicOn] = useState(true);
  const [scenarioExpanded, setScenarioExpanded] = useState(true);
  
  // Role scope permission switch (Host vs Player testing)
  const [isHostUser, setIsHostUser] = useState(true); // Default Room Creator / Host

  // Custom Ban & Pick Roles State
  const [rolesCatalog, setRolesCatalog] = useState<RoleConfig[]>(INITIAL_ROLES_CATALOG);
  const [showBanPickModal, setShowBanPickModal] = useState(false);
  const [filterFaction, setFilterFaction] = useState<'ALL' | 'WEREWOLF' | 'GOD' | 'VILLAGER' | 'NEUTRAL'>('ALL');

  // Game Master (Bầu Quản Trò) State
  const [gmSeat, setGmSeat] = useState<string>('I'); // Default Host (HuânTướcBóngĐêm) is GM
  const [showGmVoteModal, setShowGmVoteModal] = useState(false);
  const [gmVotes, setGmVotes] = useState<{ [seat: string]: number }>({ I: 4, II: 2, VII: 1 });
  const [myVoteSeat, setMyVoteSeat] = useState<string | null>('I');

  // Dynamic Room Seats Calculations
  const occupiedSeats = playersList.map((p) => p.seat);
  const emptySeatsList = ALL_SEATS.filter((s) => !occupiedSeats.includes(s));
  const totalRoomMembers = playersList.length; // Members currently in room
  const activePlayersCount = Math.max(1, totalRoomMembers - 1); // Playing members (excluding 1 GM)
  const totalPickedCards = rolesCatalog.reduce((sum, r) => sum + r.count, 0);
  const totalBannedRoles = rolesCatalog.filter((r) => r.isBanned).length;

  const currentGmPlayer = playersList.find((p) => p.seat === gmSeat) || playersList[0];

  // Role Pick Count Handlers
  const handleUpdateRoleCount = (id: string, delta: number) => {
    if (!isHostUser) return;
    setRolesCatalog((prev) =>
      prev.map((role) => {
        if (role.id === id) {
          if (role.isBanned) return role;
          const newCount = Math.max(0, role.count + delta);
          return { ...role, count: newCount };
        }
        return role;
      })
    );
  };

  const handleToggleBan = (id: string) => {
    if (!isHostUser) return;
    setRolesCatalog((prev) =>
      prev.map((role) => {
        if (role.id === id) {
          const nextBan = !role.isBanned;
          return { ...role, isBanned: nextBan, count: nextBan ? 0 : role.count };
        }
        return role;
      })
    );
  };

  // Preset Handlers
  const handleResetZero = () => {
    if (!isHostUser) return;
    setRolesCatalog((prev) => prev.map((r) => ({ ...r, count: 0, isBanned: false })));
  };

  const handleApplyPreset8 = () => {
    if (!isHostUser) return;
    setRolesCatalog((prev) =>
      prev.map((r) => {
        if (r.id === 'wolf_normal') return { ...r, count: 2, isBanned: false };
        if (r.id === 'seer') return { ...r, count: 1, isBanned: false };
        if (r.id === 'guard') return { ...r, count: 1, isBanned: false };
        if (r.id === 'villager') return { ...r, count: activePlayersCount === 7 ? 3 : 4, isBanned: false };
        return { ...r, count: 0, isBanned: false };
      })
    );
  };

  const handleApplyPreset12 = () => {
    if (!isHostUser) return;
    setRolesCatalog((prev) =>
      prev.map((r) => {
        if (r.id === 'wolf_normal') return { ...r, count: 3, isBanned: false };
        if (r.id === 'seer') return { ...r, count: 1, isBanned: false };
        if (r.id === 'guard') return { ...r, count: 1, isBanned: false };
        if (r.id === 'witch') return { ...r, count: 1, isBanned: false };
        if (r.id === 'hunter') return { ...r, count: 1, isBanned: false };
        if (r.id === 'villager') return { ...r, count: 5, isBanned: false };
        return { ...r, count: 0, isBanned: false };
      })
    );
  };

  // Kick Player Handler (ONLY Host can kick non-host players)
  const handleKickPlayer = (player: PlayerInfo) => {
    if (!isHostUser) {
      Alert.alert('Không Có Quyền', 'Chỉ Chủ Phòng mới có quyền đuổi người chơi ra khỏi phòng!');
      return;
    }
    if (player.isHost) {
      Alert.alert('Không Thể Đuổi', 'Chủ Phòng không thể tự đuổi chính mình!');
      return;
    }

    Alert.alert(
      '🚫 Xác Nhận Đuổi Người Chơi',
      `Bạn có chắc chắn muốn đuổi [${player.name}] (Ghế ${player.seat}) ra khỏi phòng?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đuổi Ngay',
          style: 'destructive',
          onPress: () => {
            setPlayersList((prev) => prev.filter((p) => p.seat !== player.seat));
            if (gmSeat === player.seat) {
              setGmSeat('I'); // Reset GM to Host if kicked player was GM
            }
            Alert.alert('Thành Công', `Đã đuổi [${player.name}] ra khỏi phòng.`);
          },
        },
      ]
    );
  };

  // Open Ban/Pick Modal with Host permission check
  const handleOpenBanPickModal = () => {
    if (!isHostUser) {
      Alert.alert('Quyền Chủ Phòng', 'Chỉ Chủ Phòng mới có quyền cấu hình chọn & cấm (ban) vai trò cho ván đấu!');
      return;
    }
    setShowBanPickModal(true);
  };

  // Voting for GM
  const handleVoteGm = (seat: string) => {
    setGmVotes((prev) => {
      const next = { ...prev };
      if (myVoteSeat && next[myVoteSeat]) {
        next[myVoteSeat] = Math.max(0, next[myVoteSeat] - 1);
      }
      next[seat] = (next[seat] || 0) + 1;
      return next;
    });
    setMyVoteSeat(seat);
  };

  const handleAssignGmDirect = (seat: string) => {
    if (!isHostUser) {
      Alert.alert('Quyền Chủ Phòng', 'Chỉ Chủ Phòng mới có quyền chỉ định Quản Trò trực tiếp!');
      return;
    }
    setGmSeat(seat);
    setShowGmVoteModal(false);
    const p = playersList.find((item) => item.seat === seat);
    Alert.alert('Chỉ Định Quản Trò', `Đã phân công [${p?.name || seat}] làm QUẢN TRÒ (GAME MASTER) cho ván đấu!`);
  };

  // Start Game Validation
  const handleStartGame = () => {
    if (!isHostUser) {
      Alert.alert('Quyền Chủ Phòng', 'Chỉ Chủ Phòng mới có quyền bấm Bắt Đầu Vào Trận!');
      return;
    }

    if (totalPickedCards === 0) {
      Alert.alert(
        'Vui Lòng Chọn Nhân Vật',
        `Mặc định chưa chọn lá bài nào.\nPhòng có ${totalRoomMembers} thành viên (1 Quản trò + ${activePlayersCount} người chơi).\nBạn cần chọn đúng ${activePlayersCount} lá bài cho ${activePlayersCount} người chơi!`
      );
      setShowBanPickModal(true);
      return;
    }

    if (totalPickedCards !== activePlayersCount) {
      Alert.alert(
        'Số Lượng Không Khớp',
        `Phòng có ${totalRoomMembers} thành viên (1 Quản trò + ${activePlayersCount} người chơi).\nTổng số lá bài đã chọn (${totalPickedCards}) phải bằng số người chơi (${activePlayersCount}).\n\nHãy điều chỉnh lại số lượng lá bài!`
      );
      setShowBanPickModal(true);
      return;
    }

    if (onNavigate) {
      if (isHostUser) {
        // QUẢN TRÒ: Bỏ qua màn xem lá bài bí mật (RoleReveal), đi thẳng vào NightPhaseScreen!
        onNavigate('NightPhase');
      } else {
        // NGƯỜI CHƠI THƯỜNG (Client): Mở màn hình lật bài nhận vai
        onNavigate('RoleReveal');
      }
    }
  };

  const filteredRoles = rolesCatalog.filter((r) => filterFaction === 'ALL' || r.faction === filterFaction);

  const wolvesCount = rolesCatalog.filter((r) => r.faction === 'WEREWOLF').reduce((a, b) => a + b.count, 0);
  const godsCount = rolesCatalog.filter((r) => r.faction === 'GOD').reduce((a, b) => a + b.count, 0);
  const villagersCount = rolesCatalog.filter((r) => r.faction === 'VILLAGER').reduce((a, b) => a + b.count, 0);
  const neutralCount = rolesCatalog.filter((r) => r.faction === 'NEUTRAL').reduce((a, b) => a + b.count, 0);

  return (
    <View style={styles.rootContainer}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Gothic Blood Moon Forest Background Image (Full Edge-to-Edge) */}
      <Image
        source={require('../../assets/screen.png')}
        style={StyleSheet.absoluteFill}
        resizeMode="stretch"
      />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(10, 12, 16, 0.50)' }]} pointerEvents="none" />

      <SafeAreaView style={styles.safeArea}>

      {/* TOP HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => onNavigate && onNavigate('Home')} style={styles.backBtn}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.headerLabel}>Ritual Assembly</Text>
            <Text style={styles.headerTitle}>Lobby Gathering</Text>
          </View>
        </View>

        {/* ROLE SCOPE SWITCHER (HOST PERMISSION TOGGLE FOR TESTING) */}
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={[styles.hostPermissionToggle, isHostUser ? styles.hostPermissionOn : styles.hostPermissionOff]}
            onPress={() => setIsHostUser(!isHostUser)}
            activeOpacity={0.8}
          >
            <Text style={styles.hostPermissionIcon}>{isHostUser ? '👑' : '👤'}</Text>
            <Text style={styles.hostPermissionText}>{isHostUser ? 'CHỦ PHÒNG' : 'THÀNH VIÊN'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.headerMicBtn, micOn && styles.headerMicBtnActive]}
            onPress={() => setMicOn(!micOn)}
          >
            <Text style={styles.headerMicIcon}>{micOn ? '🎙' : '🔇'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* ROOM INFO HEADER */}
        <View style={styles.roomInfoSection}>
          <View style={styles.roomInfoRow}>
            <View>
              <View style={styles.roomBadgeRow}>
                <View style={styles.roomCodeBadge}>
                  <Text style={styles.roomCodeText}>#8921</Text>
                </View>
                <View style={styles.pingBadge}>
                  <View style={styles.pingDot} />
                  <Text style={styles.pingText}>24ms</Text>
                </View>
              </View>
              <Text style={styles.roomName}>SÓI TRĂNG MÁU ĐI ĐÊM</Text>
            </View>
            <View style={styles.roomActions}>
              <TouchableOpacity style={styles.copyBtn}>
                <Text style={styles.copyIcon}>📋</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.qrBtn}>
                <Text style={styles.qrIcon}>📷</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.roomMeta}>
            <TouchableOpacity
              style={[styles.metaPill, { backgroundColor: '#381619', borderWidth: 1, borderColor: '#8a121a' }]}
              onPress={() => onNavigate && onNavigate('BloodMoonModifiers')}
            >
              <Text style={[styles.metaPillText, { color: Colors.primary, fontWeight: '800' }]}>🌕 TRĂNG MÁU HOST</Text>
            </TouchableOpacity>
            <View style={styles.metaPill}>
              <Text style={styles.metaPillText}>🔥 Chủ Phòng: HuânTướcBóngĐêm</Text>
            </View>
            <View style={[styles.metaPill, { backgroundColor: Colors.surfaceContainer }]}>
              <Text style={styles.metaPillText2}>📣 Mic Tự Do</Text>
            </View>
            <View style={[styles.metaPill, { backgroundColor: Colors.surfaceContainer }]}>
              <Text style={styles.metaPillText2}>🌙 60s Đêm / 90s Ngày</Text>
            </View>
          </View>
        </View>

        {/* SECTION: GAME MASTER (BẦU QUẢN TRÒ) */}
        <View style={styles.gmBannerCard}>
          <View style={styles.gmBannerLeft}>
            <View style={styles.gmBadgeCircle}>
              <Text style={{ fontSize: 22 }}>👑</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.gmBannerTitle}>QUẢN TRÒ</Text>
                <View style={styles.gmActiveTag}>
                  <Text style={styles.gmActiveTagText}>ĐIỀU HÀNH</Text>
                </View>
              </View>
              <Text style={styles.gmNameText}>{currentGmPlayer.name}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.gmVoteBtn} onPress={() => setShowGmVoteModal(true)}>
            <Text style={styles.gmVoteBtnText}>{isHostUser ? 'Cài Đặt Quản Trò 👑' : 'Bầu Quản Trò 🗳️'}</Text>
          </TouchableOpacity>
        </View>

        {/* CARD SET SELECTION & BAN/PICK CUSTOMIZER UI */}
        <View style={styles.scenarioCard}>
          <View style={styles.scenarioHeaderRow}>
            <View style={styles.scenarioLeftBox}>
              <View style={styles.scenarioIcon}>
                <Text style={{ fontSize: 20 }}>🎴</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.scenarioName}>Bộ Bài & Ban/Pick Vai Trò</Text>
                <Text style={styles.scenarioDesc} numberOfLines={1}>
                  {isHostUser ? 'Tùy chỉnh chọn nhân vật & cấm vai trò (Quyền Chủ Phòng)' : 'Danh sách lá bài đã chọn cho ván đấu'}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.scenarioDetailBtn}
              onPress={() => setScenarioExpanded(!scenarioExpanded)}
              activeOpacity={0.8}
            >
              <Text style={styles.scenarioDetailText}>Tùy chỉnh {scenarioExpanded ? '▲' : '▼'}</Text>
            </TouchableOpacity>
          </View>

          {/* STATUS BADGE SUB ROW */}
          <View style={styles.statusBadgeSubRow}>
            <View style={[
              styles.scenarioBadge,
              totalPickedCards === activePlayersCount ? styles.badgeGreen : totalPickedCards === 0 ? styles.badgeRed : styles.badgeYellow
            ]}>
              <Text style={styles.scenarioBadgeText}>
                {totalPickedCards === 0 ? `⚠️ Mặc định: 0/${activePlayersCount} lá bài` : `🎴 Đã chọn: ${totalPickedCards}/${activePlayersCount} lá bài người chơi (1 Quản trò)`}
              </Text>
            </View>
          </View>

          {scenarioExpanded && (
            <View style={styles.cardSetSelectorBox}>
              <View style={styles.banPickTriggerRow}>
                <TouchableOpacity
                  style={[styles.openBanPickModalBtn, !isHostUser && styles.openBanPickModalBtnDisabled]}
                  onPress={handleOpenBanPickModal}
                >
                  <Text style={styles.openBanPickModalText}>
                    {isHostUser ? 'Ban pick vai trò ⚙️' : '🚫 Ban pick (Chỉ Chủ Phòng)'}
                  </Text>
                  <Text style={styles.openBanPickModalBadge}>
                    {isHostUser ? (totalBannedRoles > 0 ? `Đã cấm ${totalBannedRoles}` : 'Mở bảng chọn') : '🔒 Xem vai trò'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.deckBreakdown}>
                <View style={styles.deckItem}>
                  <Text style={[styles.deckCount, { color: Colors.primary }]}>{wolvesCount}</Text>
                  <Text style={styles.deckLabel}>Phe Sói</Text>
                </View>
                <View style={styles.deckItem}>
                  <Text style={[styles.deckCount, { color: Colors.secondary }]}>{godsCount}</Text>
                  <Text style={styles.deckLabel}>Thần Thánh</Text>
                </View>
                <View style={styles.deckItem}>
                  <Text style={[styles.deckCount, { color: Colors.onSurface }]}>{villagersCount}</Text>
                  <Text style={styles.deckLabel}>Dân Làng</Text>
                </View>
                <View style={styles.deckItem}>
                  <Text style={[styles.deckCount, { color: Colors.tertiary }]}>{neutralCount}</Text>
                  <Text style={styles.deckLabel}>Trung Lập</Text>
                </View>
              </View>

              {/* SELECTED ROLES SUMMARY CHIPS */}
              <View style={styles.selectedRolesSummaryBox}>
                <Text style={styles.selectedSummaryTitle}>LÁ BÀI ĐÃ CHỌN THAM GIA ({totalPickedCards}/${activePlayersCount} người chơi + 1 Quản trò):</Text>
                <View style={styles.summaryChipsContainer}>
                  {totalPickedCards === 0 ? (
                    <Text style={styles.emptySummaryText}>Chưa chọn vai trò nào. Hãy nhờ Chủ Phòng cài đặt vai trò.</Text>
                  ) : (
                    rolesCatalog.filter(r => r.count > 0).map(r => (
                      <View key={r.id} style={styles.summaryChipPill}>
                        <Text style={styles.summaryChipIcon}>{r.icon}</Text>
                        <Text style={styles.summaryChipName}>{r.name}</Text>
                        <Text style={styles.summaryChipCount}>x{r.count}</Text>
                      </View>
                    ))
                  )}
                </View>
              </View>
            </View>
          )}
        </View>

        {/* PLAYER LIST (HIỆP ƯỚC LINH HỒN & ĐUỔI NGƯỜI CHƠI) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionLeft}>
              <Text style={styles.sectionIcon}>👥</Text>
              <Text style={styles.sectionTitle}>HIỆP ƯỚC LINH HỒN</Text>
              <Text style={styles.sectionCount}>({totalRoomMembers}/12)</Text>
            </View>
            <View style={styles.readyBadge}>
              <Text style={styles.readyBadgeText}>🛡️ Đã Sẵn Sàng: 7/{totalRoomMembers}</Text>
            </View>
          </View>

          <View style={styles.playerGrid}>
            {playersList.map((player) => {
              const isGm = player.seat === gmSeat;
              return (
                <View
                  key={player.seat}
                  style={[
                    styles.playerCard,
                    player.isYou && styles.playerCardYou,
                    isGm && styles.playerCardGm,
                    !player.ready && styles.playerCardNotReady,
                  ]}
                >
                  {player.isYou && <View style={styles.youIndicator} />}
                  <View style={styles.playerCardTop}>
                    <View style={styles.seatBadge}>
                      <Text style={styles.seatText}>{player.seat}</Text>
                    </View>

                    {isGm ? (
                      <View style={styles.gmCrownBadge}>
                        <Text style={styles.gmCrownText}>👑 QUẢN TRÒ</Text>
                      </View>
                    ) : player.isHost ? (
                      <Text style={styles.hostStar}>🔥 CHỦ PHÒNG</Text>
                    ) : null}

                    {/* KICK BUTTON FOR ROOM HOST */}
                    {isHostUser && !player.isHost && (
                      <TouchableOpacity
                        style={styles.kickPlayerBtn}
                        onPress={() => handleKickPlayer(player)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.kickPlayerText}>🚫 Đuổi</Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  <View style={styles.playerMid}>
                    <View style={styles.playerAvatar}>
                      <Image
                        source={{ uri: SEAT_AVATAR_IMAGES[player.seat] || SEAT_AVATAR_IMAGES.I }}
                        style={styles.playerAvatarImg}
                        resizeMode="cover"
                      />
                      <View style={[styles.levelChip, player.isYou && styles.levelChipYou]}>
                        <Text style={styles.levelChipText}>{player.level}</Text>
                      </View>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.playerName, player.isYou && styles.playerNameYou]} numberOfLines={1}>
                        {player.name}
                      </Text>
                      {player.isHost && <Text style={styles.hostLabel}>CHỦ PHÒNG</Text>}
                    </View>
                  </View>

                  <View style={[styles.readyStatus, player.ready ? styles.readyStatusOn : styles.readyStatusOff]}>
                    <Text style={styles.readyStatusText}>
                      {player.ready ? '✓ SẴN SÀNG' : '⌛ ĐANG CHỜ...'}
                    </Text>
                  </View>
                </View>
              );
            })}

            {emptySeatsList.map((seat) => (
              <TouchableOpacity key={seat} style={styles.emptySeat}>
                <View style={styles.emptySeatIcon}>
                  <Text style={styles.emptySeatIconText}>👤+</Text>
                </View>
                <Text style={styles.emptySeatLabel}>Ghế {seat}</Text>
                <Text style={styles.emptySeatSubtitle}>+ Mời Bạn Bè</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* CHAT PREVIEW */}
        <View style={styles.chatPreview}>
          <Text style={styles.chatIcon}>💬</Text>
          <View style={styles.chatContent}>
            <Text style={styles.chatSender}>ThợSănBạc: </Text>
            <Text style={styles.chatMsg} numberOfLines={1}>Trận này nhớ cắn nhẹ tay nhé anh em...</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.chatOpenBtn}>Mở ›</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* BOTTOM DOCK */}
      <View style={styles.bottomDock}>
        <TouchableOpacity style={styles.leaveBtn} onPress={() => onNavigate && onNavigate('Home')}>
          <Text style={styles.leaveBtnIcon}>🚪</Text>
          <Text style={styles.leaveBtnText}>RỜI</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.dockMicBtn, !micOn && styles.dockMicBtnOff]}
          onPress={() => setMicOn(!micOn)}
        >
          <Text style={styles.dockMicIcon}>{micOn ? '🎙' : '🔇'}</Text>
          <Text style={styles.dockMicText}>MIC</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.masterActionBtn,
            (!isHostUser || totalPickedCards !== activePlayersCount) && styles.masterActionBtnWarning,
          ]}
          onPress={handleStartGame}
        >
          <Text style={styles.masterActionIcon}>🔮</Text>
          <Text style={styles.masterActionText}>
            {isHostUser
              ? totalPickedCards === activePlayersCount
                ? 'BẮT ĐẦU VÀO TRẬN'
                : `CHỌN LÁ BÀI (${totalPickedCards}/${activePlayersCount})`
              : 'CHỜ CHỦ PHÒNG BẮT ĐẦU'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ==================== MODAL 1: BAN & PICK NHÂN VẬT (ONLY HOST CAN EDIT) ==================== */}
      <Modal visible={showBanPickModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.banPickModalCard}>
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalTitle}>🚫⚡ TÙY CHỈNH BAN & PICK VAI TRÒ</Text>
                <Text style={styles.modalSubTitle}>
                  {isHostUser
                    ? `Mặc định chọn 0. Hãy pick đúng ${activePlayersCount} lá bài cho ${activePlayersCount} người chơi (trừ 1 Quản trò).`
                    : 'Chế độ xem vai trò (Chỉ Chủ Phòng có quyền thay đổi)'}
                </Text>
              </View>
              <TouchableOpacity style={styles.closeModalBtn} onPress={() => setShowBanPickModal(false)}>
                <Text style={styles.closeModalText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* STATUS SUMMARY BAR */}
            <View style={[
              styles.modalStatusBar,
              totalPickedCards === activePlayersCount ? styles.matchBarSuccess : totalPickedCards === 0 ? styles.matchBarEmpty : styles.matchBarWarning
            ]}>
              <Text style={styles.modalStatusText}>
                {totalPickedCards === activePlayersCount
                  ? `✅ CHUẨN XÁC: ĐÃ CHỌN ${totalPickedCards}/${activePlayersCount} LÁ BÀI CHO ${activePlayersCount} NGƯỜI CHƠI!`
                  : `⚠️ ĐÃ CHỌN ${totalPickedCards}/${activePlayersCount} LÁ BÀI (${totalPickedCards < activePlayersCount ? `CẦN THÊM ${activePlayersCount - totalPickedCards}` : `DƯ ${totalPickedCards - activePlayersCount}`})`}
              </Text>

              {isHostUser && (
                <View style={styles.presetQuickRow}>
                  <TouchableOpacity style={styles.presetChipBtn} onPress={handleResetZero}>
                    <Text style={styles.presetChipText}>🔄 Reset 0</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.presetChipBtnGold} onPress={handleApplyPreset8}>
                    <Text style={styles.presetChipTextDark}>⚡ Preset {activePlayersCount} Bài</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.presetChipBtnCyan} onPress={handleApplyPreset12}>
                    <Text style={styles.presetChipTextDark}>🌕 Preset 12 Bài</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* FACTION FILTER TABS */}
            <View style={styles.filterTabsRow}>
              {[
                { id: 'ALL', label: 'Tất Cả' },
                { id: 'WEREWOLF', label: 'Phe Sói 🐺' },
                { id: 'GOD', label: 'Phe Thần 👁️' },
                { id: 'VILLAGER', label: 'Dân Làng 🧑' },
                { id: 'NEUTRAL', label: 'Trung Lập 🔪' },
              ].map((tab) => (
                <TouchableOpacity
                  key={tab.id}
                  style={[styles.filterTab, filterFaction === tab.id && styles.filterTabActive]}
                  onPress={() => setFilterFaction(tab.id as any)}
                >
                  <Text style={[styles.filterTabText, filterFaction === tab.id && styles.filterTabTextActive]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* ROLES CATALOG LIST */}
            <ScrollView style={styles.rolesListScroll} showsVerticalScrollIndicator={false}>
              {filteredRoles.map((role) => (
                <View
                  key={role.id}
                  style={[
                    styles.roleRowCard,
                    role.isBanned && styles.roleRowCardBanned,
                    role.count > 0 && styles.roleRowCardPicked,
                  ]}
                >
                  <View style={styles.roleIconWrap}>
                    <Text style={{ fontSize: 24 }}>{role.icon}</Text>
                  </View>

                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={styles.roleNameText}>{role.name}</Text>
                      <View style={[
                        styles.roleFactionBadge,
                        role.faction === 'WEREWOLF' ? styles.bgWolf : role.faction === 'GOD' ? styles.bgGod : role.faction === 'VILLAGER' ? styles.bgVillager : styles.bgNeutral
                      ]}>
                        <Text style={styles.roleFactionText}>{role.factionLabel}</Text>
                      </View>
                      {role.isBanned && (
                        <View style={styles.bannedTag}>
                          <Text style={styles.bannedTagText}>🚫 ĐÃ CẤM (BAN)</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.roleDescText}>{role.desc}</Text>
                  </View>

                  {/* CONTROLS: BAN TOGGLE & QUANTITY COUNTER (ONLY FOR HOST) */}
                  {isHostUser ? (
                    <View style={styles.roleRowRightControls}>
                      <TouchableOpacity
                        style={[styles.banToggleBtn, role.isBanned && styles.banToggleBtnActive]}
                        onPress={() => handleToggleBan(role.id)}
                      >
                        <Text style={[styles.banToggleText, role.isBanned && { color: '#ff4d4d' }]}>
                          {role.isBanned ? '🚫 BAN' : ' CẤM'}
                        </Text>
                      </TouchableOpacity>

                      {!role.isBanned && (
                        <View style={styles.counterWrap}>
                          <TouchableOpacity
                            style={styles.counterBtn}
                            onPress={() => handleUpdateRoleCount(role.id, -1)}
                          >
                            <Text style={styles.counterBtnText}>-</Text>
                          </TouchableOpacity>

                          <Text style={[styles.counterValue, role.count > 0 && styles.counterValueActive]}>
                            {role.count}
                          </Text>

                          <TouchableOpacity
                            style={styles.counterBtnAdd}
                            onPress={() => handleUpdateRoleCount(role.id, 1)}
                          >
                            <Text style={styles.counterBtnAddText}>+</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  ) : (
                    <View style={{ paddingHorizontal: 8 }}>
                      <Text style={{ color: role.count > 0 ? Colors.secondary : Colors.onSurfaceVariant, fontWeight: '700', fontSize: 13 }}>
                        x{role.count}
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity style={styles.saveBanPickBtn} onPress={() => setShowBanPickModal(false)}>
              <Text style={styles.saveBanPickText}>XÁC NHẬN CHỌN VAI TRÒ ({totalPickedCards}/{activePlayersCount})</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ==================== MODAL 2: BẦU QUẢN TRÒ (GAME MASTER) ==================== */}
      <Modal visible={showGmVoteModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.gmVoteModalCard}>
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalTitle}>👑 BẦU QUẢN TRÒ (GAME MASTER)</Text>
                <Text style={styles.modalSubTitle}>
                  {isHostUser ? 'Chủ phòng có quyền chỉ định Quản Trò hoặc mở bình chọn.' : 'Bỏ phiếu bình chọn Quản Trò cho ván đấu.'}
                </Text>
              </View>
              <TouchableOpacity style={styles.closeModalBtn} onPress={() => setShowGmVoteModal(false)}>
                <Text style={styles.closeModalText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* EXPLANATION BOX */}
            <View style={styles.gmExplainBox}>
              <Text style={styles.gmExplainTitle}>💡 PHÂN BIỆT QUẢN TRÒ VÀ NGƯỜI CHƠI:</Text>
              <Text style={styles.gmExplainText}>
                • <Text style={{ color: Colors.tertiary, fontWeight: '700' }}>QUẢN TRÒ (GM)</Text>: Là người đọc hiệu lệnh ban đêm, bấm "GỌI VAI TRÒ TIẾP THEO", chốt lượt và có quyền kích hoạt Trăng Máu.
              </Text>
              <Text style={styles.gmExplainText}>
                • <Text style={{ color: Colors.secondary, fontWeight: '700' }}>NGƯỜI CHƠI (CLIENT)</Text>: Nhận lá bài vai trò ẩn, nhắm mắt và chỉ hành động khi được Quản Trò gọi.
              </Text>
            </View>

            {/* PLAYER CANDIDATES LIST */}
            <ScrollView style={styles.gmListScroll} showsVerticalScrollIndicator={false}>
              {playersList.map((p) => {
                const votesCount = gmVotes[p.seat] || 0;
                const isSelectedGm = gmSeat === p.seat;
                const isMyVoted = myVoteSeat === p.seat;

                return (
                  <View key={p.seat} style={[styles.gmCandidateCard, isSelectedGm && styles.gmCandidateCardActive]}>
                    <View style={styles.gmAvatarWrap}>
                      <Image
                        source={{ uri: SEAT_AVATAR_IMAGES[p.seat] || SEAT_AVATAR_IMAGES.I }}
                        style={{ width: 38, height: 38, borderRadius: 19 }}
                        resizeMode="cover"
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={styles.gmCandidateName}>{p.name}</Text>
                        <Text style={styles.gmSeatTag}>Ghế {p.seat}</Text>
                        {p.isHost && <Text style={styles.gmHostBadge}>CHỦ PHÒNG</Text>}
                        {isSelectedGm && <Text style={styles.gmCurrentBadge}>👑 ĐANG LÀM QUẢN TRÒ</Text>}
                      </View>
                      <Text style={styles.gmVotesTally}>
                        🗳️ Số phiếu bình chọn: <Text style={{ color: Colors.tertiary, fontWeight: '700' }}>{votesCount}</Text>
                      </Text>
                    </View>

                    <View style={{ flexDirection: 'row', gap: 6 }}>
                      <TouchableOpacity
                        style={[styles.voteGmBtn, isMyVoted && styles.voteGmBtnActive]}
                        onPress={() => handleVoteGm(p.seat)}
                      >
                        <Text style={[styles.voteGmText, isMyVoted && { color: '#ffffff' }]}>
                          {isMyVoted ? '✓ Đã Bầu' : '🗳️ Bầu'}
                        </Text>
                      </TouchableOpacity>

                      {/* DIRECT ASSIGN BUTTON ONLY FOR ROOM HOST */}
                      {isHostUser && (
                        <TouchableOpacity
                          style={styles.assignDirectBtn}
                          onPress={() => handleAssignGmDirect(p.seat)}
                        >
                          <Text style={styles.assignDirectText}>👑 Host Giao</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                );
              })}
            </ScrollView>

            <TouchableOpacity style={styles.closeGmVoteBtn} onPress={() => setShowGmVoteModal(false)}>
              <Text style={styles.closeGmVoteText}>HOÀN TẤT CHỌN QUẢN TRÒ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  </View>
);
}

const styles = StyleSheet.create({
  rootContainer: { flex: 1, backgroundColor: '#0a0c10', position: 'relative' },
  safeArea: { flex: 1, backgroundColor: 'transparent' },
  header: {
    height: 64, paddingHorizontal: Spacing.gutterMobile,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: `${Colors.surface}D9`,
    borderBottomWidth: 1, borderBottomColor: Colors.outlineVariant,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  backIcon: { color: Colors.onSurfaceVariant, fontSize: 28, fontWeight: '300' },
  headerLabel: { color: Colors.outline, fontSize: FontSizes.labelSm, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.5 },
  headerTitle: { color: Colors.onSurface, fontSize: FontSizes.headlineSm, fontWeight: '600', letterSpacing: 0.5 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  
  hostPermissionToggle: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, borderWidth: 1,
  },
  hostPermissionOn: { backgroundColor: 'rgba(255, 179, 0, 0.15)', borderColor: '#ffb300' },
  hostPermissionOff: { backgroundColor: '#282a2d', borderColor: '#333538' },
  hostPermissionIcon: { fontSize: 11 },
  hostPermissionText: { color: '#ffffff', fontSize: 10, fontWeight: '800' },

  headerMicBtn: {
    width: 38, height: 38, borderRadius: BorderRadius.md,
    backgroundColor: `${Colors.surfaceContainerHigh}99`,
    alignItems: 'center', justifyContent: 'center',
  },
  headerMicBtnActive: { backgroundColor: `${Colors.secondaryContainer}66` },
  headerMicIcon: { fontSize: 16 },

  scroll: { flex: 1 },

  roomInfoSection: {
    backgroundColor: Colors.surfaceContainerLowest,
    paddingHorizontal: Spacing.gutterMobile,
    paddingVertical: Spacing.sm,
  },
  roomInfoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  roomBadgeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  roomCodeBadge: {
    backgroundColor: Colors.primaryContainer, paddingHorizontal: 6, paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  roomCodeText: { color: Colors.onPrimaryContainer, fontSize: FontSizes.labelSm, fontWeight: '700', textTransform: 'uppercase' },
  pingBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  pingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.secondary },
  pingText: { color: Colors.secondary, fontSize: FontSizes.bodySm },
  roomName: { color: Colors.onSurface, fontSize: FontSizes.headlineSm, fontWeight: '600', letterSpacing: 0.5 },
  roomActions: { flexDirection: 'row', gap: 4 },
  copyBtn: {
    height: 36, paddingHorizontal: 10, borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceContainerHigh, alignItems: 'center', justifyContent: 'center',
  },
  copyIcon: { fontSize: 16 },
  qrBtn: {
    width: 36, height: 36, borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceContainerHigh, alignItems: 'center', justifyContent: 'center',
  },
  qrIcon: { fontSize: 16 },
  roomMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: Spacing.sm },
  metaPill: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: BorderRadius.full, backgroundColor: `${Colors.tertiaryContainer}66`,
  },
  metaPillText: { color: Colors.tertiary, fontSize: FontSizes.labelSm },
  metaPillText2: { color: Colors.secondary, fontSize: FontSizes.bodySm },

  // GAME MASTER BANNER
  gmBannerCard: {
    marginHorizontal: Spacing.gutterMobile, marginTop: Spacing.sm,
    backgroundColor: '#1b1d22', borderRadius: BorderRadius.lg, padding: 12,
    borderWidth: 1, borderColor: '#5c3f00',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10,
  },
  gmBannerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  gmBadgeCircle: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(241, 190, 102, 0.15)',
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.tertiary,
  },
  gmBannerTitle: { color: Colors.tertiary, fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },
  gmActiveTag: { backgroundColor: '#332300', paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4 },
  gmActiveTagText: { color: '#ffcc80', fontSize: 8, fontWeight: '800' },
  gmNameText: { color: '#ffffff', fontSize: 14, fontWeight: '700', marginTop: 2 },
  gmVoteBtn: {
    backgroundColor: Colors.tertiaryContainer, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8,
    borderWidth: 1, borderColor: Colors.tertiary,
  },
  gmVoteBtnText: { color: '#ffffff', fontSize: 11, fontWeight: '700' },

  // CARD SET SELECTION & BAN/PICK
  scenarioCard: {
    marginHorizontal: Spacing.gutterMobile, marginTop: Spacing.sm,
    backgroundColor: Colors.surfaceContainerLow, borderRadius: BorderRadius.lg, padding: 12, gap: 6,
  },
  scenarioHeaderRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8,
  },
  scenarioLeftBox: {
    flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1, paddingRight: 4,
  },
  scenarioIcon: {
    width: 38, height: 38, borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceContainerHigh, alignItems: 'center', justifyContent: 'center',
  },
  scenarioName: { color: Colors.onSurface, fontSize: 13, fontWeight: '700' },
  scenarioDesc: { color: Colors.onSurfaceVariant, fontSize: 10, marginTop: 1 },
  scenarioDetailBtn: {
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceContainerHigh, flexShrink: 0,
  },
  scenarioDetailText: { color: Colors.primary, fontSize: 11, fontWeight: '700' },

  statusBadgeSubRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  scenarioBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  badgeGreen: { backgroundColor: '#1b3a2b', borderWidth: 1, borderColor: '#4caf50' },
  badgeYellow: { backgroundColor: '#3d3000', borderWidth: 1, borderColor: '#ffb300' },
  badgeRed: { backgroundColor: '#3d1217', borderWidth: 1, borderColor: '#ff4d4d' },
  scenarioBadgeText: { color: '#ffffff', fontSize: 10, fontWeight: '800' },

  cardSetSelectorBox: { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#33353840' },
  banPickTriggerRow: { marginBottom: 10 },
  openBanPickModalBtn: {
    height: 44, borderRadius: 10, backgroundColor: '#282a2d',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8,
    borderWidth: 1, borderColor: Colors.secondary, paddingHorizontal: 12,
  },
  openBanPickModalBtnDisabled: { borderColor: '#333538', opacity: 0.8 },
  openBanPickModalText: { color: Colors.secondary, fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },
  openBanPickModalBadge: {
    backgroundColor: '#0c0e11', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10,
    color: Colors.onSurfaceVariant, fontSize: 10, fontWeight: '600',
  },

  deckBreakdown: { flexDirection: 'row', marginTop: Spacing.xs, gap: Spacing.xs },
  deckItem: {
    flex: 1, alignItems: 'center', padding: 8, borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceContainerLowest,
  },
  deckCount: { fontSize: FontSizes.headlineSm, fontWeight: '700' },
  deckLabel: { color: Colors.onSurfaceVariant, fontSize: 9, textTransform: 'uppercase', marginTop: 2, fontWeight: '700' },

  selectedRolesSummaryBox: { marginTop: 10, backgroundColor: '#111317', padding: 8, borderRadius: 8 },
  selectedSummaryTitle: { color: Colors.tertiary, fontSize: 9, fontWeight: '800', letterSpacing: 0.5, marginBottom: 4 },
  summaryChipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  emptySummaryText: { color: Colors.onSurfaceVariant, fontSize: 10, fontStyle: 'italic' },
  summaryChipPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#1e2023', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6,
    borderWidth: 1, borderColor: '#333538',
  },
  summaryChipIcon: { fontSize: 11 },
  summaryChipName: { color: Colors.onSurface, fontSize: 10, fontWeight: '600' },
  summaryChipCount: { color: Colors.secondary, fontSize: 10, fontWeight: '800' },

  // PLAYER GRID
  section: { paddingHorizontal: Spacing.gutterMobile, marginTop: Spacing.md },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.sm },
  sectionLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sectionIcon: { fontSize: 18 },
  sectionTitle: {
    color: Colors.onSurface, fontSize: FontSizes.labelMd, fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: 1.5,
  },
  sectionCount: { color: Colors.secondary, fontSize: FontSizes.bodySm, fontWeight: '700' },
  readyBadge: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: BorderRadius.full, backgroundColor: Colors.surfaceContainerHigh,
  },
  readyBadgeText: { color: Colors.tertiary, fontSize: FontSizes.bodySm },

  playerGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
  playerCard: {
    width: '48%', borderRadius: BorderRadius.lg, backgroundColor: Colors.surfaceContainerLow,
    padding: 10, marginBottom: 4, overflow: 'hidden', borderWidth: 1, borderColor: 'transparent',
  },
  playerCardYou: { backgroundColor: Colors.surfaceContainer, borderColor: Colors.secondary },
  playerCardGm: { borderColor: Colors.tertiary, borderWidth: 1.5, backgroundColor: '#211c12' },
  playerCardNotReady: { opacity: 0.9 },
  youIndicator: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 2,
    backgroundColor: Colors.secondary,
  },
  playerCardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  seatBadge: {
    width: 20, height: 20, borderRadius: 4,
    backgroundColor: Colors.surfaceContainerHighest, alignItems: 'center', justifyContent: 'center',
  },
  seatText: { color: Colors.onSurfaceVariant, fontSize: FontSizes.labelSm, fontWeight: '700' },
  hostStar: { color: Colors.tertiary, fontSize: 9, fontWeight: '800' },
  gmCrownBadge: { backgroundColor: '#5c3f00', paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4 },
  gmCrownText: { color: '#ffcc80', fontSize: 8, fontWeight: '800' },

  kickPlayerBtn: {
    backgroundColor: '#3d1217', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4,
    borderWidth: 1, borderColor: '#ff4d4d',
  },
  kickPlayerText: { color: '#ff8080', fontSize: 8, fontWeight: '800' },

  playerMid: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  playerAvatar: {
    width: 40, height: 40, borderRadius: 20, overflow: 'hidden',
    borderWidth: 1, borderColor: Colors.surfaceContainerHighest,
  },
  playerAvatarImg: { width: '100%', height: '100%' },
  levelChip: {
    position: 'absolute', bottom: -2, right: -2,
    backgroundColor: Colors.surfaceContainerHighest, paddingHorizontal: 3, borderRadius: 2,
  },
  levelChipYou: { backgroundColor: Colors.secondary },
  levelChipText: { color: Colors.onSurface, fontSize: 9, fontWeight: '700' },
  playerName: { color: Colors.onSurface, fontSize: 12, fontWeight: '600' },
  playerNameYou: { color: Colors.secondary, fontWeight: '700' },
  hostLabel: { color: Colors.tertiary, fontSize: 9, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  readyStatus: {
    paddingVertical: 4, borderRadius: 2, alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.surfaceContainer,
  },
  readyStatusOn: { backgroundColor: Colors.surfaceContainer },
  readyStatusOff: { backgroundColor: Colors.surfaceContainerHighest },
  readyStatusText: { color: Colors.secondary, fontSize: FontSizes.labelSm, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  emptySeat: {
    width: '48%', borderRadius: BorderRadius.lg,
    backgroundColor: `${Colors.surfaceContainerLowest}99`,
    padding: 10, alignItems: 'center', justifyContent: 'center', minHeight: 110, marginBottom: 4,
  },
  emptySeatIcon: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.surfaceContainerHigh, alignItems: 'center', justifyContent: 'center', marginBottom: 6,
  },
  emptySeatIconText: { fontSize: 16 },
  emptySeatLabel: { color: Colors.onSurfaceVariant, fontSize: FontSizes.labelSm, textTransform: 'uppercase', fontWeight: '700' },
  emptySeatSubtitle: { color: Colors.outline, fontSize: FontSizes.bodySm },

  chatPreview: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginHorizontal: Spacing.gutterMobile, marginTop: Spacing.sm,
    backgroundColor: Colors.surfaceContainerLow, borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.sm, paddingVertical: 8,
  },
  chatIcon: { fontSize: 18, color: Colors.outline },
  chatContent: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  chatSender: { color: Colors.tertiary, fontSize: FontSizes.bodySm, fontWeight: '600' },
  chatMsg: { color: Colors.onSurfaceVariant, fontSize: FontSizes.bodySm, flex: 1 },
  chatOpenBtn: { color: Colors.primary, fontSize: FontSizes.labelSm, fontWeight: '700' },

  bottomDock: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.xs,
    paddingHorizontal: Spacing.gutterMobile, paddingVertical: Spacing.sm,
    backgroundColor: `${Colors.surface}F2`,
    borderTopWidth: 1, borderTopColor: Colors.outlineVariant,
  },
  leaveBtn: {
    width: 48, height: 48, borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceContainerHigh, alignItems: 'center', justifyContent: 'center',
  },
  leaveBtnIcon: { fontSize: 18 },
  leaveBtnText: { color: Colors.onSurfaceVariant, fontSize: 9, fontWeight: '700' },
  dockMicBtn: {
    width: 48, height: 48, borderRadius: BorderRadius.md,
    backgroundColor: Colors.secondaryContainer, alignItems: 'center', justifyContent: 'center',
  },
  dockMicBtnOff: { backgroundColor: Colors.surfaceContainerHighest },
  dockMicIcon: { fontSize: 18 },
  dockMicText: { color: Colors.onSecondary, fontSize: 9, fontWeight: '700', textTransform: 'uppercase' },
  masterActionBtn: {
    flex: 1, height: 48, borderRadius: BorderRadius.md, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: Colors.primaryContainer,
  },
  masterActionBtnWarning: { backgroundColor: '#5c3f00' },
  masterActionIcon: { fontSize: 20 },
  masterActionText: {
    color: Colors.onPrimaryContainer, fontSize: FontSizes.headlineSm,
    fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1,
  },

  // MODAL STYLES
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end',
  },
  banPickModalCard: {
    height: '85%', backgroundColor: '#111317', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 16, borderTopWidth: 1, borderTopColor: Colors.secondary,
  },
  gmVoteModalCard: {
    maxHeight: '80%', backgroundColor: '#111317', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 16, borderTopWidth: 1, borderTopColor: Colors.tertiary,
  },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  modalTitle: { color: Colors.onSurface, fontSize: 15, fontWeight: '800', letterSpacing: 0.5 },
  modalSubTitle: { color: Colors.onSurfaceVariant, fontSize: 11, marginTop: 2 },
  closeModalBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#282a2d', alignItems: 'center', justifyContent: 'center' },
  closeModalText: { color: Colors.onSurfaceVariant, fontSize: 16 },

  modalStatusBar: { padding: 10, borderRadius: 10, marginBottom: 10, gap: 8 },
  modalStatusText: { color: '#ffffff', fontSize: 11, fontWeight: '800', textAlign: 'center' },
  presetQuickRow: { flexDirection: 'row', justifyContent: 'center', gap: 6 },
  presetChipBtn: { backgroundColor: '#282a2d', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  presetChipBtnGold: { backgroundColor: Colors.tertiary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  presetChipBtnCyan: { backgroundColor: Colors.secondary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  presetChipText: { color: Colors.onSurface, fontSize: 10, fontWeight: '700' },
  presetChipTextDark: { color: '#111317', fontSize: 10, fontWeight: '800' },

  filterTabsRow: { flexDirection: 'row', gap: 6, marginBottom: 10 },
  filterTab: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: '#1e2023' },
  filterTabActive: { backgroundColor: Colors.secondaryContainer },
  filterTabText: { color: Colors.onSurfaceVariant, fontSize: 10, fontWeight: '600' },
  filterTabTextActive: { color: '#ffffff', fontWeight: '800' },

  rolesListScroll: { flex: 1, marginBottom: 10 },
  roleRowCard: {
    flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10, borderRadius: 12,
    backgroundColor: '#181a1d', marginBottom: 6, borderWidth: 1, borderColor: '#33353840',
  },
  roleRowCardBanned: { opacity: 0.5, backgroundColor: '#2b1216', borderColor: '#ff4d4d' },
  roleRowCardPicked: { borderColor: Colors.secondary, backgroundColor: '#132328' },
  roleIconWrap: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#282a2d', alignItems: 'center', justifyContent: 'center' },
  roleNameText: { color: Colors.onSurface, fontSize: 13, fontWeight: '700' },
  roleFactionBadge: { paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4 },
  bgWolf: { backgroundColor: '#3d1217' },
  bgGod: { backgroundColor: '#162b32' },
  bgVillager: { backgroundColor: '#1e2023' },
  bgNeutral: { backgroundColor: '#3d2600' },
  roleFactionText: { color: '#ffffff', fontSize: 9, fontWeight: '700' },
  bannedTag: { backgroundColor: '#ff4d4d', paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4 },
  bannedTagText: { color: '#ffffff', fontSize: 8, fontWeight: '800' },
  roleDescText: { color: Colors.onSurfaceVariant, fontSize: 10, marginTop: 2 },

  roleRowRightControls: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  banToggleBtn: {
    paddingHorizontal: 8, paddingVertical: 6, borderRadius: 6, backgroundColor: '#282a2d',
    borderWidth: 1, borderColor: '#333538',
  },
  banToggleBtnActive: { backgroundColor: '#3d1217', borderColor: '#ff4d4d' },
  banToggleText: { color: Colors.onSurfaceVariant, fontSize: 9, fontWeight: '700' },

  counterWrap: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#0c0e11', padding: 2, borderRadius: 8 },
  counterBtn: { width: 28, height: 28, borderRadius: 6, backgroundColor: '#282a2d', alignItems: 'center', justifyContent: 'center' },
  counterBtnText: { color: Colors.onSurface, fontSize: 16, fontWeight: '700' },
  counterBtnAdd: { width: 28, height: 28, borderRadius: 6, backgroundColor: Colors.secondary, alignItems: 'center', justifyContent: 'center' },
  counterBtnAddText: { color: '#111317', fontSize: 16, fontWeight: '800' },
  counterValue: { color: Colors.onSurfaceVariant, fontSize: 14, fontWeight: '700', minWidth: 20, textAlign: 'center' },
  counterValueActive: { color: Colors.secondary, fontWeight: '800' },

  saveBanPickBtn: {
    height: 48, borderRadius: 12, backgroundColor: Colors.secondary,
    alignItems: 'center', justifyContent: 'center', shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.4, shadowRadius: 6, elevation: 6,
  },
  saveBanPickText: { color: '#111317', fontSize: 13, fontWeight: '900', letterSpacing: 0.5 },

  // GM VOTE MODAL STYLES
  gmExplainBox: { backgroundColor: '#1e2023', padding: 10, borderRadius: 10, marginBottom: 10, gap: 4 },
  gmExplainTitle: { color: Colors.tertiary, fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  gmExplainText: { color: Colors.onSurfaceVariant, fontSize: 10, lineHeight: 15 },

  gmListScroll: { maxHeight: 340, marginBottom: 10 },
  gmCandidateCard: {
    flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10, borderRadius: 12,
    backgroundColor: '#181a1d', marginBottom: 6, borderWidth: 1, borderColor: '#333538',
  },
  gmCandidateCardActive: { backgroundColor: '#2b210a', borderColor: Colors.tertiary },
  gmAvatarWrap: { width: 38, height: 38, borderRadius: 19, overflow: 'hidden', borderWidth: 1, borderColor: Colors.tertiary },
  gmCandidateName: { color: Colors.onSurface, fontSize: 13, fontWeight: '700' },
  gmSeatTag: { color: Colors.secondary, fontSize: 10, fontWeight: '700' },
  gmHostBadge: { color: Colors.tertiary, fontSize: 8, fontWeight: '800' },
  gmCurrentBadge: { backgroundColor: Colors.tertiary, color: '#111317', fontSize: 8, fontWeight: '800', paddingHorizontal: 4, borderRadius: 4 },
  gmVotesTally: { color: Colors.onSurfaceVariant, fontSize: 10, marginTop: 2 },
  voteGmBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, backgroundColor: '#282a2d' },
  voteGmBtnActive: { backgroundColor: Colors.secondary },
  voteGmText: { color: Colors.onSurfaceVariant, fontSize: 10, fontWeight: '700' },
  assignDirectBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, backgroundColor: '#5c3f00' },
  assignDirectText: { color: '#ffcc80', fontSize: 10, fontWeight: '800' },

  closeGmVoteBtn: {
    height: 44, borderRadius: 10, backgroundColor: Colors.tertiaryContainer,
    alignItems: 'center', justifyContent: 'center',
  },
  closeGmVoteText: { color: '#ffffff', fontSize: 12, fontWeight: '800' },

  matchBarSuccess: { backgroundColor: 'rgba(76, 175, 80, 0.15)', borderWidth: 1, borderColor: '#4caf50' },
  matchBarWarning: { backgroundColor: 'rgba(255, 179, 0, 0.15)', borderWidth: 1, borderColor: '#ffb300' },
  matchBarEmpty: { backgroundColor: 'rgba(244, 67, 54, 0.15)', borderWidth: 1, borderColor: '#f44336' },
});
