export interface Dimension {
  key: string;
  emoji: string;
  color: string;
  category: 'health' | 'relationships' | 'work';
  en: string;
  zh: string;
  shortEn: string;  // Short description for label
  shortZh: string;
  descEn: string;   // Detailed description for info box
  descZh: string;
}

export interface Word {
  key: string;
  emoji: string;
  en: string;
  zh: string;
}

export interface Scores {
  [key: string]: number;
}

export interface Actions {
  [key: string]: string[];  // Array of up to 3 actions per dimension
}

export interface AppState {
  step: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  scores2025: Scores;
  scores2026: Scores;
  // Joy - overall happiness
  joy2025: number;
  joy2026: number;
  // Step 2: Reflections
  reflectionHigh: string;
  reflectionLow: string;
  // Step 3: 2025 keyword
  keyword2025: string;
  // Step 5: Action commitments for top gap areas
  actions: Actions;
  // Step 6: 2026 keyword
  keyword2026: string;
  lang: 'en' | 'zh';
}

// Category colors: Health (green), Relationships (pink), Work (blue)
export const CATEGORY_COLORS = {
  health: { bg: '#E8F5E9', border: '#81C784' },
  relationships: { bg: '#FCE4EC', border: '#F48FB1' },
  work: { bg: '#E3F2FD', border: '#64B5F6' },
};

export const DIMENSIONS: Dimension[] = [
  // Health - 健康 (greens)
  { key: 'body', emoji: '💪', color: '#4CAF50', category: 'health', en: 'Body', zh: '身体',
    shortEn: 'Health & fitness', shortZh: '健康体能',
    descEn: 'Your physical health, fitness level, energy, sleep quality, and overall bodily well-being. How well are you taking care of your body?',
    descZh: '你的身体健康、体能水平、精力状态、睡眠质量和整体身体状况。你有多好地照顾自己的身体？' },
  { key: 'mind', emoji: '🧠', color: '#66BB6A', category: 'health', en: 'Mind', zh: '思想',
    shortEn: 'Mental wellness', shortZh: '心理健康',
    descEn: 'Your mental health, emotional stability, stress management, and cognitive well-being. How clear and balanced is your mind?',
    descZh: '你的心理健康、情绪稳定性、压力管理和认知状态。你的思维有多清晰和平衡？' },
  { key: 'soul', emoji: '✨', color: '#81C784', category: 'health', en: 'Soul', zh: '灵魂',
    shortEn: 'Inner peace', shortZh: '内心平静',
    descEn: 'Your spiritual wellness, sense of purpose, inner peace, and connection to something greater. How fulfilled do you feel spiritually?',
    descZh: '你的精神健康、人生意义感、内心平静和与更高层面的连接。你在精神层面有多满足？' },
  // Relationships - 关系 (pinks/reds)
  { key: 'romance', emoji: '💕', color: '#E91E63', category: 'relationships', en: 'Romance', zh: '爱情',
    shortEn: 'Love & intimacy', shortZh: '亲密关系',
    descEn: 'Your romantic relationship, intimacy, partnership quality, and love life. How satisfied are you with your romantic connection?',
    descZh: '你的浪漫关系、亲密感、伴侣关系质量和爱情生活。你对亲密关系有多满意？' },
  { key: 'family', emoji: '👨‍👩‍👧', color: '#F06292', category: 'relationships', en: 'Family', zh: '家庭',
    shortEn: 'Family bonds', shortZh: '家庭关系',
    descEn: 'Your family relationships, home environment, and bonds with parents, children, or siblings. How strong are your family connections?',
    descZh: '你与家人的关系、家庭环境、与父母/孩子/兄弟姐妹的纽带。你的家庭关系有多紧密？' },
  { key: 'friends', emoji: '👥', color: '#F48FB1', category: 'relationships', en: 'Friends', zh: '朋友',
    shortEn: 'Social life', shortZh: '社交生活',
    descEn: 'Your friendships, social connections, community involvement, and sense of belonging. How rich is your social life?',
    descZh: '你的友谊、社交关系、社区参与和归属感。你的社交生活有多丰富？' },
  // Work - 工作 (blues)
  { key: 'career', emoji: '💼', color: '#2196F3', category: 'work', en: 'Career', zh: '职业',
    shortEn: 'Work & purpose', shortZh: '工作事业',
    descEn: 'Your career satisfaction, professional growth, work-life balance, and sense of purpose at work. How fulfilled are you professionally?',
    descZh: '你的职业满意度、专业成长、工作生活平衡和工作中的使命感。你在职业上有多满足？' },
  { key: 'money', emoji: '💰', color: '#42A5F5', category: 'work', en: 'Money', zh: '金钱',
    shortEn: 'Financial health', shortZh: '财务状况',
    descEn: 'Your financial security, income, savings, investments, and money management. How stable and healthy are your finances?',
    descZh: '你的财务安全、收入、储蓄、投资和理财能力。你的财务状况有多稳定健康？' },
  { key: 'growth', emoji: '📈', color: '#64B5F6', category: 'work', en: 'Growth', zh: '成长',
    shortEn: 'Learning & skills', shortZh: '学习技能',
    descEn: 'Your personal development, learning, skill acquisition, and intellectual growth. How much are you growing and evolving?',
    descZh: '你的个人发展、学习进步、技能提升和智识成长。你成长和进化了多少？' },
];

