// OFFICIAL SGK GLOBAL SUCCESS UNITS & DYNAMIC GRAMMAR MAPPING FOR GRADES 6, 7, 8, 9

export const GRADE_UNITS_MAP = {
  6: [
    { value: 'unit1', label: 'Unit 1: My new school (Trường học mới)' },
    { value: 'unit2', label: 'Unit 2: My house (Ngôi nhà của tôi)' },
    { value: 'unit3', label: 'Unit 3: My friends (Bạn bè của tôi)' },
    { value: 'unit4', label: 'Unit 4: My neighbourhood (Khu phố của tôi)' },
    { value: 'unit5', label: 'Unit 5: Natural wonders of Viet Nam (Kỳ quan thiên nhiên Việt Nam)' },
    { value: 'unit6', label: 'Unit 6: Our Tet holiday (Ngày Tết của chúng tôi)' },
    { value: 'unit7', label: 'Unit 7: Television (Truyền hình)' },
    { value: 'unit8', label: 'Unit 8: Sports and games (Thể thao và trò chơi)' },
    { value: 'unit9', label: 'Unit 9: Cities of the world (Các thành phố trên thế giới)' },
    { value: 'unit10', label: 'Unit 10: Our houses in the future (Nhà của chúng ta trong tương lai)' },
    { value: 'unit11', label: 'Unit 11: Our greener world (Thế giới xanh hơn của chúng ta)' },
    { value: 'unit12', label: 'Unit 12: Robots (Người máy)' }
  ],
  7: [
    { value: 'unit1', label: 'Unit 1: Hobbies (Sở thích)' },
    { value: 'unit2', label: 'Unit 2: Healthy living (Sống khỏe mạnh)' },
    { value: 'unit3', label: 'Unit 3: Community service (Phục vụ cộng đồng)' },
    { value: 'unit4', label: 'Unit 4: Music and arts (Âm nhạc và nghệ thuật)' },
    { value: 'unit5', label: 'Unit 5: Food and drink (Thực phẩm và đồ uống)' },
    { value: 'unit6', label: 'Unit 6: A visit to School (Thăm trường học)' },
    { value: 'unit7', label: 'Unit 7: Traffic (Giao thông)' },
    { value: 'unit8', label: 'Unit 8: Films (Phim ảnh)' },
    { value: 'unit9', label: 'Unit 9: Festivals around the world (Lễ hội trên thế giới)' },
    { value: 'unit10', label: 'Unit 10: Energy sources (Nguồn năng lượng)' },
    { value: 'unit11', label: 'Unit 11: Travelling in the future (Du lịch trong tương lai)' },
    { value: 'unit12', label: 'Unit 12: An English-speaking country (Các nước nói tiếng Anh)' }
  ],
  8: [
    { value: 'unit1', label: 'Unit 1: Leisure time (Thời gian rảnh rỗi)' },
    { value: 'unit2', label: 'Unit 2: Life in the countryside (Cuộc sống ở nông thôn)' },
    { value: 'unit3', label: 'Unit 3: Teenagers (Lứa tuổi thanh thiếu niên)' },
    { value: 'unit4', label: 'Unit 4: Ethnic groups of Viet Nam (Các dân tộc Việt Nam)' },
    { value: 'unit5', label: 'Unit 5: Our customs and traditions (Phong tục và truyền thống)' },
    { value: 'unit6', label: 'Unit 6: Lifestyles (Lối sống)' },
    { value: 'unit7', label: 'Unit 7: Environmental protection (Bảo vệ môi trường)' },
    { value: 'unit8', label: 'Unit 8: Shopping (Mua sắm)' },
    { value: 'unit9', label: 'Unit 9: Natural disasters (Thiên tai)' },
    { value: 'unit10', label: 'Unit 10: Communication in the future (Giao tiếp trong tương lai)' },
    { value: 'unit11', label: 'Unit 11: Science and technology (Khoa học và công nghệ)' },
    { value: 'unit12', label: 'Unit 12: Life on other planets (Sự sống trên các hành tinh)' }
  ],
  9: [
    { value: 'unit1', label: 'Unit 1: Local community (Cộng đồng địa phương)' },
    { value: 'unit2', label: 'Unit 2: City life (Cuộc sống thành thị)' },
    { value: 'unit3', label: 'Unit 3: Healthy living for teens (Sống khỏe cho tuổi teen)' },
    { value: 'unit4', label: 'Unit 4: Remembering the past (Nhớ về quá khứ)' },
    { value: 'unit5', label: 'Unit 5: Our experiences (Trải nghiệm của chúng ta)' },
    { value: 'unit6', label: 'Unit 6: Viet Nam: Then and now (Việt Nam: Xưa và nay)' },
    { value: 'unit7', label: 'Unit 7: Natural wonders of the world (Kỳ quan thiên nhiên)' },
    { value: 'unit8', label: 'Unit 8: Tourism (Du lịch)' },
    { value: 'unit9', label: 'Unit 9: World Englishes (Tiếng Anh thế giới)' },
    { value: 'unit10', label: 'Unit 10: Planet Earth (Hành tinh Trái Đất)' },
    { value: 'unit11', label: 'Unit 11: Electronic devices (Thiết bị điện tử)' },
    { value: 'unit12', label: 'Unit 12: Career paths (Con đường nghề nghiệp)' }
  ]
};

