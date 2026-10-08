import { EXAM_SECTIONS, DEFAULT_EXAM_METADATA } from '../constants/examStructure';

export const createEmptyExam = (overrides = {}) => {
  return {
    id: overrides.id || `exam-${Date.now()}`,
    title: overrides.title || 'BÀI KIỂM TRA GIỮA KỲ 1 TIẾNG ANH KHỐI 8 (CHUẨN 37 CÂU • 10.0 ĐIỂM)',
    description: overrides.description || 'Đề kiểm tra chuẩn hóa 4 phần: Listening (10 câu), Knowledge of Language (10 câu), Reading (10 câu), Writing (7 câu).',
    metadata: {
      ...DEFAULT_EXAM_METADATA,
      ...(overrides.metadata || {}),
      grade_level: overrides.grade_level || overrides.metadata?.grade_level || 8,
      total_score: 10.0
    },
    sections: [
      {
        id: 'sec_listening',
        code: 'A_LISTENING',
        title: 'Section 1: Listening (2.5 điểm • 10 câu)',
        instruction: 'Listen to 3 recording tasks and answer questions 1 to 10.',
        points: 2.5,
        tasks: [
          {
            id: 'l_task_1',
            task_type: 'LISTENING_MCQ',
            title: 'Task 1: Multiple Choice Questions (4 câu • 1.0đ)',
            instruction: 'Listen to the conversation about school picnic and choose the correct answer A, B, C, or D for questions 1 to 4.',
            audio_url: '',
            audio_name: 'Listening_Task1_Picnic.mp3',
            audio_duration: '01:45',
            teacher_transcript: 'Speaker A: Hi everyone! We are planning our annual school picnic tomorrow morning. We will meet at the main school gate at 8:00 AM. Please make sure to bring your water bottles and notebooks.',
            questions: [
              { id: 'l1_q1', num: 1, question: 'Question 1: What is the main topic of the conversation?', options: ['A. School picnic', 'B. English club', 'C. Book fair', 'D. Music festival'], correct: 'A. School picnic', points: 0.25 },
              { id: 'l1_q2', num: 2, question: 'Question 2: Where will the students meet tomorrow morning?', options: ['A. At the school gate', 'B. At the park', 'C. At the bus station', 'D. At the library'], correct: 'A. At the school gate', points: 0.25 },
              { id: 'l1_q3', num: 3, question: 'Question 3: What time does the event start?', options: ['A. 7:30 AM', 'B. 8:00 AM', 'C. 8:30 AM', 'D. 9:00 AM'], correct: 'B. 8:00 AM', points: 0.25 },
              { id: 'l1_q4', num: 4, question: 'Question 4: Who is organizing the activity?', options: ['A. The English Teacher', 'B. Class Monitor', 'C. Headmaster', 'D. Youth Union'], correct: 'A. The English Teacher', points: 0.25 }
            ]
          },
          {
            id: 'l_task_2',
            task_type: 'LISTENING_GAPFILL',
            title: 'Task 2: Gap Fill Questions (3 câu • 0.75đ)',
            instruction: 'Listen to the announcement and fill in each blank with ONE suitable word for questions 5 to 7.',
            audio_url: '',
            audio_name: 'Listening_Task2_Bus.mp3',
            audio_duration: '01:20',
            teacher_transcript: 'Speaker B: Attention students, the school bus will arrive at exactly 7:45 AM. All participants must bring their own water bottles and wear comfortable sneakers.',
            questions: [
              { id: 'l2_q5', num: 5, blank_num: 5, question: 'Question 5: Students should bring their own _____ to the venue.', options: ['A. water', 'B. food', 'C. notebook', 'D. camera'], correct: 'A. water', points: 0.25 },
              { id: 'l2_q6', num: 6, blank_num: 6, question: 'Question 6: The bus will arrive at exactly _____.', options: ['A. 7:45 AM', 'B. 8:15 AM', 'C. 7:30 AM', 'D. 8:00 AM'], correct: 'A. 7:45 AM', points: 0.25 },
              { id: 'l2_q7', num: 7, blank_num: 7, question: 'Question 7: Remember to wear comfortable _____ for walking.', options: ['A. sneakers', 'B. boots', 'C. sandals', 'D. hats'], correct: 'A. sneakers', points: 0.25 }
            ]
          },
          {
            id: 'l_task_3',
            task_type: 'LISTENING_TF',
            title: 'Task 3: True / False Questions (3 câu • 0.75đ)',
            instruction: 'Listen to the conversation and decide whether statements 8 to 10 are True or False.',
            audio_url: '',
            audio_name: 'Listening_Task3_Report.mp3',
            audio_duration: '01:10',
            teacher_transcript: 'Speaker C: The trip takes place on Sunday morning. Lunch is provided free by the school. After the trip, every student must write a short report.',
            questions: [
              { id: 'l3_q8', num: 8, question: 'Question 8: The event is held on a Sunday morning.', options: ['A. True', 'B. False'], correct: 'A. True', points: 0.25 },
              { id: 'l3_q9', num: 9, question: 'Question 9: Lunch is provided free by the school organization.', options: ['A. True', 'B. False'], correct: 'A. True', points: 0.25 },
              { id: 'l3_q10', num: 10, question: 'Question 10: All students are required to write a short report after the trip.', options: ['A. True', 'B. False'], correct: 'A. True', points: 0.25 }
            ]
          }
        ]
      },
      {
        id: 'sec_knowledge',
        code: 'B_KNOWLEDGE',
        title: 'Section 2: Knowledge of Language (2.5 điểm • 10 chỗ trống)',
        instruction: 'Read the text passages below and choose the best answer A, B, C, or D for blanks 11 to 20.',
        points: 2.5,
        tasks: [
          {
            id: 'k_task_1',
            task_type: 'CLOZE_PASSAGE',
            title: 'Part 1: Leaflet (5 chỗ trống 11–15 • 1.25đ)',
            instruction: 'Read the leaflet and choose the best option A, B, C, or D for blanks 11 to 15.',
            passage: {
              title: 'JOIN OUR GREEN COMMUNITY CLUB!',
              content: 'Are you interested in protecting the environment? Join our Green Community Club! We organize weekly activities such as (11)_____ trash in local parks and planting trees. Members will also learn how to (12)_____ household waste effectively. This is a great opportunity to make new friends who share a (13)_____ for nature. If you want to become a member, please (14)_____ the application form online before Friday. Let\'s work together for a (15)_____ future!',
              word_count: 85
            },
            questions: [
              { id: 'k1_q11', num: 11, blank_num: 11, question: 'Blank (11)', options: ['A. collecting', 'B. collection', 'C. collector', 'D. collect'], correct: 'A. collecting', explanation: 'Sau như such as + V-ing -> collecting', points: 0.25 },
              { id: 'k1_q12', num: 12, blank_num: 12, question: 'Blank (12)', options: ['A. recycle', 'B. repeat', 'C. rewrite', 'D. rebuild'], correct: 'A. recycle', explanation: 'recycle household waste: tái chế rác thải gia đình', points: 0.25 },
              { id: 'k1_q13', num: 13, blank_num: 13, question: 'Blank (13)', options: ['A. passion', 'B. stress', 'C. pressure', 'D. trouble'], correct: 'A. passion', explanation: 'share a passion for nature: chia sẻ niềm đam mê thiên nhiên', points: 0.25 },
              { id: 'k1_q14', num: 14, blank_num: 14, question: 'Blank (14)', options: ['A. fill in', 'B. turn off', 'C. look for', 'D. give up'], correct: 'A. fill in', explanation: 'fill in the application form: điền đơn đăng ký', points: 0.25 },
              { id: 'k1_q15', num: 15, blank_num: 15, question: 'Blank (15)', options: ['A. greener', 'B. darker', 'C. dirtier', 'D. higher'], correct: 'A. greener', explanation: 'a greener future: tương lai xanh hơn', points: 0.25 }
            ]
          },
          {
            id: 'k_task_2',
            task_type: 'CLOZE_PASSAGE',
            title: 'Part 2: Announcement (5 chỗ trống 16–20 • 1.25đ)',
            instruction: 'Read the announcement and choose the best option A, B, C, or D for blanks 16 to 20.',
            passage: {
              title: 'SCHOOL MIDTERM ENGLISH CONTEST ANNOUNCEMENT',
              content: 'We are pleased to (16)_____ the Annual English Speaking Contest for Grade 8 students. The contest will take place (17)_____ November 15th in the main hall. Candidates are required to prepare a 3-minute presentation about (18)_____ pressure and coping strategies. Valuable prizes will be (19)_____ to the top three winners. For more information, please contact your English teacher (20)_____ visit the school website.',
              word_count: 82
            },
            questions: [
              { id: 'k2_q16', num: 16, blank_num: 16, question: 'Blank (16)', options: ['A. announce', 'B. hide', 'C. deny', 'D. cancel'], correct: 'A. announce', explanation: 'announce the contest: thông báo cuộc thi', points: 0.25 },
              { id: 'k2_q17', num: 17, blank_num: 17, question: 'Blank (17)', options: ['A. on', 'B. in', 'C. at', 'D. for'], correct: 'A. on', explanation: 'Dùng giới từ ON trước ngày tháng', points: 0.25 },
              { id: 'k2_q18', num: 18, blank_num: 18, question: 'Blank (18)', options: ['A. teenage', 'B. adult', 'C. elderly', 'D. infant'], correct: 'A. teenage', explanation: 'teenage pressure: áp lực lứa tuổi thiếu niên', points: 0.25 },
              { id: 'k2_q19', num: 19, blank_num: 19, question: 'Blank (19)', options: ['A. awarded', 'B. stolen', 'C. thrown', 'D. forgotten'], correct: 'A. awarded', explanation: 'prizes awarded to winners: giải thưởng được trao', points: 0.25 },
              { id: 'k2_q20', num: 20, blank_num: 20, question: 'Blank (20)', options: ['A. or', 'B. so', 'C. but', 'D. because'], correct: 'A. or', explanation: 'Liên từ lựa chọn OR (hoặc)', points: 0.25 }
            ]
          }
        ]
      },
      {
        id: 'sec_reading',
        code: 'C_READING',
        title: 'Section 3: Reading (2.5 điểm • 10 câu)',
        instruction: 'Read the reading passages and answer questions 21 to 30.',
        points: 2.5,
        tasks: [
          {
            id: 'r_task_1',
            task_type: 'READING_COMPOSITE',
            title: 'Task 1: True / False (5 câu 21–25 • 1.25đ)',
            instruction: 'Read the passage "Nam and Smartphone Addiction" and decide whether statements 21 to 25 are True or False.',
            passage: {
              title: 'Nam and Smartphone Addiction',
              content: 'Nam is an 8th-grade student who used to be an active member of his school\'s basketball team. However, since his parents bought him a smartphone three months ago, his daily habits have changed completely. Nam spends up to 6 hours every day playing online games and checking social media notifications. He often stays up past midnight, which makes him feel exhausted during morning classes. As a result, his academic performance has dropped significantly. His parents and teachers are deeply concerned about his smartphone addiction and are encouraging him to set strict time limits and rejoin sports activities.',
              word_count: 105,
              source: 'Global Success Grade 8 Unit 3'
            },
            questions: [
              { id: 'r1_q21', num: 21, qType: 'true_false', question: 'Question 21: Nam used to be an active basketball player before getting a smartphone.', options: ['A. True', 'B. False'], correct: 'A. True', points: 0.25 },
              { id: 'r1_q22', num: 22, qType: 'true_false', question: 'Question 22: Nam spends only 2 hours a day on online games and social media.', options: ['A. True', 'B. False'], correct: 'B. False', points: 0.25 },
              { id: 'r1_q23', num: 23, qType: 'true_false', question: 'Question 23: Staying up past midnight makes Nam feel exhausted in morning classes.', options: ['A. True', 'B. False'], correct: 'A. True', points: 0.25 },
              { id: 'r1_q24', num: 24, qType: 'true_false', question: 'Question 24: Nam\'s school grades have improved since he started using the phone.', options: ['A. True', 'B. False'], correct: 'B. False', points: 0.25 },
              { id: 'r1_q25', num: 25, qType: 'true_false', question: 'Question 25: Teachers and parents encourage Nam to set screen limits and return to sports.', options: ['A. True', 'B. False'], correct: 'A. True', points: 0.25 }
            ]
          },
          {
            id: 'r_task_2',
            task_type: 'READING_COMPOSITE',
            title: 'Task 2: Multiple Choice (5 câu 26–30 • 1.25đ)',
            instruction: 'Read the passage "Managing Stress in Teens’ Life" and choose the correct answer A, B, C, or D for questions 26 to 30.',
            passage: {
              title: 'Managing Stress in Teens’ Life',
              content: 'Teenage years can be a turbulent period filled with physical, emotional, and academic changes. Schoolwork, parental expectations, and peer pressure are the main sources of stress for secondary students. When stress is not managed properly, it can lead to anxiety, insomnia, and poor concentration. Psychological experts suggest several effective coping strategies. First, teens should balance study time with relaxation and physical exercise. Second, maintaining open communication with parents and trusted friends helps alleviate emotional burdens. Finally, learning time management skills prevents last-minute cramming before major exams.',
              word_count: 110
            },
            questions: [
              { id: 'r2_q26', num: 26, qType: 'main_idea', question: 'Question 26: What is the main idea of the reading passage?', options: ['A. Causes and solutions for teenage stress', 'B. The history of secondary education', 'C. Physical exercise routines for teenagers', 'D. How to pass exams without studying'], correct: 'A. Causes and solutions for teenage stress', points: 0.25 },
              { id: 'r2_q27', num: 27, qType: 'detail', question: 'Question 27: According to the text, unmanaged stress can lead to:', options: ['A. anxiety and insomnia', 'B. high exam scores', 'C. better sleeping habits', 'D. physical strength'], correct: 'A. anxiety and insomnia', points: 0.25 },
              { id: 'r2_q28', num: 28, qType: 'detail', question: 'Question 28: Which coping strategy is NOT mentioned in the passage?', options: ['A. Skipping classes regularly', 'B. Balancing study with relaxation', 'C. Communicating with parents', 'D. Managing time effectively'], correct: 'A. Skipping classes regularly', points: 0.25 },
              { id: 'r2_q29', num: 29, qType: 'vocabulary', question: 'Question 29: The word "alleviate" in the passage is closest in meaning to:', options: ['A. reduce / relieve', 'B. increase', 'C. destroy', 'D. ignore'], correct: 'A. reduce / relieve', points: 0.25 },
              { id: 'r2_q30', num: 30, qType: 'detail', question: 'Question 30: Why are time management skills important for students?', options: ['A. They prevent last-minute exam cramming', 'B. They allow more video gaming time', 'C. They make exams unnecessary', 'D. They replace physical exercise'], correct: 'A. They prevent last-minute exam cramming', points: 0.25 }
            ]
          }
        ]
      },
      {
        id: 'sec_writing',
        code: 'D_WRITING',
        title: 'Section 4: Writing (2.5 điểm • 7 câu)',
        instruction: 'Complete the writing parts below (questions 31 to 37).',
        points: 2.5,
        parts: [
          {
            part_num: 1,
            title: 'Part 1: Utterances & Dialogue Ordering (2 câu • 0.5đ)',
            instruction: 'Circle the letter A, B, C or D to indicate the best arrangement of utterances or sentences to make a meaningful exchange in each of the following questions (questions 31 to 32).',
            questions: [
              {
                id: 'w1_q31',
                num: 31,
                question: 'Question 31 (0.25đ): Arrange the following utterances between a City Visitor and a Farmer about countryside life:\na. That sounds relaxing, but isn\'t it hard work every day?\nb. Yes, but working outdoors keeps us healthy and connected with nature.\nc. Good morning! Life here in the countryside seems so peaceful compared to the city.\nd. I can see that. Maybe I should spend my summer holiday in a village like this!\ne. Good morning! Indeed, we enjoy fresh air and a quiet environment.',
                options: ['A. a - c - b - e - d', 'B. e - d - c - b - a', 'C. e - c - b - d - a', 'D. a - e - b - c - d'],
                correct: 'B. e - d - c - b - a',
                explanation: 'Thứ tự logic: e (Chào & xác nhận không khí) -> d (Người xem khen) -> c (Mở đầu) -> b (Nông dân trả lời) -> a (Thắc mắc vất vả).',
                points: 0.25
              },
              {
                id: 'w1_q32',
                num: 32,
                question: 'Question 32 (0.25đ): Arrange the following sentences between Mai and Lan about study pressure:\na. Hey Lan, you look quite tired today. Is everything alright?\nb. My parents expect me to get top grades in all subjects, so I feel under a lot of pressure.\nc. Not really. I\'ve been studying for exams non-stop and couldn\'t sleep well.\nd. You should talk to your parents openly about how you feel. I\'m sure they will understand.',
                options: ['A. a - c - d - b', 'B. a - c - b - d', 'C. c - a - b - d', 'D. a - d - c - b'],
                correct: 'A. a - c - d - b',
                explanation: 'Thứ tự hội thoại chuẩn: a (Mai hỏi) -> c (Lan bộc bạch mệt) -> d (Mai khuyên) -> b (Lan chia sẻ nguyên nhân).',
                points: 0.25
              }
            ]
          },
          {
            part_num: 2,
            title: 'Part 2: Sentence Transformation (4 câu • 1.0đ)',
            instruction: 'Finish each of the sentences in such a way that it means exactly the same as the one printed before it (questions 33 to 36).',
            questions: [
              {
                id: 'w2_q33',
                num: 33,
                original_sentence: 'Minh joined the arts and crafts club because he wanted to be more creative. (so)',
                prompt_keyword: 'Minh wanted to be more creative, so...',
                suggested_answer: 'Minh wanted to be more creative, so he joined the arts and crafts club.',
                accepted_answers: [
                  'Minh wanted to be more creative, so he joined the arts and crafts club.',
                  'minh wanted to be more creative, so he joined the arts and crafts club',
                  'he joined the arts and crafts club'
                ],
                explanation: 'Chuyển mệnh đề chỉ nguyên nhân (because) sang mệnh đề chỉ kết quả (so).',
                points: 0.25
              },
              {
                id: 'w2_q34',
                num: 34,
                original_sentence: 'I fancy making origami in my free time. (crazy)',
                prompt_keyword: 'I am crazy...',
                suggested_answer: 'I am crazy about making origami in my free time.',
                accepted_answers: [
                  'I am crazy about making origami in my free time.',
                  'i am crazy about making origami in my free time',
                  'about making origami in my free time'
                ],
                explanation: 'fancy + V-ing = be crazy about + V-ing (thích làm gì).',
                points: 0.25
              },
              {
                id: 'w2_q35',
                num: 35,
                original_sentence: 'His car can run 120km/h while my car can run only 110 km/h. (fast)',
                prompt_keyword: 'His car can run...',
                suggested_answer: 'His car can run faster than my car.',
                accepted_answers: [
                  'His car can run faster than my car.',
                  'His car can run faster than mine.',
                  'His car can run faster than my car can.',
                  'His car can run faster than my car can run.',
                  'faster than my car',
                  'faster than mine'
                ],
                explanation: 'So sánh hơn của trạng từ nhanh: faster than.',
                points: 0.25
              },
              {
                id: 'w2_q36',
                num: 36,
                original_sentence: 'Julia is a better cook than I am. (cooks)',
                prompt_keyword: 'Julia cooks...',
                suggested_answer: 'Julia cooks better than I do.',
                accepted_answers: [
                  'Julia cooks better than I do.',
                  'Julia cooks better than me.',
                  'julia cooks better than i do',
                  'julia cooks better than me',
                  'better than I do',
                  'better than me'
                ],
                explanation: 'Chuyển từ so sánh danh từ/tính từ sang so sánh động từ thường: cooks better than I do / me.',
                points: 0.25
              }
            ]
          },
          {
            part_num: 3,
            title: 'Part 3: Paragraph Writing (1 câu • 1.0đ)',
            instruction: 'Write a paragraph (about 80 to 100 words) on the topic "What kind of pressure do you face as a teenager?" (Question 37).',
            prompt: 'Question 37 (1.0đ): Write a paragraph (about 80 to 100 words) about what kind of pressure you face as a teenager. You should use the following cues:\n- What pressure do you have (schoolwork, parents, peers...)?\n- How does this pressure make you feel (stressed, lonely...)?\n- What do you do to deal with it (talk to friends, join a club...)?',
            min_words: 80,
            max_words: 120,
            suggested_words: ['schoolwork', 'parental expectations', 'peer pressure', 'stressed', 'talk to friends', 'manage time'],
            rubric: {
              content: 0.3,
              organization: 0.2,
              grammar: 0.25,
              vocabulary: 0.25
            },
            points: 1.0
          }
        ]
      }
    ]
  };
};

