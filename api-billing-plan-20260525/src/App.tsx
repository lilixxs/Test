import {
  AppLayout,
  Alert,
  Badge,
  Box,
  BreadcrumbGroup,
  Cards,
  Container,
  ContentLayout,
  Header,
  KeyValuePairs,
  ProgressBar,
  SpaceBetween,
  StatusIndicator,
  Table,
  TopNavigation
} from '@cloudscape-design/components';
import { models, modules, tierMeta, vendorStats, assumptions, type ModelRow, type Tier } from './data';

const TOTAL_INPUT = models.reduce((s, m) => s + m.inputMW, 0);
const TOTAL_OUTPUT = models.reduce((s, m) => s + m.outputMW, 0);
const TOTAL_COST = models.reduce((s, m) => s + m.cost, 0);
const MAX_INPUT = Math.max(...models.map(m => m.inputMW));
const MAX_OUTPUT = Math.max(...models.map(m => m.outputMW));

function tierBadge(tier: Tier) {
  const meta = tierMeta[tier];
  const colorMap: Record<typeof meta.color, 'red' | 'blue' | 'green' | 'grey'> = {
    red: 'red', blue: 'blue', green: 'green', grey: 'grey'
  };
  return <Badge color={colorMap[meta.color]}>{meta.label.replace('模型', '')}</Badge>;
}

export default function App() {
  return (
    <>
      <TopNavigation
        identity={{
          href: '#',
          title: 'API Billing Console',
          logo: {
            src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ff9900"><rect width="24" height="24" rx="4"/></svg>',
            alt: 'logo'
          }
        }}
        utilities={[
          { type: 'button', text: '控制台', href: '#' },
          { type: 'button', text: '文档', href: '#' },
          { type: 'button', text: '设置', href: '#' }
        ]}
      />
      <AppLayout
        toolsHide
        navigationHide
        breadcrumbs={
          <BreadcrumbGroup
            items={[
              { text: '控制台主页', href: '#' },
              { text: '成本管理', href: '#' },
              { text: 'API Token 月度方案', href: '#' }
            ]}
          />
        }
        content={<MainContent />}
      />
    </>
  );
}


function MainContent() {
  return (
    <ContentLayout
      header={
        <Header
          variant="h1"
          description="月度预算 ¥300 · 数据来源 dmxapi.cn · 汇率 1 USD ≈ 7.25 RMB"
        >
          API Token 月度消耗方案
        </Header>
      }
    >
      <SpaceBetween size="l">
        <Alert type="info" header="本方案以 DMXAPI 海外模型7折价为基础">
          覆盖复杂开发、多Agent协同、文档解析、研究报告与知识库管理5个场景；
          预算实际花费 ¥{TOTAL_COST.toFixed(1)}，与目标 ¥300 偏差 0.1%。
        </Alert>

        <OverviewSection />
        <ModulesSection />
        <PricingSection />
        <DetailSection />
        <HeatmapSection />
        <VendorSection />
        <TierSection />
        <AssumptionsSection />

        <Box textAlign="center" color="text-status-inactive" fontSize="body-s" padding={{ vertical: 'l' }}>
          Generated on 2025-05-25 · 价格数据来源：
          <a href="https://www.dmxapi.cn/rmb" style={{ color: '#0972d3' }}>dmxapi.cn/rmb</a>
        </Box>
      </SpaceBetween>
    </ContentLayout>
  );
}

function OverviewSection() {
  return (
    <Container header={<Header variant="h2" description="关键指标 · Key value pairs">方案总览</Header>}>
      <KeyValuePairs
        columns={4}
        items={[
          { label: '月度预算', value: <Box variant="h2" color="text-status-info">¥300</Box> },
          { label: '实际花费', value: <Box variant="h2" color="text-status-info">¥{TOTAL_COST.toFixed(1)}</Box> },
          { label: '使用模型数', value: `${models.length} 个` },
          { label: '工作模块', value: `${modules.length} 个` },
          { label: '月文档处理量', value: '~100 篇' },
          { label: '总Token量', value: `${(TOTAL_INPUT + TOTAL_OUTPUT).toLocaleString()} 万` },
          { label: '日均花费', value: `¥${(TOTAL_COST / 22).toFixed(2)}` },
          { label: '预算状态', value: <StatusIndicator type="success">在预算内</StatusIndicator> }
        ]}
      />
    </Container>
  );
}


