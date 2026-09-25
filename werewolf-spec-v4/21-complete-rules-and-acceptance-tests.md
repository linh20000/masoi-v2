# 21 — Complete Rules, Edge Cases & Acceptance Tests

> Tài liệu này bổ sung các luật còn thiếu để bộ luật hiện tại có thể triển khai và kiểm thử. Các quy tắc ở đây là default ruleset V4. Nếu một pack hoặc scenario muốn dùng biến thể khác, phải khai báo `variantCode` khi game khởi tạo; không được thay đổi giữa các ván.

## 1. Nguyên tắc chung

1. Server là nguồn sự thật duy nhất.
2. Mọi hành động đều có `actionId`, `clientRequestId`, `actorId`, `submittedAt`, `phase`, `sequence`.
3. Một `clientRequestId` chỉ được xử lý một lần. Request lặp lại trả về kết quả cũ, không tạo hiệu ứng lần hai.
4. Action chỉ hợp lệ nếu actor còn sống, đúng phase/turn, chưa bị vô hiệu hóa và target hợp lệ tại thời điểm server nhận action.
5. Action hợp lệ được ghi nhận trước; hiệu ứng chỉ được thực thi trong resolution thích hợp.
6. Khi hết timer, action chưa gửi được xem là `PASS`, trừ action bắt buộc. Action bắt buộc không có lựa chọn thì dùng target mặc định do scenario quy định; không tự chọn ngẫu nhiên nếu chưa khai báo.
7. Người chơi disconnect không làm dừng phase. Reconnect nhận replay theo sequence hoặc snapshot mới nhất.
8. Death, transformation và win check chỉ được chốt sau khi hoàn thành resolution của event hiện tại.
9. Khi tài liệu nguồn mâu thuẫn, scenario phải chọn đúng variant trước khi bắt đầu; server không tự trộn hai luật.

## 2. Setup ván chơi

### 2.1 Điều kiện phòng

- Mặc định: 5–20 người chơi thật và 1 host/Quản trò hệ thống.
- Không bắt đầu nếu không đạt số người tối thiểu của preset.
- Mỗi player chỉ có một Character Role; Title và Relationship là state bổ sung.
- Không được có hai role độc quyền nếu scenario không cho phép.
- Role bị loại khỏi deck phải được ghi vào `excludedRoles`.
- Mọi ván phải lưu: `rulesetVersion`, `scenarioCode`, `roleDeck`, `variantCodes`, `seed` và thứ tự player.

### 2.2 Preset mặc định

| Người chơi | Sói tối thiểu | Gợi ý role đặc biệt | Phe thứ ba |
|---:|---:|---|---|
| 5–6 | 1 | Tiên tri, Bảo vệ hoặc Phù thủy | Không mặc định |
| 7–8 | 2 | Thợ săn, Cupid, Cô bé | Tối đa 1 |
| 9–11 | 2–3 | Già làng, Cáo, Quạ, Người thế thân | Tối đa 1 |
| 12–15 | 3–4 | role Plus | Tối đa 2 |
| 16–20 | 4–5 | role nâng cao, Event | Theo scenario |

Preset chỉ là mặc định cân bằng, không phải công thức cứng. Scenario phải xác định chính xác từng lá bài trước khi chia.

### 2.3 Kiểm tra hợp lệ trước khi bắt đầu

- Có ít nhất một role có khả năng giết trong phe Sói.
- Có ít nhất một điều kiện thắng áp dụng được cho mỗi phe đang tồn tại.
- Không dùng Angel nếu không định nghĩa rõ điều kiện `FIRST_NIGHT`.
- Không dùng Piper nếu không đủ số người sống để thôi miên.
- Không dùng Lovers/relationship làm phe thứ ba nếu không có Cupid hoặc cơ chế tạo relationship tương ứng.
- Không dùng role phụ thuộc Event nếu Event chưa được đưa vào deck.

## 3. Phase và timeout

### 3.1 Thứ tự phase

```text
WAITING → STARTING → ROLE_REVEAL → NIGHT
→ NIGHT_RESOLUTION → DAY → DISCUSSION → VOTING
→ VOTE_RESOLUTION → WIN_CHECK → GAME_OVER / NIGHT
```

