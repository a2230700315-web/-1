import type { EthicsCase } from "../schemas";

/**
 * 案例：精神康复期服务对象自行减药 + 自主、保密与家属期待之间的伦理冲突。
 * 全部为合成数据（synthetic），人物与情节均为虚构。
 * 案例只描述情境与决策节点的价值结构，服务对象的具体言行由 Agent 动态生成。
 */
export const psychMedicationCase: EthicsCase = {
  case_id: "psych-medication-v1",
  version: "0.1.0",
  title: "「这次，让我自己决定」",
  domain: "社区精神康复 / 精神健康社会工作",
  population: "康复期成年人（29 岁）",
  setting: "社区精神康复服务中心，个别面谈室",
  difficulty: 4,
  risk_level: "medium",
  ethical_conflicts: [
    { between: ["autonomy", "client_best_interest"], note: "服务对象有权参与自身治疗的决定，但减药或停药后的复发风险无法排除。" },
    { between: ["confidentiality", "family_relationship"], note: "家属希望随时了解情况，服务对象希望自己的信息不被转述。" },
    { between: ["professional_boundary", "professional_responsibility"], note: "社工不是医生，也不是监督者，但对服务对象的状态变化仍负有专业责任。" },
  ],
  stakeholders: [
    { id: "client", name: "陈嘉禾（化名）", role: "服务对象，29 岁，康复期", interest: "恢复对自己生活的掌控，不再被当作“病人”看待", power: "low" },
    { id: "mother", name: "陈嘉禾的母亲（化名：陈阿姨）", role: "主要照顾者", interest: "害怕病情反复，希望儿子一直稳定", power: "high" },
    { id: "psychiatrist", name: "主治精神科医生", role: "医疗决策者", interest: "掌握用药调整的专业判断，关注复发预警信号", power: "high" },
    { id: "supervisor", name: "机构督导", role: "专业支持", interest: "确保服务合规，社工在边界内工作", power: "high" },
    { id: "colleague", name: "康复中心同伴支持员", role: "同伴支持", interest: "以亲身经验陪伴，关注服务对象是否被尊重", power: "low" },
  ],
  institutional_constraints: [
    "机构的服务协议对信息共享范围有书面约定，涉及向家属披露的内容需先征得服务对象同意（虚构设定）。",
    "药物的调整属于医疗范畴，社工无权建议增减剂量，也不能代替医生评估。",
    "服务过程中如出现明显的复发预警或危险迹象，须按机构流程向督导和医疗方汇报。",
  ],
  client_preferences: ["希望自己的治疗决定被当作“一个成年人的决定”来对待", "希望家人不要再每天查看药盒、追问状态"],
  information_completeness: 0.5,
  time_pressure: "medium",
  resource_constraints: ["主治医生门诊名额紧张，复诊预约需等待", "康复中心每周仅能安排一次个别面谈"],
  initial_state:
    "周三下午，陈嘉禾准时来到中心。他已经稳定了半年，最近开始上手工作坊的课程，笑得也比以前多。上周，他的母亲打电话给你，说在药盒里发现药片对不上数，请你“看着他吃药，有变化马上告诉我”。",
  events: [
    { id: "e1", narration: "窗外下着小雨，面谈室里只有你们两个人。他把外套挂在椅背上，手里转着一支笔，没有立刻开口。" },
  ],
  decision_nodes: [
    {
      id: "n1",
      minTurns: 4,
      disclosureThreshold: 40,
      lowDisclosureNarration:
        "陈嘉禾几乎没有提到药。他说“最近挺好的”，笑了笑，又在你提到家里时收起了笑容。你只从母亲的电话和他略显拘谨的神情里，隐约觉得有些事没有被说出口。你并不清楚他是否真的减了药、减了多少、为什么，母亲的请求却已经在等你的回应。",
      lowDisclosurePrompt:
        "你对陈嘉禾的用药情况和真实想法了解有限，而母亲希望你监督服药并随时汇报。在信息并不完整的情况下，你现在怎么做？",
      prompt:
        "陈嘉禾告诉你，三周前他开始自己把药减了一半。他说：“我已经稳定半年了，这次，让我自己决定。”他也知道母亲已经起疑。你现在怎么做？",
      narrationByBranch: {
        default:
          "陈嘉禾手里转着笔，终于停下来。“我没有不舒服。睡得着，也能上课。”他看着你，“我只是不想一辈子都被药绑着。我妈每天看我吃，我觉得自己像在被管。”他顿了顿，“你会告诉她吗？”",
      },
      options: [
        {
          id: "n1-a",
          label: "尊重他的决定，对减药一事暂不向家属透露",
          description: "把他当作有权决定的成年人，保守他的信息，同时继续保持面谈与关注。",
          protects: ["autonomy", "confidentiality"],
          sacrifices: ["family_relationship", "client_best_interest"],
          consequences: [
            "他可能因被信任而更坦诚，愿意继续来谈，甚至考虑与医生沟通。",
            "若复发征兆出现，家属可能因不知情而错过早期支持，事后也可能对你产生不满。",
            "你需要在没有医生参与的情况下，承担持续观察他状态的责任。",
          ],
          effects: [
            { key: "trust", delta: 12, reason: "他的信息和决定被尊重，没有被转述" },
            { key: "willingness_to_disclose", delta: 10, reason: "确认这里是可以谈真实想法的地方" },
            { key: "anger", delta: -6, reason: "“被管”的感觉暂时缓解" },
            { key: "risk_level", delta: 8, reason: "医疗方与家属均不知情，预警信号可能被延误" },
          ],
          outcomeNarration:
            "陈嘉禾的肩膀松了下来。“谢谢你没有马上说‘不行’。”他说。你的笔记本上写下了今天的日期，旁边留了一行空白，不知道下次该填什么。",
          branchKey: "keep_confidential",
        },
        {
          id: "n1-b",
          label: "坦诚说明你的角色与保密的限度，并鼓励他与医生沟通",
          description: "告诉他你不能替他决定用药，也不会随意向家属汇报，但会邀请他把想法带给主治医生。",
          protects: ["autonomy", "professional_responsibility", "client_best_interest"],
          sacrifices: ["family_relationship"],
          consequences: [
            "他有机会在医疗专业的支持下安全地讨论减药，而不是独自冒险。",
            "他可能担心医生会反对或强行恢复原量，对此保持防备。",
            "医生的建议未必与他的期待一致，他仍可能选择自行行动。",
          ],
          effects: [
            { key: "trust", delta: 5, reason: "你没有评判，也没有替他做决定，同时说明了自己的位置" },
            { key: "fear", delta: 6, reason: "担心与医生谈后治疗方案被改回去" },
            { key: "relationship_quality", delta: 6, reason: "他感到你在与他商量而不是管他" },
            { key: "risk_level", delta: -7, reason: "医疗专业的视角可能介入" },
          ],
          outcomeNarration:
            "“你的意思是，让我自己去跟医生说？”他重复了一遍，像在掂量这句话的分量。“如果她不同意呢？”你说，你们可以一起想想怎么表达。",
          branchKey: "suggest_doctor",
        },
        {
          id: "n1-c",
          label: "劝他先恢复原剂量，并告知他你需要向家属和医生汇报",
          description: "说明减药存在风险，请他先按医嘱服药，同时告诉他你会把情况通报相关方。",
          protects: ["client_best_interest", "professional_responsibility", "family_relationship"],
          sacrifices: ["autonomy", "confidentiality"],
          consequences: [
            "复发的可能性可能因恢复稳定剂量而降低，家属也会感到安心。",
            "他可能把此举理解为“你站在家人那边”，从此在这里有所保留。",
            "他也许会表面服从，转而更隐蔽地处理药物，让风险更难被看见。",
          ],
          effects: [
            { key: "trust", delta: -15, reason: "他以为可以谈的事，变成了需要汇报的事" },
            { key: "anger", delta: 15, reason: "再次感到自己的意愿被忽视" },
            { key: "willingness_to_disclose", delta: -12, reason: "担心说出来的话会被转述" },
            { key: "relationship_quality", delta: -12, reason: "关系被他理解为“监督”而不是“陪伴”" },
          ],
          outcomeNarration:
            "陈嘉禾的笑意一点点消失了。“原来你也是来看着我的。”他把笔放进口袋，“我明白了。”会谈还剩二十分钟，但他已经不太说话了。",
          branchKey: "urge_resume",
        },
        {
          id: "n1-d",
          label: "答应家属的请求，每次面谈确认服药并向母亲汇报",
          description: "把母亲的要求当作服务计划的一部分，定期核对并向家属通报。",
          protects: ["family_relationship", "client_best_interest"],
          sacrifices: ["autonomy", "confidentiality", "professional_boundary"],
          consequences: [
            "家属的焦虑可能缓解，也更愿意配合康复安排。",
            "他可能感到被监视，服务关系从“伙伴”变成“监督”。",
            "你可能在无意间扮演了医疗监督者与家属代言人的角色，超出了社工的界限。",
          ],
          effects: [
            { key: "trust", delta: -22, reason: "他的信息被转交给了他想有所保留的人" },
            { key: "anger", delta: 18, reason: "感到成年人的决定被家人和专业人员联手否定" },
            { key: "fear", delta: 10, reason: "担心被当作“又不稳定了”" },
            { key: "relationship_quality", delta: -18, reason: "专业关系被转为监督关系" },
          ],
          outcomeNarration:
            "母亲在电话里长长地舒了口气：“那我就放心了，谢谢你。”下一次见面，陈嘉禾坐下后第一句话是：“我妈跟我说，你都告诉她了。”他没有看你，语气很轻。",
          branchKey: "report_to_family",
        },
      ],
    },
    {
      id: "n2",
      minTurns: 3,
      prompt: "又过去了一段时间，事情有了新的进展。接下来你如何推进？",
      narrationByBranch: {
        keep_confidential:
          "两周后，陈嘉禾仍按时来面谈，状态看上去平稳，只是提到自己最近睡得晚了些，工作坊的作业也交得迟。母亲打来电话：“他最近是不是有点不对？你有没有发现什么？”",
        suggest_doctor:
          "陈嘉禾去复诊了。回来后他告诉你，医生没有直接反对，但希望他“先别自己动”，并建议一起制定一个缓慢调整的计划。他说：“我还没想好要不要答应。”",
        urge_resume:
          "他恢复了原剂量——至少他是这么说的。但面谈时他话明显少了，工作坊也缺了两次课。母亲说他最近总关着房门。你无法判断，这是情绪低落，还是对你的防备。",
        report_to_family:
          "汇报持续了一个月。家里表面平静，但陈嘉禾在面谈中几乎不谈真实感受，只问“今天要汇报什么”。母亲则开始每天给你发消息，询问他的一举一动。",
        default: "一段时间过去了，事情有了新的变化。",
      },
      options: [
        {
          id: "n2-a",
          label: "与他共同商议，由他决定向家属和医生披露哪些内容",
          description: "邀请他参与决定信息的共享范围，并提出由他自己或在你陪同下与家人沟通。",
          protects: ["autonomy", "family_relationship", "confidentiality"],
          sacrifices: ["professional_responsibility"],
          consequences: [
            "他保有对自己信息的掌控感，也可能因此更愿意向家人开口。",
            "他可能迟迟不愿披露，期间对潜在风险的把握仍然不足。",
            "你需要同时回应家属的焦虑，而你能给的承诺有限。",
          ],
          effects: [
            { key: "trust", delta: 7, reason: "他被邀请参与决定，而不是被通知" },
            { key: "willingness_to_disclose", delta: 8, reason: "可以主导信息如何被分享" },
            { key: "fear", delta: -5, reason: "不再担心被突然“汇报”" },
            { key: "risk_level", delta: 4, reason: "披露的节奏取决于他，早期信号可能被延后看到" },
          ],
          outcomeNarration:
            "陈嘉禾想了很久。“我想自己跟我妈说，”他终于说，“但不是现在。你能陪我练一练吗？”你们在面谈室里，一遍遍地练习第一句话该怎么说。",
          branchKey: "client_led_disclosure",
        },
        {
          id: "n2-b",
          label: "与督导及医疗方商议，共同制定一份预警与应对计划",
          description: "在征得他同意的前提下，让医生、督导和他一起列出预警信号、联系方式与应对步骤。",
          protects: ["professional_responsibility", "client_best_interest", "autonomy"],
          sacrifices: ["confidentiality"],
          consequences: [
            "有了明确的预警指标，复发风险可能被更早发现。",
            "更多人了解他的情况，他可能觉得自己再次被“盯上”。",
            "计划的效果依赖他的配合，计划本身并不能保证稳定。",
          ],
          effects: [
            { key: "trust", delta: 4, reason: "他被告知并参与，而不是被安排" },
            { key: "risk_level", delta: -12, reason: "形成了清晰的预警与应对安排" },
            { key: "fear", delta: 5, reason: "更多人参与让他担心被重新贴上“病人”的标签" },
            { key: "dependency", delta: 5, reason: "对外部支持网络的依赖有所增加" },
          ],
          outcomeNarration:
            "会议开得不长。医生在纸上写下四条“如果出现，请尽快联系”的信号，陈嘉禾自己加了一条：“如果我自己觉得不对，我会先告诉同伴支持员。”这一条被认真地写了下来。",
          branchKey: "warning_plan",
        },
        {
          id: "n2-c",
          label: "重新回应家属的诉求，在他同意的范围内定期提供一般性情况",
          description: "与母亲重新沟通，说明服务的边界，同意只在约定范围内提供“整体状态”而非服药细节。",
          protects: ["family_relationship", "professional_boundary"],
          sacrifices: ["autonomy", "client_best_interest"],
          consequences: [
            "家属获得了一定程度的信息，焦虑可能缓解。",
            "他可能对“整体状态”的界限感到模糊，担心信息会越出约定。",
            "母亲对“一般性情况”的期待与你实际能给出的内容之间可能存在落差。",
          ],
          effects: [
            { key: "trust", delta: -4, reason: "他对信息“会不会越线”保持警觉" },
            { key: "relationship_quality", delta: 3, reason: "你清晰地向双方说明了界限" },
            { key: "anger", delta: 4, reason: "他仍对家人的关注感到压力" },
          ],
          outcomeNarration:
            "你与母亲谈了一个多小时。她哭了，说：“我不是想管他，我是真的怕。”你说，你能理解这份害怕，也说清了自己不能说什么。她沉默地点了点头。",
          branchKey: "family_boundary_talk",
        },
        {
          id: "n2-d",
          label: "继续按目前的节奏陪伴，把观察记录交给督导复盘",
          description: "保持面谈频率，不主动改变现状，同时把每次的观察交由督导共同回看。",
          protects: ["autonomy", "professional_responsibility"],
          sacrifices: ["family_relationship", "safety"],
          consequences: [
            "关系保持稳定，他的节奏被尊重。",
            "若出现复发迹象，可能错过更早的介入时机。",
            "家属的焦虑得不到回应，可能自行采取行动。",
          ],
          effects: [
            { key: "trust", delta: 4, reason: "你没有改变与他的相处方式" },
            { key: "relationship_quality", delta: 4, reason: "关系持续稳定" },
            { key: "risk_level", delta: 6, reason: "没有新的预警或支持措施" },
          ],
          outcomeNarration:
            "你们保持着每周一次的见面。每次结束后，你把观察的几行字交给督导。督导读完，只问了一句：“你现在最担心的是什么？”你发现，自己一时答不上来。",
          branchKey: "continue_pace",
        },
      ],
    },
  ],
  possible_outcomes: [
    "他在医疗支持下完成缓慢、可监测的减药尝试，并保持稳定",
    "他因感到被监督而中断服务，独自继续减药，风险难以被看见",
    "症状出现反复，需要及时的医疗介入与家庭支持",
    "他与家人关系在一次坦诚的沟通中得到修复，或进一步紧张",
  ],
  knowledge_sources: [
    {
      title: "所在地区关于精神卫生服务、知情同意及个人信息保护的现行规定（请自行核对具体条文）",
      source: "待核对：法律法规",
      verified: false,
    },
    {
      title: "所在国家/地区社会工作者职业伦理守则中关于保密、自我决定及与家属沟通的条款（请自行核对具体条文）",
      source: "待核对：专业伦理守则",
      verified: false,
    },
  ],
  synthetic: true,
  human_in_the_loop_required: true,
  opening_line: "（他在椅子上坐直，手里转着一支笔。）今天……我想跟你说点事。但你先答应我，别一听就开始劝我，行吗？",
  hitl_notice:
    "涉及用药调整、复发风险及对家属的信息披露。此为虚构模拟，AI 仅提供反思材料；用药决定属于医疗范畴，真实情境中的判断须由具备专业责任的人员在督导与医疗团队支持下作出。",
  suggested_prompts: ["今天想从哪里聊起都可以。", "我想先听听你这段时间的感受。", "这半年里，你觉得自己有哪些变化？", "你希望我在这里扮演什么样的角色？"],
  reflection_questions: [
    "当一个人说“我想自己决定”，你如何分辨这是一种康复的表现、一种风险，还是两者同时存在？",
    "你的选择中，哪些是基于你看到的事实，哪些是基于你对“精神疾病服务对象应当如何”的预设？",
    "母亲的焦虑是否正当？你能否在不否定她的前提下，也不辜负嘉禾对你的信任？",
    "你能否分别用一句话，向嘉禾、向他母亲、向主治医生解释你的做法？三种解释是否一致？",
    "如果几个月后他出现了反复，你会如何看待自己在今天的选择？你需要怎样的支持？",
  ],
  uncertainties: [
    "无法预知减药是否会导致复发，也无法预知他在医生指导下调整药物后的状态。",
    "嘉禾对“被控制”的感受，与母亲的担忧，各自在多大程度上反映了真实的风险，案例中的信息并不完整。",
    "社工与医生、家属之间的信息共享边界，会随具体情况与所在地区的规定不同而变化。",
  ],
  topic_replies: [
    { pattern: "药|减药|停药|剂量|吃药", minDisclosure: 40, reply: "（他把笔放下）……三周前，我自己把量减了一半。睡眠没变，也没有听到什么，反而觉得脑子清楚了些。……我知道这样不对，但我想试试。" },
    { pattern: "药|减药|停药|剂量|吃药", reply: "（他笑了笑）……药啊，按时吃着呢。怎么，是我妈跟你说什么了吗？" },
    { pattern: "妈|母亲|家里人|家人|家属", minDisclosure: 40, reply: "（他的声音低下来）……我妈每天看着我吃，就像我随时会出事一样。我知道她怕，可我也怕，怕我这辈子都只是‘她的病人’。" },
    { pattern: "妈|母亲|家里人|家人|家属", reply: "（他耸耸肩）……她挺好的，就是爱操心。" },
    { pattern: "医生|复诊|门诊|主治", minDisclosure: 35, reply: "（他挠了挠头）……我没敢跟医生说。我怕他一听就让我加回去，然后什么都别再提。" },
    { pattern: "医生|复诊|门诊|主治", reply: "（他避开视线）……医生挺忙的，我就是按时去拿药。" },
    { pattern: "保密|告诉|汇报|通知|隐私", reply: "（他抬头直视你）……你会把我说的都告诉别人吗？我想知道，哪些话在这里是安全的。" },
    { pattern: "睡|失眠|状态|感觉|心情|怎么样", minDisclosure: 40, reply: "（他想了想）……最近睡得晚，有时候脑子停不下来。……不过我分得清楚，这和以前不一样。" },
    { pattern: "睡|失眠|状态|感觉|心情|怎么样", reply: "（他点点头）……挺好的，真的挺好的。" },
    { pattern: "工作|手工|课程|朋友|同伴|计划", reply: "（他的眼睛亮了一点）……工作坊的老师夸我最近做的东西细致。我想以后能找份正式的活，不想一直靠着别人。" },
    { pattern: "病|复发|稳定|半年", reply: "（他停顿了一下）……半年了，我自己心里有数。我不想被当成一个随时会倒的人。" },
  ],
  initial_client_state: {
    trust: 45,
    fear: 35,
    anger: 25,
    willingness_to_disclose: 30,
    risk_level: 40,
    dependency: 25,
    relationship_quality: 50,
  },
  client_agent: {
    agent_id: "client-chenjiahe",
    role: "client",
    name: "陈嘉禾",
    personality: ["敏感", "有主见", "自尊心强", "渴望被当作普通人对待"],
    goals: ["恢复对自己生活的掌控", "获得一份稳定的工作", "让家人相信他已经在好转"],
    fears: ["被重新当作“病人”看待", "病情反复、失去已经得到的一切", "辜负母亲的期待与付出"],
    values: ["自主", "尊严", "被信任", "对家人的责任感"],
    background:
      "29 岁，两年前因一次急性发作经历住院治疗，之后在社区康复。稳定半年，目前参加手工作坊，计划学习一门技能后找工作。与母亲同住，母亲每日查看药盒。他对药物的副作用（嗜睡、迟钝）颇有感受，认为这些妨碍了他的生活。",
    knowledge: {
      knows: ["自己用药后的身体感受", "自己对康复和生活的想法", "母亲的担心和日常的照看方式", "社区康复中心的服务内容"],
      does_not_know: [
        "减药对自己病情的长期影响",
        "医生是否愿意与他一起制定逐步调整的计划",
        "社工在什么情况下必须向家属或医生汇报",
        "母亲内心真实的恐惧来源",
      ],
    },
    decision_policy:
      "被当作成年人平等商量、不被评判时，会逐步说出减药的原因与顾虑；一旦感到被说教、被监督或被转述，会沉默、转移话题或表面顺从；对“病人”“不稳定”等字眼十分敏感；对承诺与保密边界的说法格外留意。",
  },
};
