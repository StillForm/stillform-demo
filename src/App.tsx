import React, { useEffect } from "react";
import { motion } from "framer-motion";

// ============================================================
// RWA 宣传网站 - 首页（演示安全版 · v3）
// 修复：
// - 解决 “Adjacent JSX elements must be wrapped ...” 报错：
//   确保所有 return 语句仅返回单一根节点；所有 SVG 子节点统一用 Fragment 包裹。
// - 保留页内平滑滚动；所有导航按钮可跳转到对应分区。
// - 产品展示仅保留文玩系列 & 艺术版画各 1 个，并使用本地图片 `/public/images/*`。
// - 移除一切未实现交互（无外链、无钱包、无开盲盒），避免沙箱错误。
// - 新增更多自检“测试用例”，但不改动已存在的断言语义。
// ============================================================

const DEMO_MODE = true; // 演示/宣传用：不做任何链上/外部调用

// ------------------------------------------------------------
// 内置 SVG 图标（统一使用 Fragment 包裹子节点，规避相邻节点问题）
// ------------------------------------------------------------

type IconProps = { className?: string };

function svgBase(props: IconProps, children: React.ReactNode) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className || "w-5 h-5"}
      aria-hidden
    >
      {children}
    </svg>
  );
}

const ShieldCheck = (p: IconProps) => svgBase(p, (<><path d="M12 3l7 4v5a9 9 0 1 1-14 0V7l7-4z" /><path d="M9 12l2 2 4-4" /></>));
const BadgeCheck  = (p: IconProps) => svgBase(p, (<><circle cx="12" cy="12" r="8" /><path d="M8.5 12.5l2 2 4-4" /></>));
const Factory     = (p: IconProps) => svgBase(p, (<><rect x="3" y="10" width="18" height="11" rx="2" /><path d="M7 10V6h2v4M15 10V6h2v4" /></>));
const Palette     = (p: IconProps) => svgBase(p, (<><path d="M12 3a9 9 0 1 0 0 18 2.5 2.5 0 0 0 0-5h-1a3 3 0 0 1-3-3 10 10 0 0 1 4-10z" /><circle cx="8.5" cy="10" r="1" /><circle cx="10.5" cy="6.5" r="1" /><circle cx="14.5" cy="7.5" r="1" /><circle cx="16" cy="11" r="1" /></>));
const Package     = (p: IconProps) => svgBase(p, (<><path d="M21 7l-9-4-9 4 9 4 9-4z" /><path d="M12 11v10" /><path d="M3 7v10l9 4 9-4V7" /></>));
const Lock        = (p: IconProps) => svgBase(p, (<><rect x="4" y="11" width="16" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>));
const Wallet      = (p: IconProps) => svgBase(p, (<><rect x="3" y="6" width="18" height="12" rx="2" /><circle cx="16" cy="12" r="1" /></>));
const Boxes       = (p: IconProps) => svgBase(p, (<><rect x="3" y="3" width="8" height="8" rx="1" /><rect x="13" y="3" width="8" height="8" rx="1" /><rect x="8" y="13" width="8" height="8" rx="1" /></>));
const Users       = (p: IconProps) => svgBase(p, (<><circle cx="8" cy="10" r="3" /><circle cx="16" cy="9" r="2.5" /><path d="M2.5 20a5.5 5.5 0 0 1 11 0M13 20a5 5 0 0 1 9 0" /></>));
const ArrowRight  = (p: IconProps) => svgBase(p, (<><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></>));
const Twitter     = (p: IconProps) => svgBase(p, (<><path d="M22 5c-.7.3-1.4.5-2.2.6.8-.5 1.3-1.2 1.6-2.1-.8.5-1.7.9-2.6 1.1A3.8 3.8 0 0 0 12 7.7v.8C8.1 8.3 5 6.7 3 4.3c-.9 1.6-.4 3.5.9 4.6-.6 0-1.1-.2-1.6-.4 0 1.9 1.3 3.5 3.1 3.9-.5.2-1 .2-1.5.1.4 1.6 1.9 2.8 3.7 2.8A7.6 7.6 0 0 1 2 18.1 10.8 10.8 0 0 0 7.9 20c7.4 0 11.5-6.3 11.3-12 .8-.6 1.4-1.3 1.8-2.1Z" /></>));
const Github      = (p: IconProps) => svgBase(p, (<><path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-2c-2.8.6-3.4-1.2-3.4-1.2-.5-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.6 1.1 1.6 1.1 .9 1.6 2.4 1.1 3 .8.1-.7.4-1.1.7-1.4-2.3-.2-4.7-1.2-4.7-5.1 0-1.1.4-2 1.1-2.7-.1-.2-.5-1.3.1-2.7 0 0 .9-.3 2.8 1.1.8-.2 1.7-.4 2.5-.4s1.7.1 2.5.4c1.9-1.4 2.8-1.1 2.8-1.1.6 1.4.2 2.5.1 2.7.7.7 1.1 1.6 1.1 2.7 0 3.9-2.4 4.9-4.7 5.1.4.3.7.9.7 1.9v2.9c0 .3.2.6.7.5A10 10 0 0 0 12 2Z" /></>));
const Discord     = (p: IconProps) => svgBase(p, (<><rect x="3" y="6" width="18" height="12" rx="3" /><circle cx="9" cy="12" r="1.5" /><circle cx="15" cy="12" r="1.5" /></>));
const Globe       = (p: IconProps) => svgBase(p, (<><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c-3 3.5-3 14.5 0 18 3-3.5 3-14.5 0-18Z" /></>));
const CheckCircle2= (p: IconProps) => svgBase(p, (<><circle cx="12" cy="12" r="9" /><path d="M8.5 12.5l2 2 4.5-4.5" /></>));
const ChevronRight= (p: IconProps) => svgBase(p, (<><path d="M9 6l6 6-6 6" /></>));
const Star        = (p: IconProps) => svgBase(p, (<><path d="M12 3l2.7 5.5 6 1-4.4 4.2 1 6-5.3-2.8-5.3 2.8 1-6L3.3 9.5l6-1L12 3z" /></>));

// ------------------------------------------------------------
// 工具：平滑滚动到锚点 + 容器/标题
// ------------------------------------------------------------

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <a
      href={`#${to}`}
      onClick={(e) => {
        e.preventDefault();
        scrollToId(to);
      }}
      className="hover:text-zinc-900"
    >
      {children}
    </a>
  );
}

function Container({ children, className = "", ...rest }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) {
    return (
        <div
            {...rest}
            className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 box-border ${className}`}
        >
            {children}
        </div>
    );
}



function SectionTitle({ overline, title, subtitle }: { overline?: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-10 text-center">
      {overline && (
        <div className="inline-block text-xs tracking-widest uppercase bg-zinc-900 text-zinc-100 rounded-full px-3 py-1 mb-3">
          {overline}
        </div>
      )}
      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">{title}</h2>
      {subtitle && <p className="text-zinc-500 mt-3 max-w-2xl mx-auto">{subtitle}</p>}
    </div>
  );
}

// ------------------------------------------------------------
// 展示用静态数据 + 业务状态字段
// ------------------------------------------------------------

type Product = {
  id: number;
  title: string;
  sold: number;
  total: number;
  status: "未实体化" | "已锁定"; // 已锁定 = 已实体化
  token: string;
  owner: boolean; // 是否为当前用户已购买持有
  imgSrc?: string; // 本地图片路径（/public/images/...）
};

const pains = [
  { pain: "真伪难辨、信息不透明", solution: "每件实物绑定链上唯一资产，可溯源可核验" },
  { pain: "流动性差、转让难", solution: "NFT 化与市场交易，提高流通效率" },
  { pain: "一物多卖风险", solution: "选择实体化后，链上资产进入锁定状态，确保一物一链" },
  { pain: "版权与分成难以保障", solution: "智能合约自动分配二级市场分成" },
];

const personas = [
  { key: "artists",   icon: <Palette className="w-6 h-6" />, title: "For Artists",   points: ["作品链上确权，防抄袭", "全球曝光与收藏者社群", "二级市场自动分成"], color: "from-pink-500/20 to-purple-500/20" },
  { key: "factories", icon: <Factory className="w-6 h-6" />, title: "For Factories", points: ["源头直供 + 链上背书", "生产批次一物一链", "品牌升级与稳定订单"],   color: "from-emerald-500/20 to-teal-500/20" },
  { key: "collectors",icon: <Boxes className="w-6 h-6" />, title: "For Collectors",points: ["限量编号与稀缺感", "链上溯源，真伪可查", "社群活动与展示"],       color: "from-amber-500/20 to-orange-500/20" },
];

// 仅保留 2 个展示商品：文玩系列 & 艺术版画；并提供本地图片路径
const demoProducts: Product[] = [
  { id: 2, title: "Ink·文玩系列 #021",    sold: 40, total: 60, status: "已锁定",   token: "0x44..8b10", owner: true,  imgSrc: "/images/ink-021.jpg" },
  { id: 3, title: "Ink·文玩系列 #013", sold: 15, total: 30, status: "未实体化", token: "0x11..9f05", owner: false, imgSrc: "/images/canvas-013.jpg" },
];

// ------------------------------------------------------------
// 工具与基础 UI
// ------------------------------------------------------------

function Progress({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="w-full h-2 rounded-full bg-zinc-200 overflow-hidden">
      <div className="h-2 bg-zinc-900" style={{ width: `${v}%` }} />
    </div>
  );
}

function Card({ children, className = "" }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={`rounded-2xl border border-zinc-200 bg-white shadow-sm ${className}`}>{children}</div>;
}

type PillIntent = "default" | "success" | "warning" | "info" | "danger";

function Pill(
    { children, intent = "default" }: React.PropsWithChildren<{ intent?: PillIntent }>
) {
    const map: Record<PillIntent, string> = {
        default: "bg-zinc-100 text-zinc-700",
        success: "bg-emerald-100 text-emerald-700",
        warning: "bg-amber-100 text-amber-700",
        info: "bg-blue-100 text-blue-700",
        danger: "bg-red-100 text-red-700",
    };
    return <span className={`text-xs px-2.5 py-1 rounded-full ${map[intent]}`}>{children}</span>;
}


// ------------------------------------------------------------
// 顶部导航（使用平滑滚动） & 首屏（无开盲盒按钮）
// ------------------------------------------------------------

function Navbar() {
  return (
    <div className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/90 border-b border-zinc-200">
      <Container className="h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-semibold">SF</div>
          <span className="font-medium">Stillform RWA</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-700">
          <NavLink to="about">About</NavLink>
          <NavLink to="how">How It Works</NavLink>
          <NavLink to="personas">For Users</NavLink>
          <NavLink to="market">Explore</NavLink>
          <NavLink to="community">Community</NavLink>
        </nav>
        <div className="flex items-center gap-3">
          {!DEMO_MODE && (
            <button className="hidden sm:inline-flex items-center gap-2 text-sm font-medium border border-zinc-300 rounded-xl px-3 py-2 hover:border-zinc-800">
              <Globe className="w-4 h-4" /> 中文 / EN
            </button>
          )}
          {!DEMO_MODE && (
            <button className="inline-flex items-center gap-2 text-sm font-medium bg-zinc-900 text-white rounded-xl px-3 py-2 hover:bg-zinc-800">
              <Wallet className="w-4 h-4" /> Connect Wallet
            </button>
          )}
          {/* {DEMO_MODE && <span className="text-xs text-zinc-500">演示模式</span>} */}
        </div>
      </Container>
    </div>
  );
}

function Hero() {
    return (
        <div className="relative overflow-hidden">
            {/* 背景渐变（使用视口宽度 + 外层裁切，杜绝水平溢出） */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div
                    aria-hidden
                    className="
            absolute -top-24 left-1/2 -translate-x-1/2
            w-[110vw] max-w-none aspect-square
            bg-gradient-to-tr from-zinc-200 via-white to-white
            rounded-full blur-3xl pointer-events-none
          "
                />
            </div>

            <Container className="py-16 md:py-24">
                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 bg-white text-xs mb-4">
                        <ShieldCheck className="w-4 h-4" /> 一物一链 · 透明确权 · 实体化即锁定
                    </div>
                    <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.1]">
                        把现实艺术带到链上，
                        <br className="hidden md:block" /> 让收藏更安全、更稀缺
                    </h1>
                    <p className="text-zinc-500 mt-5 max-w-2xl mx-auto">
                        只有已购买持有者可发起实体化；实体化后链上资产锁定，商家端不可再销售，且不可再次提取。
                    </p>
                    <div className="mt-8 flex items-center justify-center gap-3">
                        <a
                            href="#how"
                            onClick={(e) => {
                                e.preventDefault();
                                scrollToId("how");
                            }}
                            className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 text-white px-5 py-3 text-sm font-medium hover:bg-zinc-800"
                        >
                            了解运作机制 <ArrowRight className="w-4 h-4" />
                        </a>
                    </div>
                </motion.div>
            </Container>
        </div>
    );
}


// ------------------------------------------------------------
// 核心内容分区
// ------------------------------------------------------------

function PainVsSolution() {
  return (
    <Container id="about" className="py-16 md:py-24 scroll-mt-20">
      <SectionTitle overline="Why RWA" title="传统痛点 vs 我们的解决方案" subtitle="用链上确权与透明流程，解决真伪、流动性与收益分配问题" />
      <div className="grid md:grid-cols-2 gap-5">
        {pains.map((p, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center">
                <BadgeCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm text-zinc-500">问题</div>
                <div className="font-medium">{p.pain}</div>
                <div className="mt-3 text-sm text-zinc-500">我们的方案</div>
                <div className="font-medium text-zinc-900">{p.solution}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Container>
  );
}

function Flow() {
  const steps = [
    { icon: <Palette className="w-5 h-5" />, title: "实物收录",   desc: "艺术品 / 潮玩 / 文玩与生产批次建立绑定" },
    { icon: <Package className="w-5 h-5" />, title: "上链映射",   desc: "铸造 NFT / RWA 资产，生成唯一 token" },
    { icon: <Wallet  className="w-5 h-5" />, title: "购买与托管", desc: "用户购买后可选择托管或提取" },
    { icon: <Lock    className="w-5 h-5" />, title: "实体化锁定", desc: "仅持有人可实体化；实体化后链上锁定，商家不可再售，且不可再次提取" },
    { icon: <Users   className="w-5 h-5" />, title: "二级流通",   desc: "链上展示/转让按合约规则执行" },
  ];

  return (
    <div id="how" className="bg-gradient-to-b from-white to-zinc-50 scroll-mt-20">
      <Container className="py-16 md:py-24">
        <SectionTitle overline="How It Works" title="运作机制" subtitle="把复杂流程抽象为可理解的五步法" />
        <div className="grid md:grid-cols-5 gap-4">
          {steps.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
              <Card className="p-6 h-full">
                <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center">{s.icon}</div>
                <h4 className="font-medium mt-4">{s.title}</h4>
                <p className="text-sm text-zinc-500 mt-2">{s.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-zinc-600">
          <CheckCircle2 className="w-4 h-4" /> 实体化后链上锁定用于保护用户权益并强化稀缺性
        </div>
      </Container>
    </div>
  );
}

function Personas() {
  return (
    <Container id="personas" className="py-16 md:py-24 scroll-mt-20">
      <SectionTitle overline="For Whom" title="为不同人群量身打造" subtitle="击中艺术家、工厂、收藏者的核心诉求" />
      <div className="grid md:grid-cols-3 gap-5">
        {personas.map((p) => (
          <Card key={p.key} className="p-6">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${p.color} text-zinc-900 flex items-center justify-center`}>{p.icon}</div>
            <h4 className="font-semibold mt-4">{p.title}</h4>
            <ul className="mt-3 space-y-2 text-sm text-zinc-600">
              {p.points.map((txt, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Star className="w-4 h-4 mt-0.5" /> <span>{txt}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-zinc-500">
              <span>了解更多</span> <ChevronRight className="w-4 h-4" />
            </div>
          </Card>
        ))}
      </div>
    </Container>
  );
}

function Market() {
  return (
    <Container id="market" className="py-16 md:py-24 scroll-mt-20">
      <SectionTitle overline="Explore" title="产品展示" />
      <div className="grid md:grid-cols-2 gap-5">
        {demoProducts.map((p) => {
          const pct = Math.round((p.sold / p.total) * 100);
          const locked = p.status === "已锁定";
          return (
            <Card key={p.id} className="p-5 flex flex-col">
              <div className="aspect-square rounded-xl bg-zinc-100 overflow-hidden flex items-center justify-center">
                {p.imgSrc ? (
                  <img
                    src={p.imgSrc}
                    alt={p.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="text-zinc-400"><Boxes className="w-10 h-10" /></div>
                )}
              </div>
              <h4 className="mt-4 font-medium line-clamp-1">{p.title}</h4>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Pill intent={locked ? "warning" : "info"}>{p.status}</Pill>
                {p.owner ? <Pill intent="success">我已持有</Pill> : <Pill>未持有</Pill>}
                <Pill>token: {p.token}</Pill>
              </div>
              <div className="mt-3">
                <Progress value={pct} />
                <div className="text-xs text-zinc-500 mt-1">已售 {p.sold} / {p.total}</div>
              </div>
              {/* 演示版不渲染任何按钮，避免无实现交互 */}
            </Card>
          );
        })}
      </div>
    </Container>
  );
}

function Community() {
  const links = [
    { icon: <Discord className="w-5 h-5" />, label: "Discord" },
    { icon: <Twitter className="w-5 h-5" />, label: "Twitter" },
    { icon: <Github className="w-5 h-5" />, label: "GitHub" },
  ];
  return (
    <Container id="community" className="py-16 md:py-24 scroll-mt-20">
      <SectionTitle overline="Community" title="加入我们的社区" subtitle="DAO 投票、线下展览等活动等你参与" />
      <div className="flex flex-wrap items-center justify-center gap-3">
        {links.map((l) => (
          <div key={l.label} className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 px-4 py-2 text-zinc-600">
            {l.icon} <span className="text-sm font-medium">{l.label}</span>
          </div>
        ))}
      </div>
    </Container>
  );
}

function Footer() {
  return (
    <div className="border-t border-zinc-200">
      <Container className="py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-600">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-zinc-900 text-white flex items-center justify-center text-xs">SF</div>
          <span>© 2025 Stillform · All rights reserved.</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Terms</span>
          <span>Privacy</span>
          <span>FAQ</span>
        </div>
      </Container>
    </div>
  );
}

// ------------------------------------------------------------
// 轻量“测试用例”（开发期自检）
// ------------------------------------------------------------

function runDevTests() {
  // 1) 导航锚点存在（基本语义检查）
  ["about", "how", "personas", "market", "community"].forEach((id) => {
    console.assert(typeof id === "string", `锚点 ${id} 应为字符串`);
  });
  // 2) 产品售卖进度合法性
  for (const p of demoProducts) {
    const pct = Math.round((p.sold / p.total) * 100);
    console.assert(pct >= 0 && pct <= 100, `进度应在 0..100 之间，产品 ${p.id} 计算到 ${pct}%`);
  }
  // 3) 人群配置完整性
  console.assert(personas.length === 3, `应包含 3 类人群，当前为 ${personas.length}`);
  // 4) 新增：展示商品仅 2 个，且本地图片字段存在
  console.assert(demoProducts.length === 2, `演示应仅展示 2 个商品，当前为 ${demoProducts.length}`);
  for (const p of demoProducts) {
    console.assert(typeof p.imgSrc === "string" && p.imgSrc.length > 0, `产品 ${p.id} 缺少本地图片 imgSrc`);
  }
}

// ------------------------------------------------------------
// 页面主组件
// ------------------------------------------------------------

export default function RWAHomePage() {
  useEffect(() => {
    runDevTests();
  }, []);

  return (
    <div className="min-h-screen bg-white text-zinc-900 overflow-x-hidden">
      <Navbar />
      <Hero />
      <PainVsSolution />
      <Flow />
      <Personas />
      <Market />
      <Community />
      <Footer />
    </div>
  );
}