function ModulesSection() {
  return (
    <Container header={
      <Header variant="h2" counter={`(${modules.length})`}
        description="按业务场景拆分预算 · 文档解析与多Agent协同合计占50%">
        工作模块预算分配
      </Header>
    }>
      <Table
        variant="embedded"
        columnDefinitions={[
          { id: 'name', header: '工作模块', cell: (i: typeof modules[0]) => <strong>{i.name}</strong> },
          { id: 'models', header: '主要模型', cell: (i) => i.models },
          { id: 'budget', header: '月预算 (¥)', cell: (i) => i.budget.toFixed(1) },
          { id: 'ratio', header: '占比', cell: (i) => i.ratio },
          { id: 'desc', header: '说明', cell: (i) => <Box color="text-status-inactive">{i.desc}</Box> }
        ]}
        items={modules}
      />
    </Container>
  );
}

function PricingSection() {
  return (
    <Container header={
      <Header variant="h2" counter={`(${models.length})`}
        description="DMXAPI 人民币价格（约官方 7 折） · 价格 = 官方美元价 × 7.25 × 0.7">
        模型价格表
      </Header>
    }>
      <Table
        variant="embedded"
        columnDefinitions={[
          { id: 'name', header: '模型', cell: (i: ModelRow) => <strong>{i.name}</strong> },
          { id: 'vendor', header: '厂商', cell: (i) => i.vendor },
          { id: 'tier', header: '性能分类', cell: (i) => tierBadge(i.tier) },
          { id: 'in', header: '输入 (¥/百万)', cell: (i) => i.inputPrice.toFixed(2) },
          { id: 'out', header: '输出 (¥/百万)', cell: (i) => i.outputPrice.toFixed(2) },
          { id: 'cache', header: '缓存输入', cell: (i) => i.cachePrice.toFixed(2) }
        ]}
        items={models}
      />
    </Container>
  );
}


function DetailSection() {
  return (
    <Container header={
      <Header variant="h2"
        description="输入:输出 — 开发3:1 · 文档5:1 · 报告2:1 · Agent4:1 · 知识库6:1；缓存命中 30%-40%">
        各模型详细 Token 消耗方案
      </Header>
    }>
      <Table
        variant="embedded"
        columnDefinitions={[
          { id: 'name', header: '模型', cell: (i: ModelRow) => <strong>{i.name}</strong> },
          { id: 'scenario', header: '应用场景', cell: (i) => <Box color="text-status-inactive">{i.scenario}</Box> },
          { id: 'in', header: '输入 (万)', cell: (i) => i.inputMW.toLocaleString() },
          { id: 'out', header: '输出 (万)', cell: (i) => i.outputMW.toLocaleString() },
          { id: 'cache', header: '缓存命中', cell: (i) => i.cacheRate },
          { id: 'cost', header: '花费 (¥)', cell: (i) => <Box color="text-status-info" fontWeight="bold">¥{i.cost.toFixed(1)}</Box> }
        ]}
        items={models}
        footer={
          <Box textAlign="right">
            <SpaceBetween direction="horizontal" size="xl">
              <span>合计输入: <strong>{TOTAL_INPUT.toLocaleString()} 万</strong></span>
              <span>合计输出: <strong>{TOTAL_OUTPUT.toLocaleString()} 万</strong></span>
              <span>总花费: <Box variant="span" color="text-status-info" fontWeight="bold">¥{TOTAL_COST.toFixed(1)}</Box></span>
            </SpaceBetween>
          </Box>
        }
      />
    </Container>
  );
}

function HeatmapSection() {
  return (
    <Container header={
      <Header variant="h2" description="输入/输出 Token 分布 · 进度条按模型最大值归一化展示">
        模型使用热力图
      </Header>
    }>
      <Table
        variant="embedded"
        columnDefinitions={[
          { id: 'name', header: '模型', cell: (i: ModelRow) => <strong>{i.name}</strong> },
          {
            id: 'in', header: '输入分布',
            cell: (i) => (
              <ProgressBar
                value={(i.inputMW / MAX_INPUT) * 100}
                additionalInfo={`${i.inputMW} 万 (${((i.inputMW / TOTAL_INPUT) * 100).toFixed(1)}%)`}
                variant="key-value"
              />
            ),
            minWidth: 260
          },
          {
            id: 'out', header: '输出分布',
            cell: (i) => (
              <ProgressBar
                value={(i.outputMW / MAX_OUTPUT) * 100}
                additionalInfo={`${i.outputMW} 万 (${((i.outputMW / TOTAL_OUTPUT) * 100).toFixed(1)}%)`}
                variant="key-value"
              />
            ),
            minWidth: 260
          },
          { id: 'sum', header: '合计 (万)', cell: (i) => (i.inputMW + i.outputMW).toLocaleString() }
        ]}
        items={models}
      />
    </Container>
  );
}


