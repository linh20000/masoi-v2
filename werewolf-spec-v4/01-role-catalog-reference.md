# 01 — Canonical Role Catalog

Canonical details are stored under `02-role-details/`. There are 43 Character Roles.
Activation lifecycle and call order are defined in `37-role-lifecycle-catalog.md`.
2. **Tiên tri** — `seer` — nhóm `basic`
3. **Bảo vệ / Cảnh vệ** — `bodyguard` — nhóm `basic`
4. **Phù thủy** — `witch` — nhóm `basic`
5. **Thợ săn** — `hunter` — nhóm `basic`
6. **Thần tình yêu** — `cupid` — nhóm `basic`
7. **Sói thường** — `werewolf` — nhóm `wolves`
8. **Sói con** — `wolf-cub` — nhóm `wolves`
9. **Ăn trộm** — `thief` — nhóm `neutral`
10. **Người thổi sáo** — `pied-piper` — nhóm `neutral`
11. **Nửa người Nửa sói / Chó sói / Bán Sói** — `wolf-dog` — nhóm `neutral`
12. **Sói trắng** — `white-werewolf` — nhóm `wolves`
13. **Cô Bé** — `little-girl` — nhóm `basic`
14. **Thằng ngốc** — `idiot` — nhóm `basic`
15. **Già làng** — `elder` — nhóm `basic`
16. **Người thế thân** — `scapegoat` — nhóm `basic`
17. **Con quạ** — `raven` — nhóm `basic`
18. **Hai chị em** — `two-sisters` — nhóm `basic`
19. **Ba anh em** — `three-brothers` — nhóm `basic`
20. **Thiên sứ** — `angel` — nhóm `neutral`
21. **Thẩm phán lắp bắp** — `stuttering-judge` — nhóm `basic`
22. **Hiệp sĩ kiếm gỉ** — `rusty-sword-knight` — nhóm `basic`
23. **Cáo** — `fox` — nhóm `basic`
24. **Người thuần phục gấu** — `bear-tamer` — nhóm `basic`
25. **Diễn viên** — `actor` — nhóm `neutral`
26. **Người đầy tớ tận tụy** — `devoted-servant` — nhóm `neutral`
27. **Thành viên giáo phái** — `sect-member` — nhóm `neutral`
28. **Đứa trẻ hoang dã** — `wild-child` — nhóm `neutral`
29. **Sói lớn xấu xa** — `big-bad-wolf` — nhóm `wolves`
30. **Người cha của sói** — `father-of-werewolves` — nhóm `wolves`
31. **Bà đồng** — `spiritualist` — nhóm `neutral`
32. **Nguyệt Nữ** — `moon-maiden` — nhóm `basic`
33. **Thầy thôi miên** — `hypnotist` — nhóm `basic`
34. **Dược sĩ** — `pharmacist` — nhóm `basic`
35. **Người múa rối** — `puppeteer` — nhóm `basic`
36. **Sát thủ** — `assassin` — nhóm `neutral`
37. **Con Quạ (Bản Plus)** — `raven-plus` — nhóm `basic`
38. **Người gọi hồn** — `necromancer` — nhóm `basic`
39. **Sói lửa** — `fire-wolf` — nhóm `wolves`
40. **Anh Em Sói** — `wolf-brothers` — nhóm `wolves`
41. **Ảnh tử** — `shadow` — nhóm `neutral`
42. **Kẻ báo thù** — `avenger` — nhóm `neutral`
43. **Kẻ đốt nhà** — `arsonist` — nhóm `neutral`

## Normalization notes
- `Cảnh sát trưởng / Trưởng làng` và `Cảnh sát` không nằm trong Character Role catalog vì nguồn xác định đây là chức danh gán thêm.
- `Cặp đôi khác phe yêu nhau` là runtime relationship tạo bởi Cupid, không phải Character Role độc lập.
- `Trăng Máu / Blood Moon` là Event Card.
- Guard/Bảo vệ và Raven/Con Quạ xuất hiện lặp trong nguồn; catalog giữ một canonical role.
- Nguồn có hai cách mô tả Wolf-Dog/Nửa người Nửa sói: chọn phe ngay đầu game hoặc bị Sói cắn rồi hóa Sói. Hai cách này được giữ như variant/scenario rule, không tự ý gộp thành một luật mới.
