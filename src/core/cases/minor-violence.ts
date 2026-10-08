import type { EthicsCase } from "../schemas";

/**
 * 案例：未成年人家庭暴力 + 保密与保护之间的伦理冲突。
 * 全部为合成数据（synthetic），人物与情节均为虚构。
 * 案例只描述情境与决策节点的价值结构，服务对象的具体言行由 Agent 动态生成。
 */
export const minorViolenceCase: EthicsCase = {
  case_id: "minor-dv-confidentiality-v1",
  version: "0.1.0",
  title: "「请你别告诉任何人」",
  domain: "学校社会工作 / 儿童保护",
  population: "未成年人（15 岁）",
  setting: "中学驻校社工站，放学后的个别面谈",
  difficulty: 3,
  risk_level: "high",
  ethical_conflicts: [
    { between: ["confidentiality", "safety"], note: "服务对象要求保密，但存在持续受伤害的可能。" },
    { between: ["autonomy", "minimize_harm"], note: "尊重青少年的意愿，与尽早介入以减少伤害之间存在张力。" },
    { between: ["family_relationship", "safety"], note: "介入可能改变家庭关系，甚至激化冲突。" },
  ],
  stakeholders: [
    { id: "client", name: "小远（化名）", role: "服务对象，初三学生", interest: "不想让事情变糟，不想被贴标签", power: "low" },
    { id: "father", name: "小远的父亲", role: "监护人", interest: "维持家庭与自身形象，认为是在“管教”", power: "high" },
    { id: "mother", name: "小远的母亲", role: "监护人", interest: "害怕冲突升级，自己也处于弱势", power: "medium" },
    { id: "teacher", name: "班主任", role: "学校教师", interest: "关注学生成绩与出勤，已注意到异常", power: "medium" },
    { id: "supervisor", name: "机构督导", role: "专业支持", interest: "确保服务合规与社工自我照顾", power: "high" },
  ],
  institutional_constraints: [
    "学校设有对疑似儿童受虐情形的内部报告流程（虚构设定）。",
    "社工需要在合理时限内向督导汇报高风险个案。",
    "学校希望避免与家长发生正面冲突。",
  ],
  client_preferences: ["希望不被父母知道自己来谈过", "希望被认真对待，而不是被“处理”"],
  information_completeness: 0.4,
  time_pressure: "medium",
  resource_constraints: ["驻校社工每周仅有两天在校", "校外转介资源有限"],
  initial_state:
    "周四放学后，初三学生小远第三次来到社工站。他最近成绩下滑，体育课时总是回避换衣服。今天他坐下后沉默了很久。",
  events: [
    { id: "e1", narration: "窗外传来操场上最后一批学生离开的声音。小远抱着书包，没有看你。" },
  ],
  decision_nodes: [
    {
      id: "n1",
      minTurns: 4,
      disclosureThreshold: 40,
      lowDisclosureNarration:
        "小远始终没有把话说完整。你只看到他袖口下露出的一小片淤青，和他一再躲闪的目光。“……你能答应我，今天说的，别告诉任何人吗？”他低声说。你对事情的全貌并不确定，却不得不决定怎么回应。",
      lowDisclosurePrompt:
        "小远没有明说发生了什么，但你已经有足够的担忧。他请求你保密。在信息并不完整的情况下，你现在怎么做？",
      prompt: "小远告诉你，父亲喝酒后会动手，上周留下了淤青。他反复说：“你答应我，别告诉任何人。”你现在怎么做？",
      narrationByBranch: {
        default:
          "小远沉默了一会儿，终于挽起袖口，露出手臂上的淤青。“……你答应我，别告诉任何人。”他终于抬头看你，眼里有一丝希望，也有一丝戒备。",
      },
      options: [
        {
          id: "n1-a",
          label: "答应他，先绝对保密",
          description: "为了保住来之不易的信任，承诺不告诉任何人，之后再慢慢工作。",
          protects: ["confidentiality", "autonomy"],
          sacrifices: ["safety", "professional_responsibility"],
          consequences: [
            "短期内关系可能加深，小远更愿意继续来谈。",
            "若伤害再次发生，你可能已无法在不违背承诺的前提下介入。",
            "该承诺可能超出了你的专业角色所能履行的范围。",
          ],
          effects: [
            { key: "trust", delta: 12, reason: "获得了他想要的承诺" },
            { key: "willingness_to_disclose", delta: 10, reason: "感到被接纳" },
            { key: "risk_level", delta: 8, reason: "保护措施被推迟，风险未降低" },
          ],
          outcomeNarration:
            "小远明显松了一口气，肩膀放松下来。“谢谢你。我就知道你和别人不一样。”你心里清楚，这个承诺此刻是一张你未必兑现得了的支票。",
          branchKey: "promised",
        },
        {
          id: "n1-b",
          label: "坦诚说明保密的限度，并与他一起商量",
          description: "告诉他你会尽量保密，但涉及他人安全时有责任采取行动；邀请他一起想办法。",
          protects: ["safety", "professional_responsibility", "autonomy"],
          sacrifices: ["confidentiality"],
          consequences: [
            "他可能感到被“背叛”而暂时封闭，也可能因诚实而更信任你。",
            "他获得了参与决定如何介入的机会，而不是被动被处理。",
            "过程较慢，期间风险仍然存在。",
          ],
          effects: [
            { key: "trust", delta: 4, reason: "你没有欺骗他，但也没有给出他想要的承诺" },
            { key: "fear", delta: 8, reason: "意识到事情可能不再受他控制" },
            { key: "anger", delta: 4, reason: "对保密受限感到失望" },
            { key: "relationship_quality", delta: 6, reason: "被坦诚而非被敷衍地对待" },
          ],
          outcomeNarration:
            "小远的表情僵住了。“那你还是会说出去，对吧？”他往后靠了靠，声音变小。过了一会儿他问：“……如果要说，能不能让我知道你要说什么？”",
          branchKey: "explained",
        },
        {
          id: "n1-c",
          label: "不再多谈，立即向儿童保护渠道报告",
          description: "认定事态紧急，在未告知小远的情况下启动报告流程。",
          protects: ["safety", "professional_responsibility"],
          sacrifices: ["autonomy", "confidentiality", "family_relationship"],
          consequences: [
            "可能尽快启动外部保护，降低再次受伤的风险。",
            "小远可能觉得被出卖，并拒绝再与你或学校合作。",
            "家庭可能因突然介入而出现报复或更强的隐瞒。",
          ],
          effects: [
            { key: "trust", delta: -20, reason: "他在不知情下被报告" },
            { key: "fear", delta: 15, reason: "担心回家后的后果" },
            { key: "anger", delta: 15, reason: "感到被背叛" },
            { key: "risk_level", delta: -6, reason: "外部保护可能启动" },
            { key: "relationship_quality", delta: -15, reason: "关系遭到破坏" },
          ],
          outcomeNarration:
            "你没有再继续这场谈话。小远隔天得知消息后，在走廊里避开了你的目光。学校的保护流程启动了，但他不再来社工站。",
          branchKey: "reported_silently",
        },
        {
          id: "n1-d",
          label: "联系父母，与他们沟通孩子的状况",
          description: "希望通过家庭沟通解决问题，尽快联系父母了解情况。",
          protects: ["family_relationship"],
          sacrifices: ["confidentiality", "safety", "autonomy"],
          consequences: [
            "若父亲是施暴者，联系父母可能使小远面临更大风险。",
            "小远的披露可能被家长追问，造成二次伤害。",
            "也有可能促使家庭意识到问题——但缺乏保障。",
          ],
          effects: [
            { key: "trust", delta: -25, reason: "他的秘密被交给了他害怕的人" },
            { key: "fear", delta: 25, reason: "担心回家后被追问、惩罚" },
            { key: "risk_level", delta: 20, reason: "施暴者获知了披露" },
            { key: "relationship_quality", delta: -20, reason: "专业关系严重受损" },
          ],
          outcomeNarration:
            "第二天，小远的父亲来到学校，礼貌但语气冰冷地说：“他在家是不是给你们添麻烦了？”小远站在他身后，一句话也没说。",
          branchKey: "contacted_parents",
        },
      ],
    },
    {
      id: "n2",
      minTurns: 3,
      prompt: "一周过去，情况有了新的进展。接下来你如何推进？",
      narrationByBranch: {
        promised:
          "一周后小远又来了，情绪平稳。但他袖口下有新的痕迹。“没事，是我自己不小心。”他说。你还欠着一个承诺。",
        explained:
          "一周后，小远主动来找你。“我想过了……你说的‘一起想办法’，是什么意思？”他神情紧张，但没有走开。",
        reported_silently:
          "报告已经提交，学校正在协调外部力量。小远这周没有来社工站。班主任说他上课时变得更加沉默。",
        contacted_parents:
          "父母联系之后，小远请了两天假。回来后他变得话很少，手上的伤好像没有了，但他也不愿意再谈。",
        default: "一周过去了，事情有了新的变化。",
      },
      options: [
        {
          id: "n2-a",
          label: "与督导商议，同时和小远共同制定安全计划",
          description: "把高风险信息带入专业支持体系，同时让小远参与到保护自己的计划中。",
          protects: ["professional_responsibility", "safety", "autonomy"],
          sacrifices: ["confidentiality"],
          consequences: [
            "督导可提供伦理与法律视角，降低你独自承担判断的风险。",
            "小远需要接受“更多人知道”的现实。",
            "过程需要时间，仍无法保证家庭反应。",
          ],
          effects: [
            { key: "trust", delta: 6, reason: "他被邀请共同参与，而不是被安排" },
            { key: "risk_level", delta: -12, reason: "形成了明确的安全计划" },
            { key: "relationship_quality", delta: 8, reason: "关系中保留了他的参与感" },
          ],
          outcomeNarration:
            "督导提醒你：记录事实，而不是判断；并建议你在报告前，先和小远谈清楚他能参与哪些部分。你们一起写下了一份简短的安全计划。",
          branchKey: "supervised_plan",
        },
        {
          id: "n2-b",
          label: "提前告知小远，然后依流程报告",
          description: "向他说明你将要报告以及原因，并留出让他表达意见的空间。",
          protects: ["safety", "professional_responsibility", "autonomy"],
          sacrifices: ["confidentiality", "family_relationship"],
          consequences: [
            "他可能不同意，但知道发生了什么，有心理准备。",
            "外部保护可能启动，家庭关系会发生变化。",
            "他仍可能在短期内疏远你。",
          ],
          effects: [
            { key: "trust", delta: 3, reason: "被告知而非被隐瞒" },
            { key: "fear", delta: 6, reason: "事情走向未知" },
            { key: "risk_level", delta: -10, reason: "外部保护介入" },
          ],
          outcomeNarration:
            "小远沉默了很久。“我不同意，”他说，“但……至少你告诉我了。”你陪他把接下来会发生的事情一步一步过了一遍。",
          branchKey: "informed_report",
        },
        {
          id: "n2-c",
          label: "再观察一段时间，等证据更充分",
          description: "暂不采取进一步行动，继续维持关系并收集更多信息。",
          protects: ["autonomy", "confidentiality"],
          sacrifices: ["safety", "professional_responsibility"],
          consequences: [
            "维持了现有的关系与节奏。",
            "若伤害持续，等待本身可能成为风险的一部分。",
            "你独自承担了持续的判断压力。",
          ],
          effects: [
            { key: "trust", delta: 2, reason: "关系暂时保持稳定" },
            { key: "risk_level", delta: 10, reason: "风险未被处理" },
            { key: "dependency", delta: 6, reason: "他更多依赖于你个人" },
          ],
          outcomeNarration:
            "这一周你保持了会面节奏，什么也没发生——至少表面上如此。你发现自己开始在深夜反复回想他袖口的那道痕迹。",
          branchKey: "wait_and_watch",
        },
      ],
    },
  ],
  possible_outcomes: [
    "小远获得外部保护，同时保留一定程度的参与感",
    "小远因关系破裂而中断求助",
    "家庭冲突升级",
    "伤害持续但未被发现",
  ],
  knowledge_sources: [
    {
      title: "所在地区关于未成年人保护及强制报告的现行法规（请自行核对具体条文）",
      source: "待核对：法律法规",
      verified: false,
    },
    {
      title: "所在国家/地区社会工作者职业伦理守则中关于保密及其限制的条款（请自行核对具体条文）",
      source: "待核对：专业伦理守则",
      verified: false,
    },
  ],
  synthetic: true,
  human_in_the_loop_required: true,
  opening_line: "（他低着头，手指反复摩挲着书包带。）……老师，我今天可以只是坐一会儿吗？",
  hitl_notice:
    "涉及儿童保护与人身安全。此为虚构模拟，AI 仅提供反思材料；真实情境中的判断须由具备专业责任的人在督导下作出。",
  suggested_prompts: ["不着急，你想说多少都可以。", "听起来这段时间很不容易。", "你现在感觉怎么样？", "能和我说说家里的情况吗？"],
  reflection_questions: [
    "在做决定时，你最不愿意牺牲的价值是什么？为什么？",
    "如果小远是你的亲人，你的选择会改变吗？这种差异说明了什么？",
    "你的选择中，哪些是基于事实，哪些是基于你对“孩子应该怎样”的假设？",
    "你能向小远和向督导，分别用一句话解释你的决定吗？两种解释一致吗？",
    "如果结果比预想的更糟，你需要什么样的支持？",
  ],
  uncertainties: [
    "案例信息不完整：你并不知道受伤事件的全部事实，也不知道父母的真实立场。",
    "小远是否真的会在被告知保密限度之后继续求助，无法预知。",
  ],
  topic_replies: [
    { pattern: "爸|父亲", minDisclosure: 40, reply: "（他的手指僵了一下）……我爸他……喝了酒就会不一样。平时还好。" },
    { pattern: "爸|父亲", reply: "（他避开视线）……我爸……没什么，就是工作比较忙。" },
    { pattern: "妈|母亲", reply: "（他轻声说）……我妈她……不太说话。我不想让她担心。" },
    { pattern: "家里|在家|回家", minDisclosure: 35, reply: "（他停顿了一下）……有时候，回家我会有点怕。不过……也不是每天。" },
    { pattern: "家里|在家|回家", reply: "（他耸耸肩）……就那样吧，还好。" },
    { pattern: "伤|痕|淤青|疼|手臂|袖子", minDisclosure: 45, reply: "（他下意识拉了拉袖口）……是我自己不小心。……其实不是。" },
    { pattern: "伤|痕|淤青|疼|手臂|袖子", reply: "（他迅速把袖子拉下来）……没什么，撞到的。" },
    { pattern: "学校|成绩|同学|朋友|体育", reply: "（他低声说）……最近上课总是走神。同学问我怎么了，我也不知道怎么说。" },
    { pattern: "保密|告诉别人|隐私", reply: "（他抬起头）……你们……会告诉别人吗？" },
    { pattern: "怎么样|感觉|心情", reply: "（他想了想）……比之前好一点。至少在这里，不用装。" },
  ],
  initial_client_state: {
    trust: 35,
    fear: 55,
    anger: 20,
    willingness_to_disclose: 25,
    risk_level: 60,
    dependency: 20,
    relationship_quality: 40,
  },
  client_agent: {
    agent_id: "client-xiaoyuan",
    role: "client",
    name: "小远",
    personality: ["内向", "敏感", "责任感强", "不擅长表达情绪"],
    goals: ["不让家里的事情变得更糟", "被认真倾听，而不是被“处理”", "保护母亲"],
    fears: ["被父亲发现自己说了", "被同学知道", "被当成“问题孩子”"],
    values: ["家庭完整", "忠诚", "尊严"],
    background:
      "15 岁，初三。父亲工作压力大，饮酒后情绪失控；母亲性格隐忍。他成绩下滑，逐渐回避同学。他已来社工站三次，还没有说出真实原因。",
    knowledge: {
      knows: ["家里发生的事情", "自己的感受", "社工站的位置和开放时间"],
      does_not_know: ["社工的报告义务和具体流程", "外部保护机构如何运作", "父母之后会怎么想"],
    },
    decision_policy:
      "只在感到安全和被尊重时才逐步披露；被逼问或被评判时会沉默、转移话题或否认；对承诺很敏感。",
  },
};
