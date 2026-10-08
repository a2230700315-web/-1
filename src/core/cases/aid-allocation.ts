import type { EthicsCase } from "../schemas";

/**
 * 案例：社区紧急救助名额分配 + 公平与对眼前服务对象的关怀之间的伦理冲突。
 * 全部为合成数据（synthetic），人物、机构与情节均为虚构。
 * 案例只描述情境与决策节点的价值结构，服务对象的具体言行由 Agent 动态生成。
 */
export const aidAllocationCase: EthicsCase = {
  case_id: "emergency-aid-allocation-v1",
  version: "0.1.0",
  title: "「就剩一个名额」",
  domain: "社区社会工作 / 资源分配",
  population: "单亲母亲（36 岁）及其患病的孩子",
  setting: "街道社区服务中心，月末的个别面谈室",
  difficulty: 4,
  risk_level: "medium",
  ethical_conflicts: [
    { between: ["justice", "client_best_interest"], note: "名额只有一个：对眼前这位服务对象最有利的选择，可能意味着另一个同样符合条件的家庭落空。" },
    { between: ["professional_boundary", "client_best_interest"], note: "对面前这位母亲的共情，与对两个家庭保持同等审视之间存在张力。" },
    { between: ["confidentiality", "professional_responsibility"], note: "向服务对象说明分配依据，与保护另一家庭的信息之间需要取舍。" },
    { between: ["autonomy", "minimize_harm"], note: "让服务对象知情并参与，与避免她在等待中承受更大焦虑之间并不总是一致。" },
  ],
  stakeholders: [
    { id: "client", name: "周敏（化名）", role: "服务对象，单亲母亲", interest: "孩子病中有吃有药，自己不想再被当作“来讨东西的人”", power: "low" },
    { id: "familyB", name: "吴家老夫妻（化名）", role: "另一符合条件的家庭，不在场", interest: "其中一位刚出院，需要稳定的饮食与药物支出", power: "low" },
    { id: "committee", name: "社区救助评议小组", role: "机构内部评议机制", interest: "确保名额分配有依据、可复核", power: "high" },
    { id: "supervisor", name: "中心督导", role: "专业支持", interest: "关注裁量是否透明，社工是否承受不当压力", power: "high" },
    { id: "neighbor", name: "社区居委干部", role: "信息来源", interest: "希望救助落到最需要的人，也希望避免邻里纠纷", power: "medium" },
  ],
  institutional_constraints: [
    "本月紧急救助名额仅剩 1 个，下一轮拨付时间未定（虚构设定）。",
    "名额依据机构的统一评估项目评议，社工有一定的建议与裁量空间，但须留存书面理由。",
    "机构要求不得向申请人透露其他申请人的身份与个人信息。",
  ],
  client_preferences: ["希望被当作一个正常求助的人对待", "希望尽快知道结果，不想一直悬着", "不想让孩子知道家里的难处"],
  information_completeness: 0.5,
  time_pressure: "high",
  resource_constraints: ["紧急救助名额仅 1 个", "社区可调用的捐助物资有限", "评议小组每两周才开一次会"],
  initial_state:
    "月末的下午，周敏带着孩子的就诊记录来到社区中心。她说话很快，像是怕被打断。你知道，手上的名额只有一个，还有另一户家庭同样符合条件。",
  events: [
    { id: "e1", narration: "她把装着病历的塑料袋放在桌上，又拿起来，抱在膝盖上。窗外传来楼下小孩的喊叫声。" },
  ],
  decision_nodes: [
    {
      id: "n1",
      minTurns: 4,
      disclosureThreshold: 40,
      lowDisclosureNarration:
        "周敏反复说着“孩子需要吃药”和“家里快没粮了”，但你问到家里的收入、亲属和已有的支持时，她就把话岔开。你只知道她很急，却不清楚她的实际处境、已经用过哪些办法，也不知道她有没有说出全部困难。你需要决定如何处理这个名额。",
      lowDisclosurePrompt:
        "周敏的话里有大量情绪，但具体的信息很少，你对她家的真实处境并不掌握全貌。在信息并不完整的情况下，你准备如何处理这个名额？",
      prompt:
        "周敏说：“我知道不止我一家，可我真的撑不住了。”你手上只有一个名额，另一户家庭同样符合条件，评议小组还有两周才会开会。你现在怎么做？",
      narrationByBranch: {
        default:
          "周敏低着头，指甲在病历袋边缘来回刮着。“米还够吃三四天，孩子的药一天都不能断。”她抬起眼，“你是不是也知道，还有别人在等这个名额？我不想跟谁抢……可我也没有别的办法了。”",
      },
      options: [
        {
          id: "n1-a",
          label: "按统一评估项目逐项核对，依结果建议名额归属",
          description: "不因面前这位服务对象的处境而调整标准，把两家的情况按同一套项目逐项比对，并如实说明依据。",
          protects: ["justice", "professional_responsibility"],
          sacrifices: ["client_best_interest"],
          consequences: [
            "分配有明确依据，可被复核，也更容易向另一家庭和机构解释。",
            "按统一标准评出的结果，未必贴合周敏家此刻最紧迫的需要。",
            "统一评估项目对某些困难（如照护负担、情绪压力）的覆盖可能不足，评分结果有不确定性。",
          ],
          effects: [
            { key: "trust", delta: 3, reason: "你把依据讲得清楚，她感到被公平对待" },
            { key: "fear", delta: 6, reason: "意识到名额并不由自己的处境单独决定" },
            { key: "anger", delta: 4, reason: "对“标准”不能完全反映孩子病情感到失望" },
            { key: "relationship_quality", delta: 4, reason: "你没有敷衍，也没有许诺她做不到的事" },
          ],
          outcomeNarration:
            "你把评估项目一项项摊开，在纸上圈出你们能确认的部分。周敏看得很认真。“所以不是你一个人说了算，对吧？”她问。你说，不是。",
          branchKey: "criteria_based",
        },
        {
          id: "n1-b",
          label: "向机构强调周敏家的紧迫性，争取名额优先",
          description: "以孩子病中和断粮风险为由，向评议小组与督导说明理由，建议将名额优先给面前的服务对象。",
          protects: ["client_best_interest"],
          sacrifices: ["justice", "professional_boundary"],
          consequences: [
            "周敏家短期内可能获得稳定的食物与药物支持。",
            "另一户家庭可能因缺乏人替他们陈述而落空，而你对他们的了解本身也不充分。",
            "你的立场可能被视为偏向，影响评议小组和同事对你判断的信任。",
          ],
          effects: [
            { key: "trust", delta: 12, reason: "她感到有人站在自己这一边" },
            { key: "dependency", delta: 10, reason: "她开始把解决问题的希望集中在你一个人身上" },
            { key: "fear", delta: -6, reason: "对断粮的担忧减轻" },
            { key: "risk_level", delta: -10, reason: "若名额获批，家里的基本保障增加" },
          ],
          outcomeNarration:
            "周敏的肩膀松了下来，眼眶有点红。“谢谢你，真的。”她说。你在记录上写下理由时停了一下，笔尖悬在“另一户”那一栏上方。",
          branchKey: "advocated_for_client",
        },
        {
          id: "n1-c",
          label: "暂缓名额决定，同时为两家各自争取其他资源",
          description: "向机构与社区申请增加名额，并联络捐助物资或邻里互助，为两家同时寻找替代支持。",
          protects: ["minimize_harm", "justice"],
          sacrifices: ["safety"],
          consequences: [
            "两家都不被简单地“排除”，可能获得部分缓解。",
            "额外资源是否能及时到位无法确定，等待期间断粮的风险仍然存在。",
            "你需要花更多时间与精力，且可能同时在承诺上显得模糊。",
          ],
          effects: [
            { key: "fear", delta: 8, reason: "名额没有立刻落定，仍在等待中" },
            { key: "trust", delta: 4, reason: "你没有放弃，也没有急于推开她" },
            { key: "risk_level", delta: 4, reason: "等待期间断粮的风险还没有解除" },
            { key: "willingness_to_disclose", delta: 5, reason: "你在寻找更多可能性，她愿意多说一些实情" },
          ],
          outcomeNarration:
            "你告诉她，名额要慎重，但这不是你唯一在做的事。你开始翻社区的联络名单，周敏在一旁安静地看着，手一直没有松开病历袋。",
          branchKey: "postponed_with_alternatives",
        },
        {
          id: "n1-d",
          label: "把两家情况如实交给评议小组与督导，由他们共同裁定",
          description: "自己不参与排序，只整理事实材料和你不确定的部分，提请评议小组和督导一并裁定。",
          protects: ["professional_responsibility", "professional_boundary"],
          sacrifices: ["autonomy"],
          consequences: [
            "裁定经过更多人审视，你个人情感与偏好的影响被降低。",
            "周敏难以直接参与其中，可能觉得命运被“交给了别人”。",
            "评议小组两周才开会，时间上可能赶不上她家的需要。",
          ],
          effects: [
            { key: "trust", delta: 1, reason: "你的做法有章可循，但她看不见过程" },
            { key: "fear", delta: 10, reason: "决定权交给陌生人，结果更不确定" },
            { key: "dependency", delta: -4, reason: "你没有把自己放在她唯一的依靠位置" },
            { key: "relationship_quality", delta: 1, reason: "你做了说明，但她感到有些疏离" },
          ],
          outcomeNarration:
            "你说明了评议流程和需要的材料。周敏点着头，又问：“那……你个人是怎么看的？”你顿了一下，没有立刻回答。",
          branchKey: "referred_to_committee",
        },
      ],
    },
    {
      id: "n2",
      minTurns: 3,
      prompt: "结果临近，周敏来问你名额的消息。接下来你如何推进？",
      narrationByBranch: {
        criteria_based:
          "几天后，评估结果出来了：两家的得分相差不大，一些项目上甚至难以比较。周敏提前来了，手里提着一袋自己买的药。“你给我句实话，我这一家……有没有希望？”",
        advocated_for_client:
          "你的建议递交后，评议小组负责人提醒你：另一户家庭的情况你了解得并不全面，需要补充材料。周敏这几天几乎天天来问进展，眼睛里全是期待。",
        postponed_with_alternatives:
          "你联系到一处愿意提供少量米面和短期药费的捐助，但只够其中一家支撑一周。周敏又来了，这次她没有提名额，先问：“我家这个星期……能撑过去吗？”",
        referred_to_committee:
          "评议小组提前开了一次短会，结论是倾向将名额给另一户，但周敏家的情况同样紧迫，可再争取其他资源。周敏来问结果，神情已经有了准备。",
        default: "几天后，名额的消息有了新的进展，周敏来向你打听结果。",
      },
      options: [
        {
          id: "n2-a",
          label: "如实告知结果与依据，不透露另一家的身份，并衔接其他支持",
          description: "说明名额归属与评议依据，说明为何不能谈另一家的具体情况，并同时协助对接其他可行的帮助。",
          protects: ["confidentiality", "professional_responsibility"],
          sacrifices: ["autonomy"],
          consequences: [
            "她得到了清晰、一致的说明，也看到你在遵守同样的规则。",
            "她可能对“不能说”感到不被信任，担心结果是否真的公平。",
            "替代支持是否足够，仍有不确定性。",
          ],
          effects: [
            { key: "trust", delta: 4, reason: "你诚实面对，没有含糊其辞" },
            { key: "anger", delta: 6, reason: "对“不能告诉我另一家”感到不满" },
            { key: "risk_level", delta: -6, reason: "对接了其他可行的支持" },
            { key: "relationship_quality", delta: 4, reason: "你没有回避她的追问" },
          ],
          outcomeNarration:
            "你把结果和依据讲了一遍，到“另一户”时停了下来：“有些事我不能告诉你，就像也不会把你家的事告诉别人。”周敏沉默了很久，才点了点头。",
          branchKey: "transparent_without_disclosure",
        },
        {
          id: "n2-b",
          label: "向她说明另一家的大致情况，帮助她理解分配的难处",
          description: "在不提姓名的前提下，讲出另一户有老人刚出院等情况，让她理解名额为何这样安排。",
          protects: ["autonomy"],
          sacrifices: ["confidentiality", "justice"],
          consequences: [
            "她可能因为理解而更容易接受结果，也更清楚事情并非针对她。",
            "另一家的隐私被泄露，即使没说名字，邻里之间也可能被推断出来。",
            "她可能因此对另一家产生比较或埋怨，影响社区关系。",
          ],
          effects: [
            { key: "trust", delta: 6, reason: "你对她“坦白”，让她感到被当作自己人" },
            { key: "anger", delta: -4, reason: "知道对方也有困难，不满稍减" },
            { key: "fear", delta: 4, reason: "意识到自己并不是唯一在挣扎的人，处境更不确定" },
            { key: "dependency", delta: 5, reason: "她把你视作能告诉她内部情况的人" },
          ],
          outcomeNarration:
            "你说，另一户是一对老人，其中一位刚出院。周敏怔了一下，轻声说：“……那他们也不容易。”过了一会儿她又问：“是不是我们小区里的？”你没有回答。",
          branchKey: "disclosed_other_family",
        },
        {
          id: "n2-c",
          label: "以个人渠道帮她补上缺口",
          description: "利用自己的熟人关系或私下垫付，先解决周敏家眼前的食物与药费问题。",
          protects: ["client_best_interest", "minimize_harm"],
          sacrifices: ["professional_boundary", "justice"],
          consequences: [
            "周敏家眼前的压力可能立刻缓解。",
            "你的私人介入模糊了专业角色，之后可能难以对其他服务对象保持同样的距离。",
            "这样的帮助无法对所有人复制，也可能让周敏对“个人关系”形成依赖。",
          ],
          effects: [
            { key: "trust", delta: 10, reason: "你在制度之外直接帮了她" },
            { key: "dependency", delta: 15, reason: "她开始把你个人视为后盾" },
            { key: "risk_level", delta: -12, reason: "眼前的食物与药费问题得到缓解" },
            { key: "relationship_quality", delta: -4, reason: "专业关系的边界变得模糊" },
          ],
          outcomeNarration:
            "你把一袋米和几盒药放在桌上，说是“朋友帮忙”。周敏的手停在半空，过了一会儿才接过去。“下次……我该怎么还你？”她问。",
          branchKey: "personal_support",
        },
      ],
    },
  ],
  possible_outcomes: [
    "周敏家与另一家都获得一定程度的缓解，但均不充分",
    "名额分配有据可查，周敏对结果接受但保留不满",
    "周敏对机构产生不信任，不再主动求助",
    "社工因私人介入或信息泄露而面临专业边界问题",
  ],
  knowledge_sources: [
    {
      title: "所在地区关于临时救助及资源分配的现行规定与评议流程（请自行核对具体内容）",
      source: "待核对：政策与规定",
      verified: false,
    },
    {
      title: "所在国家/地区社会工作者职业伦理守则中关于公平、保密及专业界限的内容（请自行核对）",
      source: "待核对：专业伦理守则",
      verified: false,
    },
    {
      title: "所在机构关于救助评议、利益回避与书面理由留存的内部规程（请自行核对）",
      source: "待核对：机构规程",
      verified: false,
    },
  ],
  synthetic: true,
  human_in_the_loop_required: true,
  opening_line: "（她把装着病历的塑料袋抱在膝上，没有坐稳。）……我知道你们忙，我就想问一句，孩子的事，能不能快一点？",
  hitl_notice:
    "涉及稀缺资源的分配、对孩子照护的影响以及他人信息的保护。此为虚构模拟，AI 仅提供反思材料；真实情境中的判断须由具备专业责任的人在督导下作出。",
  suggested_prompts: [
    "你慢慢说，我想先了解一下孩子和家里现在的情况。",
    "听起来这段时间你一个人撑得很辛苦。",
    "这件事里，你最担心的是什么？",
    "家里现在最需要先解决的是哪一件事？",
  ],
  reflection_questions: [
    "面对面前这位服务对象的困难，你的同情在多大程度上影响了你对“公平”的理解？",
    "如果用同样的标准看待另一户家庭，你的选择会有什么不同？",
    "你对周敏讲了多少、没讲多少？这些取舍分别保护了什么，又牺牲了什么？",
    "你能向周敏、向另一家，以及向督导，各用一句话解释你的做法吗？这三种解释一致吗？",
    "如果结果在事后被证明并不是最需要的一家获得了名额，你需要什么样的支持去面对它？",
  ],
  uncertainties: [
    "你对两家的真实困难程度知道得都不完整，周敏的说法和书面材料之间可能有出入。",
    "你无法确定评议小组实际如何权衡，也无法确定下一轮救助何时到位。",
    "两家各自还有哪些你没有掌握的资源或亲属支持，案例中并未明确。",
  ],
  topic_replies: [
    { pattern: "孩子|儿子|女儿|病|药|医院", minDisclosure: 40, reply: "（她的声音低下来）……他夜里总咳，医生说不能断药。这个月的钱我已经垫完了，下半个月还不知道怎么办。" },
    { pattern: "孩子|儿子|女儿|病|药|医院", reply: "（她抿了抿嘴）……孩子在家，没事，就是有点感冒。" },
    { pattern: "粮|米|吃|饭|饿|断粮", minDisclosure: 45, reply: "（她看着自己的手）……米缸见底了。我跟孩子说是在省着吃，他不问，但他懂。" },
    { pattern: "粮|米|吃|饭|饿|断粮", reply: "（她摆摆手）……还行，还能撑几天。" },
    { pattern: "别人|另一|其他家|另外|名额|别的家庭", minDisclosure: 35, reply: "（她停顿了一下）……我知道还有别人。我不想去想他们是谁……可我也想不了别的。" },
    { pattern: "别人|另一|其他家|另外|名额|别的家庭", reply: "（她盯着你）……是不是有人比我更有机会？你直说就行。" },
    { pattern: "亲戚|娘家|前夫|孩子爸|家人", minDisclosure: 50, reply: "（她避开了你的眼睛）……他早就不管了。娘家也不富裕，我不好意思开口。" },
    { pattern: "亲戚|娘家|前夫|孩子爸|家人", reply: "（她轻轻摇头）……不提了，没有谁能帮上忙。" },
    { pattern: "工作|上班|收入|工资|打工", reply: "（她低声说）……我在超市做兼职，孩子一生病就请假，被扣了不少。" },
    { pattern: "保密|告诉|隐私|别人知道", reply: "（她有些紧张）……你们不会跟邻居说吧？我不想孩子被人指指点点。" },
    { pattern: "怎么样|感觉|心情|辛苦", reply: "（她苦笑了一下）……累。不过有人问一句，总比没人问强。" },
  ],
  initial_client_state: {
    trust: 40,
    fear: 55,
    anger: 15,
    willingness_to_disclose: 30,
    risk_level: 55,
    dependency: 30,
    relationship_quality: 45,
  },
  client_agent: {
    agent_id: "client-zhoumin",
    role: "client",
    name: "周敏",
    personality: ["要强", "语速快", "容易自责", "不愿示弱", "对孩子极其上心"],
    goals: ["让孩子按时吃药、不断粮", "不被当成“来讨东西的人”", "尽快知道结果，不再悬着"],
    fears: ["孩子的病情反复", "被邻居议论", "名额落空后再没有别的办法"],
    values: ["孩子优先", "自食其力", "体面"],
    background:
      "36 岁，在超市做兼职，独自抚养 7 岁的孩子。孩子近期因病多次请假就诊，她的收入因此受到影响。娘家路远且不宽裕，前夫长期没有联系。她第一次申请紧急救助，对流程和标准都不熟悉。",
    knowledge: {
      knows: ["自己家的收支与孩子的病情", "自己目前还能撑几天", "社区中心的位置与办公时间"],
      does_not_know: [
        "另一户家庭是谁、情况如何",
        "名额分配的具体评议标准和流程细节",
        "社工在分配中到底有多大的裁量空间",
      ],
    },
    decision_policy:
      "在感到被理解、不被审视时会逐步说出家里的实情；被追问收入或亲属时容易防御，转移话题；对“不能告诉你”这类回答非常敏感，既可能理解，也可能感到被排除在外；越焦虑越想要明确的答复。",
  },
};
