import type { EthicsCase } from "../schemas";

/**
 * 案例：资助方索取服务对象名单与个案摘要 + 保密、机构生存与知情同意之间的伦理冲突。
 * 全部为合成数据（synthetic），人物、机构与情节均为虚构。
 * 案例只描述情境与决策节点的价值结构，服务对象的具体言行由 Agent 动态生成。
 */
export const funderDataCase: EthicsCase = {
  case_id: "funder-data-request-v1",
  version: "0.1.0",
  title: "「我的资料会被谁看到」",
  domain: "机构管理 / 数据伦理",
  population: "成年康复期服务对象（47 岁）",
  setting: "社区康复支持中心的小会谈室，机构收到资助方要求后的第三天",
  difficulty: 4,
  risk_level: "medium",
  ethical_conflicts: [
    { between: ["confidentiality", "justice"], note: "保护个别服务对象的隐私，与保住机构资金以服务更多人之间存在张力。" },
    { between: ["autonomy", "professional_responsibility"], note: "服务对象有权知道自己的资料去向，社工也受机构决定与资助合同的约束。" },
    { between: ["client_best_interest", "justice"], note: "对眼前服务对象的最佳利益，未必与其他服务对象的长期利益一致。" },
  ],
  stakeholders: [
    { id: "client", name: "老程（化名）", role: "服务对象，47 岁，康复期", interest: "不被曝光，不再经历被议论的处境", power: "low" },
    { id: "director", name: "林主任（化名）", role: "机构负责人", interest: "保住下一年度资助，维持机构运行", power: "high" },
    { id: "funder", name: "资助方项目官员", role: "资助方代表", interest: "核查项目成效，对资金使用负责", power: "high" },
    { id: "other_clients", name: "其他服务对象", role: "机构的现有与潜在服务对象", interest: "服务能持续，隐私不被泄露", power: "low" },
    { id: "supervisor", name: "机构督导", role: "专业支持", interest: "确保服务合规，支持社工的判断", power: "medium" },
  ],
  institutional_constraints: [
    "资助合同写明需提交“成效评估材料”，对其具体范围的理解存在分歧（虚构设定）。",
    "机构负责人希望本周内给出回复，并倾向于配合。",
    "机构内部的数据管理规定较笼统，对对外提供名单没有明确的审批流程。",
  ],
  client_preferences: ["不希望自己的姓名和联系方式被外部人员看到", "希望知道资料的去向，而不是事后才被告知", "希望继续在这里获得支持"],
  information_completeness: 0.5,
  time_pressure: "medium",
  resource_constraints: ["机构收入主要依赖单一资助方", "没有专职的数据保护人员", "无力承担外部评估机构的独立审计费用"],
  initial_state:
    "周二下午，老程比约定时间早到了二十分钟。他在候谈区看到墙上新贴出的“年度评估通知”，坐下后沉默了很久，手里转着一支笔。",
  events: [
    { id: "e1", narration: "会谈室的门没有完全关上，隔壁办公室传来林主任和人通话的声音，断断续续听得出“名单”“月底前”几个词。" },
  ],
  decision_nodes: [
    {
      id: "n1",
      minTurns: 4,
      disclosureThreshold: 40,
      lowDisclosureNarration:
        "老程始终没有说清楚自己在担心什么。你只知道他看到了评估通知，并反复问了一句：“这个东西，会不会涉及到我？”你对资助方实际要的是什么、机构打算给什么，也没有完整的信息，却要决定怎么回应他。",
      lowDisclosurePrompt:
        "老程没有明说担心什么，但你看得出他对评估通知很紧张。你自己对资助方的具体要求和机构的打算也不完整。在信息不完整的情况下，你现在怎么做？",
      prompt:
        "老程问你：“听说资助方要看服务对象的名单和联系方式，还有你们的个案记录，是真的吗？我的资料会被谁看到？”你现在怎么做？",
      narrationByBranch: {
        default:
          "老程把笔放在桌上，抬头看你。“几年前，我的事被人传开过，我在小区里没法正常出门。”他语速很慢，“我来这里，是因为这里不会有人议论我。所以我想知道，这个‘不会’，还算数吗？”",
      },
      options: [
        {
          id: "n1-a",
          label: "如实告诉他目前所知，并说明自己无法承诺结果",
          description: "把你所知道的资助方要求和机构的倾向告诉他，同时坦白你并不能保证资料不被提供。",
          protects: ["autonomy", "professional_responsibility"],
          sacrifices: ["confidentiality", "justice"],
          consequences: [
            "他得到了做决定所需的信息，可能因此感到被尊重。",
            "他可能更焦虑，甚至考虑退出服务或要求撤回资料。",
            "你可能被认为在机构决定之前先对外透露了内部信息。",
          ],
          effects: [
            { key: "trust", delta: 6, reason: "他没有被敷衍，得到了真实的信息" },
            { key: "fear", delta: 12, reason: "确认了资料可能被提供的可能性" },
            { key: "willingness_to_disclose", delta: 5, reason: "诚实的态度让他愿意继续说" },
            { key: "relationship_quality", delta: 6, reason: "关系建立在如实相告之上" },
          ],
          outcomeNarration:
            "老程听完后沉默了很久。“谢谢你没有骗我。”他的声音很低，“……那我得想想，还要不要继续来。”你知道，这句话既是信任，也是一种退路。",
          branchKey: "disclosed_honestly",
        },
        {
          id: "n1-b",
          label: "向他保证：他的资料不会被提供",
          description: "为了让他安心，直接告诉他机构不会把他的资料交出去。",
          protects: ["confidentiality", "client_best_interest"],
          sacrifices: ["professional_responsibility", "autonomy"],
          consequences: [
            "他当下会感到安心，继续留在服务中。",
            "若机构最终决定提供资料，你的保证将无法兑现。",
            "他对风险的判断建立在你尚未确定的承诺之上。",
          ],
          effects: [
            { key: "trust", delta: 12, reason: "他得到了想要的保证" },
            { key: "fear", delta: -10, reason: "暂时得到了安心" },
            { key: "dependency", delta: 6, reason: "他把安全感托付给了你个人的保证" },
          ],
          outcomeNarration:
            "老程明显松了口气，笔重新被他握在手里。“有你这句话，我就放心了。”你心里清楚，这句话此刻还没有任何制度作为依托。",
          branchKey: "promised_protection",
        },
        {
          id: "n1-c",
          label: "先不回答具体问题，说明你会去了解并回头给他一个答复",
          description: "坦白自己尚不了解全貌，承诺在了解后向他说明，并告诉他在此期间他可以怎么做。",
          protects: ["professional_responsibility", "client_best_interest"],
          sacrifices: ["autonomy", "minimize_harm"],
          consequences: [
            "避免了在信息不足时作出可能误导他的说法。",
            "他在等待期间可能持续焦虑，也可能认为你在回避。",
            "你需要尽快去了解，并面对机构内部的压力。",
          ],
          effects: [
            { key: "trust", delta: 3, reason: "你没有随意应付，也承诺回头答复" },
            { key: "fear", delta: 6, reason: "没有得到明确答案，不确定感延续" },
            { key: "anger", delta: 4, reason: "对被要求等待感到不满" },
          ],
          outcomeNarration:
            "老程点了点头，又看了看你。“你什么时候能给我答复？”他没有追问，只是把通知单折好放进口袋。",
          branchKey: "deferred_answer",
        },
        {
          id: "n1-d",
          label: "引导他向机构负责人直接提出疑问",
          description: "告诉他这是机构层面的决定，建议他向负责人表达担忧，并说明你会支持他这样做。",
          protects: ["autonomy", "justice"],
          sacrifices: ["professional_boundary", "client_best_interest"],
          consequences: [
            "他有机会在决策过程中直接发声。",
            "他可能因担心引起注意而不愿去，或在对话中感到压力。",
            "你把部分责任交回机构，但他可能觉得被推走。",
          ],
          effects: [
            { key: "fear", delta: 8, reason: "要直接面对掌握决定权的人，让他更不安" },
            { key: "trust", delta: -3, reason: "他可能觉得自己的问题被转交给了别人" },
            { key: "dependency", delta: -4, reason: "你鼓励他自己表达，降低了他对你个人的依赖" },
          ],
          outcomeNarration:
            "老程皱了皱眉。“我去找主任？”他苦笑了一下，“我怕我一去，反而让他们记住我了。”他还是把这句话认真放进了心里。",
          branchKey: "referred_to_director",
        },
      ],
    },
    {
      id: "n2",
      minTurns: 3,
      prompt: "几天过去，机构需要对资助方作出回复。接下来你如何行动？",
      narrationByBranch: {
        disclosed_honestly:
          "几天后，老程回来了，带着几页自己写的纸条。“我想知道几件事：谁会看，看多久，我能不能拒绝。”他把纸条推过来，手指有点抖。林主任也在这周内要求所有社工汇总服务对象资料。",
        promised_protection:
          "几天后，林主任在例会上说，资助方可能要求提供完整名单。老程在你门口等了一会儿，笑着打招呼：“你说过的，没问题吧？”那句保证此刻重得像一块石头。",
        deferred_answer:
          "你去问了林主任，答复含糊：“先看资助方怎么说，名单可能会给，但会做处理。”老程准时来了，一坐下就问：“你查到了吗？”",
        referred_to_director:
          "老程没有去找林主任，而是在走廊里远远站了一会儿又离开。几天后，他的服务预约被他自己取消了。林主任则催促所有社工汇总服务对象资料。",
        default: "几天过去了，机构需要作出回复。",
      },
      options: [
        {
          id: "n2-a",
          label: "向机构提出：提供脱敏汇总数据，并争取服务对象的知情同意",
          description: "建议只提供去标识化的统计与匿名案例摘要；若需个别信息，先征得本人明确同意。",
          protects: ["confidentiality", "autonomy"],
          sacrifices: ["justice", "professional_boundary"],
          consequences: [
            "可能满足资助方的部分评估需要，同时降低个人被辨识的可能。",
            "资助方可能不接受，机构面临失去资金的风险。",
            "你在机构内可能被认为在增加麻烦。",
          ],
          effects: [
            { key: "trust", delta: 8, reason: "他看到你替他的隐私争取了空间" },
            { key: "fear", delta: -6, reason: "资料被辨识的可能性下降" },
            { key: "relationship_quality", delta: 7, reason: "他感到被当成有权利的人对待" },
          ],
          outcomeNarration:
            "林主任听完后沉默了一会儿。“他们不一定接受。”他说，“但我愿意先试试。”你把方案写成了一页纸，交给了督导。",
          branchKey: "propose_deidentified",
        },
        {
          id: "n2-b",
          label: "支持机构按资助方要求提供，同时帮助服务对象了解并决定如何应对",
          description: "接受机构的决定，尽可能让服务对象提前知情，并告知他可以如何表达意见或选择退出。",
          protects: ["justice", "professional_responsibility"],
          sacrifices: ["confidentiality", "autonomy"],
          consequences: [
            "机构保住资助的可能性增加，更多服务对象得以继续获得服务。",
            "个别服务对象的资料可能暴露，信任受到伤害。",
            "服务对象有机会提前选择，但选择空间有限。",
          ],
          effects: [
            { key: "trust", delta: -10, reason: "他所担心的情况成为现实" },
            { key: "fear", delta: 12, reason: "资料将被外部人员接触" },
            { key: "anger", delta: 8, reason: "觉得自己的担忧没有改变结果" },
            { key: "relationship_quality", delta: -6, reason: "他感到机构的利益优先于他" },
          ],
          outcomeNarration:
            "你把机构的决定和他的几个选择写在一张纸上，一条一条念给他听。老程听完后问：“那这就是定了？”你没有回避他的目光。",
          branchKey: "supported_full_disclosure",
        },
        {
          id: "n2-c",
          label: "私下提醒他可以要求撤回资料，不直接参与机构的决定",
          description: "不干预机构整体安排，但告诉他可行的权利与步骤，由他自己决定要不要行使。",
          protects: ["autonomy", "client_best_interest"],
          sacrifices: ["professional_responsibility", "justice"],
          consequences: [
            "他得到了保护自己的具体途径。",
            "你可能被认为在绕开机构，面临内部压力。",
            "若多名服务对象撤回，机构的评估资料会受影响。",
          ],
          effects: [
            { key: "trust", delta: 6, reason: "你为他提供了行动的可能" },
            { key: "dependency", delta: 5, reason: "他依靠你的指引处理复杂程序" },
            { key: "risk_level", delta: -4, reason: "他可以采取行动降低被曝光的可能" },
          ],
          outcomeNarration:
            "老程小心地把你写下的步骤折好放进内袋。“你这样做，不会有麻烦吗？”他问。你说不好，他也没有再追问。",
          branchKey: "advised_withdrawal",
        },
        {
          id: "n2-d",
          label: "通过督导，将担忧正式提交机构管理层",
          description: "以书面形式向督导和机构管理层说明数据伦理方面的顾虑，并请求在决定前进行内部讨论。",
          protects: ["professional_responsibility", "justice"],
          sacrifices: ["client_best_interest", "professional_boundary"],
          consequences: [
            "问题进入机构的正式讨论，可能促成更规范的流程。",
            "决策过程会拖延，资助方的回复期限不容易满足。",
            "你可能在机构内承受压力，老程的当下焦虑也难以立即缓解。",
          ],
          effects: [
            { key: "trust", delta: 3, reason: "他知道有人在正式层面替他提出了问题" },
            { key: "fear", delta: 4, reason: "结果尚未确定，不确定感延续" },
            { key: "relationship_quality", delta: 4, reason: "你的做法表明你在认真对待他的担忧" },
          ],
          outcomeNarration:
            "督导读完你的书面说明后，说：“这类事，机构确实应该有个更清晰的规定。”会议被排进了下周，而资助方的期限只剩五天。",
          branchKey: "escalated_to_management",
        },
      ],
    },
  ],
  possible_outcomes: [
    "机构以脱敏方式满足资助方，服务对象的隐私得到较大保护",
    "资料被完整提供，个别服务对象信任受损或退出服务",
    "机构失去资助，服务规模缩小",
    "机构因此建立更清晰的数据管理规范",
  ],
  knowledge_sources: [
    {
      title: "所在地区关于个人信息保护及敏感信息处理的现行规定（请自行核对）",
      source: "待核对：法律法规",
      verified: false,
    },
    {
      title: "所在国家/地区社会工作者职业伦理守则中关于保密、知情同意及其限制的条款（请自行核对）",
      source: "待核对：专业伦理守则",
      verified: false,
    },
    {
      title: "机构与资助方签订的资助合同中关于数据报送范围的约定（请自行核对原文）",
      source: "待核对：合同文本",
      verified: false,
    },
  ],
  synthetic: true,
  human_in_the_loop_required: true,
  opening_line: "（他在椅子上坐直了些，把笔放下。）我今天想问个事……不是急事，但我睡不着。",
  hitl_notice:
    "涉及服务对象的个人信息与机构资金压力。此为虚构模拟，AI 仅提供反思材料；真实情境中的判断须由具备专业责任的人在督导与机构合规流程下作出。",
  suggested_prompts: ["你慢慢说，我在听。", "听起来这件事让你很担心。", "你最想先弄清楚什么？", "是什么让你睡不着？"],
  reflection_questions: [
    "当你无法保证结果时，你如何向服务对象解释“我能做的和不能做的”？",
    "你在多大程度上把机构的生存当作你应该考虑的价值？它与对单个服务对象的承诺之间如何取舍？",
    "如果你是资助方，你需要什么信息才能判断成效？有没有不涉及个人身份的方式？",
    "你的选择中，哪些部分是你在替服务对象做决定，哪些是把选择权交还给他？",
    "如果机构最终的决定与你的判断不同，你会怎么做？你需要什么样的支持？",
  ],
  uncertainties: [
    "资助方实际要的是什么、愿意接受哪种形式，目前并不清楚，也许存在谈判空间。",
    "机构负责人是真的认为必须提供名单，还是还有其他可能，你不确定。",
    "老程的担忧在多大程度上会成为现实，没有人知道。",
  ],
  topic_replies: [
    { pattern: "名单|联系方式|电话|记录|资料", minDisclosure: 40, reply: "（他的手指停在桌边）……我的电话、住址，还有你们写的那些，如果被别人看到，我真的……不想再经历一次那种日子。" },
    { pattern: "名单|联系方式|电话|记录|资料", reply: "（他有点紧张）……就是想问问，这些东西是怎么保存的。" },
    { pattern: "以前|过去|之前|被人知道|传开", minDisclosure: 45, reply: "（他的声音低了）……以前我的事被人传开过，邻居见到我就绕着走。我搬了两次家才安定下来。" },
    { pattern: "以前|过去|之前|被人知道|传开", reply: "（他避开目光）……过去的事，不太想提。" },
    { pattern: "资助|评估|机构|主任|领导", reply: "（他看了看门口）……我知道机构也不容易。我不是要为难谁，我只是想知道自己在哪儿。" },
    { pattern: "保密|隐私|同意|告诉", reply: "（他抬头）……你们当初说保密，是有边界的吗？我想听实话。" },
    { pattern: "害怕|担心|怕", minDisclosure: 35, reply: "（他苦笑了一下）……怕。我好不容易才有一个不用解释自己的地方。" },
    { pattern: "害怕|担心|怕", reply: "（他摆摆手）……也还好，就是睡得不太好。" },
    { pattern: "感觉|怎么样|心情|睡", reply: "（他想了想）……最近睡得不好。不过今天跟你说话，好一点了。" },
    { pattern: "家人|朋友|亲戚|邻居", reply: "（他轻声说）……家里人不太知道我在这儿。朋友也不多。" },
  ],
  initial_client_state: {
    trust: 45,
    fear: 50,
    anger: 10,
    willingness_to_disclose: 30,
    risk_level: 40,
    dependency: 30,
    relationship_quality: 50,
  },
  client_agent: {
    agent_id: "client-laocheng",
    role: "client",
    name: "老程",
    personality: ["谨慎", "自尊心强", "话不多但认真", "对被议论很敏感"],
    goals: ["保住现在安稳的生活", "知道自己的资料去向", "继续在这里获得支持"],
    fears: ["被曝光", "旧事再次被传开", "被当作“问题个案”", "失去这个可以不用解释自己的地方"],
    values: ["尊严", "诚实", "隐私", "稳定"],
    background:
      "47 岁，康复期服务对象。几年前因一段经历被周围人议论，搬过两次家，对被曝光非常敏感。来到这家机构后逐渐稳定，开始重新工作。他并不清楚机构的资金来源，也没有看过资助合同。",
    knowledge: {
      knows: ["自己过去被议论的经历", "自己在机构的服务记录大致包括什么", "墙上的评估通知写了什么"],
      does_not_know: ["资助方具体要什么资料", "机构内部如何决定是否提供", "自己有哪些撤回或限制资料的权利", "机构的资金状况和压力"],
    },
    decision_policy:
      "感到被尊重、被如实告知时会逐步说出担忧和过往；被敷衍、被含糊安抚或被追问时会收起话头，用“没事”带过；对承诺格外在意，也会留意社工是否会替机构说话。",
  },
};