- `ROLE_REVEAL`: server gửi role và knowledge riêng tư; không gửi role của người khác.
- `NIGHT`: role được gọi theo `nightOrder` của scenario.
- `DAY`: công bố kết quả chết sau khi night resolution hoàn tất.
- `DISCUSSION`: người chết không được nói hoặc gửi chat vào kênh người sống.
- `VOTING`: chỉ player còn quyền vote mới được gửi `VOTE_EXECUTION`.
- Chuyển phase phải phát một event có `fromPhase`, `toPhase`, `sequence`, `deadline`.

### 3.2 Timeout

- Role active hết giờ: `PASS`.
- Sói có nhiều người nhưng không thống nhất mục tiêu: scenario dùng `wolfVotePolicy` (đa số; hòa thì không cắn; hoặc target leader). Default: đa số, hòa thì không cắn.
- Voting hết giờ: vote chưa gửi tính là abstain.
- Nếu không có phiếu hợp lệ, không ai bị xử tử và vẫn thực hiện `WIN_CHECK`.

## 4. Target và action validation

Mỗi action phải kiểm tra:

```text
actor alive
actor owns ability
phase and turn valid
ability not disabled
usage limit remaining
target exists
 target alive/dead requirement
self-target requirement
faction/relationship requirement
cooldown and scenario restriction
```

Mặc định:

- Không chọn người chết, trừ action có `targetState: DEAD`.
- Không chọn chính mình, trừ role ghi rõ cho phép.
- Target bị chọn nhiều lần trong cùng action phải bị reject.
- Nếu target chết sau lúc action được gửi nhưng trước resolution, action được xử lý theo `targetStateAtResolution`; nếu target không còn hợp lệ thì action thất bại, không tự đổi sang target khác.
- Không được sửa action sau deadline; nếu cần đổi, phải gửi command thay thế trước deadline và server ghi audit.
- Bị disable trước khi resolution: action chưa resolve bị hủy. Passive death trigger vẫn hoạt động trừ khi status ghi rõ `disableDeathTrigger`.

## 5. Night resolution mặc định

Resolution dùng các bước sau, mỗi bước có transaction và event audit:

```text
1. Freeze actions
2. Validate actions
3. Resolve pre-action disables/statuses
4. Resolve wolf vote and attacks
5. Resolve special attacks (White Wolf, extra bite, Assassin)
6. Resolve protection
7. Resolve healing/restoration
8. Resolve poison, curse, burn and direct damage
9. Resolve survival rules (Elder, Idiot, Rusty Sword Knight)
10. Resolve scheduled deaths
11. Propagate Lovers/other death relationships
12. Resolve death triggers (Hunter, Avenger, Wolf Cub, Wild Child)
13. Resolve transformations
14. Recalculate knowledge and public results
15. Check win conditions
```

### 5.1 Death model

Mọi nguồn chết tạo `PendingDeath`:

```text
victim, cause, source, createdAt, priority, preventable, publicReason
```

- Cứu chỉ hủy `PendingDeath` mà effect đó cho phép hủy.
- `POISON`, `ASSASSIN_KILL`, `EXECUTION` mặc định không bị Bảo vệ hủy.
- `WOLF_ATTACK` bị Bảo vệ/thuốc cứu hủy nếu target chưa có luật miễn.
- Một player chỉ chết một lần; các trigger sau đó nhận event `PLAYER_DEATH_CONFIRMED`.
- Nguyên nhân chết chỉ công khai nếu scenario cho phép; Quản trò/server luôn biết.
- Nếu nhiều nguyên nhân cùng lúc, lưu tất cả causes nhưng chọn một `primaryCause` theo priority để hiển thị.

## 6. Luật role và case đặc biệt

### 6.1 Sói và các biến thể

