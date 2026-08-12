-- ====================================================================
-- SỔ TAY DẠY HỌC TIẾNG ANH THCS (KHỐI 6, 7, 8, 9) - FULL DATABASE SCHEMA
-- ====================================================================

-- 1. PROFILES (Thông tin người dùng & phân quyền)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    username TEXT UNIQUE,
    student_code TEXT UNIQUE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'teacher', 'student')) DEFAULT 'student',
    status TEXT NOT NULL CHECK (status IN ('active', 'locked')) DEFAULT 'active',
    grade_level INT CHECK (grade_level BETWEEN 6 AND 9),
    total_stars INT DEFAULT 0,
    total_coins INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index cho profiles
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_grade ON public.profiles(grade_level);
CREATE INDEX IF NOT EXISTS idx_profiles_student_code ON public.profiles(student_code);

-- 2. CLASSES (Lớp học)
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    grade_level INT NOT NULL CHECK (grade_level BETWEEN 6 AND 9),
    code TEXT UNIQUE NOT NULL,
    teacher_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_classes_teacher ON public.classes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_classes_grade ON public.classes(grade_level);

-- 3. CLASS_MEMBERS (Danh sách học sinh thuộc lớp)
CREATE TABLE IF NOT EXISTS public.class_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_class_student UNIQUE (class_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_class_members_class ON public.class_members(class_id);
CREATE INDEX IF NOT EXISTS idx_class_members_student ON public.class_members(student_id);

-- 4. MATERIAL_CATEGORIES (Cây danh mục bài học theo Khối & Unit)
CREATE TABLE IF NOT EXISTS public.material_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grade_level INT NOT NULL CHECK (grade_level BETWEEN 6 AND 9),
    unit_name TEXT NOT NULL,
    lesson_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_material_cat_grade ON public.material_categories(grade_level);

-- 5. MATERIALS (Tệp tin học liệu & bài giảng)
CREATE TABLE IF NOT EXISTS public.materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.material_categories(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT NOT NULL, -- 'pdf', 'docx', 'pptx', 'game_html', 'video', 'image', 'iframe_link'
    uploader_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_materials_category ON public.materials(category_id);

-- 6. QUIZZES (Bộ đề thi & bài kiểm tra)
CREATE TABLE IF NOT EXISTS public.quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    grade_level INT NOT NULL CHECK (grade_level BETWEEN 6 AND 9),
    creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    time_limit_minutes INT DEFAULT 15,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quizzes_grade ON public.quizzes(grade_level);

-- 7. QUIZ_QUESTIONS (Câu hỏi kiểm tra)
CREATE TABLE IF NOT EXISTS public.quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL DEFAULT '[]'::jsonb,
    correct_answer TEXT NOT NULL,
    question_type TEXT NOT NULL CHECK (question_type IN ('multiple_choice', 'fill_in_blanks', 'sentence_scramble', 'reading_comprehension')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_questions_quiz ON public.quiz_questions(quiz_id);

-- 8. STUDENT_QUIZ_RESULTS (Kết quả làm bài thi của học sinh)
CREATE TABLE IF NOT EXISTS public.student_quiz_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    score NUMERIC(5, 2) NOT NULL,
    stars_earned INT DEFAULT 0,
    answers JSONB DEFAULT '{}'::jsonb,
    submitted_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quiz_results_student ON public.student_quiz_results(student_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_quiz ON public.student_quiz_results(quiz_id);

-- 9. BEHAVIOR_LOGS (Sổ theo dõi nề nếp & điểm danh)
CREATE TABLE IF NOT EXISTS public.behavior_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action_type TEXT NOT NULL CHECK (action_type IN ('plus', 'minus', 'attendance', 'praise')),
    points INT NOT NULL DEFAULT 1,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_behavior_student ON public.behavior_logs(student_id);
CREATE INDEX IF NOT EXISTS idx_behavior_class ON public.behavior_logs(class_id);

-- 10. BADGES (Huy hiệu thành tích)
CREATE TABLE IF NOT EXISTS public.badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon_name TEXT NOT NULL DEFAULT 'Award',
    required_stars INT NOT NULL DEFAULT 10,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. STUDENT_BADGES (Huy hiệu đã đạt của học sinh)
CREATE TABLE IF NOT EXISTS public.student_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES public.badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_student_badge UNIQUE (student_id, badge_id)
);

CREATE INDEX IF NOT EXISTS idx_student_badges_student ON public.student_badges(student_id);


-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.behavior_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_badges ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
CREATE POLICY "Allow public read access to profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow users to update own profile or admins/teachers to edit" ON public.profiles 
FOR UPDATE USING (
  auth.uid() = id OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
);
CREATE POLICY "Allow admins/teachers to insert profiles" ON public.profiles FOR INSERT WITH CHECK (true);

-- 2. Classes Policies
CREATE POLICY "Allow authenticated read classes" ON public.classes FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow teachers/admins to insert/update classes" ON public.classes 
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
);

-- 3. Class Members Policies
CREATE POLICY "Allow members read" ON public.class_members FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow teachers to modify members" ON public.class_members 
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
);

-- 4. Material Categories & Materials Policies
CREATE POLICY "Read material categories" ON public.material_categories FOR SELECT USING (true);
CREATE POLICY "Modify material categories" ON public.material_categories FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
);