function VendorSection() {
  return (
    <Container header={
      <Header variant="h2" description="合计三家海外厂商 · Anthropic 占比最高">
        按厂商统计
      </Header>
    }>
      <SpaceBetween size="m">
        {vendorStats.map(v => {
          const vModels = models.filter(m => m.vendor === v.vendor);
          return (
            <Container
              key={v.vendor}
              variant="stacked"
              header={
                <Header
                  variant="h3"
                  info={<Badge color="blue">{v.pct}</Badge>}
                  actions={<Box variant="h3" color="text-status-info">¥{v.cost.toFixed(1)}</Box>}
                >
                  {v.vendor}
                </Header>
              }
            >
              <Table
                variant="embedded"
                columnDefinitions={[
                  { id: 'm', header: '模型', cell: (i: ModelRow) => <strong>{i.name}</strong> },
                  { id: 'tier', header: '类型', cell: (i) => tierBadge(i.tier) },
                  { id: 'in', header: '输入 (万)', cell: (i) => i.inputMW.toLocaleString() },
                  { id: 'out', header: '输出 (万)', cell: (i) => i.outputMW.toLocaleString() },
                  { id: 'cost', header: '花费 (¥)', cell: (i) => `¥${i.cost.toFixed(1)}` }
                ]}
                items={vModels}
              />
            </Container>
          );
        })}
      </SpaceBetween>
    </Container>
  );
}

function TierSection() {
  const tiers: Tier[] = ['high', 'general', 'fast', 'other'];
  const cardItems = tiers.map(t => ({
    tier: t,
    meta: tierMeta[t],
    members: models.filter(m => m.tier === t)
  }));

  return (
    <Container header={
      <Header variant="h2" description="将 8 个模型按性能位段分为 4 类 · 通用模型承担主要负载（41.4%）">
        按模型性能分类
      </Header>
    }>
      <Cards
        cardDefinition={{
          header: (item) => (
            <SpaceBetween direction="horizontal" size="xs" alignItems="center">
              {tierBadge(item.tier)}
              <Box variant="h3" color="text-status-info">¥{item.meta.cost.toFixed(1)} · {item.meta.pct}</Box>
            </SpaceBetween>
          ),
          sections: [
            { id: 'desc', content: (item) => <Box color="text-status-inactive">{item.meta.desc}</Box> },
            {
              id: 'members',
              header: '包含模型',
              content: (item) => (
                <SpaceBetween size="xs">
                  {item.members.map(m => (
                    <SpaceBetween key={m.name} direction="horizontal" size="xs" alignItems="center">
                      <strong>{m.name}</strong>
                      <Box color="text-status-inactive">¥{m.cost.toFixed(1)}</Box>
                    </SpaceBetween>
                  ))}
                </SpaceBetween>
              )
            }
          ]
        }}
        cardsPerRow={[{ cards: 1 }, { minWidth: 600, cards: 2 }, { minWidth: 992, cards: 4 }]}
        items={cardItems}
        trackBy="tier"
      />
    </Container>
  );
}

function AssumptionsSection() {
  return (
    <Container header={
      <Header variant="h2" description="用于成本测算的关键参数 · 实际花费随业务波动会有 ±15% 浮动">
        估算假设
      </Header>
    }>
      <Table
        variant="embedded"
        columnDefinitions={[
          { id: 'k', header: '参数', cell: (i: typeof assumptions[0]) => <strong>{i.key}</strong> },
          { id: 'v', header: '取值', cell: (i) => i.value },
          { id: 'n', header: '说明', cell: (i) => <Box color="text-status-inactive">{i.note}</Box> }
        ]}
        items={assumptions}
      />
    </Container>
  );
}