- Sói thường: phe Sói, biết các thành viên Sói được phép biết; cả phe tạo một `WOLF_ATTACK` mỗi đêm.
- Sói Con chết được tạo đúng một extra bite vào đêm kế tiếp; nếu Sói Con được cứu thì không kích hoạt.
- Sói Trắng: vẫn tham gia wolf attack; sau khi lượt Sói kết thúc, có thể giết một Sói một lần mỗi chu kỳ theo variant `WHITE_WOLF_KILL`. Không được giết chính mình.
- Sói Lớn Xấu Xa: extra attack chỉ khả dụng khi điều kiện scenario còn đúng; mỗi target extra phải khác target cắn chính.
- Cha Sói: chuyển nạn nhân của `WOLF_ATTACK` thành Sói chỉ khi nạn nhân chưa được cứu và effect conversion được bật trước death confirmation. Conversion không áp dụng cho role miễn nhiễm hoặc role bị cấm bởi scenario.
- Sói Lửa: vô hiệu hóa ability của target trong thời hạn được khai báo; không xóa role, title, knowledge đã nhận.
- Anh Em Sói: phân biệt `WOLF_BROTHER` và `WOLF_SISTER`/vai trò tương ứng phải được lưu như role state, không suy diễn từ tên hiển thị.
- Wolf-Dog: V4 bắt buộc chọn một trong `VILLAGE_LOCKED` hoặc `WOLF_LOCKED` trước khi chia bài. Không được cho player chọn nếu scenario không bật `playerChoice`.

### 6.2 Dân và role phòng thủ

- Bảo vệ: một target mỗi đêm; mặc định không được bảo vệ cùng target trong hai đêm liên tiếp; bảo vệ không chặn poison, execution, Hunter shot hoặc Lovers propagation.
- Già làng: có hai hit point đối với `WOLF_ATTACK`; poison/execution/Hunter mặc định bỏ qua extra life. Khi mất extra life, server phát private status, không công khai nếu luật không yêu cầu.
- Hiệp sĩ kiếm gỉ: nếu chết bởi wolf attack, wolf gây thương nhận `WOUNDED_UNTIL_NEXT_DAY_END`; không chết ngay trừ khi scenario bật lethal variant.
- Idiot: khi bị execution, lật role, sống và mất quyền vote vĩnh viễn. Nếu đang giữ Title có thể chuyển Title theo luật Title. Không được kích hoạt khi chết bởi nguyên nhân khác.
- Scapegoat: chỉ chết khi kết quả vote hợp lệ là hòa; không chết khi không có phiếu. Sau đó chọn người được quyền vote ngày kế tiếp; lựa chọn phải được ghi server.

### 6.3 Role thông tin

- Tiên tri nhận đúng loại thông tin mà scenario khai báo: `ROLE`, `ALIGNMENT` hoặc `WOLF_OR_NOT`; không được suy diễn loại còn lại.
- Cáo chọn đúng ba người còn sống. Nếu nhóm có Sói, ability vẫn còn; nếu không có Sói, mất ability theo rule hiện tại.
- Gấu phát hiện Sói ở hai hàng xóm sống gần nhất; người chết bỏ qua khi tính láng giềng.
- Cô bé chỉ peek từ đêm 2; peek không được tạo knowledge về role cụ thể nếu source chỉ cho phép nhìn Sói.
- Hai chị em/Ba anh em chỉ biết thành viên cùng relationship, không tự động biết role/alignment.

### 6.4 Witch, Pharmacist và các role cứu/độc

- Witch có một `HEAL` và một `POISON`, mỗi loại một lần; được dùng cả hai trong cùng đêm nếu scenario bật `dualUse`.
- HEAL mặc định chỉ cứu nạn nhân của wolf attack trong đêm đó; không cứu execution, poison, Assassin hoặc death chain.
- POISON tạo pending death độc lập; Bảo vệ không chặn.
- Pharmacist `SEDATIVE` làm mất vote và chat trong đúng ngày kế tiếp; `RESTORATIVE` chỉ cứu đúng death cause được khai báo, mặc định là Witch poison.
- Không action nào được tự chuyển target nếu target chết trước resolution.

### 6.5 Lovers, Cupid và relationship

- Cupid tạo đúng một relationship trong đêm đầu; sau khi tạo, Cupid không cần còn sống để relationship tồn tại.
- Lovers được biết danh tính nhau; nếu khác phe, win condition chuyển sang `LOVERS_LAST_TWO` theo scenario.
- Khi một Lover chết được xác nhận, Lover còn lại nhận `LOVER_CHAIN_DEATH`; chain death không bị Bảo vệ hủy và không kích hoạt lại người đã chết.
- Nếu cả hai cùng chết trong một resolution, chỉ tạo một relationship event, không lặp chain.