export const WORDS: Word[] = [
  // Core growth & development
  { key: 'growth', emoji: '🌱', en: 'Growth', zh: '成长' },
  { key: 'learning', emoji: '📚', en: 'Learning', zh: '学习' },
  { key: 'breakthrough', emoji: '🚀', en: 'Breakthrough', zh: '突破' },
  { key: 'transformation', emoji: '🦋', en: 'Transformation', zh: '蜕变' },
  // Balance & wellness
  { key: 'balance', emoji: '⚖️', en: 'Balance', zh: '平衡' },
  { key: 'peace', emoji: '☮️', en: 'Peace', zh: '平和' },
  { key: 'healing', emoji: '💚', en: 'Healing', zh: '疗愈' },
  { key: 'rest', emoji: '😴', en: 'Rest', zh: '休息' },
  // Action & courage
  { key: 'courage', emoji: '🦁', en: 'Courage', zh: '勇气' },
  { key: 'action', emoji: '⚡', en: 'Action', zh: '行动' },
  { key: 'persistence', emoji: '💪', en: 'Persistence', zh: '坚持' },
  { key: 'adventure', emoji: '🏔️', en: 'Adventure', zh: '冒险' },
  // Focus & clarity
  { key: 'focus', emoji: '🎯', en: 'Focus', zh: '专注' },
  { key: 'clarity', emoji: '💎', en: 'Clarity', zh: '清晰' },
  { key: 'simplicity', emoji: '🍃', en: 'Simplicity', zh: '简单' },
  { key: 'discipline', emoji: '⏰', en: 'Discipline', zh: '自律' },
  // Joy & freedom
  { key: 'joy', emoji: '✨', en: 'Joy', zh: '喜悦' },
  { key: 'freedom', emoji: '🕊️', en: 'Freedom', zh: '自由' },
  { key: 'gratitude', emoji: '🙏', en: 'Gratitude', zh: '感恩' },
  { key: 'play', emoji: '🎈', en: 'Play', zh: '玩乐' },
  // Connection & impact
  { key: 'connection', emoji: '🤝', en: 'Connection', zh: '连接' },
  { key: 'love', emoji: '❤️', en: 'Love', zh: '爱' },
  { key: 'impact', emoji: '💥', en: 'Impact', zh: '影响力' },
  { key: 'service', emoji: '🌟', en: 'Service', zh: '服务' },
  // Abundance & success
  { key: 'abundance', emoji: '🌈', en: 'Abundance', zh: '丰盛' },
  { key: 'prosperity', emoji: '💰', en: 'Prosperity', zh: '富足' },
  { key: 'success', emoji: '🏆', en: 'Success', zh: '成功' },
  { key: 'creation', emoji: '🎨', en: 'Creation', zh: '创造' },
  // Change & uncertainty
  { key: 'change', emoji: '🔄', en: 'Change', zh: '变化' },
  { key: 'volatile', emoji: '🌊', en: 'Volatile', zh: '动荡' },
  { key: 'uncertainty', emoji: '❓', en: 'Uncertainty', zh: '不确定' },
  { key: 'transition', emoji: '🚪', en: 'Transition', zh: '过渡' },
];

export function createInitialScores(defaultValue: number): Scores {
  const scores: Scores = {};
  DIMENSIONS.forEach(d => {
    scores[d.key] = defaultValue;
  });
  return scores;
}

// Action presets for each dimension
export const ACTION_PRESETS: Record<string, { en: string[]; zh: string[] }> = {
  body: {
    en: ['Exercise 3x/week', 'Sleep 7+ hours', 'Eat healthier', 'Run a marathon', 'Quit smoking/drinking'],
    zh: ['每周运动3次', '睡眠7小时以上', '健康饮食', '跑马拉松', '戒烟/戒酒'],
  },
  mind: {
    en: ['Start meditation', 'See a therapist', 'Daily journaling', 'Digital detox weekends', 'Read 12 books'],
    zh: ['开始冥想', '寻求心理咨询', '每日写日记', '周末数字排毒', '读12本书'],
  },
  soul: {
    en: ['Weekly nature walks', 'Start gratitude practice', 'Join a community', 'Travel solo', 'Learn to say no'],
    zh: ['每周户外散步', '培养感恩习惯', '加入社群', '独自旅行', '学会拒绝'],
  },
  romance: {
    en: ['Weekly date nights', 'Couples therapy', 'Start dating again', 'Move in together', 'Get engaged/married'],
    zh: ['每周约会', '伴侣咨询', '重新开始约会', '同居', '订婚/结婚'],
  },
  family: {
    en: ['Weekly family dinners', 'Call parents weekly', 'Plan a family trip', 'Have a child', 'Move closer to family'],
    zh: ['每周家庭聚餐', '每周给父母打电话', '计划家庭旅行', '生育计划', '搬近家人'],
  },
  friends: {
    en: ['Monthly friend meetups', 'Reconnect with old friends', 'Join a club/group', 'Host gatherings', 'Make 3 new friends'],
    zh: ['每月朋友聚会', '联系老朋友', '加入俱乐部/兴趣小组', '组织聚会', '结交3个新朋友'],
  },
  career: {
    en: ['Change jobs', 'Get promoted', 'Start a side hustle', 'Switch industries', 'Start own business'],
    zh: ['换工作', '晋升', '开始副业', '转行', '创业'],
  },
  money: {
    en: ['Save 20% of income', 'Pay off debt', 'Start investing', 'Create budget', 'Increase income 30%'],
    zh: ['存收入的20%', '还清债务', '开始投资', '制定预算', '收入增加30%'],
  },
  growth: {
    en: ['Get a certification', 'Learn a new skill', 'Take online courses', 'Find a mentor', 'Attend conferences'],
    zh: ['考取证书', '学习新技能', '上网课', '找导师', '参加行业会议'],
  },
};

export const initialState: AppState = {
  step: 1,
  scores2025: createInitialScores(5),
  scores2026: createInitialScores(7),
  joy2025: 5,
  joy2026: 7,
  reflectionHigh: '',
  reflectionLow: '',
  keyword2025: '',
  actions: {},
  keyword2026: '',
  lang: 'zh',
};
