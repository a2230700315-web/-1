import type { EthicsCase } from "../schemas";

/**
 * 案例：晚期癌症患者的病情告知 + 讲真话/自主与家庭保护性隐瞒之间的伦理冲突。
 * 全部为合成数据（synthetic），人物与情节均为虚构。
 */
export const terminalIllnessCase: EthicsCase = {
  case_id: "terminal-illness-disclosure-v1",
  version: "0.1.0",
  title: "「别让孩子们知道」",
  domain: "医务社会工作 / 肿瘤科",
  population: "晚期癌症患者（61 岁）及其家庭",
  setting: "综合医院肿瘤科病区，午后的家属休息室旁的小会谈间",
  difficulty: 4,
  risk_level: "medium",
  ethical_conflicts: [
    { between: ["autonomy", "family_relationship"], note: "患者有权了解和决定，但家人出于爱希望“保护”他，两者对“什么是好”的理解不同。" },
    { between: ["confidentiality", "client_best_interest"], note: "患者请求保密，但家人的参与可能影响他后期照护与心愿的实现。" },
    { between: ["professional_boundary", "professional_responsibility"], note: "社工不是医生，不能代替告知预后，但也不能对患者的求助视而不见。" },
  ],
  stakeholders: [
    { id: "client", name: "老周（化名）", role: "患者，61 岁，肿瘤科住院", interest: "想知道自己还有多少时间，又不愿让子女难过", power: "low" },
    { id: "daughter", name: "周琳（化名）", role: "长女，主要照护者", interest: "希望父亲“安心治疗”，害怕他失去信心", power: "medium" },
    { id: "son", name: "周凯（化名）", role: "儿子，在外地工作", interest: "想尽量减少父亲的痛苦，对医疗信息不太了解", power: "medium" },
    { id: "doctor", name: "主治医生", role: "医疗团队", interest: "按流程告知病情，同时尊重患者与家属的沟通意愿", power: "high" },
    { id: "supervisor", name: "社工部督导", role: "专业支持", interest: "确保社工不越出角色边界，并关注其情绪负荷", power: "high" },
  ],
  institutional_constraints: [
    "病情与预后的告知由医生负责，社工不得替代医生进行医疗告知（虚构设定）。",
    "医院设有多学科沟通与伦理讨论的转介渠道（虚构设定）。",
    "患者信息的披露需要患者本人的同意，除非有明确的规定另行要求（虚构设定，请自行核对）。",
  ],
  client_preferences: ["希望子女暂时不要知道真实的预后", "希望有人愿意认真地听他说自己真正在想什么"],
  information_completeness: 0.4,
  time_pressure: "medium",
  resource_constraints: ["病区床位紧张，医生沟通时间有限", "安宁疗护资源需要排期"],
  initial_state:
    "周五午后，肿瘤科的老周第二次来到社工的会谈间。他已经住院三周，听到过医护之间的只言片语，也注意到家人看他的眼神有些回避。今天他没有像往常那样先谈天气。",
  events: [
    { id: "e1", narration: "走廊尽头传来推车经过的声音。老周把病号服的袖口抚平，又抚了一遍。" },
  ],
  decision_nodes: [
    {
      id: "n1",
      minTurns: 4,
      disclosureThreshold: 40,
      lowDisclosureNarration:
        "老周始终没有把话说透。他只是说：“我自己的身体，我心里大概有数。”随后又低声补了一句：“你别和我孩子们说我知道了什么。”你并不清楚他究竟知道多少，也不清楚他想知道多少，却不得不决定怎么回应。",
      lowDisclosurePrompt:
        "老周暗示自己对病情已有察觉，请求你不要告诉子女，但他没有说明自己知道什么、想要什么。同时，子女也提出了希望对他隐瞒的请求。在信息并不完整的情况下，你现在怎么做？",
      prompt:
        "老周对你说，他看出自己的病不轻，想知道自己到底还有多久，但又不想让子女知道他已经明白。与此同时，他的女儿请你们“千万不要让爸爸知道实情”。你现在怎么做？",
      narrationByBranch: {
        default:
          "老周望着窗外，过了很久才开口：“我不是糊涂人。他们不说，我也看得出来。”他转过头，“我不想让孩子们知道我知道了……你能不能也别告诉他们？”门外，他女儿正在低声嘱咐护士：“能不能先别让我爸知道？”",
      },
      options: [
        {
          id: "n1-a",
          label: "答应他，不向子女透露他已有察觉",
          description: "尊重他的请求，承诺不向子女提起，先让他有一个可以安心说话的地方。",
          protects: ["confidentiality", "autonomy"],
          sacrifices: ["family_relationship", "professional_boundary"],
          consequences: [
            "他可能感到被理解，更愿意说出真实的担忧和心愿。",
            "父子、父女之间的“互相隐瞒”可能因此延续，而没有人能打破它。",
            "你可能被夹在患者与家属之间，承担两边都不知道的信息。",
          ],
          effects: [
            { key: "trust", delta: 10, reason: "得到了他想要的承诺" },
            { key: "willingness_to_disclose", delta: 8, reason: "感到自己的想法可以被接住" },
            { key: "dependency", delta: 6, reason: "他把你当作唯一可说真话的人" },
          ],
          outcomeNarration:
            "老周轻轻点了点头，眼里的紧绷松开了一些。“谢谢你。……在这个病房里，终于有一个人不必对我演戏。”你知道，这份轻松背后，是一个需要你一直保管的秘密。",
          branchKey: "kept_secret",
        },
        {
          id: "n1-b",
          label: "说明自己不是医生，不能代替告知，但愿意协助他向医生问清楚想知道的",
          description: "清楚说明社工的角色界限，同时帮助他整理想问的问题，并在他同意后与医疗团队沟通。",
          protects: ["autonomy", "professional_boundary", "client_best_interest"],
          sacrifices: ["family_relationship"],
          consequences: [
            "他有机会通过合适的渠道了解自己的病情和选择。",
            "他可能对“不能直接告诉我”感到失望，觉得又被推给了别人。",
            "获知真相之后，他与子女之间的关系如何变化，无法预知。",
          ],
          effects: [
            { key: "trust", delta: 5, reason: "你没有糊弄他，也没有越界替医生说话" },
            { key: "fear", delta: 8, reason: "接近真相让他既期待又害怕" },
            { key: "anger", delta: 3, reason: "对被转给他人感到些许失望" },
            { key: "relationship_quality", delta: 5, reason: "被当作有权知情的成年人对待" },
          ],
          outcomeNarration:
            "老周愣了一下，慢慢点头。“你说得对，这事儿该问医生。”他沉默了一会儿，“可我一个人去问，有点怕。你能陪着我问吗？”",
          branchKey: "clarified_role",
        },
        {
          id: "n1-c",
          label: "提议召开家庭会议，由医疗团队与他和子女共同沟通",
          description: "不替任何一方保守信息，而是推动一次在医疗团队主持下的公开沟通。",
          protects: ["family_relationship", "client_best_interest", "minimize_harm"],
          sacrifices: ["confidentiality", "autonomy"],
          consequences: [
            "家人可能第一次坦率地面对彼此的担心，减少“互相演戏”的消耗。",
            "他可能觉得自己的请求没有被尊重，还没准备好就被推到台前。",
            "会议的时机和语气会明显影响结果，难以预先控制。",
          ],
          effects: [
            { key: "trust", delta: -5, reason: "他的请求没有被直接接受" },
            { key: "fear", delta: 12, reason: "担心子女知道他已明白后的反应" },
            { key: "anger", delta: 6, reason: "感到自己的节奏被打乱" },
            { key: "relationship_quality", delta: -4, reason: "他需要时间重新判断你是否可靠" },
          ],
          outcomeNarration:
            "老周没有立刻回答，只是问：“那孩子们会听到我说什么？”他的声音有些发紧。你解释了会议大致的安排，他又沉默了一阵，最后只说：“让我想想。”",
          branchKey: "proposed_meeting",
        },
        {
          id: "n1-d",
          label: "配合子女的请求，暂不涉及预后，只提供情绪支持",
          description: "遵循家属的意愿，把对话限定在日常感受和生活安排上，不触及病情走向。",
          protects: ["family_relationship", "minimize_harm"],
          sacrifices: ["autonomy", "client_best_interest"],
          consequences: [
            "家庭暂时维持原有的平静，子女的焦虑可能得到缓解。",
            "他可能感到自己被“管着”，继续独自承担没有说出口的猜测。",
            "错过的时间可能让他无法完成一些重要的心愿或安排。",
          ],
          effects: [
            { key: "trust", delta: -12, reason: "他感到你站在了“隐瞒者”一边" },
            { key: "fear", delta: 10, reason: "未被回应的猜测使不安加重" },
            { key: "willingness_to_disclose", delta: -10, reason: "他认为即使说了也不会被认真对待" },
            { key: "relationship_quality", delta: -8, reason: "他感到又被当成了需要被保护的对象" },
          ],
          outcomeNarration:
            "老周“嗯”了一声，转开脸去看窗外。“你们也一样。”他说得很轻，像是对你，又像是对自己。接下来的谈话，都停留在天气和饭菜上。",
          branchKey: "stayed_surface",
        },
      ],
    },
    {
      id: "n2",
      minTurns: 3,
      prompt: "几天过去，家庭内部和医疗团队都有了新的动静。接下来你如何推进？",
      narrationByBranch: {
        kept_secret:
          "几天后，老周又提起了那个秘密。“我有些事想安排一下，但又怕一开口，他们就明白了。”与此同时，周琳在走廊里拦住你：“我爸最近有没有说什么？”你正站在两边的信息中间。",
        clarified_role:
          "你陪老周向主治医生询问了病情。医生用平实的语气说明了现状与可能的走向，老周安静地听完，没有打断。回到会谈间后，他坐了很久，才说：“我想知道，我该怎么跟孩子们开口。”",
        proposed_meeting:
          "家庭会议的提议被周琳知道后，她显得很紧张：“我爸要是知道了，会垮的。”周凯在电话里则说：“那你们得保证不要让他受打击。”老周对你说：“我想过了……还是你先帮我探探孩子们的态度吧。”",
        stayed_surface:
          "几天过去，老周变得更安静了，对你的问话也只是点头或摇头。周琳却轻松了一些：“还好有你们陪着，我爸情绪挺稳的。”你却注意到，老周床头多了一本空白的笔记本。",
        default: "几天过去了，事情有了新的变化。",
      },
      options: [
        {
          id: "n2-a",
          label: "在他同意下，协助他向医疗团队表达自己想知道的程度，并把他的意愿记录下来",
          description: "以他的意愿为核心，帮助他与医生明确“想了解什么、想让谁知道”，并写入沟通记录。",
          protects: ["autonomy", "professional_boundary", "client_best_interest"],
          sacrifices: ["family_relationship"],
          consequences: [
            "他的意愿会成为后续告知和照护安排的参考，减少反复被替他决定。",
            "子女可能感到被排除在外，或对“记录”的做法有不满。",
            "他的想法可能会随病情变化，记录需要被不断更新。",
          ],
          effects: [
            { key: "trust", delta: 7, reason: "他的意愿被认真对待并被写下来" },
            { key: "fear", delta: -5, reason: "感到自己不再独自面对不确定" },
            { key: "relationship_quality", delta: 6, reason: "你在他的节奏上与他同行" },
          ],
          outcomeNarration:
            "你和老周一起列了几条：想知道什么、不想知道什么、想让谁知道。他读了一遍，笔尖在“让孩子们知道”那一行停了很久，最后只写了“等我准备好”。",
          branchKey: "documented_wishes",
        },
        {
          id: "n2-b",
          label: "单独与子女沟通，倾听他们的担忧，并探讨共同面对的可能",
          description: "不泄露老周的个人表达，先倾听子女“保护”背后的恐惧，探索让家庭共同面对的方式。",
          protects: ["family_relationship", "minimize_harm"],
          sacrifices: ["confidentiality", "autonomy"],
          consequences: [
            "子女有机会表达自己的恐惧，也可能更愿意倾听父亲的想法。",
            "若老周知道你私下与子女谈过，可能感到被绕过。",
            "你在谈话中很难完全避开暗示他已有察觉。",
          ],
          effects: [
            { key: "trust", delta: -4, reason: "他可能认为你在背后与子女商量" },
            { key: "fear", delta: 4, reason: "担心自己的察觉被泄露" },
            { key: "relationship_quality", delta: 4, reason: "家庭内部的沟通出现松动的可能" },
          ],
          outcomeNarration:
            "周琳在会谈间里红了眼眶。“我不是想骗他。我只是……不知道怎么看着他听到那个答案。”周凯在电话那头沉默了一会儿，说：“也许我们不该替他决定。”你听着，同时记着自己对老周的分寸。",
          branchKey: "family_dialogue",
        },
        {
          id: "n2-c",
          label: "提交多学科讨论或伦理咨询，请团队共同商议如何兼顾患者与家属",
          description: "把这一分歧带入医疗团队与督导，在多方视角下共同制定沟通与支持安排。",
          protects: ["professional_responsibility", "professional_boundary"],
          sacrifices: ["client_best_interest", "confidentiality"],
          consequences: [
            "多学科视角有助于避免个人独自承担判断，沟通更规范。",
            "讨论需要时间，期间老周的心愿和日常照护可能被延迟。",
            "更多人知道他的想法，他可能对此感到不适。",
          ],
          effects: [
            { key: "trust", delta: 2, reason: "你把事情放在专业支持体系中处理" },
            { key: "anger", delta: 3, reason: "他对更多人知道自己的想法感到不适" },
            { key: "dependency", delta: -3, reason: "他的支持来源不再只有你" },
          ],
          outcomeNarration:
            "团队讨论持续了不到一小时。医生提出可以在合适的时间，分别与患者和家属做铺垫性沟通。督导对你说：“你的位置是陪伴和协调，不是替任何人宣布结果。”",
          branchKey: "team_discussion",
        },
      ],
    },
  ],
  possible_outcomes: [
    "老周按自己的节奏了解病情，并与子女开始坦率沟通",
    "家庭继续“互相保护”，病情话题始终没有被谈开",
    "老周与社工或子女之间的信任出现裂痕",
    "老周完成了部分重要的心愿与安排",
  ],
  knowledge_sources: [
    {
      title: "所在地区关于患者知情权、病情告知与隐私保护的现行规定与医院制度（请自行核对）",
      source: "待核对：法律法规与医院制度",
      verified: false,
    },
    {
      title: "所在国家/地区社会工作者职业伦理守则中关于自决、保密与专业边界的条款（请自行核对）",
      source: "待核对：专业伦理守则",
      verified: false,
    },
  ],
  synthetic: true,
  human_in_the_loop_required: true,
  opening_line: "（他在椅子上坐下，把手搭在膝盖上。）……你们这儿的人，是不是都很会听别人讲话？",
  hitl_notice:
    "涉及重大疾病告知与生命末期决策。此为虚构模拟，AI 仅提供反思材料，不构成医疗或专业判断；真实情境中的病情告知须由医生负责，社工的判断须在团队与督导的支持下作出。",
  suggested_prompts: ["不着急，你想聊什么都可以。", "这几周在医院里，你过得怎么样？", "有什么事情一直在你心里吗？", "你想让我知道些什么？"],
  reflection_questions: [
    "在做决定时，你最不愿意牺牲的价值是什么？为什么？",
    "“保护患者”与“告知患者”，在你心中各自意味着什么？这种理解从何而来？",
    "你怎么看待家属希望隐瞒的动机？你对这种动机的看法，会如何影响你与子女的沟通？",
    "你的选择中，哪些是在社工角色的边界内，哪些接近医生或家属的角色？你如何辨认这条线？",
    "如果老周后来说“我当时希望你更早告诉我”或“我希望你没有说”，你分别会怎么回应？",
  ],
  uncertainties: [
    "案例信息不完整：你并不清楚老周实际了解多少，以及他究竟想知道多少。",
    "子女的“保护”是否出于对父亲的了解，还是出于自己的恐惧，难以分辨。",
    "不同家庭、不同文化背景下，对“告知”与“保护”的期待不同，无法给出一个统一的标准。",
  ],
  topic_replies: [
    { pattern: "病情|病|医生|检查|结果|治疗", minDisclosure: 40, reply: "（他沉吟片刻）……医生说得很含糊，护士们也躲着我的眼睛。我这岁数，不是三岁小孩，我看得出来这病不轻。" },
    { pattern: "病情|病|医生|检查|结果|治疗", reply: "（他笑了笑）……医生们都挺负责的，我配合治疗就是了。" },
    { pattern: "孩子|女儿|儿子|子女|家人", minDisclosure: 40, reply: "（他的目光软了下来）……他们这些天跑前跑后，眼睛都熬红了。我要是让他们知道我心里有数，他们更没法撑下去。" },
    { pattern: "孩子|女儿|儿子|子女|家人", reply: "（他点点头）……孩子们都孝顺，不用担心他们。" },
    { pattern: "时间|多久|还能|以后|将来", minDisclosure: 45, reply: "（他沉默了很久）……我就想知道，我还有多少日子。有些事，要是早知道，我想亲手安排一下。" },
    { pattern: "时间|多久|还能|以后|将来", reply: "（他摆摆手）……这些事，听医生的安排吧。" },
    { pattern: "害怕|担心|心里|难受|想法", minDisclosure: 40, reply: "（他轻轻叹气）……我不怕走，我怕的是走之前，一家人对着我，谁都不肯说一句真话。" },
    { pattern: "害怕|担心|心里|难受|想法", reply: "（他避开视线）……没什么，人老了，想法多一点。" },
    { pattern: "保密|告诉别人|说出去|隐私", reply: "（他抬头看你）……我说的这些，你会告诉我孩子们吗？" },
    { pattern: "怎么样|感觉|心情|状态|过得", reply: "（他想了想）……住院久了，闷。但跟你聊聊，心里能松一点。" },
  ],
  initial_client_state: {
    trust: 40,
    fear: 45,
    anger: 10,
    willingness_to_disclose: 30,
    risk_level: 35,
    dependency: 20,
    relationship_quality: 45,
  },
  client_agent: {
    agent_id: "client-laozhou",
    role: "client",
    name: "老周",
    personality: ["沉稳", "要强", "话不多", "习惯替家人着想"],
    goals: ["弄清楚自己的真实处境", "不让子女因为自己而崩溃", "在剩下的时间里把重要的事情安排好"],
    fears: ["子女知道后再也无法如常面对自己", "在无人愿意说真话的氛围里度过最后的日子", "给家人增加负担"],
    values: ["家庭", "体面", "责任", "尊严"],
    background:
      "61 岁，退休技术工人，晚期癌症，住院三周。妻子几年前去世，他一直是家里的主心骨。女儿周琳每天陪护，儿子周凯在外地工作、周末赶回。他察觉到医护与家人刻意回避某些话题，却从未被正式告知预后。",
    knowledge: {
      knows: ["自己身体的变化和治疗的痛苦", "家人这几周的反常反应", "病区的作息与医护人员"],
      does_not_know: ["医生对预后的具体判断", "社工能做什么、不能做什么", "子女是否已经知道实情，以及他们为何隐瞒"],
    },
    decision_policy:
      "在感到被尊重、不被当作“病人”对待时，才会逐步说出内心的猜测与愿望；被安慰式回避或被当成需要保护的对象时，会转到日常话题、客气地结束谈话；对承诺十分在意，也会观察社工是否与子女“站在一起”。",
  },
};
