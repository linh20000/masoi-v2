/**
 * Step Call State Machine Schema & Priority Order Specification
 * Supports Card Sets: BASIC, CHARACTER, CHARACTER_PLUS
 */

export type CardSet = 'BASIC' | 'CHARACTER' | 'CHARACTER_PLUS';

export type RoleLifecycle =
  | 'PASSIVE'
  | 'FIRST_NIGHT_ONLY'
  | 'EVERY_NIGHT'
  | 'FROM_SECOND_NIGHT'
  | 'ALTERNATING_NIGHT'
  | 'DAY_ACTION'
  | 'DEATH_EVENT'
  | 'CONDITIONAL'
  | 'ONCE_WHEN_CONDITION_MET'
  | 'DURING_OTHER_ACTION'
  | 'SETUP_ONLY'
  | 'TRANSFORMATION_EVENT';

export type StepCallState =
  | 'IDLE'
  | 'ROLE_TURN_START'
  | 'ACTIVATION_CHECK'
  | 'ACTION_AVAILABLE'
  | 'PLAYER_SUBMITS'
  | 'ACTION_CLOSED'
  | 'RESOLVE_ACTION'
  | 'PRIVATE_RESULT'
  | 'EVENT_DISPATCH'
  | 'NEXT_ACTION';

export type TimeoutPolicy = 'SKIP' | 'AUTO_RESOLVE' | 'USE_DEFAULT' | 'WAIT_FOR_GROUP';

export interface ActionDefinition {
  id: string;
  roleId: string;
  roleName: string;
  cardSet: CardSet;
  lifecycle: RoleLifecycle;
  turnOrderFirstNight: number;
  turnOrderNormalNight: number;
  mandatory: boolean;
  timeoutSeconds: number;
  timeoutPolicy: TimeoutPolicy;
  description: string;
  scriptLines?: string[];
}

/**
 * Machine-readable Call Order Table derived from Werewolf Role Lifecycle Catalog
 */