### 6.6 Role chuyển hóa

- Wild Child chọn idol đêm đầu. Idol chết được xác nhận thì transform ở cuối resolution, sau death chain của đêm đó.
- Shadow chỉ nhận role của target nếu target chết và role đó được phép copy; không copy Title/knowledge.
- Devoted Servant được đổi role với người bị execution trước `PLAYER_DEATH_CONFIRMED`; sau đổi, target chết và Servant nhận role/knowledge theo variant.
- Transformation không hồi sinh player, không reset usage history trừ khi variant ghi rõ.

### 6.7 Role chết kích hoạt hành động

- Hunter chỉ bắn theo cause được scenario cho phép; default: bắn khi chết bởi Sói hoặc execution, không bắn khi poison.
- Avenger chọn alignment đầu game; khi chết, target đúng alignment bị giết nếu target còn sống. Effect này không tự gây chuỗi vô hạn.
- Wolf Cub trigger chỉ chạy khi death confirmation, không chạy khi bị disable hoặc bị cứu.
- Mọi death trigger phải có `oncePerGame` hoặc `oncePerDeath`; server chống lặp bằng event ID.

## 7. Luật bỏ phiếu ban ngày

### 7.1 Quyền nói và quyền vote

- Chỉ player sống và không có status `SILENCED` được nói trong discussion.
- Chỉ player sống, có `canVote=true`, mới được vote.
- Player bị `SILENCED` vẫn được vote nếu không có status `VOTE_DISABLED`.
- Người chết không vote, không chat với người sống và không được tác động vào target.
- Raven tạo vote modifier trước khi mở voting; modifier được gắn vào target, không gắn vào người bỏ phiếu.
- Title Sheriff/Mayor mặc định có 2 vote khi tính tổng; nếu họ mất quyền vote thì cả hai phiếu bị mất.

### 7.2 Tính kết quả

```text
valid votes
→ áp dụng vote modifier
→ cộng Title multiplier
→ bỏ target không hợp lệ
→ tìm số phiếu cao nhất
```

- Abstain không tính vào mẫu số và không tạo hòa.
- Không có vote hợp lệ: không execution.
- Có từ hai target cao nhất trở lên: kết quả hòa.
- Scapegoat chết trong hòa nếu còn sống và scenario bật rule.
- Nếu không có Scapegoat: không ai bị xử tử trong default ruleset.
- Sau khi xác định execution target, Stuttering Judge có thể yêu cầu một vòng vote phụ một lần trong toàn game, trước khi death confirmation.
- Idiot reveal hủy execution, đặt `canVote=false`, sau đó chuyển Title nếu cần.
- Hunter/Knight action được mở sau khi execution target đã được chốt nhưng trước death confirmation nếu scenario yêu cầu.

### 7.3 Công khai

Sáng hôm sau công khai danh sách người chết và role chỉ khi `revealRoleOnDeath=true`. Không công khai ai đã cứu, ai gây poison, ai vote cho target, hoặc kết quả private inspection nếu scenario không quy định.

## 8. Điều kiện thắng và thứ tự ưu tiên

Win check chạy sau mỗi `PLAYER_DEATH_CONFIRMED`, sau transformation và cuối mỗi phase. Default priority:

1. `ANGEL_FIRST_NIGHT_DEATH` — Angel thắng nếu chết đúng điều kiện trong đêm/ngày đầu; game kết thúc ngay sau khi death được xác nhận.
2. `LOVERS_LAST_TWO` — cả hai Lover còn sống và mọi player khác đã chết.
3. `PIPER_ALL_BEWITCHED` — mọi player còn sống hợp lệ bị bewitched.
4. `SECT_ELIMINATE_OPPOSING_GROUP` — Sect đạt mục tiêu scenario.
5. `WHITE_WOLF_SOLE_SURVIVOR` — White Wolf là người sống duy nhất.
6. `WEREWOLF_DOMINATION` — số player Sói có thể kiểm soát vote/không còn phe đối lập có khả năng ngăn thắng.
7. `VILLAGE_ELIMINATE_WEREWOLVES` — không còn Werewolf sống và Village vẫn có thể nhận thắng.

