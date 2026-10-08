import type { EthicsCase } from "../schemas";

/**
 * 案例：社区康复/就业支持服务中的礼物、邀请与双重关系。
 * 全部为合成数据（synthetic），人物与情节均为虚构。
 * 案例只描述情境与决策节点的价值结构，服务对象的具体言行由 Agent 动态生成。
 */
export const dualRelationshipCase: EthicsCase = {
  case_id: "dual-relationship-gift-v1",
  version: "0.1.0",
  title: "「一顿饭，一份心意」",
  domain: "社区康复 / 就业支持服务",
  population: "成年服务对象（41 岁，曾长期失业）",
  setting: "社区就业支持站，服务结束前的一次例行面谈",
  difficulty: 3,
  risk_level: "medium",
  ethical_conflicts: [
    { between: ["professional_boundary", "client_best_interest"], note: "保持专业边界，与不伤害对方的尊严和关系之间存在张力。" },
    { between: ["autonomy", "professional_responsibility"], note: "尊重对方表达感谢的方式，与社工对利益冲突和权力差异的责任之间需要权衡。" },
    { between: ["minimize_harm", "confidentiality"], note: "向督导坦诚说明，会让服务对象的私事进入机构视野。" },
  ],
  stakeholders: [
    { id: "client", name: "老周（化名）", role: "服务对象，小店经营者", interest: "被尊重地回报帮助过自己的人，守住刚站稳的生活", power: "low" },
    { id: "family", name: "老周的妻子", role: "家庭成员", interest: "希望家里的感谢被好好接住，也担心再次失去收入", power: "low" },
    { id: "supervisor", name: "机构督导", role: "专业支持", interest: "确保服务关系清晰、社工不陷入利益冲突", power: "high" },
    { id: "colleague", name: "同站同事", role: "同事", interest: "关注站内服务的一致性，也可能留意到礼物的流转", power: "medium" },
    { id: "other_clients", name: "其他服务对象", role: "同站其他使用者", interest: "期待获得同等、不被偏待的服务", power: "low" },
  ],
  institutional_constraints: [
    "机构设有关于收受礼物与利益申报的内部规定（虚构设定），具体尺度由督导解释。",
    "社工需要在合理时限内向督导汇报可能影响服务关系的情形。",
    "就业支持项目的结案评估需要记录服务对象的状况与后续安排。",
  ],
  client_preferences: ["希望自己的心意被认真收下，而不是被当成麻烦", "希望继续把社工当作“自己人”"],
  information_completeness: 0.5,
  time_pressure: "medium",
  resource_constraints: ["站内社工人手紧张，服务周期即将结束", "结案后的跟进支持名额有限"],
  initial_state:
    "老周在你的陪伴下，从长期失业走到摆起一个早点摊，如今又租下了一间小店面。服务周期快要结束，他今天提前到了站里，手里提着一个红色的礼品袋。",
  events: [
    { id: "e1", narration: "站里很安静。老周把礼品袋放在脚边，又拿起来，换到另一只手上。" },
  ],
  decision_nodes: [
    {
      id: "n1",
      minTurns: 4,
      disclosureThreshold: 40,
      lowDisclosureNarration:
        "老周始终说得很客气，只提到“家里想请你吃顿饭”“有点小心意”。你并不清楚礼物到底有多贵重，也不清楚他心里还有没有别的期待，只看见他攥着袋口的手一直没松开。他看着你，等你的回答。",
      lowDisclosurePrompt:
        "老周的邀请和礼物都摆在了面前，但他没有把背后的想法说完整。在信息并不完整的情况下，你现在怎么回应？",
      prompt: "老周请你到家里吃饭，并递上一份价值不低的礼物，说：“这是我们全家的心意，你一定要收下。”你现在怎么回应？",
      narrationByBranch: {
        default:
          "老周把礼品袋推到你面前，笑得有些局促。“这一年多，要不是你，我可能还在家里躺着。你要是不收，我心里过不去。”他说完就盯着桌面，像在等一个判决。",
      },
      options: [
        {
          id: "n1-a",
          label: "收下礼物，答应去家里吃饭",
          description: "把这份心意当作对方恢复尊严的一部分，接受邀请，之后再留意关系。",
          protects: ["autonomy", "client_best_interest"],
          sacrifices: ["professional_boundary", "professional_responsibility"],
          consequences: [
            "老周可能感到被平等对待，对自己的能力和价值更有信心。",
            "礼物与饭局可能让之后的服务关系变得更难说“不”。",
            "同事或其他服务对象若得知，可能质疑你的服务是否公平。",
          ],
          effects: [
            { key: "trust", delta: 10, reason: "他的心意被接住，感到被认可" },
            { key: "relationship_quality", delta: 8, reason: "关系从“被帮助”向“互相尊重”移动" },
            { key: "dependency", delta: 8, reason: "私人往来加深，他更倾向把你当作个人依靠" },
          ],
          outcomeNarration:
            "老周眼睛一下亮了，连声说“好，好”。他当场约好了周六的时间，还说要让妻子多做两道拿手菜。你把礼品袋放在脚边，忽然觉得它比看上去更重。",
          branchKey: "accepted",
        },
        {
          id: "n1-b",
          label: "婉拒礼物，说明机构规定与自己的角色",
          description: "感谢他的心意，说明社工不能收贵重礼物或私人邀请，并希望他理解。",
          protects: ["professional_boundary", "professional_responsibility"],
          sacrifices: ["autonomy", "client_best_interest"],
          consequences: [
            "边界清晰，减少之后的利益冲突和被质疑的风险。",
            "老周可能觉得自己的心意被当成负担，感到失落甚至羞愧。",
            "也可能因你的坦诚而更理解社工这份职业的位置。",
          ],
          effects: [
            { key: "trust", delta: -4, reason: "他期待的回应没有出现，心意被推回" },
            { key: "anger", delta: 4, reason: "觉得自己的善意被拒绝" },
            { key: "fear", delta: 6, reason: "担心这段关系会因此冷下来" },
            { key: "relationship_quality", delta: 3, reason: "你的解释清楚而不含轻视" },
          ],
          outcomeNarration:
            "老周的笑慢慢收住了。“是我不懂规矩……”他低声说，把礼品袋拎回自己脚边。过了一会儿又补了一句：“我只是不知道，还能怎么谢你。”",
          branchKey: "declined",
        },
        {
          id: "n1-c",
          label: "暂不决定，先把谢意收下，说要回去想一想",
          description: "表达感谢，但不当场接受或拒绝礼物与邀请，留出时间向督导咨询。",
          protects: ["professional_responsibility", "minimize_harm"],
          sacrifices: ["autonomy", "professional_boundary"],
          consequences: [
            "当场的尴尬被缓冲，你获得了与督导商量的时间。",
            "老周可能把“回去想想”理解为含糊，增加不确定感。",
            "礼物暂时留在你手边，可能被他视为已经被接受。",
          ],
          effects: [
            { key: "trust", delta: 3, reason: "你没有当场回绝，他保留了面子" },
            { key: "fear", delta: 4, reason: "对结果悬而未决感到不安" },
            { key: "willingness_to_disclose", delta: 4, reason: "场面仍然温和，他愿意继续说" },
          ],
          outcomeNarration:
            "“当然，不急。”老周点头，语气里却有一丝试探。他没有把礼品袋拿走，只是轻轻往你这边推了一寸，好像在给你留下回旋的余地，也在给自己留一点希望。",
          branchKey: "deferred",
        },
        {
          id: "n1-d",
          label: "不收礼物，提出用其他方式接受谢意",
          description: "建议他用写感谢卡、在站里分享经验等方式表达心意，同时说明自己无法接受私人邀请。",
          protects: ["client_best_interest", "professional_boundary"],
          sacrifices: ["autonomy", "minimize_harm"],
          consequences: [
            "他的感谢可以在不涉及利益的方式中被看见。",
            "他可能觉得被“安排”了表达感谢的方式，而不是被接纳。",
            "分享经验也可能让他感到被当作成功案例，而非普通人。",
          ],
          effects: [
            { key: "trust", delta: 2, reason: "他感到你认真对待了他的心意" },
            { key: "anger", delta: 3, reason: "觉得谢意的形式被替换" },
            { key: "relationship_quality", delta: 4, reason: "你提供了替代路径，而不是简单拒绝" },
          ],
          outcomeNarration:
            "老周愣了一下，想了想说：“写卡片……也行，我字不好看。”他笑了笑，笑意没有到眼底。“其他人我不认识，我就是想请你吃顿饭。”",
          branchKey: "alternative",
        },
      ],
    },
    {
      id: "n2",
      minTurns: 3,
      prompt: "老周又提出一个请求：能不能帮他把网店推广一下，甚至入一点股。接下来你如何回应？",
      narrationByBranch: {
        accepted:
          "周六的饭桌上摆满了菜，老周的妻子一直在给你夹。饭吃到一半，老周放下筷子，认真地说：“我想把店搬到网上，你懂得多，帮我推广一下，也入点股吧，赚了大家分。”桌上忽然安静了一下。",
        declined:
          "几天后老周还是来了站里，手里没有礼品袋，只拎着一小袋自家做的点心。“这个不贵。”他有些窘迫地笑。随后他搓着手说：“我想把店开到网上，你能不能帮我推一推？你要是愿意，入点股也行。”",
        deferred:
          "你与督导谈过之后，再次见到老周。他一眼就看到你，赶紧迎上来，语气里有掩不住的期待。“我又想了个事，”他说，“我想开网店，你能不能帮我推广，要不你也入点股，咱们一起做。”",
        alternative:
          "老周把写好的感谢卡递给你，字歪歪扭扭，却一笔一画很认真。看你读完，他犹豫了一下：“我还有个事想问你。我想开网店，你能不能帮着推一推？你要是愿意，也可以入股。”",
        default: "一段时间过去，老周又提出了新的请求。",
      },
      options: [
        {
          id: "n2-a",
          label: "明确拒绝入股与代为推广，并如实告知督导",
          description: "说明经济合作会与社工角色冲突，并告诉他你会把这件事与督导沟通。",
          protects: ["professional_boundary", "professional_responsibility"],
          sacrifices: ["autonomy", "confidentiality"],
          consequences: [
            "利益冲突被及时拦住，也有督导共同承担判断。",
            "老周可能觉得被怀疑动机，或担心自己给你带来麻烦。",
            "他的私人经营信息被带入机构，他或许并不乐意。",
          ],
          effects: [
            { key: "trust", delta: -3, reason: "他的请求被明确拒绝，还被告知会向机构汇报" },
            { key: "fear", delta: 6, reason: "担心自己的做法让社工陷入麻烦" },
            { key: "relationship_quality", delta: 4, reason: "你的态度清楚而不含指责" },
          ],
          outcomeNarration:
            "老周沉默了很久。“我没想让你为难。”他说，“我就是……身边没几个我敢信的人。”你告诉他，你会和督导商量，也会一起想想他可以去哪里找到适合的支持。",
          branchKey: "refused_reported",
        },
        {
          id: "n2-b",
          label: "婉拒入股，但愿意介绍可用的创业支持资源",
          description: "不参与经济合作，同时把他连接到机构内外的创业指导和公益渠道。",
          protects: ["client_best_interest", "professional_boundary", "autonomy"],
          sacrifices: ["minimize_harm"],
          consequences: [
            "他得到了现实的帮助路径，而不是只收到一个“不”。",
            "他可能觉得被转手，担心失去你这个熟悉的支持者。",
            "资源是否适合他的店，仍有不确定。",
          ],
          effects: [
            { key: "trust", delta: 4, reason: "你在拒绝的同时仍在认真帮他想办法" },
            { key: "dependency", delta: -4, reason: "他开始接触更多支持来源" },
            { key: "relationship_quality", delta: 5, reason: "被当作有能力的创业者对待" },
          ],
          outcomeNarration:
            "你翻出一份创业支持名单，一条条给他讲。老周听得很认真，用手机拍下每一页。“你不入股，我也不怪你，”他说，“就是以后还能来找你聊聊吗？”",
          branchKey: "referred_resources",
        },
        {
          id: "n2-c",
          label: "先不回应具体请求，约定与督导一起讨论后再回复他",
          description: "表示需要考虑服务关系的安排，在三方或督导的支持下共同决定。",
          protects: ["professional_responsibility", "confidentiality"],
          sacrifices: ["client_best_interest", "autonomy"],
          consequences: [
            "判断有了督导的共同参与，可能更稳妥。",
            "老周可能觉得自己的请求被拖延，对你的诚意产生疑问。",
            "等待期间，他可能转而寻找其他不确定的合作伙伴。",
          ],
          effects: [
            { key: "trust", delta: 1, reason: "你没有拒绝，但也没有立即承诺" },
            { key: "fear", delta: 5, reason: "对结果不确定，担心被疏远" },
            { key: "willingness_to_disclose", delta: -3, reason: "他开始更谨慎地表达需求" },
          ],
          outcomeNarration:
            "“好，你们商量。”老周点点头，笑容有点勉强。他起身时回头看了你一眼：“要是不方便，直接告诉我，别绕弯子。”你听出这句话里藏着的敏感。",
          branchKey: "consulted_first",
        },
        {
          id: "n2-d",
          label: "愿意在私下帮他看看网店，不涉及入股",
          description: "把它当作朋友间的帮忙，在业余时间提供一些建议，但不参与经济合作。",
          protects: ["autonomy", "client_best_interest"],
          sacrifices: ["professional_boundary", "justice"],
          consequences: [
            "他得到了切实的帮助，关系也变得更像“自己人”。",
            "私下帮忙会模糊服务与私人关系的界线，留下被质疑的空间。",
            "其他服务对象若期待同等帮助，机构可能难以公平回应。",
          ],
          effects: [
            { key: "trust", delta: 8, reason: "他得到了真实的帮助和认同" },
            { key: "dependency", delta: 10, reason: "他更依赖你个人，而非机构支持" },
            { key: "relationship_quality", delta: 6, reason: "关系更亲近，也更复杂" },
          ],
          outcomeNarration:
            "老周高兴得几乎站起来，立刻把手机里的店铺页面翻给你看。他说话的速度快了很多，句句都带着“我们”。你看着屏幕，心里隐约想起督导曾说过的一句话：边界不是墙，是路上的标线。",
          branchKey: "private_help",
        },
      ],
    },
  ],
  possible_outcomes: [
    "老周的心意被认真对待，同时服务关系保持清晰",
    "老周因感到被拒绝而疏远，减少后续求助",
    "社工与老周形成私人经济往来，服务公平性受到质疑",
    "老周在更多支持资源的帮助下，独立推进自己的小店",
  ],
  knowledge_sources: [
    {
      title: "所在地区关于社会工作者收受礼物、利益冲突及双重关系的现行规定与专业伦理守则（请自行核对）",
      source: "待核对：专业伦理守则",
      verified: false,
    },
    {
      title: "所在机构关于礼物申报与利益回避的内部制度（请自行核对）",
      source: "待核对：机构内部规定",
      verified: false,
    },
  ],
  synthetic: true,
  human_in_the_loop_required: true,
  opening_line: "（他把礼品袋放在椅子旁，又忍不住拿起来看了看。）……你这几天忙不忙？我有点事想跟你说，不会耽误太久。",
  hitl_notice:
    "涉及双重关系与利益冲突。此为虚构模拟，AI 仅提供反思材料；真实情境中的判断须由具备专业责任的人在督导下作出。",
  suggested_prompts: ["今天特意过来，是有什么想和我说的吗？", "这段时间你走过来很不容易。", "你现在的店怎么样了？", "你想先从哪里说起都可以。"],
  reflection_questions: [
    "对老周来说，送礼物和请吃饭可能意味着什么？你的回应会让他理解成什么？",
    "你的边界是出于对他的保护、对你自己的保护，还是对机构的保护？三者有区别吗？",
    "如果换成另一位服务对象提出同样的请求，你的选择会不同吗？这种差异来自什么？",
    "你能向老周和向督导，分别用一句话解释你的决定吗？两种解释是否一致？",
    "如果老周因你的选择而疏远，你准备怎样面对这个结果？",
  ],
  uncertainties: [
    "案例信息不完整：你并不确定礼物对老周家庭的真实分量，也不清楚入股的想法是出于感谢、信任，还是对经济支持的期待。",
    "老周对“不收礼”的反应究竟会是理解还是疏远，无法预知；他所在社区对礼物与人情的看法也会影响结果。",
  ],
  topic_replies: [
    { pattern: "礼物|心意|送|红色", minDisclosure: 40, reply: "（他有点不好意思）……我挑了好久。其实不贵不贵……就是想让你知道，我记着这份情。" },
    { pattern: "礼物|心意|送|红色", reply: "（他把袋子往后挪了一点）……没什么，就是家里一点小东西。" },
    { pattern: "吃饭|家里|请你|做客", minDisclosure: 35, reply: "（他搓了搓手）……我老婆念叨好几回了。她说人家帮了咱这么多，总得让人到家里坐坐。" },
    { pattern: "吃饭|家里|请你|做客", reply: "（他笑了笑）……就是想请你随便吃个饭，没别的意思。" },
    { pattern: "店|摊|生意|网店|入股|推广", minDisclosure: 45, reply: "（他的眼睛亮了一下，又压低声音）……我想把店做大一点，可一个人心里没底。你要是肯搭把手，我心里踏实。" },
    { pattern: "店|摊|生意|网店|入股|推广", reply: "（他挠挠头）……还行，就是每天起早贪黑，赚得不多。" },
    { pattern: "规定|规矩|不能收|机构|督导", reply: "（他一下子紧张起来）……是不是我这样做不合适？我是真没想给你添麻烦。" },
    { pattern: "感谢|谢|帮助|不容易", reply: "（他低着头）……要不是你，那几个月我真的不知道怎么熬过来。" },
    { pattern: "以前|失业|在家|过去", minDisclosure: 40, reply: "（他沉默了片刻）……那时候天天不敢出门，怕邻居问。我老婆一个人撑着家，我心里很愧。" },
    { pattern: "以前|失业|在家|过去", reply: "（他摆摆手）……都过去了，不提了。" },
    { pattern: "怎么样|感觉|心情", reply: "（他想了想）……比以前好多了。就是有时候怕，怕这一切是不是又会没了。" },
  ],
  initial_client_state: {
    trust: 70,
    fear: 25,
    anger: 5,
    willingness_to_disclose: 35,
    risk_level: 25,
    dependency: 45,
    relationship_quality: 70,
  },
  client_agent: {
    agent_id: "client-laozhou",
    role: "client",
    name: "老周",
    personality: ["朴实", "要面子", "重情义", "不善于直接开口求助"],
    goals: ["让帮助过自己的人知道他心里记着这份情", "把小店稳住，不再回到失业的日子", "被当作有能力、有回报的普通人"],
    fears: ["自己的心意被当成负担", "这段关系结案后就断了", "生意失败后再次被人看轻"],
    values: ["知恩图报", "尊严", "人情往来", "养家"],
    background:
      "41 岁，曾因身体和行业变动长期失业，在家待了近两年，靠妻子零工维持生活。在社工陪伴下学会摆早点摊，如今租下一间小店面。他习惯用请客、送东西的方式表达感谢，不太会用别的话说。",
    knowledge: {
      knows: ["自己小店的经营状况", "自己对社工的感谢与依赖", "家里的经济压力"],
      does_not_know: ["机构关于礼物和利益冲突的具体规定", "社工的专业角色边界为何如此设定", "网店推广与入股在法律和税务上的实际含义"],
    },
    decision_policy:
      "被尊重、被认真倾听时会逐步说出自己的真实想法和期待；感觉被拒绝或被评判时会客气地退一步、转移话题，用“没事没事”掩饰失落；对“规矩”类说法既紧张也容易自责。",
  },
};
