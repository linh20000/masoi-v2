import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { Colors, Spacing } from '../theme/colors';

interface RoleActionModalProps {
  visible: boolean;
  roleId: string;
  onClose: () => void;
  onConfirm: (targetId: string, extra?: any) => void;
}

export default function RoleActionModals({
  visible,
  roleId,
  onClose,
  onConfirm,
}: RoleActionModalProps) {
  const [selectedSeat, setSelectedSeat] = useState<string>('IV');
  const [selectedSeat2, setSelectedSeat2] = useState<string>('VIII');
  const [potionType, setPotionType] = useState<'HEAL' | 'POISON' | 'NONE'>('HEAL');
  const [arsonistAction, setArsonistAction] = useState<'OIL' | 'IGNITE'>('OIL');

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* 1. SEER INSPECT MODAL (BASIC) */}
          {roleId === 'seer' && (
            <View style={styles.cardBox}>
              <View style={styles.headerRow}>
                <Text style={styles.titleCyan}>👁️ TIÊN TRI — SOI BẢN CHẤT</Text>
                <TouchableOpacity onPress={onClose}>
                  <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.descText}>
                Chọn 1 người chơi để soi kiểm tra linh hồn thuộc Phe Dân Làng hay Phe Ma Sói.
              </Text>
              <View style={styles.seatsRow}>
                {['I', 'II', 'III', 'IV', 'V', 'VI', 'VIII', 'IX', 'X'].map((seat) => (
                  <TouchableOpacity
                    key={seat}
                    style={[styles.seatChip, selectedSeat === seat && styles.seatChipActiveCyan]}
                    onPress={() => setSelectedSeat(seat)}
                  >
                    <Text style={[styles.seatChipText, selectedSeat === seat && styles.seatChipTextActive]}>
                      Ghế {seat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity
                style={styles.confirmBtnCyan}
                onPress={() => {
                  onConfirm(selectedSeat);
                  onClose();
                }}
              >
                <Text style={styles.confirmBtnTextDark}>SOI LINH HỒN (GHẾ {selectedSeat})</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* 2. WEREWOLF ATTACK MODAL (BASIC) */}
          {roleId === 'werewolf' && (
            <View style={styles.cardBox}>
              <View style={styles.headerRow}>
                <Text style={styles.titleRed}>🐺 PHE MA SÓI — HỘI Ý CẮN MỒI</Text>
                <TouchableOpacity onPress={onClose}>
                  <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.descText}>
                Đồng thuận cùng bầy Sói chọn 1 nạn nhân xấu số xé xác trong đêm.
              </Text>
              <View style={styles.seatsRow}>
                {['I', 'II', 'III', 'IV', 'V', 'VIII', 'IX', 'XI'].map((seat) => (
                  <TouchableOpacity
                    key={seat}
                    style={[styles.seatChip, selectedSeat === seat && styles.seatChipActiveRed]}
                    onPress={() => setSelectedSeat(seat)}
                  >
                    <Text style={[styles.seatChipText, selectedSeat === seat && styles.seatChipTextActive]}>
                      Ghế {seat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity
                style={styles.confirmBtnRed}
                onPress={() => {
                  onConfirm(selectedSeat);
                  onClose();
                }}
              >
                <Text style={styles.confirmBtnTextLight}>CHỐT CẮN NẠN NHÂN (GHẾ {selectedSeat})</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* 3. WITCH POTION SHEET (BASIC) */}
          {roleId === 'witch' && (
            <View style={styles.cardBox}>
              <View style={styles.headerRow}>
                <Text style={styles.titleGold}>🧪 PHÙ THỦY — THUỐC ĐỘC & BÌNH CỨU</Text>
                <TouchableOpacity onPress={onClose}>
                  <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.victimAlertBox}>
                <Text style={styles.victimAlertText}>⚠️ Nạn nhân bị Sói cắn đêm nay: Ghế V (Bánh Mì)</Text>
              </View>
              <View style={styles.potionTabs}>
                <TouchableOpacity
                  style={[styles.potionTab, potionType === 'HEAL' && styles.potionTabActiveGold]}
                  onPress={() => setPotionType('HEAL')}
                >
                  <Text style={styles.potionTabText}>💚 Dùng Bình Cứu (1L)</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.potionTab, potionType === 'POISON' && styles.potionTabActiveRed]}
                  onPress={() => setPotionType('POISON')}
                >
                  <Text style={styles.potionTabText}>💜 Dùng Bình Độc (1L)</Text>
                </TouchableOpacity>
              </View>
              {potionType === 'POISON' && (
                <View style={styles.seatsRow}>
                  {['I', 'II', 'III', 'IV', 'VI', 'VIII', 'IX', 'X'].map((seat) => (
                    <TouchableOpacity
                      key={seat}
                      style={[styles.seatChip, selectedSeat === seat && styles.seatChipActiveRed]}
                      onPress={() => setSelectedSeat(seat)}
                    >
                      <Text style={[styles.seatChipText, selectedSeat === seat && styles.seatChipTextActive]}>
                        Ghế {seat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              <TouchableOpacity
                style={styles.confirmBtnGold}
                onPress={() => {
                  onConfirm(potionType === 'POISON' ? selectedSeat : 'V', { potionType });
                  onClose();
                }}
              >
                <Text style={styles.confirmBtnTextDark}>XÁC NHẬN DÙNG DƯỢC PHẨM</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* 4. HUNTER SHOOT MODAL (BASIC - DEATH EVENT) */}
          {roleId === 'hunter' && (
            <View style={styles.cardBox}>
              <View style={styles.headerRow}>
                <Text style={styles.titleRed}>🏹 THỢ SẮN — BẮN PHÁT SÚNG CUỐI</Text>
                <TouchableOpacity onPress={onClose}>
                  <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.descText}>
                Khi ngã xuống, Thợ Săn có quyền kéo theo 1 người chơi khác cùng chôn vùi.
              </Text>
              <View style={styles.seatsRow}>
                {['I', 'II', 'III', 'V', 'VI', 'VIII', 'IX', 'X', 'XI'].map((seat) => (
                  <TouchableOpacity
                    key={seat}
                    style={[styles.seatChip, selectedSeat === seat && styles.seatChipActiveRed]}
                    onPress={() => setSelectedSeat(seat)}
                  >
                    <Text style={[styles.seatChipText, selectedSeat === seat && styles.seatChipTextActive]}>
                      Ghế {seat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity
                style={styles.confirmBtnRed}
                onPress={() => {
                  onConfirm(selectedSeat);
                  onClose();
                }}
              >
                <Text style={styles.confirmBtnTextLight}>BẮN HẠ NGƯỜI CHƠI (GHẾ {selectedSeat})</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* 5. CUPID LOVERS BIND MODAL (CHARACTER) */}
          {roleId === 'cupid' && (
            <View style={styles.cardBox}>
              <View style={styles.headerRow}>
                <Text style={styles.titleGold}>💘 THẦN TÌNH YÊU — SE DUYÊN ĐÊM 1</Text>
                <TouchableOpacity onPress={onClose}>
                  <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.descText}>
                Chọn 2 người chơi làm Cặp Đôi Sinh Tử. Hai người sẽ cùng sống cùng chết.
              </Text>
              <Text style={styles.subLabel}>Người thứ nhất: Ghế {selectedSeat}</Text>
              <View style={styles.seatsRow}>
                {['I', 'II', 'III', 'IV', 'VI', 'VII'].map((seat) => (
                  <TouchableOpacity
                    key={seat}
                    style={[styles.seatChip, selectedSeat === seat && styles.seatChipActiveGold]}
                    onPress={() => setSelectedSeat(seat)}
                  >
                    <Text style={[styles.seatChipText, selectedSeat === seat && styles.seatChipTextActive]}>
                      Ghế {seat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.subLabel}>Người thứ hai: Ghế {selectedSeat2}</Text>
              <View style={styles.seatsRow}>
                {['VIII', 'IX', 'X', 'XI', 'XII'].map((seat) => (
                  <TouchableOpacity
                    key={seat}
                    style={[styles.seatChip, selectedSeat2 === seat && styles.seatChipActiveGold]}
                    onPress={() => setSelectedSeat2(seat)}
                  >
                    <Text style={[styles.seatChipText, selectedSeat2 === seat && styles.seatChipTextActive]}>
                      Ghế {seat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity
                style={styles.confirmBtnGold}
                onPress={() => {
                  onConfirm(selectedSeat, { lover2: selectedSeat2 });
                  onClose();
                }}
              >
                <Text style={styles.confirmBtnTextDark}>BẮN MŨI TÊN SE DUYÊN</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* 6. DEFENDER SHIELD MODAL (CHARACTER) */}
          {roleId === 'defender' && (
            <View style={styles.cardBox}>
              <View style={styles.headerRow}>
                <Text style={styles.titleCyan}>🛡️ BẢO VỆ — DỰNG KHIÊN CHE CHỞ</Text>
                <TouchableOpacity onPress={onClose}>
                  <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.descText}>
                Chọn 1 người chơi để bảo vệ khỏi cú cắn của Sói. Không thể bảo vệ cùng 1 người 2 đêm liên tiếp.
              </Text>
              <View style={styles.seatsRow}>
                {['I', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'].map((seat) => (
                  <TouchableOpacity
                    key={seat}
                    style={[styles.seatChip, selectedSeat === seat && styles.seatChipActiveCyan]}
                    onPress={() => setSelectedSeat(seat)}
                  >
                    <Text style={[styles.seatChipText, selectedSeat === seat && styles.seatChipTextActive]}>
                      Ghế {seat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity
                style={styles.confirmBtnCyan}
                onPress={() => {
                  onConfirm(selectedSeat);
                  onClose();
                }}
              >
                <Text style={styles.confirmBtnTextDark}>DỰNG KHIÊN BẢO VỆ (GHẾ {selectedSeat})</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* 7. WHITE WEREWOLF KILL MODAL (CHARACTER) */}
          {roleId === 'white_werewolf' && (
            <View style={styles.cardBox}>
              <View style={styles.headerRow}>
                <Text style={styles.titleRed}>🐺 SÓI TRẮNG — ĐÊM CHẴN CẮN LẺ SÓI</Text>
                <TouchableOpacity onPress={onClose}>
                  <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.descText}>
                Vào các đêm chẵn, Sói Trắng có thể thức giấc riêng và cắn chết 1 Ma Sói đồng loại.
              </Text>
              <View style={styles.seatsRow}>
                {['VI', 'X'].map((seat) => (
                  <TouchableOpacity
                    key={seat}
                    style={[styles.seatChip, selectedSeat === seat && styles.seatChipActiveRed]}
                    onPress={() => setSelectedSeat(seat)}
                  >
                    <Text style={[styles.seatChipText, selectedSeat === seat && styles.seatChipTextActive]}>
                      Sói Ghế {seat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity
                style={styles.confirmBtnRed}
                onPress={() => {
                  onConfirm(selectedSeat);
                  onClose();
                }}
              >
                <Text style={styles.confirmBtnTextLight}>CẮN TIÊU DIỆT SÓI (GHẾ {selectedSeat})</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* 8. WILD CHILD MODEL MODAL (CHARACTER) */}
          {roleId === 'wild_child' && (
            <View style={styles.cardBox}>
              <View style={styles.headerRow}>
                <Text style={styles.titleGold}>👶 ĐỨA TRẺ HOANG DÃ — CHỌN THẦN TƯỢNG</Text>
                <TouchableOpacity onPress={onClose}>
                  <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.descText}>
                Đêm 1: Chọn 1 người chơi làm Thần Tượng. Nếu Thần Tượng chết, Đứa Trẻ Hoang Dã biến thành Ma Sói!
              </Text>
              <View style={styles.seatsRow}>
                {['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'].map((seat) => (
                  <TouchableOpacity
                    key={seat}
                    style={[styles.seatChip, selectedSeat === seat && styles.seatChipActiveGold]}
                    onPress={() => setSelectedSeat(seat)}
                  >
                    <Text style={[styles.seatChipText, selectedSeat === seat && styles.seatChipTextActive]}>
                      Ghế {seat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity
                style={styles.confirmBtnGold}
                onPress={() => {
                  onConfirm(selectedSeat);
                  onClose();
                }}
              >
                <Text style={styles.confirmBtnTextDark}>CHỌN THẦN TƯỢNG (GHẾ {selectedSeat})</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* 9. THIEF EXCHANGE MODAL (CHARACTER) */}
          {roleId === 'thief' && (
            <View style={styles.cardBox}>
              <View style={styles.headerRow}>
                <Text style={styles.titleCyan}>🎭 ĂN TRỘM — TRÁO BÀI ĐÊM 1</Text>
                <TouchableOpacity onPress={onClose}>
                  <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.descText}>
                Xem 2 lá bài dư trong bộ và chọn đổi vai trò nếu có lá bài Ma Sói.
              </Text>
              <View style={styles.potionTabs}>
                <TouchableOpacity
                  style={[styles.potionTab, selectedSeat === 'WOLF' && styles.potionTabActiveRed]}
                  onPress={() => setSelectedSeat('WOLF')}
                >
                  <Text style={styles.potionTabText}>🐺 Lấy Lá Ma Sói</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.potionTab, selectedSeat === 'VILLAGER' && styles.potionTabActiveGold]}
                  onPress={() => setSelectedSeat('VILLAGER')}
                >
                  <Text style={styles.potionTabText}>👨‍🌾 Lấy Lá Dân Làng</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.confirmBtnCyan}
                onPress={() => {
                  onConfirm(selectedSeat);
                  onClose();
                }}
              >
                <Text style={styles.confirmBtnTextDark}>XÁC NHẬN ĐỔI VAI TRÒ</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* 10. ARSONIST ACTION MODAL (CHARACTER_PLUS) */}
          {roleId === 'arsonist' && (
            <View style={styles.cardBox}>
              <View style={styles.headerRow}>
                <Text style={styles.titleRed}>🔥 KẺ PHÓNG HỎA — TƯỚI DẦU HOẶC THIÊU RỤI</Text>
                <TouchableOpacity onPress={onClose}>
                  <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.descText}>
                Mỗi đêm tưới dầu 2 nhà người chơi, hoặc châm lửa thiêu rụi toàn bộ những nhà đã dính dầu!
              </Text>
              <View style={styles.potionTabs}>
                <TouchableOpacity
                  style={[styles.potionTab, arsonistAction === 'OIL' && styles.potionTabActiveGold]}
                  onPress={() => setArsonistAction('OIL')}
                >
                  <Text style={styles.potionTabText}>🛢️ Tưới Dầu 2 Nhà</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.potionTab, arsonistAction === 'IGNITE' && styles.potionTabActiveRed]}
                  onPress={() => setArsonistAction('IGNITE')}
                >
                  <Text style={styles.potionTabText}>🔥 Châm Lửa Thiêu</Text>
                </TouchableOpacity>
              </View>
              {arsonistAction === 'OIL' && (
                <View style={styles.seatsRow}>
                  {['I', 'II', 'III', 'IV', 'V', 'VI'].map((seat) => (
                    <TouchableOpacity
                      key={seat}
                      style={[styles.seatChip, selectedSeat === seat && styles.seatChipActiveGold]}
                      onPress={() => setSelectedSeat(seat)}
                    >
                      <Text style={[styles.seatChipText, selectedSeat === seat && styles.seatChipTextActive]}>
                        Ghế {seat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              <TouchableOpacity
                style={styles.confirmBtnRed}
                onPress={() => {
                  onConfirm(selectedSeat, { mode: arsonistAction });
                  onClose();
                }}
              >
                <Text style={styles.confirmBtnTextLight}>
                  {arsonistAction === 'OIL' ? `TƯỚI DẦU GHẾ ${selectedSeat}` : 'CHÂM LỬA THIÊU RỤI ALL'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* 11. WOLF CUB RAGE MODAL (CHARACTER_PLUS - DEATH EVENT) */}
          {roleId === 'wolf_cub' && (
            <View style={styles.cardBox}>
              <View style={styles.headerRow}>
                <Text style={styles.titleRed}>🐾 SÓI CON — NỔI GIẬN CẮN DOUBLE</Text>
                <TouchableOpacity onPress={onClose}>
                  <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.descText}>
                Sói Con bị hạ sát! Đêm tiếp theo bầy Sói được quyền cắn 2 người chơi liên tiếp!
              </Text>
              <TouchableOpacity
                style={styles.confirmBtnRed}
                onPress={() => {
                  onConfirm('BOOST_RAGE');
                  onClose();
                }}
              >
                <Text style={styles.confirmBtnTextLight}>KÍCH HOẠT NỔI GIẬN PRAY</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* 12. BEAR TAMER GROWL (CHARACTER_PLUS) */}
          {roleId === 'bear_tamer' && (
            <View style={styles.cardBox}>
              <View style={styles.headerRow}>
                <Text style={styles.titleGold}>🐻 THỢ SĂN GẤU — TIẾNG RỐNG BÌNH MINH</Text>
                <TouchableOpacity onPress={onClose}>
                  <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.descText}>
                Nếu 1 trong 2 người ngồi sát bên Thợ Săn Gấu là Ma Sói, chú Gấu sẽ gầm rú cảnh báo vào bình minh!
              </Text>
              <TouchableOpacity
                style={styles.confirmBtnGold}
                onPress={() => {
                  onConfirm('BEAR_CHECK');
                  onClose();
                }}
              >
                <Text style={styles.confirmBtnTextDark}>KIỂM TRA TIẾNG RỐNG</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  container: { width: '100%', maxWidth: 340 },
  cardBox: { backgroundColor: '#1a1c1f', borderRadius: 16, padding: 16, gap: 12, borderWidth: 1, borderColor: '#333538' },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  titleCyan: { color: Colors.secondary, fontSize: 13, fontWeight: '700' },
  titleRed: { color: Colors.primary, fontSize: 13, fontWeight: '700' },
  titleGold: { color: Colors.tertiary, fontSize: 13, fontWeight: '700' },
  closeText: { color: Colors.onSurfaceVariant, fontSize: 16 },
  descText: { color: Colors.onSurfaceVariant, fontSize: 11, lineHeight: 16 },

  victimAlertBox: { backgroundColor: Colors.primaryContainer, padding: 8, borderRadius: 8 },
  victimAlertText: { color: Colors.onPrimaryContainer, fontSize: 11, fontWeight: '700' },

  potionTabs: { flexDirection: 'row', gap: 8 },
  potionTab: { flex: 1, backgroundColor: '#282a2d', paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  potionTabActiveGold: { backgroundColor: Colors.tertiaryContainer },
  potionTabActiveRed: { backgroundColor: Colors.primaryContainer },
  potionTabText: { color: Colors.onSurface, fontSize: 11, fontWeight: '600' },

  subLabel: { color: Colors.tertiary, fontSize: 10, fontWeight: '700', marginTop: 4 },
  seatsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  seatChip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: '#282a2d' },
  seatChipActiveCyan: { backgroundColor: Colors.secondaryContainer },
  seatChipActiveRed: { backgroundColor: Colors.primaryContainer },
  seatChipActiveGold: { backgroundColor: Colors.tertiaryContainer },
  seatChipText: { color: Colors.onSurfaceVariant, fontSize: 11 },
  seatChipTextActive: { color: '#FFFFFF', fontWeight: '700' },

  confirmBtnCyan: { height: 44, borderRadius: 10, backgroundColor: Colors.secondary, alignItems: 'center', justifyContent: 'center', marginTop: 6 },
  confirmBtnRed: { height: 44, borderRadius: 10, backgroundColor: Colors.primaryContainer, alignItems: 'center', justifyContent: 'center', marginTop: 6 },
  confirmBtnGold: { height: 44, borderRadius: 10, backgroundColor: Colors.tertiary, alignItems: 'center', justifyContent: 'center', marginTop: 6 },
  confirmBtnTextDark: { color: '#111317', fontSize: 12, fontWeight: '800' },
  confirmBtnTextLight: { color: Colors.onPrimaryContainer, fontSize: 12, fontWeight: '800' },
});
