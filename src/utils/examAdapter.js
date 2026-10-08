import { EXAM_SECTIONS, DEFAULT_EXAM_METADATA } from '../constants/examStructure';

export const createEmptyExam = (overrides = {}) => {
  return {
    id: overrides.id || `exam-${Date.now()}`,
    title: overrides.title || 'BÀI KIỂM TRA GIỮA KỲ 1 TIẾNG ANH THCS',
    description: overrides.description || 'Đề kiểm tra chuẩn THCS 4 kỹ năng (Listening, Knowledge, Reading, Writing)',
    metadata: {
      ...DEFAULT_EXAM_METADATA,
      ...(overrides.metadata || {}),
      grade_level: overrides.grade_level || overrides.metadata?.grade_level || 8
    },
    sections: [
      {
        id: 'sec_listening',
        code: 'A_LISTENING',
        title: 'A. LISTENING',
        instruction: 'Listen to the audio recordings and complete the tasks below.',
        points: 2.5,
        tasks: [
          {
            id: 'l_task_1',
            task_type: 'LISTENING_MCQ',
            title: 'Task 1: Multiple Choice Questions',
            instruction: 'Listen to the audio recording and choose the correct answer A, B, C, or D.',
            audio_url: '',
            audio_name: '',
            audio_duration: '00:00',
            teacher_transcript: '',
            teacher_notes: '',
            questions: [
              { id: 'l1_q1', num: 1, question: 'What is the main topic of the conversation?', options: ['A. School picnic', 'B. English club', 'C. Book fair', 'D. Music festival'], correct: 'A. School picnic', points: 0.25 },
              { id: 'l1_q2', num: 2, question: 'Where will the students meet tomorrow morning?', options: ['A. At the school gate', 'B. At the park', 'C. At the bus station', 'D. At the library'], correct: 'A. At the school gate', points: 0.25 },
              { id: 'l1_q3', num: 3, question: 'What time does the event start?', options: ['A. 7:30 AM', 'B. 8:00 AM', 'C. 8:30 AM', 'D. 9:00 AM'], correct: 'B. 8:00 AM', points: 0.25 },
              { id: 'l1_q4', num: 4, question: 'Who is organizing the activity?', options: ['A. The English Teacher', 'B. Class Monitor', 'C. Headmaster', 'D. Youth Union'], correct: 'A. The English Teacher', points: 0.25 },
              { id: 'l1_q5', num: 5, question: 'What should students bring with them?', options: ['A. Water and notebooks', 'B. Cameras and hats', 'C. Laptops', 'D. Sports shoes'], correct: 'A. Water and notebooks', points: 0.25 }
            ]
          }
        ]
      },
      {
        id: 'sec_knowledge',
        code: 'B_KNOWLEDGE',
        title: 'B. KNOWLEDGE OF LANGUAGE',
        instruction: 'Read the cloze passages and choose the best option for each blank.',
        points: 2.5,
        tasks: [
          {
            id: 'k_task_1',
            task_type: 'CLOZE_PASSAGE',
            title: 'Task 1: Cloze Passage 1',
            instruction: 'Read the passage and choose the best answer A, B, C, or D to fill in each blank.',
            passage: {
              title: 'Life in a Modern Village',
              content: 'Living in the countryside offers many advantages. People can enjoy (1)_____ air and quiet surroundings. In addition, villagers are very friendly and always willing to (2)_____ their neighbors. Teenagers often spend their free time (3)_____ traditional games or helping parents with farm work. However, life here is changing fast as modern technology becomes (4)_____ available. Many young people now have smartphones to access (5)_____ information for their studies.',
              word_count: 75
            },
            questions: [
              { id: 'k1_q1', num: 1, blank_num: 1, question: 'Blank (1)', options: ['A. fresh', 'B. dirty', 'C. noisy', 'D. crowded'], correct: 'A. fresh', explanation: 'fresh air: không khí trong lành', points: 0.25 },
              { id: 'k1_q2', num: 2, blank_num: 2, question: 'Blank (2)', options: ['A. help', 'B. hurt', 'C. ignore', 'D. avoid'], correct: 'A. help', points: 0.25 },
              { id: 'k1_q3', num: 3, blank_num: 3, question: 'Blank (3)', options: ['A. playing', 'B. play', 'C. played', 'D. to play'], correct: 'A. playing', explanation: 'spend time + V-ing', points: 0.25 },
              { id: 'k1_q4', num: 4, blank_num: 4, question: 'Blank (4)', options: ['A. widely', 'B. wide', 'C. widen', 'D. width'], correct: 'A. widely', explanation: 'Trạng từ bổ nghĩa cho tính từ available', points: 0.25 },
              { id: 'k1_q5', num: 5, blank_num: 5, question: 'Blank (5)', options: ['A. useful', 'B. useless', 'C. bad', 'D. dark'], correct: 'A. useful', points: 0.25 }
            ]
          },
          {
            id: 'k_task_2',
            task_type: 'CLOZE_PASSAGE',
            title: 'Task 2: Cloze Passage 2',
            instruction: 'Read the passage and choose the best answer A, B, C, or D to fill in each blank.',
            passage: {
              title: 'Preserving Local Crafts',
              content: 'Bat Trang Pottery Village is famous for its handmade ceramics. Artisans have passed down traditional techniques from (1)_____ to generation. Today, tourists come to buy beautiful vases and (2)_____ their own pottery products. The local authorities are trying to (3)_____ traditional crafts to promote tourism. It is important to support local craftsmen so that these cultural values will not (4)_____ away. School students are encouraged to visit workshops and (5)_____ about Vietnamese heritage.',
              word_count: 80
            },
            questions: [
              { id: 'k2_q1', num: 1, blank_num: 1, question: 'Blank (1)', options: ['A. generation', 'B. year', 'C. century', 'D. age'], correct: 'A. generation', points: 0.25 },
              { id: 'k2_q2', num: 2, blank_num: 2, question: 'Blank (2)', options: ['A. make', 'B. take', 'C. buy', 'D. break'], correct: 'A. make', points: 0.25 },
              { id: 'k2_q3', num: 3, blank_num: 3, question: 'Blank (3)', options: ['A. preserve', 'B. destroy', 'C. forget', 'D. hide'], correct: 'A. preserve', points: 0.25 },
              { id: 'k2_q4', num: 4, blank_num: 4, question: 'Blank (4)', options: ['A. fade', 'B. run', 'C. walk', 'D. fly'], correct: 'A. fade', points: 0.25 },
              { id: 'k2_q5', num: 5, blank_num: 5, question: 'Blank (5)', options: ['A. learn', 'B. teach', 'C. speak', 'D. write'], correct: 'A. learn', points: 0.25 }
            ]
          }
        ]
      },
      {
        id: 'sec_reading',
        code: 'C_READING',
        title: 'C. READING',
        instruction: 'Read the passages carefully and answer the questions below.',
        points: 2.5,
        tasks: [
          {
            id: 'r_task_1',
            task_type: 'READING_COMPOSITE',
            title: 'Task 1: Reading Comprehension',
            instruction: 'Read the text and answer the questions below.',
            passage: {
              title: 'Teen Stress and Mental Well-being',
              content: 'Teenagers today face various pressures from schoolwork, examinations, and social expectations. Many students feel overwhelmed when balancing academic deadlines with extracurricular activities. Experts recommend managing time effectively by creating daily study schedules and setting realistic goals. Getting enough sleep, eating nutritious meals, and doing regular exercise are also essential for reducing stress levels. Talking to teachers, school counselors, or parents can help teens find suitable solutions when experiencing anxiety.',
              word_count: 78,
              source: 'Global Success Grade 8 Unit 3'
            },
            questions: [
              { id: 'r1_q1', num: 1, qType: 'main_idea', question: 'What is the main topic of the passage?', options: ['A. How teenagers cope with school stress', 'B. The history of school examinations', 'C. How to become a top student', 'D. Physical sports for teenagers'], correct: 'A. How teenagers cope with school stress', points: 0.5 },
              { id: 'r1_q2', num: 2, qType: 'detail', question: 'According to the text, what helps teenagers manage time effectively?', options: ['A. Creating daily study schedules', 'B. Playing video games late at night', 'C. Skipping homework', 'D. Avoiding exams'], correct: 'A. Creating daily study schedules', points: 0.5 },
              { id: 'r1_q3', num: 3, qType: 'detail', question: 'Which habit is mentioned as essential for reducing stress levels?', options: ['A. Getting enough sleep and regular exercise', 'B. Drinking coffee constantly', 'C. Studying all night without resting', 'D. Staying indoors all weekend'], correct: 'A. Getting enough sleep and regular exercise', points: 0.5 },
              { id: 'r1_q4', num: 4, qType: 'vocabulary', question: 'The word "anxiety" in the last sentence is closest in meaning to:', options: ['A. worry/stress', 'B. happiness', 'C. excitement', 'D. energy'], correct: 'A. worry/stress', points: 0.5 },
              { id: 'r1_q5', num: 5, qType: 'true_false', question: 'Teenagers are advised NOT to talk to counselors or parents when stressed.', options: ['Đúng (True)', 'Sai (False)'], correct: 'Sai (False)', points: 0.5 }
            ]
          }
        ]
      },
      {
        id: 'sec_writing',
        code: 'D_WRITING',
        title: 'D. WRITING',
        instruction: 'Complete the writing parts below.',
        points: 2.5,
        parts: [
          {
            part_num: 1,
            title: 'Part 1: Dialogue / Sentence Ordering',
            instruction: 'Choose the correct order of sentences to form a meaningful conversation/paragraph.',
            questions: [
              {
                id: 'w1_q1',
                num: 1,
                question: 'Reorder the following sentences to complete the conversation:\na. I prefer playing badminton with my friends.\nb. What do you like doing in your free time, Nam?\nc. That sounds fun! How often do you play it?\nd. We usually play twice a week on weekends.',
                options: ['A. b - a - c - d', 'B. a - b - c - d', 'C. c - d - b - a', 'D. b - c - a - d'],
                correct: 'A. b - a - c - d',
                points: 0.5
              }
            ]
          },
          {
            part_num: 2,
            title: 'Part 2: Sentence Transformation',
            instruction: 'Finish each sentence so that it means exactly the same as the original sentence printed before it.',
            questions: [
              {
                id: 'w2_q1',
                num: 1,
                original_sentence: 'Nam is a better swimmer than Phong.',
                prompt_keyword: 'Phong swims...',
                suggested_answer: 'Phong swims worse than Nam.',
                accepted_answers: ['Phong swims worse than Nam.', 'Phong does not swim as well as Nam.'],
                explanation: 'So sánh kém hơn của động từ: swim worse than',
                points: 0.25
              },
              {
                id: 'w2_q2',
                num: 2,
                original_sentence: 'She started learning English 3 years ago.',
                prompt_keyword: 'She has...',
                suggested_answer: 'She has learned English for 3 years.',
                accepted_answers: ['She has learned English for 3 years.', 'She has been learning English for 3 years.'],
                explanation: 'Quá khứ đơn sang Hiện tại hoàn thành với FOR',
                points: 0.25
              },
              {
                id: 'w2_q3',
                num: 3,
                original_sentence: 'It is essential for students to do homework regularly.',
                prompt_keyword: 'Students must...',
                suggested_answer: 'Students must do homework regularly.',
                accepted_answers: ['Students must do homework regularly.', 'Students should do homework regularly.'],
                points: 0.25
              },
              {
                id: 'w2_q4',
                num: 4,
                original_sentence: 'Why don\'t we go to the museum this Sunday?',
                prompt_keyword: 'How about...',
                suggested_answer: 'How about going to the museum this Sunday?',
                accepted_answers: ['How about going to the museum this Sunday?'],
                points: 0.25
              }
            ]
          },
          {
            part_num: 3,
            title: 'Part 3: Paragraph Writing',
            instruction: 'Write a paragraph (80-100 words) on the topic given below.',
            prompt: 'Write a paragraph (about 80 to 100 words) about your favorite leisure activity. You should mention: what the activity is, when/where you do it, who you do it with, and why you enjoy it.',
            min_words: 80,
            max_words: 120,
            suggested_words: ['in my free time', 'hobby', 'relaxing', 'beneficial', 'enjoy'],
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
            num: flat.length + 1,
            type: 'essay',
            qText: p.prompt || 'Writing Paragraph Task',
            points: p.points || 1.0,
            sectionCode: sec.code
          });
        } else {
          (p.questions || []).forEach(q => {
            flat.push({
              ...q,
              num: flat.length + 1,
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
            num: flat.length + 1,
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