// NORMALIZE ANY QUIZ TO STANDARD 4-SECTION EXAM
export const normalizeExamData = (quizData) => {
  if (!quizData) return createEmptyExam();

  // If already has standard 4 sections structure
  if (quizData.sections && Array.isArray(quizData.sections) && quizData.sections.length === 4) {
    const hasCodes = quizData.sections.every(s => s.code);
    if (hasCodes) {
      return {
        ...createEmptyExam({ id: quizData.id, title: quizData.title, description: quizData.description }),
        ...quizData,
        metadata: {
          ...DEFAULT_EXAM_METADATA,
          ...(quizData.metadata || {}),
          grade_level: quizData.grade_level || quizData.metadata?.grade_level || 8,
          time_limit_minutes: quizData.time_limit_minutes || quizData.metadata?.time_limit_minutes || 60
        }
      };
    }
  }

  // Convert legacy quiz or custom structure into standard 4 sections
  const baseExam = createEmptyExam({
    id: quizData.id,
    title: quizData.title || 'BÀI KIỂM TRA TIẾNG ANH THCS',
    description: quizData.description || 'Đề kiểm tra bám sát chương trình THCS',
    grade_level: quizData.grade_level || 8,
    metadata: {
      time_limit_minutes: quizData.time_limit_minutes || 45
    }
  });

  // Extract all questions from legacy structures
  let rawQuestions = [];
  if (Array.isArray(quizData.questions)) {
    quizData.questions.forEach(item => {
      if (item.tasks && Array.isArray(item.tasks)) {
        item.tasks.forEach(t => {
          if (t.questions && Array.isArray(t.questions)) {
            rawQuestions.push(...t.questions);
          }
        });
      } else if (item.question || item.qText) {
        rawQuestions.push(item);
      }
    });
  }

  if (rawQuestions.length === 0) return baseExam;

  // Distribute legacy questions to Section B / C / D if applicable
  const knowledgeSec = baseExam.sections.find(s => s.code === 'B_KNOWLEDGE');
  if (knowledgeSec && knowledgeSec.tasks[0]) {
    const formattedLegacy = rawQuestions.map((q, idx) => ({
      id: q.id || `leg_q_${idx}`,
      num: idx + 1,
      question: q.question || q.qText || `Question ${idx + 1}`,
      options: q.options || ['A. True', 'B. False'],
      correct: q.correctAnswer || q.correct || (q.options ? q.options[0] : 'A'),
      points: 0.25
    }));
    knowledgeSec.tasks[0].questions = formattedLegacy;
  }

  return baseExam;
};

