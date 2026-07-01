# Drummy 付费点 · 付费墙卖点 · 特性 · 总结

> 适用版本:drummy iOS / Mac Catalyst  
> 基于代码扫描:`Paywall/PaywallService.swift` + `Paywall/FeatureUsageStore.swift` + `Paywall/ProLockAlertView.swift` + `L10n.swift`  
> 收入模型:RevenueCat Paywall(Entitlement: `pro`)

---

## 1. 付费点全景(共 8 个)

### 1.1 周限额(自然周 · Mon-Sun · `PaidFeature.weeklyLimit`)

| # | 付费点 | 免费额度 | 触发位置 | 弹墙文案键 |
|---|--------|---------|---------|-----------|
| 1 | 鼓分离(分轨) | **3 次/周** | 鼓识别 tab "快速分析/强力分析" 按钮 | `paywall.marketing.separation` |
| 2 | 鼓点识别 | **3 次/周** | 详情页 "识别" 按钮 | `paywall.marketing.drumHitDetection` |
| 3 | 序列生成 | **2 次/周** | 详情页 "生成" 按钮(免费用户额外限 2 小节) | `paywall.marketing.sequenceGeneration` |

### 1.2 计数限额(`FeatureUsageStore` 中的常量)

| # | 付费点 | 免费上限 |
|---|--------|---------|
| 4 | 识别历史记录保存 | **1 条** |
| 5 | 用户 PRESET 保存 | **3 个** |
| 6 | 变速练习条目 | **1 条** |
| 7 | 变速练习速度段(每条) | **3 段** |

### 1.3 时间窗口限额(`recordDrillStart` + `drillStartCountInWindow`)

| # | 付费点 | 免费上限 |
|---|--------|---------|
| 8 | 变速练习启动 | **2 次 / 30 分钟**(滚动窗口) |

---

## 2. 付费墙触发机制

### 2.1 三种触发场景

| 场景 | 入口 | 体验 |
|------|------|------|
| **A. 超额自动弹** | 用户点用超限功能 → `requestWeeklyFeature(_:)` / `canSave*` 返回 false → 调 `presentPaywall(for:)` | `ProLockAlert` 全屏遮罩 + 升级引导 |
| **B. 用户主动触发** | 详情页点击 PRO 锁图标 / `ProLockBadge` | 同上 |
| **C. 启动每日付费墙** | `showStartupPaywallIfNeeded()` 在 ContentView `.task` 中调 | 每天 1 次,免费用户启动后自动展示 RevenueCat 完整 paywall |

### 2.2 锁定状态 UI 标识

- **`ProLockBadge`** —— 按钮右上角小锁图标 + 渐变橙红
- **`ProLockAlertView`** —— 全屏 Alert,带锁图标 + 限制说明 + "升级" CTA
- **每条付费点的展示文案** 在 detail/sheet/section 中:
  - `lockedFeature` —— 功能名
  - `lockedLimit` —— 限制文案
  - `lockedUpgrade` —— 升级 CTA 文案

---

## 3. 付费墙卖点(摘自 L10n + 业务价值提炼)

### 3.1 现有卖点点缀(代码已用)

| 卖点文案 | 触发场景 |
|---------|---------|
| 「升级 Pro 解锁全部功能」 | 启动 daily paywall |
| 「免费用户每周仅可 X 次,升级 Pro 无限使用」 | 单功能超额弹墙(3 处) |
| 「免费用户仅可创建 1 条变速练习和 3 个速度段,升级 Pro 无限使用」 | 变速练习触发 |

### 3.2 推荐付费墙**主卖点**(营销文案可优化方向)

> 以下是基于付费点 + 用户旅程整理的卖点,可用于 RevenueCat 后台配 paywall 模板。

#### **核心价值主张**(一句话)

> **"把任何歌的鼓点,30 秒变成你的鼓机节奏。"**

#### **功能维度卖点**

| 卖点分类 | 核心承诺 |
|---------|---------|
| **AI 鼓识别** | AI 自动分离鼓组部件,识别鼓点位置,无需手写 |
| **一键成序列** | 自动生成可在鼓机上直接播放的步进序列 |
| **无限制创作** | 不限次数分轨、识别、生成、保存 |
| **完整历史管理** | 无限保存识别历史,反复对比、复用 |
| **专业变速练习** | 拆段变速、循环 A-B、不限速度段数 |

#### **痛点 → 方案 映射**

| 用户痛点 | Drummy 方案 | Pro 解锁点 |
|---------|-----------|----------|
| "我喜欢的歌的鼓点记不住" | AI 鼓识别 + 自动生成序列 | 不限识别/生成次数 |
| "手写鼓点太慢太机械" | 录音 → 自动分析 → 直接编辑 | 不限保存 PRESET |
| "练习总卡在某个段落" | 变速练习 + A-B 循环 + 速度段 | 无限速度段、无 30 分钟限制 |
| "鼓机音色不喜欢" | 12+ 鼓组 KIT + 完整混音 | 完全解锁 |
| "想导入别人的节奏" | 分享/导入 PRESET | 不限用户 PRESET 保存数 |

---

## 4. 特性(技术 / 业务)

### 4.1 RevenueCat 集成

| 项 | 值 |
|---|---|
| SDK | `RevenueCatPaywallKit` |
| Entitlement ID | `pro` |
| 正式 API Key | `appl_fPZYtuOjkqrvyYNcPMMpbaJuhxu` |
| 测试 API Key | `test_uBOFXadRwdiOzjFMEInhVPwyWgj` |
| 配置加载 | `RevenueCatPaywallConfiguration.fromInfoPlist()` 优先,fallback 硬编码 |
| Offering | `default` |
| Debug 日志 | 启用 |

