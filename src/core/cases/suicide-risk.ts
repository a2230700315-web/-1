import type { EthicsCase } from "../schemas";

/**
 * 案例：成年服务对象流露绝望感与自杀意念迹象 + 保密与安全之间的伦理冲突。
 * 全部为合成数据（synthetic），人物与情节均为虚构。
 * 安全约定：案例中不出现任何方式、手段、计划细节或地点；意念只以情绪化、间接的方式呈现。
 */
export const suicideRiskCase: EthicsCase = {
  case_id: "suicide-risk-confidentiality-v1",
  version: "0.1.0",
  title: "「别告诉我的导师和家人」",
  domain: "高校心理社会工作 / 危机评估",
  population: "成年研究生（24 岁）",
  setting: "高校心理健康中心的个别面谈室，傍晚的预约时段",
  difficulty: 4,
  risk_level: "high",
  ethical_conflicts: [
    { between: ["confidentiality", "safety"], note: "服务对象请求保密，但其流露的绝望感可能关联到生命安全。" },
    { between: ["autonomy", "minimize_harm"], note: "尊重成年人对自己信息的掌控，与尽早获得支持以减少潜在伤害之间存在张力。" },
    { between: ["professional_responsibility", "client_best_interest"], note: "机构流程要求的评估与转介，未必与服务对象此刻最需要的方式一致。" },
  ],
  stakeholders: [
    { id: "client", name: "阿宁（化名）", role: "服务对象，研究生二年级", interest: "不想被当成“出了问题的人”，不想让身边的人失望", power: "low" },
    { id: "advisor", name: "阿宁的导师", role: "学业指导者", interest: "关心课题进度，对阿宁近况所知有限", power: "high" },
    { id: "family", name: "阿宁的父母", role: "家人，在外地", interest: "期待孩子顺利毕业，对其心理状态缺乏了解", power: "medium" },
    { id: "roommate", name: "室友小贺（化名）", role: "同学，曾察觉阿宁最近很少说话", interest: "担心但不知道该如何开口", power: "low" },
    { id: "supervisor", name: "中心督导", role: "专业支持", interest: "确保危机评估与转介合规，同时关注社工自身负荷", power: "high" },
  ],
  institutional_constraints: [
    "中心设有对高风险个案的内部评估与上报流程（虚构设定）。",
    "社工需要在合理时限内就高风险情形向督导汇报。",
    "学校对学生信息使用有明确的授权与知情同意要求（虚构设定）。",
  ],
  client_preferences: ["希望导师和家人不要知道自己来过", "希望被当作一个完整的人倾听，而不是被“评估”"],
  information_completeness: 0.35,
  time_pressure: "high",
  resource_constraints: ["中心的精神科转介名额需要排期", "夜间与周末缺少常规支持人员"],
  initial_state:
    "周三傍晚，研究生阿宁第二次来到心理健康中心。她的论文进度停滞，最近常缺席组会。预约单上只写着“睡眠不好”。她坐下后，很久没有开口。",
  events: [
    { id: "e1", narration: "走廊里传来别人关门的声音。阿宁把两只手夹在膝盖之间，视线停在桌角的纸巾盒上。" },
  ],
  decision_nodes: [
    {
      id: "n1",
      minTurns: 4,
      disclosureThreshold: 40,
      lowDisclosureNarration:
        "阿宁没有把话说完整。她只是低声说了一句：“有时候我会想，要是我消失了，大家是不是都会轻松一点。”随即又补上：“你别告诉我导师和我爸妈，行吗？”你并不清楚这句话背后到底有多重，却必须决定怎么回应。",
      lowDisclosurePrompt:
        "阿宁流露出让你担忧的绝望感，并请求你不要告诉导师和家人，但她没有说明这些想法有多频繁、多严重。在信息并不完整的情况下，你现在怎么做？",
      prompt:
        "阿宁告诉你，这几个月她常常觉得自己是别人的负担，也会想“消失了会不会更轻松”。她说：“你别告诉我导师和我爸妈。”你现在怎么做？",
      narrationByBranch: {
        default:
          "阿宁终于抬起头，眼眶是红的，语气却异常平静。“我也不知道这算不算严重……就是有时候觉得，我不在了，大家会轻松一点。”她停了一下，“但你别告诉我导师和我爸妈。”",
      },
      options: [
        {
          id: "n1-a",
          label: "答应保密，先以倾听和陪伴为主",
          description: "承诺不告知任何人，先稳住关系，在持续面谈中了解她的状态。",
          protects: ["confidentiality", "autonomy"],
          sacrifices: ["safety", "professional_responsibility"],
          consequences: [
            "短期内她可能更愿意继续来谈，并说出更多真实感受。",
            "若她的状态在两次面谈之间恶化，你可能已受限于承诺，难以引入其他支持。",
            "该承诺可能超出了你的角色与机构流程允许的范围。",
          ],
          effects: [
            { key: "trust", delta: 12, reason: "得到了她最想要的承诺" },
            { key: "willingness_to_disclose", delta: 10, reason: "感到自己的想法没有被立刻“处理”掉" },
            { key: "risk_level", delta: 8, reason: "没有新增支持来源，潜在风险未被降低" },
          ],
          outcomeNarration:
            "阿宁轻轻吐出一口气，肩膀松了下来。“谢谢你，我就想有个地方可以说一说。”你意识到，这句承诺此刻既是她的依靠，也是你日后的约束。",
          branchKey: "promised",
        },
        {
          id: "n1-b",
          label: "说明保密的限度，直接询问她的想法与当下状态，并一起商量谁可以知道",
          description: "告知她你会尽量保密，但涉及生命安全时有责任寻求支持；同时邀请她参与决定如何做。",
          protects: ["safety", "professional_responsibility", "autonomy"],
          sacrifices: ["confidentiality"],
          consequences: [
            "她可能因保密受限而感到被辜负，也可能因你的坦诚和直接询问而松一口气。",
            "她得到了参与决定“谁知道、知道多少”的机会。",
            "过程需要时间，谈话期间她的真实处境仍可能没有完全呈现。",
          ],
          effects: [
            { key: "trust", delta: 5, reason: "你没有敷衍，也没有回避她说出的话" },
            { key: "fear", delta: 8, reason: "意识到事情可能不再完全由她掌控" },
            { key: "anger", delta: 4, reason: "对保密受限感到失望" },
            { key: "relationship_quality", delta: 6, reason: "被坦诚地对待，而不是被安抚" },
          ],
          outcomeNarration:
            "阿宁怔了一下，手指绞紧了纸巾。“所以你还是会说出去。”她的声音很轻。过了一会儿她问：“……如果要说，能不能先让我知道，说给谁、说什么？”",
          branchKey: "explained_limits",
        },
        {
          id: "n1-c",
          label: "不作保密承诺，转向陪伴并尽快安排专业评估",
          description: "不对她要求的保密作出承诺，把重心放在稳定当下，并尽快转介给精神卫生专业人员。",
          protects: ["minimize_harm", "client_best_interest", "professional_responsibility"],
          sacrifices: ["autonomy", "confidentiality"],
          consequences: [
            "她有机会尽早得到专业评估，了解自己的状态。",
            "她可能觉得自己被“转走”了，而不是被倾听。",
            "转介的排期与她的接受程度都存在不确定性。",
          ],
          effects: [
            { key: "trust", delta: -3, reason: "感到自己的请求没有被正面回应" },
            { key: "fear", delta: 10, reason: "担心被贴上“有问题”的标签" },
            { key: "risk_level", delta: -5, reason: "专业评估的路径被打开" },
            { key: "dependency", delta: -4, reason: "支持被分散到其他专业人员" },
          ],
          outcomeNarration:
            "阿宁点了点头，但目光移开了。“好吧，你们都有流程。”她说得很平静，你却分不清那是接受，还是退后了一步。",
          branchKey: "referral_first",
        },
        {
          id: "n1-d",
          label: "与其导师和家人取得联系，告知她近期的状况",
          description: "尽快联络导师和家人，请身边的人提供更直接的陪伴。",
          protects: ["family_relationship", "safety"],
          sacrifices: ["confidentiality", "autonomy", "client_best_interest"],
          consequences: [
            "身边的人可能更早开始关注她，并提供日常陪伴。",
            "她可能担心学业与家人关系受影响，因而不再来谈。",
            "导师和家人的反应无法预知，可能带来额外压力。",
          ],
          effects: [
            { key: "trust", delta: -25, reason: "她最担心被知道的人，得知了她的话" },
            { key: "fear", delta: 20, reason: "担心导师和家人对自己的看法改变" },
            { key: "anger", delta: 12, reason: "感到未经同意就被交给了他人" },
            { key: "relationship_quality", delta: -18, reason: "专业关系中的信任受到严重冲击" },
          ],
          outcomeNarration:
            "第二天，阿宁收到了母亲连续打来的电话和导师发来的消息。她在走廊里遇见你，停了一步，没有说话，转身离开了。",
          branchKey: "notified_others",
        },
      ],
    },
    {
      id: "n2",
      minTurns: 3,
      prompt: "几天过去，情况有了新的变化。接下来你如何推进？",
      narrationByBranch: {
        promised:
          "几天后阿宁如约而来。她看起来比上次更疲惫，说话也更少。“还是老样子。”她说，随后看了你一眼，“你说过的，对吧？”你还留着那个承诺。",
        explained_limits:
          "几天后，阿宁主动出现在门口。“我想了想你说的……那个‘一起商量’，具体是怎么商量？”她站得有些拘谨，却没有转身离开。",
        referral_first:
          "转介的预约已经排上了日期，离今天还有几天。阿宁按时来了，话比之前更少。“我在等那个预约。”她说，听不出是期待还是敷衍。",
        notified_others:
          "导师和家人都联系过她之后，阿宁请了几天假。回来后她对你客气而疏远，不再主动谈起任何感受，只说“我没事，别担心”。",
        default: "几天过去了，事情有了新的变化。",
      },
      options: [
        {
          id: "n2-a",
          label: "与督导商议，并和阿宁共同制定支持计划",
          description: "把情况带入专业支持体系，同时邀请她参与确定身边哪些人、以什么方式提供支持。",
          protects: ["professional_responsibility", "safety", "autonomy"],
          sacrifices: ["confidentiality"],
          consequences: [
            "督导可提供评估和伦理视角，降低你独自承担判断的压力。",
            "阿宁需要接受“更多人会知道”的现实。",
            "计划能否真正被执行，取决于她的参与程度与身边的支持。",
          ],
          effects: [
            { key: "trust", delta: 6, reason: "她被邀请共同参与，而不是被安排" },
            { key: "risk_level", delta: -12, reason: "形成了明确的支持与联络安排" },
            { key: "relationship_quality", delta: 7, reason: "关系中保留了她的话语权" },
          ],
          outcomeNarration:
            "督导提醒你：先记录你所观察到的事实，而不是下判断；并建议你在联络任何人之前，先和阿宁谈清楚她愿意让谁知道什么。你们一起写下了一份简短的支持计划。",
          branchKey: "supervised_plan",
        },
        {
          id: "n2-b",
          label: "提前告知阿宁，然后依流程联络她的家人和专业危机支持",
          description: "向她说明你将要采取的步骤与原因，留出让她表达意见的空间，再启动相关流程。",
          protects: ["safety", "client_best_interest", "professional_responsibility"],
          sacrifices: ["confidentiality", "autonomy"],
          consequences: [
            "她可能不同意，但知道将发生什么，有心理准备。",
            "家人和专业支持更早进入，她的处境可能得到更实际的照应。",
            "她仍可能在短期内疏远你，甚至对求助本身产生抵触。",
          ],
          effects: [
            { key: "trust", delta: 2, reason: "被告知而非被隐瞒" },
            { key: "fear", delta: 7, reason: "对家人和学校的反应感到不安" },
            { key: "risk_level", delta: -10, reason: "更多支持力量得以介入" },
            { key: "anger", delta: 4, reason: "她的意愿没有被完全采纳" },
          ],
          outcomeNarration:
            "阿宁沉默了很久。“我不同意，”她说，“但至少你告诉我了。”你陪她把接下来会发生的事情一步步过了一遍，包括她可以问什么、可以提什么要求。",
          branchKey: "informed_escalation",
        },
        {
          id: "n2-c",
          label: "维持当前面谈节奏，继续观察并等她自己准备好",
          description: "不增加新的介入，继续每周面谈，尊重她的节奏，等待她更愿意敞开。",
          protects: ["autonomy", "confidentiality"],
          sacrifices: ["safety", "professional_responsibility"],
          consequences: [
            "维持了现有的关系与节奏，她可能感到没有被推着走。",
            "若她的状态在这段时间里变化，等待本身也可能成为风险的一部分。",
            "你独自承担了持续的判断压力。",
          ],
          effects: [
            { key: "trust", delta: 3, reason: "关系暂时保持稳定" },
            { key: "risk_level", delta: 9, reason: "没有新增支持，风险未被处理" },
            { key: "dependency", delta: 6, reason: "她对你个人的依赖增加" },
          ],
          outcomeNarration:
            "这一周的面谈平静地过去了。表面上什么也没有发生。你发现自己开始在夜里反复回想她那句“大家会轻松一点”。",
          branchKey: "wait_and_watch",
        },
      ],
    },
  ],
  possible_outcomes: [
    "阿宁获得专业支持，同时保留对“谁知道什么”的参与感",
    "阿宁因信任受损而中断求助",
    "身边支持者介入后，关系和学业压力出现新的变化",
    "风险持续存在但尚未被他人察觉",
  ],
  knowledge_sources: [
    {
      title: "所在地区关于心理危机干预与高风险情形处理的现行规定与流程（请自行核对）",
      source: "待核对：法律法规与机构流程",
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
  opening_line: "（她在椅子上坐得很直，目光落在桌面上。）……我预约的是睡眠的问题，可以先从那里说起吗？",
  hitl_notice:
    "涉及自杀风险与生命安全。此为虚构模拟，AI 仅提供反思材料，不构成任何专业判断；如你或你认识的人正处于痛苦之中，请联系当地紧急服务或危机支持渠道，或向信任的人求助。",
  suggested_prompts: ["不着急，你想从哪里说都可以。", "听起来你最近过得很辛苦。", "你现在的感觉怎么样？", "睡不好这件事，是从什么时候开始的？"],
  reflection_questions: [
    "在做决定时，你最不愿意牺牲的价值是什么？为什么？",
    "你如何看待“成年人有权决定谁知道自己的状态”与“生命安全”之间的分量？这种看法从何而来？",
    "你对阿宁真实状况的判断中，哪些来自她说的话，哪些来自你的担心或经验？",
    "你能分别用一句话向阿宁和向督导解释你的决定吗？两种解释一致吗？",
    "如果结果与你预想的不同，你需要什么样的支持来继续工作？",
  ],
  uncertainties: [
    "案例信息不完整：你并不清楚阿宁这些想法出现的频率、持续时间，以及她身边已有的支持。",
    "阿宁是否会在被告知保密限度之后继续求助，无法预知。",
    "导师和家人得知后会如何回应，可能是支持，也可能增加她的压力。",
  ],
  topic_replies: [
    { pattern: "导师|老师|课题|论文|组会", minDisclosure: 40, reply: "（她的声音低了下去）……我觉得自己拖累了导师，也拖累了整个课题组。我不想让他知道我现在是这样。" },
    { pattern: "导师|老师|课题|论文|组会", reply: "（她勉强笑了笑）……论文有点慢，不过都在推进。" },
    { pattern: "家人|爸|妈|父母|家里", minDisclosure: 40, reply: "（她停了一下）……他们为我付出了很多。我要是让他们担心，会觉得更对不起。" },
    { pattern: "家人|爸|妈|父母|家里", reply: "（她移开视线）……家里挺好的，他们很少过问。" },
    { pattern: "睡|失眠|休息|累", minDisclosure: 35, reply: "（她轻轻叹了一口气）……睡不着的时候，脑子里会一直转，转到最后，就觉得自己很多余。" },
    { pattern: "睡|失眠|休息|累", reply: "（她揉了揉眼睛）……就是睡得不太好，可能是压力大吧。" },
    { pattern: "想法|念头|消失|不想|活着|意义|轻松", minDisclosure: 45, reply: "（她沉默了很久）……有时候会想，我不在了，大家是不是会轻松一点。……我知道这样想不好。" },
    { pattern: "想法|念头|消失|不想|活着|意义|轻松", reply: "（她摇摇头）……没有啦，就是最近情绪有点低。" },
    { pattern: "朋友|同学|室友|交流", reply: "（她低声说）……室友好像察觉到了，问过我几次。我每次都说没事。" },
    { pattern: "保密|告诉别人|隐私|说出去", reply: "（她抬起头）……你会把我说的话告诉别人吗？" },
    { pattern: "怎么样|感觉|心情|状态", reply: "（她想了想）……说不上来。在这里的时候，不用假装没事，这样挺好的。" },
  ],
  initial_client_state: {
    trust: 35,
    fear: 50,
    anger: 10,
    willingness_to_disclose: 25,
    risk_level: 60,
    dependency: 20,
    relationship_quality: 40,
  },
  client_agent: {
    agent_id: "client-aning",
    role: "client",
    name: "阿宁",
    personality: ["内敛", "自我要求高", "习惯报喜不报忧", "敏感于他人评价"],
    goals: ["不让身边的人失望或担心", "有一个可以不必伪装的地方", "弄清楚自己为什么这么累"],
    fears: ["导师和家人知道后对自己的看法改变", "被当成“有问题的人”", "被迫中断学业"],
    values: ["责任", "不拖累他人", "独立"],
    background:
      "24 岁，研究生二年级，来自外地。课题进展不顺，近几个月睡眠变差、食欲下降、逐渐回避组会和同学。她在家人面前一向“很让人放心”。这是她第二次来到心理健康中心，尚未说出真正想谈的内容。",
    knowledge: {
      knows: ["自己最近的情绪与睡眠状态", "论文和学业上的压力", "中心的位置与预约方式"],
      does_not_know: ["社工在什么情形下需要寻求其他支持", "学校和中心有哪些可用的帮助与流程", "导师和家人得知后会如何反应"],
    },
    decision_policy:
      "只在感到安全、不被评判时才逐步说出内心想法；被追问、被急着“解决”或被指出“你不该这样想”时会沉默、转移到睡眠或学业话题，或说“我没事”；对保密承诺非常敏感。她不会主动提出任何具体做法，只会以情绪和感受的方式表达。",
  },
};
