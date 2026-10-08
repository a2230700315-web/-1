import type { EthicsCase } from "../schemas";

/**
 * 案例：轻中度失智独居老人 + 自主与安全之间的伦理冲突。
 * 全部为合成数据（synthetic），人物与情节均为虚构。
 * 案例只描述情境与决策节点的价值结构，服务对象的具体言行由 Agent 动态生成。
 */
export const elderDementiaCase: EthicsCase = {
  case_id: "elder-dementia-home-v1",
  version: "0.1.0",
  title: "「我哪儿也不去」",
  domain: "社区居家养老 / 老年社会工作",
  population: "老年人（78 岁，轻中度失智）",
  setting: "社区居家养老服务站，社工入户走访与站内面谈",
  difficulty: 4,
  risk_level: "medium",
  ethical_conflicts: [
    { between: ["autonomy", "safety"], note: "老人坚持留在熟悉的家中，但跌倒与走失的风险真实存在。" },
    { between: ["family_relationship", "client_best_interest"], note: "子女出于担忧的要求，与老人自己表达的意愿并不一致，何为“最佳利益”并不清晰。" },
    { between: ["autonomy", "professional_responsibility"], note: "决定能力时好时坏，社工既要尊重当下的表达，也要对可预见的风险负责。" },
  ],
  stakeholders: [
    { id: "client", name: "周桂兰（化名）", role: "服务对象，78 岁独居老人", interest: "留在自己的家，保有熟悉的生活秩序和体面", power: "low" },
    { id: "daughter", name: "周女士的女儿（化名：林悦）", role: "异地工作的子女", interest: "希望母亲安全，承受着愧疚与焦虑", power: "high" },
    { id: "neighbor", name: "隔壁邻居（化名：吴阿姨）", role: "日常照看者", interest: "愿意帮忙，但不愿承担责任，也担心得罪双方", power: "low" },
    { id: "doctor", name: "社区卫生服务中心医生", role: "医疗支持", interest: "关注病情评估与用药，对能力评估持谨慎态度", power: "medium" },
    { id: "supervisor", name: "站点督导", role: "专业支持", interest: "确保服务合规、社工不独自承担高风险判断", power: "high" },
  ],
  institutional_constraints: [
    "服务站的入户服务有固定频次和时长，无法做到全天照看（虚构设定）。",
    "对服务对象决定能力的正式评估须由具备资质的人员进行，社工不能自行认定。",
    "涉及转介入住机构时，需要本人或其合法代理人的同意程序，具体要求以所在地区规定为准。",
  ],
  client_preferences: ["希望继续住在住了四十年的老房子里", "希望被当作“一个有想法的人”来商量，而不是被安排"],
  information_completeness: 0.45,
  time_pressure: "medium",
  resource_constraints: ["社区上门照护名额有限，排队时间不确定", "附近没有可即时响应的夜间支持"],
  initial_state:
    "周二上午，你第二次上门探访周桂兰。她前天傍晚在小区门口走错了方向，被邻居领回家，膝盖上有一块新的擦伤。昨晚，在外地工作的女儿给站里打了电话，语气急切：“你们能不能劝她去养老院？”",
  events: [
    { id: "e1", narration: "茶几上摆着一杯已经凉了的茶，窗台上的绿萝被照料得很好。冰箱门上用磁铁压着一张写满提醒的纸条，字迹工整，只是有几处被反复涂改。" },
  ],
  decision_nodes: [
    {
      id: "n1",
      minTurns: 4,
      disclosureThreshold: 40,
      lowDisclosureNarration:
        "周桂兰一直没有把话说透。她说“我好得很”，又在你起身时问了你第二遍“你是哪个单位的”。你只看到擦伤、纸条和一屋子整齐的旧物，对她愿意在家里怎样生活、害怕什么、记得多少，了解得并不完整。女儿的电话还在你的手机里等着回复。",
      lowDisclosurePrompt:
        "你对周桂兰的真实想法和日常状况了解有限，而女儿希望你尽快表态。在信息并不完整的情况下，你现在怎么做？",
      prompt:
        "周桂兰告诉你，她哪儿也不去，那间屋子里有她老伴的东西。她也承认前几天“走岔了路”，但说“谁都会迷路”。女儿则希望你协助安排入住。你现在怎么做？",
      narrationByBranch: {
        default:
          "周桂兰把凉掉的茶推开，双手放在膝上。“我知道她担心我。可我在这儿住了四十年，闭着眼都知道哪块地砖是松的。”她停了停，像是在找什么，“……你说你是哪个站的来着？”随后又自己笑了一下，“看我，老糊涂了。”",
      },
      options: [
        {
          id: "n1-a",
          label: "以老人的意愿为主，协助她留在家中",
          description: "先尊重她当下清楚表达的愿望，围绕居家安全做支持，暂不推动入住。",
          protects: ["autonomy", "client_best_interest"],
          sacrifices: ["safety", "family_relationship"],
          consequences: [
            "老人可能感到被尊重，更愿意配合居家安全的调整。",
            "若跌倒或走失再次发生，风险可能比预想的更大，且发生时无人在场。",
            "女儿可能觉得自己的担忧被搁置，对站里的信任下降。",
          ],
          effects: [
            { key: "trust", delta: 12, reason: "她的意愿被认真对待，没有被当作需要被“处理”的对象" },
            { key: "willingness_to_disclose", delta: 8, reason: "感到安全，愿意说更多日常里的困难" },
            { key: "fear", delta: -8, reason: "最担心的“被送走”暂时不会发生" },
            { key: "risk_level", delta: 8, reason: "跌倒与走失的隐患尚未被实质降低" },
          ],
          outcomeNarration:
            "周桂兰长长地舒了口气，手指不再绞着衣角。“你肯听我说完。”她说。你回到站里，看着手机里女儿未读的几条消息，没有立刻回复。",
          branchKey: "stay_home_first",
        },
        {
          id: "n1-b",
          label: "把家人的担忧完整说给老人听，并邀请她一起商量",
          description: "向老人如实转达女儿的担心，同时说明你不会替她做决定，希望共同寻找方案。",
          protects: ["family_relationship", "autonomy", "professional_responsibility"],
          sacrifices: ["confidentiality"],
          consequences: [
            "老人得以了解家人真实的想法，也可能为此伤心或生气。",
            "三方的信息被摆到桌面上，为后续共同决定留下空间。",
            "老人当下的理解与记忆可能不稳定，谈话内容未必被保留。",
          ],
          effects: [
            { key: "trust", delta: 4, reason: "被如实告知，而不是被隐瞒或被安排" },
            { key: "fear", delta: 10, reason: "意识到家人确实在考虑让她离开" },
            { key: "anger", delta: 6, reason: "对“被背着商量”感到委屈" },
            { key: "relationship_quality", delta: 5, reason: "你选择了坦诚而非敷衍" },
          ],
          outcomeNarration:
            "周桂兰沉默了好一阵，目光落在冰箱上的纸条。“她小时候发烧，我也是这样一夜一夜守着的……”她说，“可她不能替我活。”你不确定，明天她是否还能完整记得今天的这番话。",
          branchKey: "family_concern_shared",
        },
        {
          id: "n1-c",
          label: "先请医生做专业评估，再决定后续安排",
          description: "说明需要先了解她目前的认知与身体状况，建议一起去做评估，结果出来再讨论。",
          protects: ["professional_responsibility", "client_best_interest", "safety"],
          sacrifices: ["autonomy"],
          consequences: [
            "评估能提供更可靠的依据，但也可能让老人感到被怀疑、被“检查”。",
            "评估结果只反映某一时刻的状态，对能力波动的解释可能有限。",
            "等待评估期间，居家风险仍然存在，女儿的焦虑可能持续上升。",
          ],
          effects: [
            { key: "trust", delta: -3, reason: "她可能把评估理解为“有人觉得我不正常”" },
            { key: "fear", delta: 6, reason: "对检查结果将决定她去留感到不安" },
            { key: "risk_level", delta: -6, reason: "专业信息进入，后续安排有了依据" },
            { key: "dependency", delta: 4, reason: "她开始更多依赖外部专业意见" },
          ],
          outcomeNarration:
            "“检查什么？我脑子好好的。”周桂兰皱起眉头，随后又低声补了一句，“……上周我煮了两次汤，都忘了关火。”她看了你一眼，像在判断你会如何处理这句话。",
          branchKey: "assessment_first",
        },
        {
          id: "n1-d",
          label: "与女儿商量，推动尽快入住机构",
          description: "与女儿一同推进入住安排，并向老人解释这样安排的理由。",
          protects: ["safety", "family_relationship"],
          sacrifices: ["autonomy", "client_best_interest"],
          consequences: [
            "跌倒与走失的风险可能显著下降，夜间也有人照看。",
            "老人可能把此事理解为被抛弃，失去熟悉环境后情绪与认知状况都可能变差。",
            "即便入住，也未必就是老人长远来看更好的安排——这一点无法预先确定。",
          ],
          effects: [
            { key: "trust", delta: -20, reason: "她的明确反对未被采纳，感到被联合起来安排" },
            { key: "fear", delta: 20, reason: "最害怕的事——被迫离开家——似乎正在发生" },
            { key: "anger", delta: 15, reason: "感到被剥夺了对自己生活的发言权" },
            { key: "risk_level", delta: -8, reason: "居家的物理风险因搬离而降低" },
            { key: "relationship_quality", delta: -15, reason: "关系被她理解为“站在女儿一边”" },
          ],
          outcomeNarration:
            "周桂兰没有哭闹，只是慢慢站起来，把茶杯端到厨房。“你们都商量好了，”她背对着你说，“那还问我做什么。”水龙头开着，她站了很久。",
          branchKey: "push_for_facility",
        },
      ],
    },
    {
      id: "n2",
      minTurns: 3,
      prompt: "几天过去，情况又有了变化。接下来你如何推进？",
      narrationByBranch: {
        stay_home_first:
          "你帮她在门口装了夜灯，也把常用物品换到了顺手的位置。三天后，邻居吴阿姨打来电话：“昨晚她又在楼下转悠，说要去接放学的孩子。”周桂兰自己则说：“我没事，就是下楼晒晒月亮。”",
        family_concern_shared:
          "女儿林悦请了两天假赶回来。三个人坐在客厅里，气氛不算友好。周桂兰说：“我不去。”林悦红着眼眶：“妈，我不是不要你。”两人同时看向你。",
        assessment_first:
          "评估预约在下周，在此之前，周桂兰对你冷淡了许多。林悦几乎每天都发来消息，语气一次比一次焦急：“如果这期间出事了呢？”医生提醒你，一次评估不等于结论。",
        push_for_facility:
          "林悦联系了一家机构，下周可以去参观。周桂兰把门反锁了，隔着门说：“我不开，你们走吧。”邻居探出头来，欲言又止地看着你。",
        default: "几天过去了，事情有了新的变化。",
      },
      options: [
        {
          id: "n2-a",
          label: "召集老人、子女与医生共同商议，制定一份可调整的居家支持方案",
          description: "引入上门照护、门禁与定位等措施，约定先试行一段时间，到期再一起回看。",
          protects: ["autonomy", "safety", "family_relationship"],
          sacrifices: ["confidentiality"],
          consequences: [
            "各方的顾虑与底线被摆出来，老人保有参与感。",
            "部分措施（如定位、监测）可能被老人感到是一种“被监视”。",
            "方案依赖社区资源与家人的配合，试行期内风险不会消失。",
          ],
          effects: [
            { key: "trust", delta: 6, reason: "她参与了方案制定，而不是被通知结果" },
            { key: "risk_level", delta: -10, reason: "有了具体的居家安全与应急安排" },
            { key: "anger", delta: -5, reason: "不必在“去”与“不去”之间二选一" },
            { key: "dependency", delta: 4, reason: "更多依赖上门照护与家人的参与" },
          ],
          outcomeNarration:
            "方案写在一张纸上：每天固定时间的电话、每周三次的上门、夜间灯具与门铃。周桂兰盯着“试行三个月”几个字，问：“三个月以后，我还能说不吗？”你说，可以一起再商量。",
          branchKey: "joint_plan",
        },
        {
          id: "n2-b",
          label: "支持老人暂时留在家中，并与子女明确告知各自可承担的风险",
          description: "把居家的风险与社区能提供的有限支持如实告知女儿，由家人共同决定是否接受。",
          protects: ["autonomy", "client_best_interest"],
          sacrifices: ["safety", "professional_responsibility"],
          consequences: [
            "老人的生活节奏得以保持，熟悉的环境可能有助于稳定情绪。",
            "若意外发生，家属与站点之间的责任边界可能引发矛盾。",
            "你可能要独自承受“是否太冒险”的持续判断压力。",
          ],
          effects: [
            { key: "trust", delta: 7, reason: "她的选择被坚持到底" },
            { key: "relationship_quality", delta: 6, reason: "你成了她可以倚靠的人" },
            { key: "risk_level", delta: 9, reason: "居家夜间与走失的风险仍无人兜底" },
          ],
          outcomeNarration:
            "林悦在电话那头沉默了很久。“如果真出了事，你们站里……”她没有说完。你说你会把每一次探访都记录下来，也会及时联系她。挂断后，你把这一页笔记反复看了几遍。",
          branchKey: "support_staying",
        },
        {
          id: "n2-c",
          label: "与督导及相关方评估后，推进试住或短期入住",
          description: "与老人说明这只是一段试住或喘息期，保留回家的选择，同时与家人协商安排。",
          protects: ["safety", "professional_responsibility", "family_relationship"],
          sacrifices: ["autonomy"],
          consequences: [
            "夜间与日间都有照看，近期发生意外的可能性可能下降。",
            "“试住”在老人的理解中也许就是“被送走”，她可能对此感到被欺骗。",
            "环境变化对失智老人的影响因人而异，难以预测，且不一定可逆。",
          ],
          effects: [
            { key: "trust", delta: -8, reason: "她可能认为“试住”只是换了一个说法" },
            { key: "fear", delta: 12, reason: "离开熟悉环境本身带来不安" },
            { key: "risk_level", delta: -12, reason: "有了持续的照看" },
            { key: "relationship_quality", delta: -5, reason: "你促成了她不情愿的改变" },
          ],
          outcomeNarration:
            "你们陪周桂兰去看了房间。她摸了摸床单，问：“我的东西能带吗？”工作人员点头。她又问：“那我什么时候回来？”没有人能立刻给出一个让她安心的答案。",
          branchKey: "trial_stay",
        },
        {
          id: "n2-d",
          label: "暂缓决定，先增加探访频次并收集更多信息",
          description: "不急于表态，增加走访与观察，等对她的日常和能力波动有更多了解后再商议。",
          protects: ["client_best_interest", "autonomy"],
          sacrifices: ["safety", "family_relationship"],
          consequences: [
            "你有机会看到她在不同时段的状态，判断可能更贴近事实。",
            "女儿可能感到被拖延，并开始自行寻找其他途径。",
            "观察期内一旦出现意外，“本可以更早行动”的疑问会随之而来。",
          ],
          effects: [
            { key: "trust", delta: 3, reason: "你持续出现，没有急于改变她的生活" },
            { key: "dependency", delta: 6, reason: "她对你的上门探访依赖加深" },
            { key: "risk_level", delta: 6, reason: "拖延期间隐患仍未得到实质处理" },
          ],
          outcomeNarration:
            "接下来的一周，你在不同的时间去敲她的门。有时她热情地招呼你，有时在门口问你“你找谁”。你把这些都一一记了下来，却仍然不知道，该以哪一天的她为准。",
          branchKey: "observe_more",
        },
      ],
    },
  ],
  possible_outcomes: [
    "老人继续居家，并获得一套逐步调整的支持安排",
    "老人在不情愿中入住机构，适应情况因人而异",
    "家人与老人、与站点之间的关系出现裂痕",
    "居家期间发生意外，各方对责任与选择重新产生争议",
  ],
  knowledge_sources: [
    {
      title: "所在地区关于老年人权益保障及监护、照护安排的现行规定（请自行核对具体条文）",
      source: "待核对：法律法规",
      verified: false,
    },
    {
      title: "所在国家/地区社会工作者职业伦理守则中关于自我决定与能力受限服务对象的条款（请自行核对具体条文）",
      source: "待核对：专业伦理守则",
      verified: false,
    },
  ],
  synthetic: true,
  human_in_the_loop_required: true,
  opening_line: "（她把凉了的茶往旁边推了推，抬头打量你。）你来了啊……坐，坐。我先说好，我哪儿也不去。",
  hitl_notice:
    "涉及老人的人身安全与决定能力评估。此为虚构模拟，AI 仅提供反思材料；真实情境中的能力评估与安置决定须由具备资质、承担责任的专业人员在督导下作出。",
  suggested_prompts: ["不着急，您想聊什么都可以。", "我想先听听您自己是怎么想的。", "您平时一天是怎么过的？", "最近有什么事让您觉得不方便吗？"],
  reflection_questions: [
    "当老人今天说得清楚、明天却记不住时，你以哪一时刻的她作为“她的意愿”？为什么？",
    "你的选择中，哪些是基于你看到的事实，哪些是基于你对“失智老人应当怎样生活”的假设？",
    "如果你是林悦，你会希望社工怎样对待你的担忧？如果你是周桂兰呢？两种立场如何影响你的判断？",
    "“安全”究竟该由谁来定义？你能接受多大程度的风险，又是在替谁接受？",
    "如果出现了比预想更坏的结果，你需要得到怎样的支持，才能继续这份工作？",
  ],
  uncertainties: [
    "周桂兰的决定能力并非全有或全无，会随时间、情绪和话题而波动，社工无法单凭一次谈话作出判断。",
    "无法预知入住机构对她是减轻还是加重困惑与孤独，也无法预知继续居家的真实风险概率。",
    "女儿的担忧中，有多少出于对母亲的了解，有多少出于距离与愧疚，案例中的信息并不完整。",
  ],
  topic_replies: [
    { pattern: "女儿|闺女|孩子|儿女|悦", minDisclosure: 40, reply: "（她的手指在膝头收紧又松开）……悦悦打电话来，一句话说三遍。我知道她怕。可她怕，就要把我关进一间不是我的屋子里吗？" },
    { pattern: "女儿|闺女|孩子|儿女|悦", reply: "（她笑了笑，转开视线）……孩子都忙，我不给他们添麻烦。" },
    { pattern: "养老院|机构|入住|搬|住进去", minDisclosure: 35, reply: "（她抬眼看了看墙上的合影）……你看，这是老周和我。他走的时候，这屋子就剩我了。我要是走了，这些东西谁来记得？" },
    { pattern: "养老院|机构|入住|搬|住进去", reply: "（她摆摆手）……我不去，我住得好好的，你们别劝了。" },
    { pattern: "摔|跌|走丢|迷路|走错|走失|膝盖|擦伤", minDisclosure: 45, reply: "（她低头看了看膝盖）……那天，我明明走的是平时那条路，可眼前的楼都不认识了。……那一会儿，我心里是真慌。你别跟我女儿说得太吓人。" },
    { pattern: "摔|跌|走丢|迷路|走错|走失|膝盖|擦伤", reply: "（她拍了拍膝盖）……小事，路上石头多，不小心绊了一下。" },
    { pattern: "记性|忘|糊涂|记不|健忘|纸条", minDisclosure: 40, reply: "（她看向冰箱上的纸条）……我自己写的。有些事不写，转身就没了。……我不爱让人知道，可你都看见了。" },
    { pattern: "记性|忘|糊涂|记不|健忘|纸条", reply: "（她哼了一声）……谁没个忘事的时候，我这是年纪大了。" },
    { pattern: "老伴|老周|先生|丈夫", reply: "（她的目光柔软下来）……他在这屋里待了一辈子。那把藤椅，他最爱坐。我坐在那儿的时候，觉得他也没走远。" },
    { pattern: "邻居|吴|隔壁|朋友", reply: "（她的语气放松了些）……吴阿姨人好，常给我送点吃的。就是话多，什么都往外说。" },
    { pattern: "吃饭|做饭|煮|火|药|吃药", reply: "（她顿了一下）……我自己会做。……药盒是女儿给我分好的，一格一天。有时候我看着那格子，想不起今天到底吃没吃。" },
    { pattern: "怎么样|感觉|心情|还好吗", reply: "（她想了想）……白天还好。到了傍晚，天一暗，屋子就显得特别大。" },
  ],
  initial_client_state: {
    trust: 40,
    fear: 50,
    anger: 25,
    willingness_to_disclose: 30,
    risk_level: 55,
    dependency: 30,
    relationship_quality: 45,
  },
  client_agent: {
    agent_id: "client-zhouguilan",
    role: "client",
    name: "周桂兰",
    personality: ["倔强", "体面", "细致", "对被当成“病人”十分敏感"],
    goals: ["继续住在自己家里", "保有做决定的资格", "让女儿不要为自己过度担心"],
    fears: ["被送走、再也回不了家", "自己渐渐什么都不记得", "成为女儿的负担"],
    values: ["独立", "体面", "与老伴共同生活过的记忆", "家人之间的体谅"],
    background:
      "78 岁，退休小学教师，老伴三年前去世，独自住在四十年的老房子里。近一年来记忆时有波动，会重复提问、偶尔忘记关火，傍晚时尤其容易迷糊；状态好的时候思路清晰、谈吐得体。唯一的女儿在外地工作，每周通话，最近开始频繁催促她搬走。",
    knowledge: {
      knows: ["自己的家和生活习惯", "自己想留在哪里、想怎样生活", "女儿平时对自己的关心", "邻居吴阿姨的作息"],
      does_not_know: [
        "自己认知状况的具体评估结果与发展走向",
        "养老机构日常是怎样运作的，实际与想象有多大差距",
        "女儿内心真正的焦虑与压力有多大",
        "社区能够提供哪些上门支持与其限度",
      ],
    },
    decision_policy:
      "被尊重、被当作有想法的人商量时，会逐步说出害怕与困难；一旦感到被检查、被安排或被劝走，会沉默、岔开话题或强调“我很好”；对“养老院”“检查”等词反应强烈；状态波动时可能重复提问或把时间弄错，此时需要温和对待，而非纠正或质询。",
  },
};