export const ACTION_CATALOG: Record<string, ActionDefinition> = {
  // SETUP / FIRST NIGHT ONLY
  thief_exchange: {
    id: 'thief_exchange',
    roleId: 'thief',
    roleName: 'Ăn Trộm',
    cardSet: 'CHARACTER',
    lifecycle: 'FIRST_NIGHT_ONLY',
    turnOrderFirstNight: 10,
    turnOrderNormalNight: -1,
    mandatory: true,
    timeoutSeconds: 15,
    timeoutPolicy: 'USE_DEFAULT',
    description: 'Ăn trộm nhìn 2 lá bài dư và chọn đổi bài.',
    scriptLines: [
      '"Ăn Trộm, thức dậy."',
      '"Đây là hai lá bài đang để lại. Bạn được chọn đổi một lá."',
      '"Ăn Trộm, nhắm mắt ngủ lại."',
    ],
  },
  cupid_bind: {
    id: 'cupid_bind',
    roleId: 'cupid',
    roleName: 'Thần Tình Yêu',
    cardSet: 'CHARACTER',
    lifecycle: 'FIRST_NIGHT_ONLY',
    turnOrderFirstNight: 20,
    turnOrderNormalNight: -1,
    mandatory: true,
    timeoutSeconds: 20,
    timeoutPolicy: 'USE_DEFAULT',
    description: 'Cupid thức giấc bắn mũi tên se duyên cho 2 người chơi.',
    scriptLines: [
      '"Thần Tình Yêu, thức dậy."',
      '"Hãy chọn hai người để trở thành Cặp Đôi Tình Nhân."',
      '"Thần Tình Yêu, nhắm mắt ngủ lại."',
    ],
  },
  wild_child_model: {
    id: 'wild_child_model',
    roleId: 'wild_child',
    roleName: 'Đứa Trẻ Hoang Dã',
    cardSet: 'CHARACTER',
    lifecycle: 'FIRST_NIGHT_ONLY',
    turnOrderFirstNight: 30,
    turnOrderNormalNight: -1,
    mandatory: true,
    timeoutSeconds: 15,
    timeoutPolicy: 'USE_DEFAULT',
    description: 'Đứa Trẻ Hoang Dã chọn 1 người làm Thần Tượng.',
    scriptLines: [
      '"Đứa Trẻ Hoang Dã, thức dậy."',
      '"Hãy chọn một người làm Thần Tượng của bạn."',
      '"Đứa Trẻ Hoang Dã, nhắm mắt ngủ lại."',
    ],
  },
  sisters_brothers_wake: {
    id: 'sisters_brothers_wake',
    roleId: 'two_sisters',
    roleName: 'Hai Chị Em / Ba Anh Em',
    cardSet: 'CHARACTER',
    lifecycle: 'FIRST_NIGHT_ONLY',
    turnOrderFirstNight: 40,
    turnOrderNormalNight: -1,
    mandatory: false,
    timeoutSeconds: 10,
    timeoutPolicy: 'SKIP',
    description: 'Hai chị em / Ba anh em thức giấc nhận mặt nhau.',
    scriptLines: [
      '"Hai Chị Em / Ba Anh Em, thức dậy."',
      '"Hãy nhận biết những người cùng nhóm với mình."',
      '"Nhắm mắt ngủ lại."',
    ],
  },

  // EVERY NIGHT / RECURRING
  actor_setup: {
    id: 'actor_setup',
    roleId: 'actor',
    roleName: 'Diễn Viên',
    cardSet: 'CHARACTER',
    lifecycle: 'EVERY_NIGHT',
    turnOrderFirstNight: 50,
    turnOrderNormalNight: 10,
    mandatory: false,
    timeoutSeconds: 15,
    timeoutPolicy: 'SKIP',
    description: 'Diễn Viên chọn 1 trong 3 lá bài vai trò để mạo danh.',
    scriptLines: [
      '"Diễn Viên, thức dậy."',
      '"Bạn có thể chọn mạo danh một trong các lá bài chức năng để ngoài."',
      '"Diễn Viên, nhắm mắt ngủ lại."',
    ],
  },
  seer_inspect: {
    id: 'seer_inspect',
    roleId: 'seer',
    roleName: 'Tiên Tri',
    cardSet: 'BASIC',
    lifecycle: 'EVERY_NIGHT',
    turnOrderFirstNight: 60,
    turnOrderNormalNight: 20,
    mandatory: true,
    timeoutSeconds: 20,
    timeoutPolicy: 'SKIP',
    description: 'Tiên Tri chọn 1 người chơi để soi kiểm tra phe phái.',
    scriptLines: [
      '"Tiên Tri, thức dậy."',
      '"Hãy chỉ định một người chơi để soi căn cước linh hồn."',
      '"Tiên Tri, nhắm mắt ngủ lại."',
    ],
  },
  fox_sniff: {
    id: 'fox_sniff',
    roleId: 'fox',
    roleName: 'Hồ Ly',
    cardSet: 'CHARACTER',
    lifecycle: 'EVERY_NIGHT',
    turnOrderFirstNight: 70,
    turnOrderNormalNight: 30,
    mandatory: false,
    timeoutSeconds: 15,
    timeoutPolicy: 'SKIP',
    description: 'Hồ Ly ngửi 3 người chơi liền kề để phát hiện Sói.',
    scriptLines: [
      '"Hồ Ly, thức dậy."',
      '"Hãy chọn ba người chơi liền kề để đánh mùi ma thuật."',
      '"Hồ Ly, nhắm mắt ngủ lại."',
    ],
  },
  defender_protect: {
    id: 'defender_protect',
    roleId: 'defender',
    roleName: 'Bảo Vệ',
    cardSet: 'CHARACTER',
    lifecycle: 'EVERY_NIGHT',
    turnOrderFirstNight: 80,
    turnOrderNormalNight: 40,
    mandatory: true,
    timeoutSeconds: 15,
    timeoutPolicy: 'USE_DEFAULT',
    description: 'Bảo Vệ dựng khiên bảo vệ 1 người chơi không bị Sói cắn.',
    scriptLines: [
      '"Bảo Vệ, thức dậy."',
      '"Hãy chọn một người để bảo vệ đêm nay."',
      '"Bảo Vệ, nhắm mắt ngủ lại."',
    ],
  },
  werewolves_attack: {
    id: 'werewolves_attack',
    roleId: 'werewolf',
    roleName: 'Phe Ma Sói',
    cardSet: 'BASIC',
    lifecycle: 'EVERY_NIGHT',
    turnOrderFirstNight: 100,
    turnOrderNormalNight: 50,
    mandatory: true,
    timeoutSeconds: 30,
    timeoutPolicy: 'WAIT_FOR_GROUP',
    description: 'Toàn bộ bầy Sói thức giấc, thảo luận thầm thì và chọn nạn nhân cắn.',
    scriptLines: [
      '"Ma Sói, thức dậy."',
      '"Hãy nhận biết đồng đội và thống nhất mục tiêu cắn đêm nay."',
      '"Ma Sói, nhắm mắt ngủ lại."',
    ],
  },
  white_werewolf_kill: {
    id: 'white_werewolf_kill',
    roleId: 'white_werewolf',
    roleName: 'Sói Trắng',
    cardSet: 'CHARACTER',
    lifecycle: 'ALTERNATING_NIGHT',
    turnOrderFirstNight: 110,
    turnOrderNormalNight: 60,
    mandatory: false,
    timeoutSeconds: 15,
    timeoutPolicy: 'SKIP',
    description: 'Sói Trắng thức giấc vào các đêm chẵn để cắn lẻ 1 Ma Sói khác.',
    scriptLines: [
      '"Sói Trắng, thức dậy."',
      '"Nếu muốn, hãy chọn một con Sói khác để thủ tiêu."',
      '"Sói Trắng, nhắm mắt ngủ lại."',
    ],
  },
  father_wolf_infect: {
    id: 'father_wolf_infect',
    roleId: 'father_of_werewolves',
    roleName: 'Người Cha Của Sói',
    cardSet: 'CHARACTER',
    lifecycle: 'CONDITIONAL',
    turnOrderFirstNight: 120,
    turnOrderNormalNight: 70,
    mandatory: false,
    timeoutSeconds: 10,
    timeoutPolicy: 'SKIP',
    description: 'Chúa Sói chọn truyền nhiễm lây bệnh hóa Sói cho nạn nhân.',
    scriptLines: [
      '"Người Cha Của Sói, thức dậy."',
      '"Bạn có muốn truyền nhiễm hóa Sói cho nạn nhân thay vì giết không?"',
      '"Người Cha Của Sói, nhắm mắt ngủ lại."',
    ],
  },
  big_bad_wolf_extra: {
    id: 'big_bad_wolf_extra',
    roleId: 'big_bad_wolf',
    roleName: 'Sói Lớn',
    cardSet: 'CHARACTER',
    lifecycle: 'CONDITIONAL',
    turnOrderFirstNight: 130,
    turnOrderNormalNight: 80,
    mandatory: false,
    timeoutSeconds: 15,
    timeoutPolicy: 'SKIP',
    description: 'Sói Lớn cắn thêm nhát thứ 2 khi chưa có Sói nào tử nạn.',
    scriptLines: [
      '"Sói Lớn, thức dậy."',
      '"Hãy chọn thêm một nạn nhân thứ hai để cắn."',
      '"Sói Lớn, nhắm mắt ngủ lại."',
    ],
  },
  witch_action: {
    id: 'witch_action',
    roleId: 'witch',
    roleName: 'Phù Thủy',
    cardSet: 'BASIC',
    lifecycle: 'CONDITIONAL',
    turnOrderFirstNight: 140,
    turnOrderNormalNight: 90,
    mandatory: false,
    timeoutSeconds: 20,
    timeoutPolicy: 'SKIP',
    description: 'Phù Thủy xem nạn nhân bị cắn và quyết định dùng Bình Cứu hoặc Bình Độc.',
    scriptLines: [
      '"Phù Thủy, thức dậy."',
      '"Đây là nạn nhân bị Sói cắn. Bạn có muốn dùng Bình Cứu không?"',
      '"Bạn có muốn dùng Bình Độc lên người chơi nào không?"',
      '"Phù Thủy, nhắm mắt ngủ lại."',
    ],
  },
  piper_hypnotize: {
    id: 'piper_hypnotize',
    roleId: 'piper',
    roleName: 'Thổi Sáo',
    cardSet: 'CHARACTER',
    lifecycle: 'EVERY_NIGHT',
    turnOrderFirstNight: 150,
    turnOrderNormalNight: 100,
    mandatory: true,
    timeoutSeconds: 15,
    timeoutPolicy: 'USE_DEFAULT',
    description: 'Thổi Sáo thức giấc thôi miên 2 người chơi.',
    scriptLines: [
      '"Kẻ Thổi Sáo, thức dậy."',
      '"Hãy chọn hai người chơi để thôi miên."',
      '"Kẻ Thổi Sáo, nhắm mắt ngủ lại."',
    ],
  },
  arsonist_action: {
    id: 'arsonist_action',
    roleId: 'arsonist',
    roleName: 'Kẻ Phóng Hỏa',
    cardSet: 'CHARACTER_PLUS',
    lifecycle: 'EVERY_NIGHT',
    turnOrderFirstNight: 160,
    turnOrderNormalNight: 110,
    mandatory: false,
    timeoutSeconds: 15,
    timeoutPolicy: 'SKIP',
    description: 'Kẻ Phóng Hỏa chọn tưới dầu 2 nhà hoặc châm lửa thiêu rụi.',
    scriptLines: [
      '"Kẻ Phóng Hỏa, thức dậy."',
      '"Bạn muốn tưới dầu 2 nhà hay châm lửa thiêu rụi tất cả?"',
      '"Kẻ Phóng Hỏa, nhắm mắt ngủ lại."',
    ],
  },
};