Nếu nhiều điều kiện cùng đạt trong cùng resolution, ghi tất cả `qualifiedWinners`, nhưng chọn kết quả theo priority trên. Scenario có thể thay priority bằng `winPriority`; không được hard-code trong role.

## 9. Public event và private knowledge

Mọi event phải khai báo `audience`:

- `PUBLIC`: phase change, public death, voting result.
- `PLAYER`: inspection, role knowledge, private prompt.
- `GROUP`: wolf pack, lovers, siblings.
- `MODERATOR`: nguyên nhân chết chi tiết, audit.

Snapshot công khai tuyệt đối không chứa role, alignment, pending private action, private target hoặc knowledge của player khác.

## 10. Acceptance test bắt buộc

### Setup/phase

- Không bắt đầu khi thiếu player hoặc thiếu điều kiện thắng.
- Role reveal không làm lộ role người khác.
- Timeout tạo PASS đúng một lần.
- Reconnect nhận replay nếu sequence còn retention; nếu không nhận snapshot.
- Duplicate request không tạo effect thứ hai.

### Night/death

- Wolf attack + Bodyguard: target sống.
- Wolf attack + Witch heal: target sống.
- Witch poison + Bodyguard: target vẫn chết.
- Elder nhận hai wolf hit mới chết; execution/poison vẫn giết theo default.
- Wolf Cub chết: chỉ có một extra bite ở đêm kế.
- White Wolf không thể giết bản thân hoặc dùng action ngoài turn.
- Father conversion không chạy nếu target đã được cứu.
- Lovers chain death chỉ chạy một lần và không bị bảo vệ.
- Hunter chỉ bắn đúng các death cause được cấu hình.
- Moon Maiden disable trước action: action bị reject; disable sau action nhưng trước resolution: action bị hủy.

### Day/vote

- Người chết không thể vote hoặc chat vào kênh người sống.
- Raven modifier được cộng đúng một lần.
- Sheriff có đúng số vote cấu hình.
- Hòa phiếu có Scapegoat: Scapegoat chết.
- Hòa phiếu không có Scapegoat: không execution.
- Idiot bị vote: sống nhưng mất quyền vote.
- Stuttering Judge chỉ dùng được một lần.
- Abstain không tạo hòa.

### Transformation/win

- Wild Child transform sau khi idol chết được xác nhận.
- Devoted Servant đổi role trước death confirmation.
- Wolf-Dog dùng đúng variant đã lưu trong game.
- Angel thắng đúng first-night condition.
- Lovers thắng khi là hai người sống cuối cùng.
- Village thắng sau khi Sói cuối cùng chết nếu không có phe ưu tiên cao hơn.
- Hai điều kiện thắng đồng thời trả về đầy đủ winners và kết quả theo `winPriority`.

### Security/consistency

- Private knowledge không xuất hiện trong public snapshot.
- Event sequence tăng đơn điệu.
- Rollback/retry không làm chết hoặc biến đổi một player hai lần.
- Audit có actor, target, cause, variant, priority và resolution ID cho mọi effect.

## 11. Những điểm scenario bắt buộc phải khai báo

```yaml
scenarioCode: classic-v4
rulesetVersion: 4.1
wolfDogVariant: VILLAGE_LOCKED
bloodMoonVariant: DISABLED
wolfVotePolicy: MAJORITY_TIE_NO_ATTACK
revealRoleOnDeath: true
hunterDeathCauses: [WOLF_ATTACK, EXECUTION]
witchHealScope: WOLF_ATTACK
bodyguardRepeatPolicy: FORBID_CONSECUTIVE
voteTiePolicy: SCAPEGOAT_IF_PRESENT_ELSE_NO_EXECUTION
winPriority: [ANGEL, LOVERS, PIPER, SECT, WHITE_WOLF, WOLVES, VILLAGE]
nightTimeoutPolicy: PASS
```

Một scenario không có các giá trị trên bị coi là chưa implementation-ready.
