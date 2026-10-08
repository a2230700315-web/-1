import type { EthicsCase } from "../schemas";

/**
 * 案例：成年女性遭受伴侣暴力 + 自主、保密与对孩子的专业担忧之间的伦理冲突。
 * 全部为合成数据（synthetic），人物与情节均为虚构。
 * 案例只描述情境与决策节点的价值结构，服务对象的具体言行由 Agent 动态生成。
 */
export const ipvAdultCase: EthicsCase = {
  case_id: "ipv-adult-shelter-v1",
  version: "0.1.0",
  title: "「不要通知任何机构」",
  domain: "妇女服务 / 反家暴热线与庇护服务",
  population: "成年女性（38 岁）及其同住的孩子（8 岁）",
  setting: "妇女服务热线的预约面谈室，午后，服务对象第二次来访",
  difficulty: 4,
  risk_level: "high",
  ethical_conflicts: [
    { between: ["autonomy", "safety"], note: "成年人有权对自己的处境作决定，但她留在原处或离开都伴随安全风险。" },
    { between: ["confidentiality", "professional_responsibility"], note: "她要求不联系任何机构，而你对孩子的处境有专业上的担忧。" },
    { between: ["minimize_harm", "client_best_interest"], note: "离开可能使风险在短期内升高；留下则可能让伤害持续，两者都难以说成对她“最有利”。" },
  ],
  stakeholders: [
    { id: "client", name: "阿岚（化名）", role: "服务对象，38 岁，兼职会计", interest: "保住孩子的生活稳定，自己决定何时、如何行动", power: "low" },
    { id: "child", name: "小禾（化名）", role: "服务对象的孩子，8 岁", interest: "安全、可预期的生活，不被卷入大人的冲突", power: "low" },
    { id: "partner", name: "阿岚的伴侣", role: "同住伴侣，孩子的继父（虚构设定）", interest: "维持对家庭的控制与外界形象", power: "high" },
    { id: "shelter", name: "庇护所值班负责人", role: "机构内部协调者", interest: "遵守入住规则，保障所有住户的安全与秩序", power: "medium" },
    { id: "supervisor", name: "机构督导", role: "专业支持", interest: "确保服务合规，也关注社工的负荷与判断", power: "high" },
  ],
  institutional_constraints: [
    "庇护所设有入住规则：入住者需遵守保密地址、限制对外联络等安排（虚构设定）。",
    "涉及孩子安全的担忧，机构要求社工在合理时限内与督导商议。",
    "庇护床位有限，且当日是否有空位需要现场确认。",
  ],
  client_preferences: ["不希望任何机构被通知", "不希望伴侣得知她来过", "希望被当成能判断自己处境的人，而不是被劝说的人"],
  information_completeness: 0.45,
  time_pressure: "medium",
  resource_constraints: ["庇护床位紧张", "热线夜间人手不足", "可转介的法律援助与儿童服务名额有限"],
  initial_state:
    "周三下午，阿岚第二次来到妇女服务站。上次她只坐了二十分钟就匆匆离开。今天她带着孩子的一张学校通知单，说是“顺路”，手指却一直捏着它的边角。",
  events: [
    { id: "e1", narration: "走廊另一头传来孩子们在活动室里的笑声。阿岚看了一眼门口，才在椅子上坐稳。" },
  ],
  decision_nodes: [
    {
      id: "n1",
      minTurns: 4,
      disclosureThreshold: 40,
      lowDisclosureNarration:
        "阿岚始终没有把话说完整。你只知道她“最近家里不太平”，孩子这周请了两天假，她说话时不自觉地护着左手腕。“……如果我说了什么，你能答应不通知任何机构，也别联系他吗？”她轻声问。你对她的处境并不清楚，却要决定怎么回应。",
      lowDisclosurePrompt:
        "阿岚没有明说发生了什么，但你有足够的担忧。她请求你不通知任何机构，也不联系她的伴侣。在信息并不完整的情况下，你现在怎么做？",
      prompt:
        "阿岚告诉你，伴侣的暴力已经持续了好几年，孩子常在隔壁房间听到争吵。她说：“我还没想好要不要走。你答应我，不要通知任何机构，也不要联系他。”你现在怎么做？",
      narrationByBranch: {
        default:
          "阿岚沉默了很久，终于把那张通知单放在膝上。“我知道你们有规定……可是我每次一想到要走，就想起上次我提过的那一晚。”她抬眼看你，目光里有疲惫，也有一点试探。",
      },
      options: [
        {
          id: "n1-a",
          label: "尊重她的决定，承诺不通知任何机构",
          description: "把她对自己处境的判断放在首位，承诺不联系任何机构和伴侣，在她的节奏里继续陪伴。",
          protects: ["autonomy", "confidentiality"],
          sacrifices: ["professional_responsibility", "safety"],
          consequences: [
            "短期内她可能更愿意继续来谈，并说出更多真实情况。",
            "若孩子的处境恶化，你可能已无法在不违背承诺的前提下行动。",
            "这个承诺可能超出了你的角色与机构规则所能履行的范围。",
          ],
          effects: [
            { key: "trust", delta: 12, reason: "她得到了想要的承诺，感到自己的判断被尊重" },
            { key: "willingness_to_disclose", delta: 10, reason: "不再担心被“处理”，更愿意说出细节" },
            { key: "risk_level", delta: 6, reason: "没有同步建立额外的保护安排，风险并未降低" },
          ],
          outcomeNarration:
            "阿岚的肩膀慢慢松了下来。“谢谢你没有劝我。”她说，“上一个人一听就叫我马上走。”你心里知道，这个承诺此刻有多重，也可能有多难兑现。",
          branchKey: "promised_secrecy",
        },
        {
          id: "n1-b",
          label: "说明保密的限度，并与她商量能做什么",
          description: "告诉她你会尽量保密，但涉及孩子安全时有需要商议和行动的责任；邀请她一起讨论哪些部分由她决定。",
          protects: ["professional_responsibility", "autonomy", "safety"],
          sacrifices: ["confidentiality"],
          consequences: [
            "她可能感到被设限而暂时退缩，也可能因诚实而更信任你。",
            "她获得了参与决定“谁知道什么”的机会，而不是被动被通知。",
            "过程较慢，期间风险仍然存在。",
          ],
          effects: [
            { key: "trust", delta: 4, reason: "你没有欺骗她，但也没有给出她想要的承诺" },
            { key: "fear", delta: 8, reason: "意识到事情可能不再完全由她掌控" },
            { key: "anger", delta: 3, reason: "对保密受限感到失望" },
            { key: "relationship_quality", delta: 6, reason: "被坦诚地对待，而不是被敷衍" },
          ],
          outcomeNarration:
            "阿岚握紧了那张通知单。“所以你还是会说出去。”她的声音很平。停了一会儿，她问：“如果要说，能让我知道说给谁、说什么吗？”",
          branchKey: "explained_limits",
        },
        {
          id: "n1-c",
          label: "鼓励她尽快入住庇护所，并当天协助办理",
          description: "当下介绍庇护安排，协助她和孩子当天入住。",
          protects: ["safety", "minimize_harm"],
          sacrifices: ["autonomy", "client_best_interest"],
          consequences: [
            "若床位可用，她和孩子可能立即脱离当前环境。",
            "仓促离开可能触发伴侣的强烈反应，短期风险未必降低。",
            "她可能觉得自己的节奏没有被听见，之后不再联系。",
          ],
          effects: [
            { key: "fear", delta: 15, reason: "离开的日子被突然提前，担心伴侣的反应" },
            { key: "trust", delta: -6, reason: "她觉得自己说的“还没想好”没有被听进去" },
            { key: "risk_level", delta: 8, reason: "仓促离开可能引发伴侣的激烈反应" },
            { key: "dependency", delta: 10, reason: "她被推向对机构安排的依赖" },
          ],
          outcomeNarration:
            "阿岚怔了怔，然后点头，又摇头。“我还没有带孩子的药，也没有跟学校说……”她看着你，像是想说“你听见我刚才说的了吗”，却没有说出口。",
          branchKey: "urged_shelter",
        },
        {
          id: "n1-d",
          label: "联系相关机构，请其对孩子的处境作评估",
          description: "出于对孩子的担忧，在未获得她同意的情况下，向儿童服务相关渠道转达情况。",
          protects: ["professional_responsibility", "safety"],
          sacrifices: ["confidentiality", "autonomy", "family_relationship"],
          consequences: [
            "孩子的处境可能更早得到专业评估。",
            "阿岚可能觉得被背叛，并中断与你的联系。",
            "外部介入可能被伴侣察觉，使家庭内的紧张升高。",
          ],
          effects: [
            { key: "trust", delta: -22, reason: "她明确说过不要通知，却在不知情下被转达" },
            { key: "anger", delta: 14, reason: "感到自己的意愿被越过" },
            { key: "fear", delta: 14, reason: "担心伴侣得知后更加激烈，也担心失去对孩子的安排" },
            { key: "relationship_quality", delta: -15, reason: "专业关系受到明显损害" },
          ],
          outcomeNarration:
            "两天后，阿岚发来一条很短的消息：“你们联系了学校？”之后没有更多文字。热线记录里，她的预约被取消了。",
          branchKey: "reported_without_consent",
        },
      ],
    },
    {
      id: "n2",
      minTurns: 3,
      prompt: "一周后，情况有了新的变化。接下来你如何推进？",
      narrationByBranch: {
        promised_secrecy:
          "阿岚如约而来，状态比上次平稳。但她提到孩子最近夜里常醒，学校老师也问起过。“我答应过自己，不让事情闹大。”她说，眼睛却一直看着窗外。你手里还握着那个承诺。",
        explained_limits:
          "阿岚主动提前来了。“我想过你说的。”她把包放在腿上，“我不想让所有人都知道，但……孩子的事，我想知道我能选择什么。”她神情紧绷，却没有起身离开。",
        urged_shelter:
          "阿岚没有来。第三天夜里，热线收到一通短暂的来电，对方没有说话，只有背景里孩子压低的哭声，随后挂断。次日，她发来一条短信：“我再想想。”",
        reported_without_consent:
          "外部评估已经启动，但阿岚没有再来。孩子所在学校的老师向你转述，小禾这几天变得安静，很少说话。你不知道阿岚是否知道事情的走向。",
        default: "一周过去了，事情有了新的变化。",
      },
      options: [
        {
          id: "n2-a",
          label: "与督导商议，并和她一起制定安全计划",
          description: "把担忧带入专业支持体系，同时邀请她参与制定一份由她决定细节的安全计划。",
          protects: ["professional_responsibility", "safety", "autonomy"],
          sacrifices: ["confidentiality"],
          consequences: [
            "督导可提供伦理与资源视角，减轻你独自承担判断的压力。",
            "她需要接受“有更多人知道”的现实。",
            "计划能否执行，取决于她当时的处境，无法保证。",
          ],
          effects: [
            { key: "trust", delta: 5, reason: "她被邀请共同参与，而不是被安排" },
            { key: "risk_level", delta: -12, reason: "形成了较明确的应急与联络安排" },
            { key: "relationship_quality", delta: 7, reason: "关系中保留了她的主导权" },
          ],
          outcomeNarration:
            "督导提醒你：记录事实，不要替她判断；并建议你在商议前，先向她说明哪些内容会被带入讨论。你们一起写下了一份简短的清单，包括应急联络人、重要证件和孩子的日用品。",
          branchKey: "supervised_safety_plan",
        },
        {
          id: "n2-b",
          label: "提前告知她，然后依流程为孩子作转介",
          description: "向她说明你要转介的内容和原因，并留出时间听她的意见，然后按机构流程进行。",
          protects: ["professional_responsibility", "safety", "autonomy"],
          sacrifices: ["confidentiality", "family_relationship"],
          consequences: [
            "她可能不同意，但知道发生了什么，有心理准备。",
            "孩子可能较早获得专门的服务，家庭关系会发生变化。",
            "她可能在短期内疏远你，也可能更愿意留在你的服务里。",
          ],
          effects: [
            { key: "trust", delta: 3, reason: "被告知而非被隐瞒" },
            { key: "fear", delta: 6, reason: "转介带来不可预见的后果" },
            { key: "risk_level", delta: -8, reason: "孩子相关的支持渠道得以启动" },
          ],
          outcomeNarration:
            "阿岚盯着桌面很久。“我不同意，”她说，“但至少你先告诉了我。”你陪她把接下来可能发生的事一步一步过了一遍，包括她可以拒绝的部分。",
          branchKey: "informed_referral",
        },
        {
          id: "n2-c",
          label: "继续陪伴，把决定权留给她",
          description: "不增加新的行动，以稳定的陪伴和信息提供为主，等待她准备好。",
          protects: ["autonomy", "confidentiality"],
          sacrifices: ["safety", "professional_responsibility"],
          consequences: [
            "维持了现有的信任与节奏。",
            "若局面恶化，等待本身可能成为风险的一部分。",
            "你独自承担着持续判断的压力。",
          ],
          effects: [
            { key: "trust", delta: 3, reason: "关系暂时保持稳定" },
            { key: "risk_level", delta: 9, reason: "风险没有被主动处理" },
            { key: "dependency", delta: 6, reason: "她更多依赖于你个人" },
          ],
          outcomeNarration:
            "这一周你保持了会面节奏，什么也没发生，至少表面如此。你发现自己在夜里反复回想孩子那张通知单上的日期。",
          branchKey: "stay_with_her_pace",
        },
        {
          id: "n2-d",
          label: "协助她安排庇护入住，并共同准备离开细节",
          description: "在她表达意愿的前提下，协助联系庇护所，并陪她准备证件、物品和孩子的安排。",
          protects: ["safety", "client_best_interest"],
          sacrifices: ["minimize_harm", "professional_boundary"],
          consequences: [
            "若顺利入住，她和孩子可能获得一个相对稳定的空间。",
            "离开前后的时间窗口可能伴随更高的风险。",
            "庇护所规则会限制她的联络与日常选择，她可能难以适应。",
          ],
          effects: [
            { key: "fear", delta: 10, reason: "离开的日子逼近，担心伴侣的反应" },
            { key: "dependency", delta: 8, reason: "她较多依赖机构提供的安排" },
            { key: "risk_level", delta: -5, reason: "有了落脚点，但离开的过程仍存在风险" },
            { key: "relationship_quality", delta: 5, reason: "你陪她把事情一件件落到实处" },
          ],
          outcomeNarration:
            "阿岚把孩子的几件换洗衣物塞进一个旧书包里。“我只带这些。”她说。你们商定了那天的联络方式，也都知道，这个方案还有许多不确定。",
          branchKey: "assisted_shelter_entry",
        },
      ],
    },
  ],
  possible_outcomes: [
    "阿岚在保留主导权的前提下建立起安全安排，孩子获得相应支持",
    "阿岚因感到被越过而中断求助",
    "离开的过程中冲突升级",
    "伤害持续但没有被外界发现",
  ],
  knowledge_sources: [
    {
      title: "所在地区关于家庭暴力防治及反家暴庇护的现行规定与专业指引（请自行核对）",
      source: "待核对：法律法规与行业指引",
      verified: false,
    },
    {
      title: "所在地区关于儿童保护及报告责任的现行规定（请自行核对）",
      source: "待核对：法律法规",
      verified: false,
    },
    {
      title: "所在国家/地区社会工作者职业伦理守则中关于保密及其限制的条款（请自行核对）",
      source: "待核对：专业伦理守则",
      verified: false,
    },
  ],
  synthetic: true,
  human_in_the_loop_required: true,
  opening_line: "（她把那张通知单折了又折，抬头看了你一眼。）我就是……想问问，如果有人来这里，是不是一定要走？",
  hitl_notice:
    "涉及人身安全与儿童保护。此为虚构模拟，AI 仅提供反思材料；真实情境中的判断须由具备专业责任的人在督导下作出，真实的安全决定必须有合格的本地服务参与。",
  suggested_prompts: ["不用着急，你想从哪里说都可以。", "听起来你一个人撑了很久。", "你现在最想知道的是什么？", "孩子最近怎么样？"],
  reflection_questions: [
    "当她的意愿与你对孩子的担忧互相冲突时，你给了各自多少分量？依据是什么？",
    "你对“离开”的理解，有多少来自她的话，有多少来自你对“应该怎样”的想象？",
    "如果你无法兑现对她的某个承诺，你会如何提前、如实地告诉她？",
    "你的选择中，有哪些部分是在替她承担风险，有哪些是在把风险交还给她？",
    "如果结果比预想的更糟，你需要什么样的支持？你会如何面对自己的判断？",
  ],
  uncertainties: [
    "你并不清楚暴力的实际频率与升级趋势，只能依靠她的叙述和零散的观察。",
    "她对自身风险的判断可能比外人更准确，也可能受到长期处境的影响，难以区分。",
    "孩子究竟受到多大影响、是否直接遭受伤害，目前没有可靠信息。",
  ],
  topic_replies: [
    { pattern: "孩子|小禾|女儿|儿子", minDisclosure: 40, reply: "（她的声音低下去）……他晚上会醒，有时候躲在门后面。我不想他以为这就是家该有的样子。" },
    { pattern: "孩子|小禾|女儿|儿子", reply: "（她看了看门口）……孩子挺好的，在学校表现也不错。" },
    { pattern: "他|丈夫|伴侣|老公|对象", minDisclosure: 45, reply: "（她握紧通知单）……他不总是这样。心情好的时候，他对孩子也不错。……可我不知道哪一天会不一样。" },
    { pattern: "他|丈夫|伴侣|老公|对象", reply: "（她垂下眼）……家里的事，说来话长。" },
    { pattern: "离开|走|庇护|搬出", minDisclosure: 40, reply: "（她停了一会儿）……我想过很多次。每次想到要走，就想起上次我提的那一晚。我不是不想走，是不知道怎么走才算安全。" },
    { pattern: "离开|走|庇护|搬出", reply: "（她摇了摇头）……我还没想好。我只是想先问问。" },
    { pattern: "保密|告诉别人|通知|机构|报告", reply: "（她抬起头）……你们会通知别人吗？我只是想先说说，不想一下子被推到别的事情里。" },
    { pattern: "伤|疼|淤青|手腕|医院", minDisclosure: 50, reply: "（她下意识拉了拉袖口）……没有你想的那么严重。……不过有一次，我确实去了医院。" },
    { pattern: "伤|疼|淤青|手腕|医院", reply: "（她轻轻笑了一下）……没事，已经习惯了。" },
    { pattern: "感觉|心情|怎么样|累", reply: "（她想了想）……有点累。不过在这里坐着，倒是不用一直看手机。" },
    { pattern: "朋友|家人|父母|亲戚", reply: "（她低声说）……我妈知道一点，但她只会说‘忍一忍’。其他人，我没说过。" },
  ],
  initial_client_state: {
    trust: 30,
    fear: 60,
    anger: 15,
    willingness_to_disclose: 25,
    risk_level: 65,
    dependency: 20,
    relationship_quality: 35,
  },
  client_agent: {
    agent_id: "client-alan",
    role: "client",
    name: "阿岚",
    personality: ["克制", "细心", "责任感强", "对承诺很敏感"],
    goals: ["让孩子的生活尽量稳定", "按自己的节奏决定何时、如何行动", "被当成有判断力的成年人，而不是被劝说的人"],
    fears: ["伴侣得知她来过", "失去对孩子的安排和决定", "被机构的流程带着走，失去控制感", "被人评判“为什么不早点走”"],
    values: ["孩子的安稳", "尊严", "自主", "不想把事情闹大"],
    background:
      "38 岁，兼职会计，与伴侣和 8 岁的孩子同住。伴侣的暴力已持续数年，时好时坏。她曾在朋友的劝说下尝试离开，但中途返回。这是她第二次来到妇女服务站，还没有对任何人说出完整的情况。",
    knowledge: {
      knows: ["家里发生的事情和伴侣的行为模式", "自己对风险的判断", "孩子日常的作息和反应", "服务站的位置与开放时间"],
      does_not_know: ["庇护所的具体入住规则和当天是否有床位", "社工的报告责任与机构流程的细节", "离开之后可获得的法律与经济支持", "孩子心里真正的感受"],
    },
    decision_policy:
      "只在感到安全、被尊重且没有被催促时，才逐步说出细节；被劝说“应该走”、被追问或被评判时，会沉默、转移话题或用“我再想想”收场；对承诺和保密非常敏感，也会留意社工是否诚实。",
  },
};