// DYNAMIC AI GRAMMAR TOPICS MAP PER GRADE & UNIT
export const UNIT_GRAMMAR_MAP = {
  6: {
    unit1: ['Present simple (Thì hiện tại đơn)', 'Adverbs of frequency (Trạng từ chỉ tần suất)'],
    unit2: ['Possessive nouns (Sở hữu cách)', 'Prepositions of place (Giới từ chỉ vị trí)'],
    unit3: ['Present continuous for future (Hiện tại tiếp diễn)', 'Adjectives of personality'],
    unit4: ['Comparative adjectives (So sánh hơn của tính từ ngắn và dài)'],
    unit5: ['Countable & Uncountable nouns (Danh từ đếm được/không đếm được)', 'Modal verb Must/Mustn\'t'],
    unit6: ['Modal verb Should/Shouldn\'t for advice', 'Some & Any for quantities'],
    unit7: ['Wh-questions (Từ hỏi Wh-)', 'Conjunctions: and, but, so, because'],
    unit8: ['Past simple (Thì quá khứ đơn)', 'Imperatives (Câu mệnh lệnh)'],
    unit9: ['Possessive pronouns (Đại từ sở hữu)', 'Superlative adjectives (So sánh nhất)'],
    unit10: ['Future simple with Will/Won\'t', 'Might for possibility'],
    unit11: ['Articles: a, an, the', 'First conditional (Câu điều kiện loại 1)'],
    unit12: ['Superlative adjectives of short/long adjectives', 'Will be able to for future ability']
  },
  7: {
    unit1: ['Present simple vs Present continuous', 'Verbs of liking + V-ing'],
    unit2: ['Simple sentences & Coordination (and, or, but, so)', 'Imperatives with More/Less'],
    unit3: ['Past simple vs Present perfect', 'Phrasal verbs for community service'],
    unit4: ['Comparisons with Like, As...as, Different from'],
    unit5: ['Nouns of quantity: a bottle of, a kilo of', 'How much / How many'],
    unit6: ['Prepositions of time & place (at, in, on)', 'Imperatives in public places'],
    unit7: ['It indicating distance (It is 5km from...)', 'Used to for past habits'],
    unit8: ['Connectors of contrast: Although, Though, Even though, Despite, In spite of'],
    unit9: ['Adjectives ending in -ed and -ing', 'Yes/No questions & Wh-questions'],
    unit10: ['Future continuous tense (Hiện tại tiếp diễn chỉ tương lai)', 'Types of energy sources'],
    unit11: ['Future possibility with Will & Might', 'Possessive pronouns'],
    unit12: ['Articles: a, an, the with geographical names', 'Questions tags']
  },
  8: {
    unit1: ['Verbs of liking / disliking + V-ing / to-V', 'Present simple for leisure activities'],
    unit2: ['Comparative adverbs (So sánh hơn của trạng từ)', 'Distributive nouns'],
    unit3: ['Simple, compound and complex sentences (Câu đơn, câu ghép, câu phức)'],
    unit4: ['Yes/No & Wh-questions about ethnic groups', 'Countable vs Uncountable nouns'],
    unit5: ['Zero article (Không dùng mạn từ)', 'Modal verbs: Should/Shouldn\'t, Have to'],
    unit6: ['First conditional (Câu điều kiện loại 1)', 'Conjunctions of time: when, while, as soon as'],
    unit7: ['Complex sentences with adverbial clauses of cause (because, since)', 'Effect clauses'],
    unit8: ['Present simple for timetables', 'Demonstratives & Quantifiers in shopping'],
    unit9: ['Past continuous tense (Thì quá khứ tiếp diễn)', 'Past simple vs Past continuous with When/While'],
    unit10: ['Prepositions of time: in, on, at, by', 'Possessive pronouns'],
    unit11: ['Reported speech (Statements & Questions)', 'Tense shifts in reported speech'],
    unit12: ['Reported speech (Commands & Requests)', 'May / Might for possibility']
  },
  9: {
    unit1: ['Complex sentences with adverbial clauses of result, concession, reason', 'Phrasal verbs'],
    unit2: ['Comparison of adjectives and adverbs (So sánh hơn/nhất phức hợp)', 'Phrasal verbs (get on, turn down...)'],
    unit3: ['Question words before to-infinitive (How to do, Where to go...)', 'Modal verbs for advice'],
    unit4: ['Used to + V vs Be/Get used to + V-ing', 'Wish + Past simple for present wishes'],
    unit5: ['Past perfect tense (Thì quá khứ hoàn thành)', 'Past simple vs Past perfect'],
    unit6: ['Structure: It + be + Adj + that-clause', 'Noun clauses as objects'],
    unit7: ['Impersonal passive: It is said that...', 'Suggest + V-ing / Suggest + that S + (should) + V'],
    unit8: ['Compound nouns (travel agency, tour guide)', 'Relative clauses (who, which, that)'],
    unit9: ['Defining and Non-defining Relative Clauses (Mệnh đề quan hệ xác định & không xác định)'],
    unit10: ['Relative pronouns with prepositions (in which, to whom)', 'Passive voice with modals'],
    unit11: ['Indirect questions (Do you know where...?)', 'Adverbial clauses of condition'],
    unit12: ['Conditional sentences type 2 (Câu điều kiện loại 2)', 'Wish + Past subjunctive for future career']
  }
};
