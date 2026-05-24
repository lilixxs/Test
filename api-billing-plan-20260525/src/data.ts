export type Tier = 'high' | 'general' | 'fast' | 'other';

export interface ModelRow {
  name: string;
  vendor: 'OpenAI' | 'Anthropic' | 'Google';
  tier: Tier;
  inputPrice: number;
  outputPrice: number;
  cachePrice: number;
  scenario: string;
  inputMW: number;
  outputMW: number;
  cacheRate: string;
  cost: number;
}

export const models: ModelRow[] = [
  { name: 'GPT-5.5', vendor: 'OpenAI', tier: 'high', inputPrice: 25.38, outputPrice: 152.25, cachePrice: 2.54, scenario: '高难度开发/攻关', inputMW: 15, outputMW: 5, cacheRate: '30%', cost: 11.2 },
  { name: 'Claude Opus 4.7', vendor: 'Anthropic', tier: 'high', inputPrice: 25.38, outputPrice: 126.88, cachePrice: 3.17, scenario: '研究报告深度推理', inputMW: 20, outputMW: 10, cacheRate: '30%', cost: 16.2 },
  { name: 'Claude Sonnet 4.6', vendor: 'Anthropic', tier: 'general', inputPrice: 15.23, outputPrice: 76.13, cachePrice: 1.90, scenario: '日常开发/Agent主控', inputMW: 180, outputMW: 60, cacheRate: '30%', cost: 64.7 },
  { name: 'GPT-5', vendor: 'OpenAI', tier: 'general', inputPrice: 6.34, outputPrice: 50.75, cachePrice: 0.63, scenario: '报告生成/分析', inputMW: 100, outputMW: 50, cacheRate: '30%', cost: 30.0 },
  { name: 'Gemini 2.5 Pro', vendor: 'Google', tier: 'general', inputPrice: 6.34, outputPrice: 50.75, cachePrice: 0.63, scenario: '长文档解析', inputMW: 200, outputMW: 40, cacheRate: '35%', cost: 29.4 },
  { name: 'Gemini 3.5 Flash', vendor: 'Google', tier: 'fast', inputPrice: 7.61, outputPrice: 45.68, cachePrice: 0.76, scenario: 'Agent子任务/快速处理', inputMW: 400, outputMW: 100, cacheRate: '30%', cost: 66.8 },
  { name: 'Claude Haiku 4.5', vendor: 'Anthropic', tier: 'fast', inputPrice: 5.08, outputPrice: 25.38, cachePrice: 0.51, scenario: '文档分类/知识库索引', inputMW: 500, outputMW: 80, cacheRate: '35%', cost: 37.3 },
  { name: 'GPT-4.1 Mini', vendor: 'OpenAI', tier: 'other', inputPrice: 2.03, outputPrice: 8.12, cachePrice: 0.20, scenario: '简单任务/格式转换', inputMW: 800, outputMW: 200, cacheRate: '40%', cost: 44.1 }
];

export const modules = [
  { name: '复杂工作开发', models: 'Claude Sonnet 4.6 / GPT-5.5', budget: 72.0, ratio: '24%', desc: '架构设计、复杂代码生成、系统重构' },
  { name: '多Agent协同', models: 'Gemini 3.5 Flash / Claude Sonnet 4.6', budget: 78.0, ratio: '26%', desc: '多轮任务拆解、Agent调度、结果聚合' },
  { name: '文档解析', models: 'Gemini 2.5 Pro / Claude Haiku 4.5', budget: 72.0, ratio: '24%', desc: '100篇/月文档摘要提取、结构化处理' },
  { name: '研究报告生成', models: 'GPT-5 / Claude Opus 4.7', budget: 48.0, ratio: '16%', desc: '深度分析报告、综述写作' },
  { name: '知识库管理', models: 'Gemini 3.5 Flash / Claude Haiku 4.5', budget: 29.7, ratio: '10%', desc: '索引更新、检索增强、知识分类' }
];

export const tierMeta: Record<Tier, { label: string; color: 'red' | 'blue' | 'green' | 'grey'; desc: string; cost: number; pct: string }> = {
  high: { label: '高难度模型', color: 'red', desc: '处理极复杂推理、长链逻辑和创造性架构设计任务。', cost: 27.4, pct: '9.1%' },
  general: { label: '通用模型', color: 'blue', desc: '承担日常编码、分析、多步任务和中等复杂度生成。', cost: 124.1, pct: '41.4%' },
  fast: { label: '快速模型', color: 'green', desc: '高吞吐低延迟，适合批量子任务和实时分类处理。', cost: 104.1, pct: '34.7%' },
  other: { label: '其他', color: 'grey', desc: '超低成本处理格式转换、简单提取等标准化任务。', cost: 44.1, pct: '14.7%' }
};

export const vendorStats = [
  { vendor: 'Anthropic', input: 700, output: 150, cost: 118.2, pct: '39.4%' },
  { vendor: 'Google', input: 600, output: 140, cost: 96.2, pct: '32.1%' },
  { vendor: 'OpenAI', input: 915, output: 255, cost: 85.3, pct: '28.5%' }
];

export const assumptions = [
  { key: '汇率', value: '1 USD = 7.25 RMB', note: '2025年5月参考汇率' },
  { key: 'DMXAPI 折扣', value: '70%', note: '海外模型集采价格约官方 7 折' },
  { key: '缓存命中率', value: '30% – 40%', note: '系统 prompt / 文档前缀复用' },
  { key: '输入:输出比', value: '2:1 ~ 6:1', note: '文档解析 5:1 · 开发 3:1 · 报告 2:1' },
  { key: '月文档量', value: '~100 篇', note: '平均每篇约 5,000 token' },
  { key: '工作日', value: '22 天/月', note: '日均花费 ¥13.6' }
];
