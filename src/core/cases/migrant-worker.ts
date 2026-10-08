import type { EthicsCase } from "../schemas";

/**
 * 案例：流动人口务工者被拖欠工资 + 维权与身份安全之间的伦理冲突。
 * 全部为合成数据（synthetic），人物与情节均为虚构。
 * 案例只描述情境与决策节点的价值结构，不作任何法律结论；服务对象的具体言行由 Agent 动态生成。
 */
export const migrantWorkerCase: EthicsCase = {
  case_id: "migrant-wage-theft-v1",
  version: "0.1.0",
  title: "「钱要回来，人不能出事」",
  domain: "流动人口服务 / 劳动权益",
  population: "外来务工者（33 岁男性）",
  setting: "社区流动人口服务站，晚间开放时段的个别面谈",
  difficulty: 4,
  risk_level: "high",
  ethical_conflicts: [
    { between: ["justice", "confidentiality"], note: "争取被拖欠的劳动报酬，与保护对方不愿暴露的个人信息之间存在张力。" },
    { between: ["autonomy", "minimize_harm"], note: "尊重他自己决定是否维权，与社工所预见的失业、被追查等风险之间需要权衡。" },
    { between: ["professional_responsibility", "safety"], note: "社工对机构和相关部门协作关系的责任，与他个人安全之间并不总是一致。" },
  ],
  stakeholders: [
    { id: "client", name: "阿强（化名）", role: "服务对象，外来务工者", interest: "拿回被拖欠的工资，同时不丢掉工作与落脚之处", power: "low" },
    { id: "foreman", name: "工头", role: "用工方的现场负责人", interest: "维持用工关系和资金周转，不愿被投诉", power: "high" },
    { id: "coworkers", name: "同工地的工友", role: "同样可能被拖欠的务工者", interest: "既想一起要钱，又怕被牵连", power: "low" },
    { id: "supervisor", name: "机构督导", role: "专业支持", interest: "确保服务合规，也顾及机构与相关部门的协作关系", power: "high" },
    { id: "agency", name: "相关主管部门的接待人员", role: "投诉渠道的受理方", interest: "按程序登记并处理，需要核实申诉人信息", power: "high" },
  ],
  institutional_constraints: [
    "机构与相关部门存在协作关系，部分转介渠道需要登记个人信息（虚构设定）。",
    "社工需要在合理时限内向督导汇报涉及潜在冲突或风险的个案。",
    "机构的资金与项目运行依赖与相关部门的良好合作。",
  ],
  client_preferences: ["希望不要因为要钱而被赶走或被追查", "希望有人能帮他把事情说清楚，而不是替他做决定"],
  information_completeness: 0.4,
  time_pressure: "high",
  resource_constraints: ["站内没有专职的劳动权益顾问", "法律援助等外部资源需要预约，且具体条件因所在地区而异"],
  initial_state:
    "晚上九点，阿强第二次来到服务站。他穿着还没换下的工装，鞋上沾着水泥。他在这家工地干了几个月，工资只发过一次，工头一直说“再等等”。他今晚没有说明来意，只问站里“能不能坐一会儿”。",
  events: [
    { id: "e1", narration: "走廊的灯一盏盏熄掉。阿强把手机反扣在腿上，又翻过来看了一眼，屏幕上是一条没有回复的催款信息。" },
  ],
  decision_nodes: [
    {
      id: "n1",
      minTurns: 4,
      disclosureThreshold: 40,
      lowDisclosureNarration:
        "阿强只说“工钱一直没结”，其他的都含糊带过。你不知道他有没有合同、身份材料是否齐全，也不清楚他到底想要回钱，还是只想找个人说说话。他看着你，说：“你们……能帮人要钱吗？”你对事情全貌并不确定，却要决定怎么回应。",
      lowDisclosurePrompt:
        "阿强请求你帮他要回工资，但他没有说明自己的身份与处境。在信息并不完整的情况下，你现在怎么做？",
      prompt: "阿强告诉你，他被拖欠了几个月工资，没有正式合同，身份和社保材料也不齐。他说：“我想把钱要回来，但我不敢去投诉，怕被人查，丢了工作。”你现在怎么做？",
      narrationByBranch: {
        default:
          "阿强沉默了好一会儿，终于把手机推到你面前，上面是一连串“再等等”的聊天记录。“我不是想闹事，”他说，“我就是想拿回我该拿的。可是我听说，投诉要登记身份……”他没有说完，抬头看你，眼里有急切，也有防备。",
      },
      options: [
        {
          id: "n1-a",
          label: "介绍相关的投诉渠道，说明可能需要登记的信息",
          description: "如实告诉他有哪些渠道，并把可能涉及的个人信息要求讲清楚，由他自己决定去不去。",
          protects: ["autonomy", "justice"],
          sacrifices: ["safety", "minimize_harm"],
          consequences: [
            "他获得了清晰的信息和选择权，可能鼓起勇气维权。",
            "若登记信息被用于其他用途，他可能面临身份方面的麻烦。",
            "他也可能因害怕而放弃，把事情压回心里。",
          ],
          effects: [
            { key: "trust", delta: 6, reason: "你没有隐瞒渠道的限制，把选择交给了他" },
            { key: "fear", delta: 8, reason: "听到需要登记信息，担忧被具体化" },
            { key: "willingness_to_disclose", delta: 5, reason: "他感到被当作能自己做决定的人" },
          ],
          outcomeNarration:
            "阿强听得很仔细，手指一下一下敲着桌沿。“登记……要写身份证，对吧。”他低声说，“那我得想想。”他没有走，只是把椅子往里拉了拉。",
          branchKey: "informed_channels",
        },
        {
          id: "n1-b",
          label: "先不推荐正式渠道，帮他整理证据并尝试协商",
          description: "协助他收集记录，必要时在他同意下尝试通过非正式方式与对方协商。",
          protects: ["confidentiality", "minimize_harm"],
          sacrifices: ["justice", "professional_responsibility"],
          consequences: [
            "不暴露个人信息，短期内降低被追查的风险。",
            "协商未必奏效，工头可能拖延或反过来施压。",
            "社工介入非正式协商，可能超出机构授权与自身专业角色。",
          ],
          effects: [
            { key: "trust", delta: 8, reason: "你把他的安全顾虑放在了前面" },
            { key: "fear", delta: -6, reason: "短期内不需要暴露身份" },
            { key: "risk_level", delta: 6, reason: "拖延使欠薪与工头施压的可能同时存在" },
          ],
          outcomeNarration:
            "阿强明显松了口气，肩膀垮下来。“那就……先不报，行吗？”他说，“我这几个月的记录都在手机里，我给你看。”你们一页页翻着，屏幕的光映在他疲惫的脸上。",
          branchKey: "informal_route",
        },
        {
          id: "n1-c",
          label: "与他商量，同时说明你需要向督导咨询",
          description: "告诉他自己会尊重他的意愿，但涉及机构协作关系与风险，需要在督导支持下一起想办法。",
          protects: ["professional_responsibility", "autonomy"],
          sacrifices: ["confidentiality"],
          consequences: [
            "判断有了督导的共同参与，降低独自承担的风险。",
            "他可能担心个人信息被机构传出去，因而有所保留。",
            "过程需要时间，期间他的经济压力并未缓解。",
          ],
          effects: [
            { key: "trust", delta: 3, reason: "你坦诚说明了需要咨询，而不是暗中处理" },
            { key: "fear", delta: 6, reason: "意识到“更多人知道”，担心信息扩散" },
            { key: "relationship_quality", delta: 4, reason: "被坦诚而不是敷衍地对待" },
          ],
          outcomeNarration:
            "阿强皱了皱眉。“督导……是会把我的事告诉别的部门吗？”他问。你说明了你所知道的边界，也承认有些事你现在回答不了。他沉默了一会儿，说：“你先说清楚，你要说什么。”",
          branchKey: "consult_supervisor",
        },
        {
          id: "n1-d",
          label: "建议他尽快去正式部门投诉，并陪同前往",
          description: "倾向通过正式渠道处理拖欠工资：主动联系相关部门，并陪他走流程。",
          protects: ["justice", "professional_responsibility"],
          sacrifices: ["confidentiality", "autonomy", "safety"],
          consequences: [
            "问题可能进入正式程序，工资有机会被追回。",
            "个人信息登记可能让他面临身份审查或被用工方报复。",
            "他可能觉得自己被推着走，失去了对节奏的控制。",
          ],
          effects: [
            { key: "trust", delta: -6, reason: "他担心的风险没有被充分顾及" },
            { key: "fear", delta: 15, reason: "要面对他最担心的登记与审查" },
            { key: "anger", delta: 6, reason: "觉得自己的顾虑被忽视" },
            { key: "risk_level", delta: 10, reason: "个人信息可能进入正式系统" },
          ],
          outcomeNarration:
            "阿强的脸一下子绷紧。“我说了我不敢……”他的声音很低，“你让我去，万一出了事，你管我吗？”他没有再说下去，只是盯着自己沾着灰的鞋尖。",
          branchKey: "formal_complaint",
        },
      ],
    },
    {
      id: "n2",
      minTurns: 3,
      prompt: "又过了几天，阿强的处境有了新变化。接下来你如何推进？",
      narrationByBranch: {
        informed_channels:
          "几天后，阿强带着两个工友的电话来找你。“他们也被欠了，”他说，“要是一起去，是不是更安全？”他的眼神里有期待，也有一丝不确定。",
        informal_route:
          "几天过去，工头回了阿强一条消息：“再等等，别闹，闹了大家都没活干。”阿强把手机举到你面前，手有点抖。“他是不是知道我在找人了？”",
        consult_supervisor:
          "督导听完后表示机构可以协助，但需要先弄清楚转介渠道的具体要求。几天里阿强没来，今晚他突然出现在门口，说：“我想知道，你们商量出什么了没有。”",
        formal_complaint:
          "投诉流程已经启动，阿强被要求补充身份相关材料。他今天来站里时脸色很差，说工头在工地上已经问起“是谁去告的”。",
        default: "几天过去，阿强的处境有了新的变化。",
      },
      options: [
        {
          id: "n2-a",
          label: "与督导和阿强一起评估各条路径的风险，由他决定下一步",
          description: "把可选择的渠道、各自可能的后果摊开，在专业支持下由他选择，社工负责信息与陪伴。",
          protects: ["autonomy", "professional_responsibility", "minimize_harm"],
          sacrifices: ["justice"],
          consequences: [
            "他在更完整的信息下做决定，对后果有心理准备。",
            "评估需要时间，欠薪问题短期内可能无法解决。",
            "他最终仍可能选择不维权，工资也许追不回来。",
          ],
          effects: [
            { key: "trust", delta: 6, reason: "他被邀请共同参与评估，而不是被安排" },
            { key: "fear", delta: -5, reason: "路径与风险被清楚地摆出来" },
            { key: "relationship_quality", delta: 6, reason: "关系中保留了他的主导权" },
          ],
          outcomeNarration:
            "你们在一张纸上列出了几条路：每条路要登记什么、可能遇到什么、他最怕的是什么。阿强用笔把“最怕的”那一栏圈了两次。“我想好了再告诉你。”他说，但这次，他的语气没有躲闪。",
          branchKey: "joint_assessment",
        },
        {
          id: "n2-b",
          label: "联系可提供咨询的外部法律援助或劳动权益机构，由对方说明条件",
          description: "把他转介给更熟悉相关规定的专业机构，同时陪他完成初步沟通。",
          protects: ["justice", "client_best_interest"],
          sacrifices: ["confidentiality", "professional_responsibility"],
          consequences: [
            "他可能得到更专业的建议，路径更清晰。",
            "转介过程中信息需要被再次说明，增加了信息扩散的风险。",
            "外部机构的条件与时间不确定，他可能需要再次面对类似的登记要求。",
          ],
          effects: [
            { key: "trust", delta: 4, reason: "你为他连接了更专业的支持" },
            { key: "fear", delta: 4, reason: "又多了一个需要陈述自己情况的对象" },
            { key: "dependency", delta: -5, reason: "他开始接触更多支持来源" },
          ],
          outcomeNarration:
            "你拨通了电话，把情况大致说明，没有报出他的名字。对方说需要见面后才能判断条件。阿强一边听一边点头，等你放下电话，他才问：“他们……也要看我的证件吗？”",
          branchKey: "external_referral",
        },
        {
          id: "n2-c",
          label: "尊重他暂时不维权的决定，继续提供情绪与生活支持",
          description: "不推进正式程序，陪他度过眼下的经济和心理压力，保持随时可以重启的开放。",
          protects: ["autonomy", "confidentiality", "safety"],
          sacrifices: ["justice", "professional_responsibility"],
          consequences: [
            "他的安全顾虑被优先，他不再被推着往前走。",
            "拖欠问题持续，其他工友的处境也没有得到处理。",
            "你可能独自承担“知道却没有行动”的道德压力。",
          ],
          effects: [
            { key: "trust", delta: 5, reason: "他的意愿和安全顾虑被尊重" },
            { key: "dependency", delta: 6, reason: "他更倚赖你个人的陪伴" },
            { key: "risk_level", delta: 4, reason: "欠薪与经济压力仍然持续" },
          ],
          outcomeNarration:
            "“你不逼我，我反而想多说几句。”阿强苦笑了一下。他讲起老家的孩子和下个月要寄回去的钱，语速越来越慢。你听着，心里也在想：这样的“暂缓”，到底是保护还是回避。",
          branchKey: "pause_and_support",
        },
        {
          id: "n2-d",
          label: "在他同意的前提下，联系其他受影响的工友，尝试集体行动",
          description: "鼓励工友们共同表达诉求，用人数分散个人风险，由他们自己商议如何行动。",
          protects: ["justice", "autonomy"],
          sacrifices: ["safety", "minimize_harm"],
          consequences: [
            "集体行动可能增加谈判力量，也让个人不那么孤立。",
            "冲突可能升级，工头可能对带头者施压或报复。",
            "不同工友的顾虑不一，内部分歧可能让局面更难收拾。",
          ],
          effects: [
            { key: "trust", delta: 4, reason: "他感到不再是一个人面对" },
            { key: "fear", delta: 8, reason: "担心被工友之外的人认出是发起者" },
            { key: "anger", delta: 5, reason: "与工友交流让积压的不满被唤起" },
            { key: "risk_level", delta: 8, reason: "冲突可能升级，个人可能被针对" },
          ],
          outcomeNarration:
            "几个工友挤在站里的小房间，七嘴八舌。有人说“要去一起去”，有人低头不说话。阿强夹在中间，声音很轻：“我不想当带头的。”屋里一下安静下来。",
          branchKey: "collective_action",
        },
      ],
    },
  ],
  possible_outcomes: [
    "阿强在了解风险后，自主选择了一条他能承受的维权路径",
    "阿强因担忧身份暴露而放弃维权，欠薪未得到解决",
    "阿强因个人信息进入正式程序而面临新的风险或报复",
    "阿强与工友形成互助，部分诉求得到回应",
  ],
  knowledge_sources: [
    {
      title: "所在地区关于劳动报酬支付、投诉受理及个人信息登记的相关规定（请自行核对）",
      source: "待核对：地方相关规定",
      verified: false,
    },
    {
      title: "所在国家/地区社会工作者职业伦理守则中关于保密、社会正义与机构冲突的条款（请自行核对）",
      source: "待核对：专业伦理守则",
      verified: false,
    },
  ],
  synthetic: true,
  human_in_the_loop_required: true,
  opening_line: "（他在门口停了一下，才走进来，把安全帽放在膝盖上。）……不好意思，这么晚。我能先坐一会儿吗？",
  hitl_notice:
    "涉及劳动权益与个人身份信息的安全。此为虚构模拟，不构成任何法律意见；AI 仅提供反思材料，真实情境中的判断须由具备专业责任的人在督导下作出。",
  suggested_prompts: ["不着急，你想从哪里说起都可以。", "看起来你这段时间过得很辛苦。", "你今天来，最想解决的是什么？", "你现在最担心的是什么？"],
  reflection_questions: [
    "阿强想要回工资，同时又害怕暴露身份。你如何看待这两个愿望之间的拉扯？",
    "在你的选择里，哪些是基于阿强说过的话，哪些是基于你对“务工者应该怎样”的假设？",
    "当机构的协作关系与阿强的安全顾虑不一致时，你会怎样理解自己的位置？",
    "你能向阿强和向督导，分别用一句话解释你的决定吗？两种解释一致吗？",
    "如果阿强因你的建议而遭遇新的困难，你需要什么样的支持来面对？",
  ],
  uncertainties: [
    "案例信息不完整：你并不确定阿强的实际处境，也不清楚所在地区的相关规定与投诉渠道的具体做法。",
    "工头会如何反应、登记信息会被如何使用、工友是否愿意一起行动，都无法预知。",
  ],
  topic_replies: [
    { pattern: "工资|工钱|拖欠|欠薪|要钱", minDisclosure: 40, reply: "（他的声音低下去）……已经四个月了，就发过一次。我老家还等着我寄钱，孩子学费都是借的。" },
    { pattern: "工资|工钱|拖欠|欠薪|要钱", reply: "（他含糊地笑了笑）……就是结得有点慢，没什么大事。" },
    { pattern: "工头|老板|包工|领班", minDisclosure: 45, reply: "（他握紧安全帽）……他说话挺客气的，每次都说再等等。但我听说有人开口要钱，第二天就被换掉了。" },
    { pattern: "工头|老板|包工|领班", reply: "（他避开视线）……他人还行，就是手头紧吧。" },
    { pattern: "身份|证件|登记|合同|社保|居住", minDisclosure: 45, reply: "（他沉默了几秒）……合同没有，社保也没有。证件……不是都齐。一登记，我怕他们会查到别的。" },
    { pattern: "身份|证件|登记|合同|社保|居住", reply: "（他把手收回膝盖上）……这个……我一时说不清。" },
    { pattern: "投诉|举报|报警|部门|渠道", reply: "（他神色一紧）……要是去投诉，会不会让人知道是我？我听说要写名字，还要拍照。" },
    { pattern: "家里|老家|孩子|老婆|家人", minDisclosure: 35, reply: "（他的神情软下来）……孩子今年上初一。我答应过他，这学期不让他辍学。" },
    { pattern: "家里|老家|孩子|老婆|家人", reply: "（他简短地答）……都在老家，挺好的。" },
    { pattern: "工友|同事|一起", reply: "（他想了想）……有几个也被欠了。大家私下都在说，但谁也不想先出头。" },
    { pattern: "怎么样|感觉|心情|累", reply: "（他揉了揉眼睛）……睡不好。一闭眼就是算账，算这个月还能撑几天。" },
  ],
  initial_client_state: {
    trust: 30,
    fear: 60,
    anger: 35,
    willingness_to_disclose: 25,
    risk_level: 55,
    dependency: 20,
    relationship_quality: 35,
  },
  client_agent: {
    agent_id: "client-aqiang",
    role: "client",
    name: "阿强",
    personality: ["沉默", "谨慎", "能吃苦", "不愿给别人添麻烦"],
    goals: ["拿回被拖欠的工资，寄钱给老家的孩子", "不被追查，也不丢掉眼下的工作", "有人真正听他说完，而不是替他做决定"],
    fears: ["个人信息被登记后被追查", "被工头报复或被换掉", "被人当成“闹事的人”"],
    values: ["靠劳动吃饭", "家庭责任", "脸面与尊严", "对承诺的在意"],
    background:
      "33 岁，从外地来到本市务工，在一处工地做了几个月。没有正式劳动合同，居留与社保材料不全。老家有妻子和上初中的孩子，每月要寄钱回去。他第二次来到服务站，还没有把真实顾虑完整说出来。",
    knowledge: {
      knows: ["自己做了多少工、被欠了多少钱", "工地的人事与工头的态度", "自己的身份与材料不全这一事实"],
      does_not_know: ["各个投诉渠道的具体要求与可能后果", "所在地区相关规定如何看待他的处境", "社工和机构的转介流程与边界"],
    },
    decision_policy:
      "在被尊重、没有被催促时会逐步说出处境；一旦感到被逼问、被评判，或听到“登记”“上报”等字眼，会沉默、转移话题或说“没事”；对承诺与保密边界特别敏感。",
  },
};
