export type Locale = 'en' | 'zh'

export const strings = {
  en: {
    nav: { home: 'Home', records: 'Records', wishes: 'Wishes', profile: 'Profile' },
    common: {
      save: 'Save', cancel: 'Cancel', delete: 'Delete', edit: 'Edit', back: 'Back', confirm: 'Confirm', yuan: '¥', closeAnywhere: 'Tap anywhere to close',
    },
    profile: {
      title: 'Profile', language: 'Language', english: 'English', chinese: 'Chinese', theme: 'Theme',
      themeSignature: 'Signature', themeLight: 'Light', themeDark: 'Dark', clearData: 'Clear local data (dev)',
      clearDataConfirm: 'Clear all local data? This cannot be undone.',
      languageHint: 'Switch app language preference',
      subtitle: 'MoneyRead · Read your money',
      reportHint: 'Weekly / Monthly · Export',
      localOnly: 'Local storage only · Data stays in this browser',
      devTools: 'Developer Tools',
      devToolsHint: 'Clear all local records/wishes/achievements for testing.',
    },
    dashboard: {
      thisMonth: 'This Month', thisMonthExpense: 'This month expense', income: 'Income', balance: 'Balance',
      dailyAverage: 'Daily average', vsLastMonth: 'vs last month', topCategories: 'Top categories · 5',
      noExpenseData: 'No expense data yet', wishProgress: 'Wish progress', all: 'All',
      createFirstWish: 'Create your first wish →', recentAchievements: 'Recent achievements',
      firstAchievementHint: 'Add a record to unlock your first achievement',
      morning: 'Good morning', afternoon: 'Good afternoon', evening: 'Good evening',
    },
    records: {
      title: 'Records', all: 'All', today: 'Today', week: 'This week', month: 'This month',
      search: 'Search notes...', noRecords: 'No records found', noMatch: 'No records match filters',
      editRecord: 'Edit record', deleteRecordConfirm: 'Delete this record?',
      expense: 'Expense', income: 'Income',
    },
    wishes: {
      title: 'Wishes', new: 'New', subtitle: 'Up to 5 active wishes · Save toward what matters',
      active: 'Active wishes', create: 'Create wish →', memories: 'Wish memories', completed: 'Completed ✅',
      deleteConfirm: 'Delete this wish?', deleteDoneConfirm: 'Delete this completed wish?',
      createWish: 'Create Wish', name: 'Wish name', target: 'Target amount', imageOptional: 'Wish image (optional)',
      image: 'Wish image',
      deadlineOptional: 'Deadline (optional)', max5: 'Maximum 5 active wishes', submit: 'Create wish',
      notFound: 'Wish not found', backToList: 'Back to list', deadline: 'Deadline',
      addDeposit: 'Add deposit', amount: 'Amount', deposit: 'Deposit', depositRecords: 'Deposit records',
      planHint: 'Plan daily savings before the deadline; small deposits still move progress forward.',
      bothDeleteHint: 'Both active and completed wishes can be deleted.', milestonesReached: 'Milestones reached',
      noRecords: 'No records', grantedTitle: 'Wish granted!',
    },
    achievements: { title: 'Achievements', unlocked: 'Unlocked', hidden: 'Hidden achievement', hiddenHint: 'Condition appears after unlock', unlockedBanner: 'Achievement unlocked' },
    dna: {
      title: 'Spending DNA', need20: 'Need 20+ records to generate Spending DNA', current: 'Current',
      records: 'records', generate: 'Generate DNA', updatedAt: 'Updated at', refreshHint: 'Refreshes monthly on the 1st', refresh: 'Refresh now',
      dimensions: { frequency: 'Frequency', concentration: 'Concentration', timePattern: 'Time pattern', volatility: 'Volatility' },
    },
    report: {
      title: 'Report Card', weekly: 'Weekly Report', monthly: 'Monthly Report', totalSpending: 'Total spending',
      dailyAvg: 'Daily avg', vsPrevious: 'vs previous', topCategories: 'Top categories', biggest: 'Biggest expense:',
      wishSnapshot: 'Wish snapshot', monthDNA: "This month's DNA", achievements: 'Achievements:', exporting: 'Exporting...', savePng: 'Save PNG',
      footer: 'moneyread · Read your money. Ready your future.',
    },
    image: { upload: 'Upload image', change: 'Change image', preview: 'Wish image preview', support: 'Supports jpg/png/webp/gif, max 2MB', typeError: 'Only jpg/png/webp/gif', sizeError: 'Image must be <= 2MB' },
    recordForm: {
      amount: 'Amount', expense: 'Expense', income: 'Income', category: 'Category', noteOptional: 'Note (optional)',
      notePlaceholder: 'Up to 50 chars', date: 'Date', confirm: 'Confirm', addRecord: 'Add record', editRecord: 'Edit record',
      oneDot: 'Only one decimal point allowed', twoDecimal: 'Up to 2 decimal places', numberOnly: 'Numbers only', close: 'Close',
    },
    categoryNames: {
      food: 'Food', milkTea: 'Bubble tea', shopping: 'Shopping', transport: 'Transport', digital: 'Subscriptions',
      entertainment: 'Entertainment', study: 'Study', medical: 'Health', social: 'Social', other_exp: 'Other',
      allowance: 'Allowance', parttime: 'Part-time', redpacket: 'Gift money', resale: 'Resale', other_inc: 'Other',
    },
    achievementNames: {
      first_record: 'First Steps', streak_7: 'On a Roll', streak_30: 'Habit Formed', records_100: 'Logging Pro',
      records_1000: 'Thousand Entries', all_categories: 'Category Master', first_deposit: 'Seed Planted', first_wish_done: 'Wish Granted',
      wishes_5: 'Wish Collector', wish_100: 'Hundred Club', wish_1000: 'Thousand Club', daily_under_50: 'Penny Pincher',
      zero_spend_day: 'Zero Day', weekend_low: 'Chill Weekend', midnight_shop: 'Night Owl Spender', milktea_20: 'Boba Addict', moonlight_awaken: 'Comeback Kid',
    },
  },
  zh: {
    nav: { home: '首页', records: '账单', wishes: '心愿', profile: '我的' },
    common: { save: '保存', cancel: '取消', delete: '删除', edit: '编辑', back: '返回', confirm: '确认', yuan: '¥', closeAnywhere: '点击任意处关闭' },
    profile: {
      title: '我的', language: '语言', english: '英文', chinese: '中文', theme: '主题',
      themeSignature: '签名紫', themeLight: '浅色', themeDark: '深色', clearData: '清空本地数据（开发）',
      clearDataConfirm: '确认清空所有本地数据？此操作不可恢复。', languageHint: '切换应用显示语言',
      subtitle: 'MoneyRead · 看懂你的钱',
      reportHint: '周报 / 月报 · 导出分享',
      localOnly: '本地存储 · 数据仅保存在本机浏览器',
      devTools: '开发工具',
      devToolsHint: '清空所有本地账单/心愿/成就数据，便于重复测试流程。',
    },
    dashboard: {
      thisMonth: '本月概览', thisMonthExpense: '本月支出', income: '收入', balance: '结余',
      dailyAverage: '日均消费', vsLastMonth: '较上月支出', topCategories: '分类占比 · Top 5',
      noExpenseData: '暂无支出数据', wishProgress: '心愿进度', all: '全部', createFirstWish: '创建第一个心愿 →',
      recentAchievements: '最近成就', firstAchievementHint: '记一笔，解锁第一个成就',
      morning: '早上好', afternoon: '下午好', evening: '晚上好',
    },
    records: {
      title: '账单', all: '全部', today: '今天', week: '本周', month: '本月',
      search: '搜索备注…', noRecords: '暂无记录', noMatch: '没有符合筛选条件的记录',
      editRecord: '编辑记录', deleteRecordConfirm: '确定删除这条记录？', expense: '支出', income: '收入',
    },
    wishes: {
      title: '心愿单', new: '新建', subtitle: '同时最多 5 个进行中 · 攒钱为心愿服务',
      active: '进行中', create: '创建心愿 →', memories: '心愿回忆录', completed: '已达成 ✅',
      deleteConfirm: '确认删除这个心愿？', deleteDoneConfirm: '确认删除这个已达成心愿？',
      createWish: '新建心愿', name: '心愿名称', target: '目标金额（元）', imageOptional: '心愿图片（可选）',
      image: '心愿图片',
      deadlineOptional: '截止日期（可选）', max5: '已达到 5 个进行中上限', submit: '创建心愿',
      notFound: '未找到心愿', backToList: '返回列表', deadline: '截止',
      addDeposit: '存一笔', amount: '金额（元）', deposit: '存入', depositRecords: '存入记录',
      planHint: '距离截止还可按日规划；坚持小额存入也能推进进度条。', bothDeleteHint: '进行中和已达成都可以删除',
      milestonesReached: '已达成里程碑', noRecords: '暂无', grantedTitle: '心愿达成！',
    },
    achievements: { title: '成就墙', unlocked: '已解锁', hidden: '隐藏成就', hiddenHint: '解锁后显示条件', unlockedBanner: '成就解锁' },
    dna: {
      title: '消费人格', need20: '累计记账满 20 笔后生成人格卡片', current: '当前', records: '笔',
      generate: '生成人格', updatedAt: '更新于', refreshHint: '每月 1 日可刷新维度', refresh: '手动刷新',
      dimensions: { frequency: '消费频率', concentration: '集中度', timePattern: '时段', volatility: '波动' },
    },
    report: {
      title: '消费报告', weekly: '周报', monthly: '月报', totalSpending: '总支出',
      dailyAvg: '日均', vsPrevious: '较上期', topCategories: 'Top 分类', biggest: '最大单笔：',
      wishSnapshot: '心愿快照', monthDNA: '本月人格', achievements: '成就：', exporting: '导出中…', savePng: '保存图片 PNG',
      footer: 'moneyread · 看懂你的钱，也看见你的未来。',
    },
    image: { upload: '上传图片', change: '更换图片', preview: '心愿图片预览', support: '支持 jpg/png/webp/gif，最大 2MB', typeError: '仅支持 jpg/png/webp/gif', sizeError: '图片不能超过 2MB' },
    recordForm: {
      amount: '金额（元）', expense: '支出', income: '收入', category: '分类', noteOptional: '备注（可选）',
      notePlaceholder: '最多 50 字', date: '日期', confirm: '确认记账', addRecord: '记一笔', editRecord: '编辑记录',
      oneDot: '只能输入一个小数点', twoDecimal: '最多保留两位小数', numberOnly: '只能输入数字', close: '关闭',
    },
    categoryNames: {
      food: '吃饭', milkTea: '奶茶饮品', shopping: '购物', transport: '交通', digital: '数码订阅',
      entertainment: '娱乐', study: '学习', medical: '医疗', social: '社交', other_exp: '其他',
      allowance: '生活费', parttime: '兼职', redpacket: '红包', resale: '闲鱼回血', other_inc: '其他',
    },
    achievementNames: {
      first_record: '初来乍到', streak_7: '坚持就是胜利', streak_30: '习惯养成', records_100: '记账达人',
      records_1000: '千笔之约', all_categories: '分类大师', first_deposit: '种子选手', first_wish_done: '小目标达成',
      wishes_5: '心愿收割机', wish_100: '百元里程碑', wish_1000: '千元俱乐部', daily_under_50: '精打细算',
      zero_spend_day: '零消费日', weekend_low: '佛系周末', midnight_shop: '深夜剁手', milktea_20: '奶茶续命', moonlight_awaken: '月光族觉醒',
    },
  },
} as const

export function getStrings(locale: Locale) {
  return strings[locale]
}