### 4.2 Debug VIP 跳过开关

- 位置:`PaywallService.vipOverride`(默认 `true`)
- 仅 DEBUG 生效,Release 永远 `false`
- `isFeatureUnlocked` 中心判断:
  ```swift
  #if DEBUG
  if vipOverride { return true }
  #endif
  return hasPro
  ```
- UI 入口:设置页底部「VIP 调试开关」(仅 DEBUG 可见)
- **关键约束**:所有 `is*Locked` UI 锁判断**必须**用 `!isFeatureUnlocked`,**不能**用 `!hasPro`,否则 DEBUG 跳过后 UI 仍显示锁图标

### 4.3 计费策略细节

| 策略 | 实现 |
|------|------|
| 周计数 | `Calendar.component(.weekOfYear)` 自然周(周一至周日) |
| 周切换 | 新周首次 increment 时自动重置 count=1 |
| 30 分钟滚动窗口 | UserDefaults 存时间戳数组,启动时过滤 `> cutoff` |
| 启动每日 paywall | UserDefaults 存 `yyyy-MM-dd`,今天已弹过则跳过 |
| 主动触发不受 daily 限制 | 用户主动点的弹墙不计入 daily 配额 |

### 4.4 触发的弹墙类型

| 类型 | 触发者 | UI 形式 |
|------|-------|---------|
| 单功能 `ProLockAlert` | 超额或锁定功能 | 自定义 Alert 卡片 + 锁图标 + "升级" 按钮 |
| RevenueCat 完整 paywall | 启动 daily / 用户点 alert 的升级按钮 | RevenueCat SDK 提供的完整订阅页 |

### 4.5 自定义 Paywall 样式

`ProLockStyle.drummy`:
- 背景渐变:`#FF8C2A → #FF6C02`(橙红)
- 图标渐变:`#FFF0E0 → #FFB866`
- 边框:`white.opacity(0.18)`
- 阴影:`#FF6C02.opacity(0.3)`

与主品牌色 `DrummyTheme.accent` 一致。

---

## 5. 付费点设计哲学(从代码推断)

| 原则 | 体现 |
|------|------|
| **可试用** | 免费额度足够体验核心流程(分轨 3 次 + 识别 3 次 + 生成 2 次 = 完整走通 2 次) |
| **痛点驱动** | 限制加在"重操作"上(分轨/生成),不是"轻操作"上(浏览/试听) |
| **不阻塞** | 不限次的浏览/编辑/试听,只限"产出性"动作 |
| **自然升级** | 周配额 + 计数 + 时间窗 多种触发,用户总会撞到 |
| **开发友好** | DEBUG VIP 跳过让开发/测试不被付费墙挡住 |

---

## 6. 付费墙推荐卖点文案(可贴到 RevenueCat 后台)

### 中文

**主标题**
> 释放你的鼓机创作力

**副标题**
> 升级 Pro,解锁无限 AI 鼓识别、无限序列生成、无限历史保存

**特性列表(4 条)**
1. 无限鼓分离与鼓点识别
2. 无限序列生成与保存
3. 无限识别历史记录
4. 专业变速练习(无速度段数限制)

**CTA 主按钮**
> 升级 Pro

**CTA 次按钮**
> 稍后再说

**底部小字**
> 随时可在设置中取消订阅

### English

**Title**
> Unlock Your Drum Machine Creativity

**Subtitle**
> Go Pro for unlimited AI drum recognition, sequence generation, and history saving.

**Feature list (4 bullets)**
1. Unlimited drum separation & hit detection
2. Unlimited sequence generation & saving
3. Unlimited recognition history
4. Pro tempo drill (no segment limits)

---

## 7. 关键数字一览(给运营/产品)

| 维度 | 免费 | Pro |
|------|------|-----|
| 鼓分离 | 3 次/周 | 无限 |
| 鼓点识别 | 3 次/周 | 无限 |
| 序列生成 | 2 次/周 | 无限(免费 2 小节内) |
| 识别历史 | 1 条 | 无限 |
| 用户 PRESET | 3 个 | 无限 |
| 变速练习条目 | 1 条 | 无限 |
| 变速练习速度段 | 3 段 | 无限 |
| 变速练习启动 | 2 次/30 分钟 | 无限 |
| 启动付费墙 | 每天 1 次 | 不弹 |
| Debug VIP 跳过 | 仅 DEBUG | 仅 DEBUG |

---

## 8. 风险与边界

- **每日启动付费墙** 一天只弹 1 次,如果用户主动点的弹墙次数多,可能引起反感 → 建议监测转化率
- **周配额** `currentWeek` 字段:周切换时 count 自动重置为 1,但旧 key 还保留(UserDefaults) → 长期占用,可加 cleanup
- **历史记录免费 1 条**:对重度用户太严,可考虑 3 条免费
- **变速练习 30 分钟窗口**:用户可能感知不到这个限制,需在 UI 上提示

---

## 9. 后续可优化(产品建议)

| 建议 | 理由 |
|------|------|
| 增加 Trial / Free Trial 按钮 | 转化漏斗顶部,可提升 5-10% 转化 |
| 付费墙加视频演示 | AI 鼓识别 30 秒演示视频,直观感受价值 |
| Pro 加"独占鼓组 KIT" | 价值感差异化(如"Pro 专属:Funk / Trap DM") |
| 区分月度 / 年度订阅 | 年度给折扣,提升 LTV |
| 引用 NPS / 用户证言 | 社交证明 |
| 推出"Lifetime"买断 | 高净值用户转化 |