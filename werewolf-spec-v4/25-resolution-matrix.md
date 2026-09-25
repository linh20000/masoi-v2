# 25 — Resolution Matrix

> Đây là tài liệu định nghĩa cách xử lý xung đột giữa các effect khi cùng lúc xảy ra.

## 1. Mục tiêu

- Không dùng if/else ngẫu nhiên.
- Mỗi effect có `priority` rõ ràng.
- Các effect cùng target được resolve theo policy xác định.

## 2. Priority mặc định

```text
1000 PRE_ACTION
2000 ACTION_VALIDATION
3000 PROTECTION
4000 HEAL
5000 DAMAGE
6000 DEATH
7000 RELATIONSHIP
8000 TRANSFORMATION
9000 WIN_CHECK
```

## 3. Resolution rules

### 3.1 Protection before death

- Bodyguard protection resolved trước death confirmation.
- Protection hủy pending death nếu target hợp lệ.
- Nếu không có protection hoặc protection không hợp lệ, death tiếp tục.

### 3.2 Heal before death

- Witch heal hoặc restorative có thể hủy pending death.
- Chỉ hủy nếu death cause nằm trong `healScope`.

### 3.3 Poison is independent

- Poison không bị protection chặn.
- Poison tạo pending death riêng.

### 3.4 Multiple death sources

- Nếu nhiều source cùng tạo death cho một player trong cùng resolution, lưu tất cả causes nhưng chọn `primaryCause` theo priority.
- Chỉ một `PLAYER_DEATH_CONFIRMED` cho mỗi player.

### 3.5 Relationship propagation after death

- Lovers chain death được resolve sau primary death, trước transform.

### 3.6 Transformations before win check

- Transformation phải xong trước khi kiểm tra win condition cuối cùng.

## 4. Matrix ví dụ

| Effect A | Effect B | Rule |
|---|---|---|
| Wolf attack | Bodyguard | Protection wins |
| Wolf attack | Witch heal | Heal wins if scope matches |
| Wolf attack | Witch poison | Poison resolved independently |
| Execution | Idiot | Idiot survive and lose vote |
| Death | Lover relationship | Chain death trigger after primary death |
| Death | Wild Child idol | Transform after death chain |
| Death | Win check | Win check after all transforms |

## 5. Anti-loop rule

- maxChainDepth = 32
- nếu death chain lặp lại target hoặc cycle, dừng và báo `DEATH_CYCLE_DETECTED`
