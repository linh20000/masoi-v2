import React, { useState } from 'react';
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

interface WakeStep {
  stepNum: number;
  roleName: string;
  roleTitle: string;
  status: 'completed' | 'active' | 'waiting';
  cardKey: keyof typeof ROLE_CARD_IMAGES;
  desc: string;
}

const WAKE_STEPS: WakeStep[] = [
  {
    stepNum: 1, roleName: 'Tiên Tri', roleTitle: 'Soi Căn Cước',
    status: 'completed', cardKey: 'seer',
    desc: 'Đã thực hiện xong soi linh hồn Ghế IV.',
  },
  {
    stepNum: 2, roleName: 'Bảo Kê', roleTitle: 'Đặt Khiên Trúng Đêm',
    status: 'completed', cardKey: 'defender',
    desc: 'Đã bảo vệ thành công một mục tiêu.',
  },
  {
    stepNum: 3, roleName: 'Phe Ma Sói', roleTitle: 'Hội Ý Cắn Mồi',
    status: 'active', cardKey: 'werewolf',
    desc: 'Đang hội ý chọn nạn nhân phanh thây trong đêm.',
  },
  {
    stepNum: 4, roleName: 'Phù Thủy', roleTitle: 'Độc Dược & Thuốc Cứu',
    status: 'waiting', cardKey: 'witch',
    desc: 'Đang chờ bầy Sói cắn xong.',
  },
  {
    stepNum: 5, roleName: 'Thợ Săn Bạc', roleTitle: 'Gài Mũi Tên Tàn Tội',
    status: 'waiting', cardKey: 'hunter',
    desc: 'Đang chờ phong ấn bình minh.',
  },
];

export default function WakeUpSequenceScreen({ onNavigate }: { onNavigate?: (screen: string) => void }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => onNavigate && onNavigate('Home')}>
          <Text style={styles.backBtnText}>‹ Trang Chủ</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>📜 TRẬT TỰ THỨC GIẤC BAN ĐÊM</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.mainScroll} contentContainerStyle={styles.scrollContent}>
        {/* Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerTag}>HÀNG ĐỜI NĂNG LỰC</Text>
          <Text style={styles.bannerTitle}>Chuỗi Hiệu Triệu Quản Trò</Text>
          <Text style={styles.bannerSub}>
            Trật tự kích hoạt các quyền năng ban đêm được thực hiện lần lượt để đảm bảo tính minh bạch và công bằng.
          </Text>
        </View>

        {/* Sequence Steps Stream */}
        <View style={styles.stepsContainer}>
          {WAKE_STEPS.map((step) => (
            <View
              key={step.stepNum}
              style={[
                styles.stepCard,
                step.status === 'active' && styles.stepCardActive,
                step.status === 'completed' && styles.stepCardCompleted,
              ]}
            >
              <View style={styles.stepHeader}>
                <View style={styles.stepNumBadge}>
                  <Text style={styles.stepNumText}>LƯỢT {step.stepNum}</Text>
                </View>

                <View style={[
                  styles.statusTag,
                  step.status === 'active' && styles.statusTagActive,
                  step.status === 'completed' && styles.statusTagCompleted,
                ]}>
                  <Text style={styles.statusTagText}>
                    {step.status === 'active' ? '🔥 ĐANG HOẠT ĐỘNG' : step.status === 'completed' ? '✓ ĐÃ XONG' : '⏳ CHỜ THỨC'}
                  </Text>
                </View>
              </View>

              <View style={styles.stepBody}>
                <Image
                  source={{ uri: ROLE_CARD_IMAGES[step.cardKey] }}
                  style={styles.stepRoleImg}
                  resizeMode="cover"
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.roleNameText}>{step.roleName}</Text>
                  <Text style={styles.roleTitleText}>{step.roleTitle}</Text>
                  <Text style={styles.roleDescText}>{step.desc}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Footer Navigation */}
      <View style={styles.footerBar}>
        <TouchableOpacity style={styles.continueBtn} onPress={() => onNavigate && onNavigate('NightPhase')}>
          <Text style={styles.continueBtnText}>🌙 Quay Về Bàn Đêm</Text>
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

  mainScroll: { flex: 1 },
  scrollContent: { padding: Spacing.marginMobile, gap: 14 },

  banner: {
    backgroundColor: `${Colors.tertiaryContainer}40`, padding: 14, borderRadius: 12,
    borderWidth: 1, borderColor: `${Colors.tertiary}40`, gap: 4,
  },
  bannerTag: { color: Colors.tertiary, fontSize: 9, fontWeight: '700', letterSpacing: 1 },
  bannerTitle: { color: Colors.onSurface, fontSize: 16, fontWeight: '700' },
  bannerSub: { color: Colors.onSurfaceVariant, fontSize: 11, lineHeight: 16 },

  stepsContainer: { gap: 10 },
  stepCard: {
    backgroundColor: Colors.surfaceContainerLow, borderRadius: 12, padding: 12, gap: 8,
    borderWidth: 1, borderColor: `${Colors.outline}26`,
  },
  stepCardActive: { borderColor: Colors.primaryContainer, backgroundColor: Colors.surfaceContainer },
  stepCardCompleted: { opacity: 0.7 },

  stepHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  stepNumBadge: { backgroundColor: Colors.surfaceContainerHigh, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  stepNumText: { color: Colors.tertiary, fontSize: 9, fontWeight: '700' },
  statusTag: { backgroundColor: Colors.surfaceContainerHighest, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  statusTagActive: { backgroundColor: Colors.primaryContainer },
  statusTagCompleted: { backgroundColor: `${Colors.secondaryContainer}40` },
  statusTagText: { color: Colors.onSurface, fontSize: 9, fontWeight: '700' },

  stepBody: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  stepRoleImg: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: Colors.tertiary },
  roleNameText: { color: Colors.onSurface, fontSize: 13, fontWeight: '700' },
  roleTitleText: { color: Colors.secondary, fontSize: 11, fontWeight: '600' },
  roleDescText: { color: Colors.onSurfaceVariant, fontSize: 10, marginTop: 2 },

  footerBar: {
    height: 64, backgroundColor: Colors.surfaceContainerLow, paddingHorizontal: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderTopWidth: 1, borderTopColor: `${Colors.outline}33`,
  },
  continueBtn: {
    width: '100%', height: 44, backgroundColor: Colors.primaryContainer, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
  },
  continueBtnText: { color: Colors.onPrimaryContainer, fontSize: 13, fontWeight: '700' },
});
