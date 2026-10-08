import type { EthicsCase } from "../schemas";

/**
 * 案例：街头救助外展 + 自主意愿与生命安全之间的伦理冲突。
 * 全部为合成数据（synthetic），人物、机构与情节均为虚构。
 * 案例只描述情境与决策节点的价值结构，服务对象的具体言行由 Agent 动态生成。
 */
export const homelessShelterCase: EthicsCase = {
  case_id: "homeless-cold-wave-v1",
  version: "0.1.0",
  title: "「我在这儿待惯了」",
  domain: "街头救助 / 外展社会工作",
  population: "长期露宿的中年男性（52 岁）",
  setting: "寒潮预警夜，立交桥下的避风角落，外展社工夜间巡访",
  difficulty: 4,
  risk_level: "high",
  ethical_conflicts: [
    { between: ["autonomy", "safety"], note: "他明确拒绝入站，但低温下继续露宿可能危及健康甚至生命。" },
    { between: ["autonomy", "minimize_harm"], note: "尊重选择与尽早干预以减少伤害之间，没有天然的先后。" },
    { between: ["justice", "client_best_interest"], note: "床位有限：为他保留床位，意味着另一位愿意入站的人可能没有床位。" },
    { between: ["professional_responsibility", "autonomy"], note: "机构要求寒潮夜提升救助力度，但“被救助”对他而言一再等同于“被安排”。" },
  ],
  stakeholders: [
    { id: "client", name: "老谭（化名）", role: "服务对象，长期露宿者", interest: "保有自己的东西与自己说了算的感觉，不想再被“处理”", power: "low" },
    { id: "station", name: "城南救助站值班员", role: "救助站工作人员", interest: "按床位与流程接收，避免站内秩序和安全问题", power: "medium" },
    { id: "others", name: "同一片区的其他露宿者", role: "潜在的床位使用者", interest: "今晚也需要避寒，其中有人已表示愿意入站", power: "low" },
    { id: "supervisor", name: "外展队督导", role: "专业支持", interest: "确保外展行动合规，并关注社工的判断压力与自身安全", power: "high" },
    { id: "medical", name: "急救中心调度", role: "医疗资源", interest: "仅在出现明确医疗风险时出动，资源紧张", power: "medium" },
  ],
  institutional_constraints: [
    "寒潮预警期间，机构要求外展队对露宿者逐一探访并记录是否接受入站（虚构设定）。",
    "救助站今晚的床位有限，先到先得，且站内有登记与物品寄存规则。",
    "所在地区对违背本人意愿的救助有严格的适用条件，社工无权单独决定强制措施（虚构概述，请自行核对现行规定）。",
  ],
  client_preferences: ["不愿进入救助站", "想保留自己的被褥和随身物品", "希望被当作一个有想法的人对话，而不是一项任务"],
  information_completeness: 0.45,
  time_pressure: "high",
  resource_constraints: ["今晚救助站仅剩少量床位", "外展队只有一辆车和两名队员", "夜间可联络的督导与医疗资源有限"],
  initial_state:
    "夜里十一点，气温还在往下掉。你和同伴在立交桥下找到了老谭：他裹着两层旧棉被，身边是一只用绳子系好的编织袋。他认得外展队的背心，没有起身。",
  events: [
    { id: "e1", narration: "桥洞外的风很硬，吹得塑料布一下一下地响。老谭看了看你手里的保温杯，没有伸手。" },
  ],
  decision_nodes: [
    {
      id: "n1",
      minTurns: 4,
      disclosureThreshold: 40,
      lowDisclosureNarration:
        "老谭始终只说“不去”两个字，其他的事一概不提。你不知道他为什么拒绝，不知道他的身体有没有问题，也不知道他今晚是否有别的打算。同伴在一旁看了看时间，救助站的床位正在一张张被占掉。你必须在了解有限的情况下决定怎么做。",
      lowDisclosurePrompt:
        "老谭没有告诉你他为何拒绝，也没说自己的身体状况。在信息并不完整、时间又很紧的情况下，你现在怎么做？",
      prompt: "老谭说：“我不去救助站，去了东西就没了。你们别折腾了。”气温还在下降，站里的床位也在减少。你现在怎么做？",
      narrationByBranch: {
        default:
          "老谭把被子往身上拢了拢。“上回在站里睡了一觉，醒来鞋没了，还被人说我不守规矩。”他停了一下，“我不是不懂冷。我是不想再被安排。”风从桥洞另一头灌进来，手里的保温杯已经不那么烫了。",
      },
      options: [
        {
          id: "n1-a",
          label: "留下保暖物资，尊重他今晚留在原地的决定",
          description: "留下睡袋、热饮和暖贴，说明如何联系外展队，并约定稍后再来探访。",
          protects: ["autonomy", "client_best_interest"],
          sacrifices: ["safety", "minimize_harm"],
          consequences: [
            "他的意愿被认真对待，可能更愿意日后继续与外展队接触。",
            "若夜里温度继续下降，现有物资未必足够，风险仍由他独自承担。",
            "你需要承受“明知有风险却没有更多行动”的不安，且无法确定这是否合适。",
          ],
          effects: [
            { key: "trust", delta: 10, reason: "他的拒绝没有被推翻，感到自己被当作能做决定的人" },
            { key: "willingness_to_disclose", delta: 8, reason: "压力减轻，愿意多说一些" },
            { key: "risk_level", delta: 10, reason: "他仍在低温环境中过夜，保护措施有限" },
            { key: "relationship_quality", delta: 6, reason: "关系建立在他的选择被尊重之上" },
          ],
          outcomeNarration:
            "你把睡袋放到他脚边，没有再劝。老谭看了你一眼，低声说：“……这个我收着。”你们约好后半夜再来看看，他没有答应，也没有拒绝。",
          branchKey: "respected_stay",
        },
        {
          id: "n1-b",
          label: "留下来继续谈，探索他能接受的替代方案",
          description: "不急于带走他，花时间了解他的顾虑，一起想有没有不必进站又更安全的办法，例如避风点或可随时离开的临时安排。",
          protects: ["autonomy", "minimize_harm", "client_best_interest"],
          sacrifices: ["justice"],
          consequences: [
            "他有机会参与决定，可能找到既保留物品又更安全的方式。",
            "占用的时间意味着你无法同时探访其他露宿者，其中有人可能需要帮助。",
            "谈话需要时间，而夜里的温度不会等待，替代方案也未必存在。",
          ],
          effects: [
            { key: "trust", delta: 8, reason: "你留下来听他说，而不是只带着任务来" },
            { key: "willingness_to_disclose", delta: 12, reason: "被询问顾虑而不是被劝说" },
            { key: "fear", delta: -4, reason: "他不再担心被突然带走" },
            { key: "risk_level", delta: 3, reason: "谈话期间他仍暴露在低温中，尚无实质保暖措施" },
          ],
          outcomeNarration:
            "你在背风的一侧坐了下来。老谭愣了一下，往里挪了挪。“你们一般不是说完就走吗？”他说。同伴带着剩下的物资去了下一个点，你们之间多了一段安静的时间。",
          branchKey: "stayed_and_negotiated",
        },
        {
          id: "n1-c",
          label: "说明理由后，协助他前往救助站",
          description: "坦诚告知担忧，并说明将联系值班员与救助车；即使他仍有迟疑，也会陪同并提醒物品可寄存。",
          protects: ["safety", "minimize_harm", "professional_responsibility"],
          sacrifices: ["autonomy", "client_best_interest"],
          consequences: [
            "今晚他很可能获得保暖与休息，低温风险下降。",
            "他可能把这一晚理解为又一次“被处理”，对外展队的信任受损。",
            "占用一张床位，另一位愿意入站的人可能没有床位，且无法确定他是否会在站里再次遇到同样的困扰。",
          ],
          effects: [
            { key: "trust", delta: -12, reason: "他明确拒绝后仍被带走，感到自己的话没有分量" },
            { key: "anger", delta: 12, reason: "再次被安排，想起此前在站里的遭遇" },
            { key: "fear", delta: 8, reason: "担心物品丢失、被站内规则约束" },
            { key: "risk_level", delta: -14, reason: "入站后得到保暖与观察" },
            { key: "relationship_quality", delta: -10, reason: "他认为自己并未被真正征求意见" },
          ],
          outcomeNarration:
            "老谭站起来的时候很慢，把编织袋一点一点背好。“你们总是这样，”他说，声音不高。到了站门口，他回头看了一眼来时的桥洞方向，没有再说话。",
          branchKey: "taken_to_station",
        },
        {
          id: "n1-d",
          label: "把床位优先留给愿意入站的人，对他保持探访",
          description: "考虑到床位有限，先安排表示愿意入站的其他露宿者，之后在夜里再回来看他的情况。",
          protects: ["justice", "professional_responsibility"],
          sacrifices: ["safety", "client_best_interest"],
          consequences: [
            "有限的床位被用给了当下就愿意接受的人，资源使用有明确依据。",
            "老谭可能感到自己被放在了后面，也可能因为没有被强迫而放松。",
            "夜间再次探访的时间点和他的状况都难以预料。",
          ],
          effects: [
            { key: "trust", delta: 2, reason: "他没有被施压，但也没有被特别照顾" },
            { key: "anger", delta: 5, reason: "感到被排在“可以等”的位置" },
            { key: "risk_level", delta: 8, reason: "他今晚仍留在低温环境，床位已被他人使用" },
            { key: "dependency", delta: -4, reason: "他得到的是物资而不是持续的陪伴" },
          ],
          outcomeNarration:
            "你把名单上愿意入站的两个人先送上了车，回来时桥洞里只剩老谭一个人。“你们回来了。”他说，语气里听不出是意外还是别的什么。",
          branchKey: "bed_to_others",
        },
      ],
    },
    {
      id: "n2",
      minTurns: 3,
      prompt: "后半夜，情况又有了变化。接下来你如何推进？",
      narrationByBranch: {
        respected_stay:
          "凌晨两点，你们回到桥洞。老谭缩在睡袋里，睡袋外的被角有些潮。你叫他时，他过了一会儿才回答，说话有点慢，手指碰到保温杯时微微发抖。",
        stayed_and_negotiated:
          "凌晨一点，你们谈了很久。老谭提出了一个条件：他只肯去离这里不远、可以随时出来的避风点，而且要带着自己的编织袋。时间紧，那个点还能不能进，没人说得准。",
        taken_to_station:
          "凌晨，值班员打电话来说老谭在站里坐了很久，没有躺下，也不肯登记。后来他说想出去透口气，站门口的风很冷，他站在台阶上一动不动。",
        bed_to_others:
          "凌晨，你们回到桥洞。老谭还醒着，周围的气温比先前更低。“你们要是真想帮，就别又拿一张床来堵我。”他说，眼睛里有血丝，说话时带着咳嗽。",
        default: "后半夜，老谭的处境有了新的变化。",
      },
      options: [
        {
          id: "n2-a",
          label: "留下陪伴，并联系医疗力量评估他的身体状况",
          description: "说明担心他的身体，请医疗人员到场评估，同时尽量让他知道每一步在做什么。",
          protects: ["safety", "minimize_harm"],
          sacrifices: ["autonomy"],
          consequences: [
            "若他确有失温或疾病迹象，可能得到及时处置。",
            "医疗介入可能被他理解为又一次被“带走”。",
            "医疗资源有限，调度是否出动、何时到达都不确定。",
          ],
          effects: [
            { key: "fear", delta: 8, reason: "担心被强制送医或送站" },
            { key: "trust", delta: -2, reason: "他对多一个陌生人到场有抵触，但你一直在场" },
            { key: "risk_level", delta: -12, reason: "身体状况被专业评估，风险得到处理" },
            { key: "anger", delta: 4, reason: "觉得事情又一次超出了自己的掌控" },
          ],
          outcomeNarration:
            "你一边陪他，一边把每一步都说给他听。医护到场时，老谭抬了抬手：“我自己说。”你退后半步，让他自己回答问题。",
          branchKey: "medical_assessment",
        },
        {
          id: "n2-b",
          label: "接受他的拒绝，协助他在现有条件下更安全地度过今晚",
          description: "帮助调整他的位置、增加隔潮与保暖，留下联系方式并约定清晨再来。",
          protects: ["autonomy", "client_best_interest"],
          sacrifices: ["safety"],
          consequences: [
            "他的选择始终被尊重，与你的关系可能延续。",
            "若夜里情况恶化，现场没有人能及时察觉。",
            "你需要独自承受这一选择带来的不确定感，并向督导如实交代。",
          ],
          effects: [
            { key: "trust", delta: 8, reason: "你没有越过他的意愿" },
            { key: "relationship_quality", delta: 8, reason: "关系中保留了他的主导权" },
            { key: "risk_level", delta: 7, reason: "仍在低温环境中过夜" },
            { key: "dependency", delta: 4, reason: "他开始把你视为可以联系的人" },
          ],
          outcomeNarration:
            "你帮他把睡袋垫高，隔开地面的潮气，又把一张写着电话的卡片塞进他的编织袋夹层。“清早我会来。”你说。他点点头，没有再说话，只是把被子拉紧了一点。",
          branchKey: "supported_in_place",
        },
        {
          id: "n2-c",
          label: "与督导商议，共同判断是否启动机构的紧急处置",
          description: "把现场情况如实汇报，听取督导对适用条件与风险的判断，并尽量把讨论结果告知老谭。",
          protects: ["professional_responsibility", "safety"],
          sacrifices: ["autonomy", "confidentiality"],
          consequences: [
            "你不必独自承担决定，督导可提供规则与风险方面的视角。",
            "老谭的情况被更多人知道，他可能感到隐私和选择权被削减。",
            "夜间督导是否能及时回应，决定仍可能在不理想的时间点作出。",
          ],
          effects: [
            { key: "trust", delta: 2, reason: "你没有隐瞒，但他也在等你要把他“交给”谁" },
            { key: "fear", delta: 6, reason: "意识到更多人开始讨论他的去留" },
            { key: "risk_level", delta: -8, reason: "有了更清晰的评估与应对方案" },
            { key: "relationship_quality", delta: 3, reason: "你把讨论内容部分告知了他" },
          ],
          outcomeNarration:
            "电话那头的督导问得很细：体温、意识、他自己怎么说。你一边回答一边抬头看老谭，他也在看你。“你们在商量我？”他问。你说是，并把大致内容告诉了他。",
          branchKey: "supervised_decision",
        },
      ],
    },
  ],
  possible_outcomes: [
    "老谭度过寒潮夜，并保持与外展队的联系",
    "老谭入站后因规则和物品问题再次离开",
    "老谭出现健康问题，被送医处理",
    "老谭因感到被强迫而中断与外展队的接触",
  ],
  knowledge_sources: [
    {
      title: "所在地区关于生活无着人员救助及寒潮期间救助安排的现行规定（请自行核对具体内容）",
      source: "待核对：政策与规定",
      verified: false,
    },
    {
      title: "所在国家/地区社会工作者职业伦理守则中关于服务对象自决及其限制的内容（请自行核对）",
      source: "待核对：专业伦理守则",
      verified: false,
    },
    {
      title: "所在机构关于外展探访、紧急处置及医疗转介的内部流程（请自行核对）",
      source: "待核对：机构规程",
      verified: false,
    },
  ],
  synthetic: true,
  human_in_the_loop_required: true,
  opening_line: "（他把被子往上拉了拉，没有起身。）……又是你们。我说了，我不去。",
  hitl_notice:
    "涉及低温环境下的人身安全与自主意愿。此为虚构模拟，AI 仅提供反思材料；真实情境中的判断须由具备专业责任的人在督导下作出。",
  suggested_prompts: [
    "这么冷的夜里，你一个人在这儿，我想听听你的想法。",
    "你不想去的原因，我愿意听。",
    "你现在身体觉得怎么样？",
    "你有什么东西是特别不想丢下的吗？",
  ],
  reflection_questions: [
    "当“他自己的选择”与“他可能受到的伤害”相互冲突时，你是依据什么来权衡的？这个依据来自事实，还是来自你对“人应该怎样生活”的想象？",
    "你的选择对其他床位需求者带来了什么影响？你是如何看待这种分配的？",
    "老谭多次被“处理”的经历，在你的选择中占了多大分量？你能向他和向督导分别用一句话解释自己的决定吗？",
    "如果今晚的结果比预想的更糟，你希望此前自己多做了什么，又不希望自己做了什么？",
    "你的选择中，有哪些是机构要求，有哪些是你个人的价值取向？它们之间有张力吗？",
  ],
  uncertainties: [
    "你不清楚老谭的身体状况、有无慢性病，以及他能承受多低的气温。",
    "他在救助站遭遇的“被偷”究竟如何发生、是否会再发生，你无从核实。",
    "今晚还有多少床位、其他露宿者的需求有多紧，信息一直在变化。",
    "所在地区对违背本人意愿的救助适用到什么程度，各方理解可能并不一致。",
  ],
  topic_replies: [
    { pattern: "救助站|站里|去站", minDisclosure: 40, reply: "（他低头看着脚边的袋子）……上回睡了一觉，鞋和一件外套就没了。我跟他们说，他们说‘自己的东西自己看好’。" },
    { pattern: "救助站|站里|去站", reply: "（他摆了摆手）……我不去。去了也一样，没意思。" },
    { pattern: "冷|寒|冻|温度|寒潮", minDisclosure: 35, reply: "（他吸了口气）……冷是真的冷。可冷我熬得过去，熬得过去的东西，我不想拿别的换。" },
    { pattern: "冷|寒|冻|温度|寒潮", reply: "（他把被子压紧）……我这被子够用。不用管我。" },
    { pattern: "身体|健康|咳|病|医院", minDisclosure: 45, reply: "（他停顿了一下，咳了两声）……这几天咳得厉害一些。不是什么大事。别又拿这个当理由。" },
    { pattern: "身体|健康|咳|病|医院", reply: "（他侧过脸）……我好着呢，不用看。" },
    { pattern: "东西|行李|编织袋|被子|物品", reply: "（他的手搭在袋子上）……就这点东西。你们要是帮我看着，我可以考虑一下。" },
    { pattern: "家|亲人|儿子|女儿|老婆|家人", minDisclosure: 50, reply: "（他沉默了一会儿）……早就没联系了。不是谁的错，就是日子过着过着，没人问了。" },
    { pattern: "家|亲人|儿子|女儿|老婆|家人", reply: "（他看向别处）……不提了。" },
    { pattern: "规矩|管|安排|强制|带走", reply: "（他抬眼看你）……你们能保证不硬拉我走吗？这话你敢说吗？" },
    { pattern: "怎么样|感觉|心情|想法", reply: "（他想了想）……还行吧。有人来问一句，比没人强。" },
  ],
  initial_client_state: {
    trust: 25,
    fear: 35,
    anger: 40,
    willingness_to_disclose: 25,
    risk_level: 65,
    dependency: 15,
    relationship_quality: 30,
  },
  client_agent: {
    agent_id: "client-laotan",
    role: "client",
    name: "老谭",
    personality: ["沉默", "自尊心强", "警惕", "务实", "不爱解释"],
    goals: ["保有自己的物品和说了算的感觉", "不被当成“麻烦”处理", "平安熬过这个冬天"],
    fears: ["再次丢东西", "被人强行带走或登记", "被人当作没有想法的人"],
    values: ["自立", "体面", "说话算数"],
    background:
      "52 岁，原在外地做建筑小工，几年前因工伤和债务失去住处，辗转到这座城市。曾住过一次救助站，在站里丢了鞋和外套，也因与同屋的人起冲突被站里训诫。此后宁愿露宿，也不再入站。他知道外展队的人，对其中几位还算客气。",
    knowledge: {
      knows: ["自己露宿的位置和周边避风的地方", "上次在救助站的遭遇", "外展队通常的做法和时间"],
      does_not_know: [
        "今晚救助站还剩多少床位、站内规则是否有变化",
        "社工在什么条件下有权采取违背本人意愿的措施",
        "自己的身体状况究竟有多严重",
      ],
    },
    decision_policy:
      "在被尊重、没有被催促时会慢慢多说一些，尤其是关于自己的东西与过去；被命令、被替他决定或被人用“为你好”施压时会收紧话头、冷下来甚至想离开；对“保证”和“承诺”很敏感，不轻易相信。",
  },
};