// CALCULATE AUTOMATIC POINTS DISTRIBUTION
export const calculateExamPoints = (exam) => {
  if (!exam || !exam.sections) return { sectionTotals: {}, grandTotal: 0 };

  const sectionTotals = {};
  let grandTotal = 0;

  exam.sections.forEach(sec => {
    let secSum = 0;

    if (sec.code === 'D_WRITING') {
      (sec.parts || []).forEach(part => {
        if (part.part_num === 3) {
          secSum += parseFloat(part.points || 1.0);
        } else {
          (part.questions || []).forEach(q => {
            secSum += parseFloat(q.points || 0.25);
          });
        }
      });
    } else {
      (sec.tasks || []).forEach(task => {
        (task.questions || []).forEach(q => {
          secSum += parseFloat(q.points || 0.25);
        });
      });
    }

    secSum = Math.round(secSum * 100) / 100;
    sectionTotals[sec.code] = secSum;
    grandTotal += secSum;
  });

  grandTotal = Math.round(grandTotal * 100) / 100;
  return { sectionTotals, grandTotal };
};

// VALIDATE EXAM BEFORE PUBLISH
export const validateExamStructure = (exam) => {
  const errors = [];
  const warnings = [];

  if (!exam) return { isValid: false, errors: ['Đề kiểm tra không hợp lệ'], warnings };

  if (!exam.metadata?.school_name?.trim()) warnings.push('Chưa nhập Tên trường học');
  if (!exam.title?.trim()) errors.push('Tên đề kiểm tra không được để trống');

  const { grandTotal, sectionTotals } = calculateExamPoints(exam);

  if (Math.abs(grandTotal - 10.0) > 0.05) {
    warnings.push(`Tổng điểm hiện tại của đề là ${grandTotal} điểm (Chuẩn khuyến nghị là 10.0 điểm).`);
  }

  // Section A: Listening checks
  const listeningSec = (exam.sections || []).find(s => s.code === 'A_LISTENING');
  if (listeningSec) {
    (listeningSec.tasks || []).forEach((t, idx) => {
      if (!t.audio_url && !t.audio_name) {
        warnings.push(`Listening Task ${idx + 1}: Chưa tải tệp Audio MP3/WAV`);
      }
      if (!t.questions || t.questions.length === 0) {
        errors.push(`Listening Task ${idx + 1}: Chưa có câu hỏi con nào`);
      }
    });
  } else {
    errors.push('Thiếu Section A. LISTENING');
  }

  // Section B: Knowledge Cloze checks
  const knowledgeSec = (exam.sections || []).find(s => s.code === 'B_KNOWLEDGE');
  if (knowledgeSec) {
    if ((knowledgeSec.tasks || []).length !== 2) {
      warnings.push('Knowledge of Language chuẩn bao gồm đúng 2 Cloze Passages.');
    }
    (knowledgeSec.tasks || []).forEach((t, idx) => {
      if (!t.passage?.content?.trim()) {
        errors.push(`Knowledge Cloze Passage ${idx + 1}: Chưa nhập đoạn văn passage`);
      }
      if (!t.questions || t.questions.length === 0) {
        errors.push(`Knowledge Cloze Passage ${idx + 1}: Chưa có câu hỏi con nào`);
      }
    });
  } else {
    errors.push('Thiếu Section B. KNOWLEDGE OF LANGUAGE');
  }

  // Section C: Reading checks
  const readingSec = (exam.sections || []).find(s => s.code === 'C_READING');
  if (readingSec) {
    (readingSec.tasks || []).forEach((t, idx) => {
      if (!t.passage?.content?.trim()) {
        errors.push(`Reading Task ${idx + 1}: Chưa nhập bài đọc passage`);
      }
      if (!t.questions || t.questions.length === 0) {
        errors.push(`Reading Task ${idx + 1}: Chưa có câu hỏi con nào`);
      }
    });
  } else {
    errors.push('Thiếu Section C. READING');
  }

  // Section D: Writing checks
  const writingSec = (exam.sections || []).find(s => s.code === 'D_WRITING');
  if (writingSec) {
    const part3 = (writingSec.parts || []).find(p => p.part_num === 3);
    if (part3 && !part3.prompt?.trim()) {
      errors.push('Writing Part 3: Chưa nhập đề bài viết đoạn văn');
    }
  } else {
    errors.push('Thiếu Section D. WRITING');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    grandTotal,
    sectionTotals
  };
};

// FLATTEN ALL QUESTIONS FOR LEGACY GRADING
export const flattenExamQuestions = (exam) => {
  const norm = normalizeExamData(exam);
  const flat = [];

  norm.sections.forEach(sec => {
    if (sec.code === 'D_WRITING') {
      (sec.parts || []).forEach(p => {
        if (p.part_num === 3) {
          flat.push({
            id: 'writing_p3',
            num: 37,
            type: 'essay',
            qText: p.prompt || 'Writing Paragraph Task',
            points: p.points || 1.0,
            sectionCode: sec.code
          });
        } else {
          (p.questions || []).forEach(q => {
            flat.push({
              ...q,
              num: q.num || flat.length + 1,
              type: q.prompt_keyword ? 'sentence_rewrite' : 'ordering',
              qText: q.question || q.original_sentence || '',
              sectionCode: sec.code
            });
          });
        }
      });
    } else {
      (sec.tasks || []).forEach(t => {
        (t.questions || []).forEach(q => {
          flat.push({
            ...q,
            num: q.num || flat.length + 1,
            type: q.options ? 'single_choice' : 'fill_blank',
            qText: q.question || '',
            sectionCode: sec.code
          });
        });
      });
    }
  });

  return flat;
};