CREATE POLICY "Read materials" ON public.materials FOR SELECT USING (true);
CREATE POLICY "Insert/Update materials" ON public.materials FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
);

-- 5. Quizzes & Quiz Questions Policies
CREATE POLICY "Read quizzes" ON public.quizzes FOR SELECT USING (true);
CREATE POLICY "Modify quizzes" ON public.quizzes FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
);

CREATE POLICY "Read quiz questions" ON public.quiz_questions FOR SELECT USING (true);
CREATE POLICY "Modify quiz questions" ON public.quiz_questions FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
);

-- 6. Student Quiz Results Policies
CREATE POLICY "Read quiz results" ON public.student_quiz_results FOR SELECT USING (
  auth.uid() = student_id OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
);
CREATE POLICY "Insert quiz results" ON public.student_quiz_results FOR INSERT WITH CHECK (
  auth.uid() = student_id OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
);

-- 7. Behavior Logs Policies
CREATE POLICY "Read behavior logs" ON public.behavior_logs FOR SELECT USING (
  auth.uid() = student_id OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
);
CREATE POLICY "Modify behavior logs" ON public.behavior_logs FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
);

-- 8. Badges & Student Badges Policies
CREATE POLICY "Read badges" ON public.badges FOR SELECT USING (true);
CREATE POLICY "Modify badges" ON public.badges FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
);

CREATE POLICY "Read student badges" ON public.student_badges FOR SELECT USING (true);
CREATE POLICY "Modify student badges" ON public.student_badges FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
);


-- ====================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER VIA SUPABASE AUTH
-- ====================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, status, grade_level, username, student_code)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    'active',
    CAST(COALESCE(NEW.raw_user_meta_data->>'grade_level', '8') AS INT),
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'student_code'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger sau khi tạo auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ====================================================================
-- SEED DATA BAN ĐẦU (CÂY HỌC LIỆU KHỐI 6-9 & HUY HIỆU MẪU)
-- ====================================================================

-- 1. Badges mẫu môn Tiếng Anh
INSERT INTO public.badges (title, description, icon_name, required_stars) VALUES
('Master of Vocabulary', 'Tích lũy 50 sao từ bài thi từ vựng', 'BookOpen', 50),
('Grammar Expert', 'Tích lũy 100 sao từ kiểm tra ngữ pháp', 'CheckCircle2', 100),
('Streak 7 Ngày', 'Tích cực tham gia học tập liên tục 7 ngày', 'Flame', 30),
('Ngôi Sao Nề Nếp', 'Đạt 20 điểm cộng nề nếp từ giáo viên', 'Star', 40),
('Nhà Thám Hiểm Tiếng Anh', 'Hoàn thành bài học ở cả 4 khối lớp', 'Compass', 60),
('Vua Trò Chơi', 'Chiến thắng 10 ván game tương tác', 'Trophy', 80)
ON CONFLICT DO NOTHING;

-- 2. Material Categories (Global Success Curriculum)
-- Khối 6
INSERT INTO public.material_categories (grade_level, unit_name, lesson_name) VALUES
(6, 'Unit 1: My New School', 'Lesson 1: Vocabulary & Pronunciation'),
(6, 'Unit 1: My New School', 'Lesson 2: Grammar - Present Simple'),
(6, 'Unit 2: My House', 'Lesson 1: Types of House & Rooms'),
(6, 'Unit 3: My Friends', 'Lesson 1: Personality Traits'),

-- Khối 7
(7, 'Unit 1: Hobbies', 'Lesson 1: Free time activities'),
(7, 'Unit 2: Healthy Living', 'Lesson 1: Health problems & advice'),
(7, 'Unit 3: Community Service', 'Lesson 1: Volunteer work'),

-- Khối 8
(8, 'Unit 1: Leisure Time', 'Lesson 1: Vocabulary & Collocations'),
(8, 'Unit 2: Life in the Countryside', 'Lesson 1: Comparative Adverbs'),
(8, 'Unit 3: Teenagers', 'Lesson 1: School clubs & Social media'),

-- Khối 9
(9, 'Unit 1: Local Environment', 'Lesson 1: Traditional Crafts'),
(9, 'Unit 2: City Life', 'Lesson 2: Phrasal Verbs'),
(9, 'Unit 3: Teen Stress and Pressure', 'Lesson 1: Coping skills')
ON CONFLICT DO NOTHING;
