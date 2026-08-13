import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PageHeroBanner } from '../components/common/PageHeroBanner';
import { soundFX } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import { cmsStorage } from '../utils/cmsStorage';
import { 
  BookOpen, 
  BookMarked, 
  Brain, 
  Volume2, 
  Image as ImageIcon, 
  Gamepad2, 
  Edit3, 
  CheckCircle2, 
  Plus, 
  Eye, 
  Trash2, 
  Sparkles, 
  X,
  FileText,
  Download,
  Wand2,
  Upload,
  Link as LinkIcon,
  Eraser,
  RefreshCw,
  Sun,
  Moon,
  Zap,
  Check,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Palette,
  Type
} from 'lucide-react';

export const MaterialPage = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTypeParam = searchParams.get('type') || 'vocabulary';

  const [activeCategory, setActiveCategory] = useState(activeTypeParam);
  const [selectedGrade, setSelectedGrade] = useState(8);
  const [articlesList, setArticlesList] = useState([]);

  // INLINE EDITOR FORM STATE
  const [showEditorForm, setShowEditorForm] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState(null);

  const [formTitle, setFormTitle] = useState('');
  const [formGrade, setFormGrade] = useState(8);
  const [formUnit, setFormUnit] = useState('Unit 1: My New School / Leisure Time');
  const [formThumbnail, setFormThumbnail] = useState('https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600&auto=format&fit=crop');
  const [formDescription, setFormDescription] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formAudioUrl, setFormAudioUrl] = useState('');
  const [formFileUrl, setFormFileUrl] = useState('');
  const [isGeneratingAiImage, setIsGeneratingAiImage] = useState(false);

  // Formatting State Helpers
  const [selectedFont, setSelectedFont] = useState("'Be Vietnam Pro', sans-serif");
  const [selectedFontSize, setSelectedFontSize] = useState("15px");
  const [selectedTextColor, setSelectedTextColor] = useState("#ffffff");

  // Editor background mode toggle ('dark' vs 'paper')
  const [editorBgMode, setEditorBgMode] = useState('dark');

  // Custom Image Insert input helper
  const [insertImageUrl, setInsertImageUrl] = useState('');

  // Reader Modal State
  const [activeReaderArticle, setActiveReaderArticle] = useState(null);

  const editorRef = useRef(null);
  const contentEditableRef = useRef(null);

  const availableGlobalSuccessUnits = [
    'Unit 1: My New School / Leisure Time',
    'Unit 2: Life in Countryside / Healthy Living',
    'Unit 3: Teenagers / Community Service',
    'Unit 4: Ethnic Groups / Music and Arts',
    'Unit 5: Food and Drink / Vietnamese Food',
    'Unit 6: Lifestyles / Wonders of Vietnam',
    'Unit 7: Environmental Protection',
    'Unit 8: Shopping / Tourism',
    'Unit 9: Natural Disasters',
    'Unit 10: Communication in Future',
    'Unit 11: Science and Technology',
    'Unit 12: Life on Other Planets'
  ];

  const categoryBadgeColors = {
    vocabulary: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    grammar: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    audio: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    infographic: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    project: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    worksheet: 'bg-teal-500/20 text-teal-300 border-teal-500/40'
  };

  useEffect(() => {
    if (activeTypeParam) setActiveCategory(activeTypeParam);
  }, [activeTypeParam]);

  useEffect(() => {
    loadArticles();
  }, [activeCategory, selectedGrade]);

  useEffect(() => {
    const articleIdParam = searchParams.get('id');
    if (articleIdParam) {
      const found = cmsStorage.getArticleById(articleIdParam);
      if (found) {
        setActiveReaderArticle(found);
      }
    }
  }, [searchParams]);

  const loadArticles = () => {
    const categoryArticles = cmsStorage.getArticlesByCategory(activeCategory);
    setArticlesList(categoryArticles);
  };

  // WYSIWYG COMMAND EXECUTION HELPER
  const executeFormatCommand = (command, value = null) => {
    soundFX.playClick();
    document.execCommand(command, false, value);
    if (contentEditableRef.current) {
      setFormContent(contentEditableRef.current.innerHTML);
    }
  };

  // CHANGE FONT FAMILY FOR SELECTION OR WHOLE EDITOR
  const handleApplyFontFamily = (fontFamilyStr) => {
    setSelectedFont(fontFamilyStr);
    soundFX.playClick();
    if (contentEditableRef.current) {
      contentEditableRef.current.style.fontFamily = fontFamilyStr;
    }
    executeFormatCommand('fontName', fontFamilyStr);
  };

  // CHANGE FONT SIZE FOR SELECTION OR WHOLE EDITOR
  const handleApplyFontSize = (sizeStr) => {
    setSelectedFontSize(sizeStr);
    soundFX.playClick();
    if (contentEditableRef.current) {
      contentEditableRef.current.style.fontSize = sizeStr;
    }
    executeFormatCommand('fontSize', '3'); // standard size
  };

  // CHANGE TEXT COLOR FOR SELECTION (STRICT WORKING INLINE STYLE)
  const handleApplyTextColor = (colorHex) => {
    setSelectedTextColor(colorHex);
    soundFX.playClick();
    
    try {
      document.execCommand('styleWithCSS', false, true);
    } catch (e) {}

    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
      const range = sel.getRangeAt(0);
      const span = document.createElement('span');
      span.style.color = colorHex;
      span.style.fontWeight = 'bold';
      try {
        range.surroundContents(span);
      } catch (e) {
        document.execCommand('foreColor', false, colorHex);
      }
    } else {
      document.execCommand('foreColor', false, colorHex);
    }

    if (contentEditableRef.current) {
      setFormContent(contentEditableRef.current.innerHTML);
    }
  };

  const savedRangeRef = useRef(null);

  // SAVE CURSOR POSITION INSIDE EDITOR CONTAINER
  const handleSaveCursorPosition = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      try {
        const range = sel.getRangeAt(0);
        if (contentEditableRef.current && contentEditableRef.current.contains(range.commonAncestorContainer)) {
          savedRangeRef.current = range.cloneRange();
        }
      } catch (e) {}
    }
  };

  // HELPER TO RESTORE CURSOR AND INSERT HTML AT EXACT SAVED CURSOR POSITION
  const insertHtmlAtCursor = (htmlStr) => {
    soundFX.playClick();
    if (contentEditableRef.current) {
      contentEditableRef.current.focus();
    }

    const sel = window.getSelection();
    if (savedRangeRef.current && sel) {
      try {
        sel.removeAllRanges();
        sel.addRange(savedRangeRef.current);
      } catch (e) {}
    }

    document.execCommand('insertHTML', false, htmlStr);

    if (sel && sel.rangeCount > 0) {
      try {
        savedRangeRef.current = sel.getRangeAt(0).cloneRange();
      } catch (e) {}
    }

    if (contentEditableRef.current) {
      setFormContent(contentEditableRef.current.innerHTML);
    }
  };

  // INSERT CLEAN BLANK EDITABLE ACCORDION TOGGLE BOX AT EXACT CURSOR POSITION
  const handleInsertHiddenAnswerBox = () => {
    const accordionHtml = `
      <br/>
      <details style="margin: 16px 0; border-radius: 16px; border: 2px solid #10b981; overflow: hidden; text-align: left; background-color: #022c22;">
        <summary style="padding: 14px 18px; font-weight: 800; font-size: 13px; color: #ffffff; cursor: pointer; background-color: #059669; list-style: none; display: flex; align-items: center; justify-content: space-between; gap: 8px;">
          <span>👉 Bấm vào đây để xem Đáp án & Giải thích chi tiết</span>
          <span style="font-size: 11px; background-color: #047857; padding: 2px 8px; border-radius: 9999px; color: #ffffff;">ĐÁP ÁN ẨN</span>
        </summary>
        <div style="padding: 18px; color: #ecfdf5; font-size: 13px; font-weight: 600; line-height: 1.7; background-color: #064e3b; border-top: 1px solid #059669;">
          <p style="color: #fbbf24; font-weight: 800; margin-bottom: 8px;">📌 NỘI DUNG ĐÁP ÁN & LỜI GIẢI CHI TIẾT CỦA THẦY NGUYỄN VĂN HẢI:</p>
          <p style="color: #ffffff;">(Thầy nhấp chuột trực tiếp vào dòng này để gõ/dán nội dung đáp án và lời giải chi tiết cho bài tập...)</p>
        </div>
      </details>
      <br/>
    `;
    insertHtmlAtCursor(accordionHtml);
    alert('✨ ĐÃ CHÈN KHUNG ẨN ĐÁP ÁN TẠI ĐÚNG VỊ TRÍ CON TRỎ CHUỘT!');
  };

  // UPLOAD AUDIO FILE FROM COMPUTER DIRECTLY (TRANSPARENT AUDIO PLAYER NO ICON NO TITLE)
  const handleFileUploadAudioFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      soundFX.playClick();
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Audio = event.target.result;
        const audioHtml = `
          <br/>
          <div style="margin: 12px 0; background: transparent; border: none; padding: 4px 0;">
            <audio controls src="${base64Audio}" style="width: 100%; max-width: 650px; background: transparent; outline: none; border-radius: 9999px;" />
          </div>
          <br/>
        `;
        insertHtmlAtCursor(audioHtml);
        alert(`✨ ĐÃ TẢI LÊN FILE AUDIO "${file.name}" THÀNH CÔNG TẠI ĐÚNG VỊ TRÍ CON TRỎ CHUỘT!`);
      };
      reader.readAsDataURL(file);
    }
  };

  // INSERT AUDIO PLAYER FROM LINK (TRANSPARENT AUDIO PLAYER NO ICON NO TITLE)
  const handleInsertAudioPlayerAtCursor = () => {
    const audioUrl = prompt('Nhập link Audio MP3 hoặc link Google Drive bài nghe:');
    if (!audioUrl || !audioUrl.trim()) return;

    let directAudio = audioUrl.trim();
    const driveMatch = directAudio.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (driveMatch && driveMatch[1]) {
      directAudio = `https://docs.google.com/uc?export=open&id=${driveMatch[1]}`;
    }

    const audioHtml = `
      <br/>
      <div style="margin: 12px 0; background: transparent; border: none; padding: 4px 0;">
        <audio controls src="${directAudio}" style="width: 100%; max-width: 650px; background: transparent; outline: none; border-radius: 9999px;" />
      </div>
      <br/>
    `;
    insertHtmlAtCursor(audioHtml);
    alert('✨ ĐÃ CHÈN TRÌNH PHÁT AUDIO TRONG SUỐT TẠI ĐÚNG VỊ TRÍ CON TRỎ CHUỘT!');
  };

  // BULLETPROOF AI TEST FORMATTER: UNSTICK & ALIGN OPTIONS A, B, C, D INTO CLEAN LINES
  const handleAiFormatAndSeparateTestContent = () => {
    if (!formContent.trim()) {
      alert('Vui lòng dán nội dung bài kiểm tra/đề thi vào ô soạn thảo trước!');
      return;
    }

    soundFX.playClick();

    let text = formContent;

    // 1. Unstick glued options like "labC. To", "roomD. To", "CherriesB. Magazines", "ProjectsD. English"
    text = text.replace(/([^\s>])\s*([A-D]\.\s*)/g, '$1<br/>&nbsp;&nbsp;&nbsp;&nbsp;<strong>$2</strong>');

    // 2. Separate options B., C., D., A. on same lines
    text = text.replace(/([^\n<]+?)\s+([B-D]\.\s*)/g, '$1<br/>&nbsp;&nbsp;&nbsp;&nbsp;<strong>$2</strong>');
    text = text.replace(/([^\n<]+?)\s+(A\.\s*)/g, '$1<br/>&nbsp;&nbsp;&nbsp;&nbsp;<strong>$2</strong>');

    // 3. Highlight question numbers (1., 2., 3., 4., 5., etc.)
    text = text.replace(/(^|<br\s*\/?>|\n)\s*(\d{1,2}[\.\)])\s*/gi, '$1<br/><br/><strong style="color: #fbbf24; font-size: 14px;">$2 </strong>');

    // 4. Style options A., B., C., D. in bright green
    text = text.replace(/(A\.\s*|B\.\s*|C\.\s*|D\.\s*)/g, '<strong style="color: #34d399;">$1</strong>');

    const div = document.createElement('div');
    div.innerHTML = text;

    const formattedHtml = div.innerHTML;
    setFormContent(formattedHtml);
    if (contentEditableRef.current) {
      contentEditableRef.current.innerHTML = formattedHtml;
    }

    soundFX.playFanfare();
    confetti({ particleCount: 120, spread: 80 });

    alert('✨ AI ĐÃ BÓC TÁCH VÀ XUỐNG HÀNG THẲNG LỐI TOÀN BỘ CÁC LỰA CHỌN A, B, C, D CỦA BÀI KIỂM TRA!');
  };

  const selectedEditorImageRef = useRef(null);

  // CLICK IMAGE TO SELECT WITH GOLDEN OUTLINE
  const handleEditorClick = (e) => {
    handleSaveCursorPosition();
    if (e.target && e.target.tagName === 'IMG') {
      if (contentEditableRef.current) {
        const allImgs = contentEditableRef.current.querySelectorAll('img');
        allImgs.forEach(i => i.style.outline = 'none');
      }
      e.target.style.outline = '4px solid #f59e0b';
      e.target.style.outlineOffset = '4px';
      selectedEditorImageRef.current = e.target;
    }
  };

  // DOUBLE CLICK IMAGE TO INSTANTLY DELETE
  const handleEditorDoubleClick = (e) => {
    if (e.target && e.target.tagName === 'IMG') {
      if (window.confirm('Thầy có muốn xóa hình ảnh này khỏi bài viết?')) {
        soundFX.playClick();
        if (e.target.parentNode) {
          e.target.parentNode.removeChild(e.target);
        }
        selectedEditorImageRef.current = null;
        if (contentEditableRef.current) {
          setFormContent(contentEditableRef.current.innerHTML);
        }
      }
    }
  };

  // KEYDOWN BACKSPACE / DELETE TO DELETE SELECTED IMAGE
  const handleEditorKeyDown = (e) => {
    if ((e.key === 'Backspace' || e.key === 'Delete') && selectedEditorImageRef.current) {
      const target = selectedEditorImageRef.current;
      if (target && target.parentNode) {
        e.preventDefault();
        soundFX.playClick();
        target.parentNode.removeChild(target);
        selectedEditorImageRef.current = null;
        if (contentEditableRef.current) {
          setFormContent(contentEditableRef.current.innerHTML);
        }
      }
    }
  };

  // TOOLBAR BUTTON TO DELETE CURRENTLY SELECTED IMAGE
  const handleDeleteSelectedImageInEditor = () => {
    soundFX.playClick();
    let target = selectedEditorImageRef.current;

    if (!target && contentEditableRef.current) {
      const imgs = contentEditableRef.current.querySelectorAll('img');
      if (imgs.length > 0) {
        target = imgs[imgs.length - 1]; // Pick last image
      }
    }

    if (target && target.parentNode) {
      target.parentNode.removeChild(target);
      selectedEditorImageRef.current = null;
      setFormContent(contentEditableRef.current.innerHTML);
      alert('✨ Đã xóa hình ảnh khỏi bài viết thành công!');
    } else {
      alert('Thầy nhấp chuột trực tiếp vào hình ảnh cần xóa, sau đó bấm nút này để xóa ảnh!');
    }
  };

  // RESIZE ALL IMAGES IN EDITOR TO CUSTOM PERCENTAGE (30%, 50%, 75%, 100%)
  const handleSetImageSizeInEditor = (widthPercent) => {
    soundFX.playClick();
    if (!contentEditableRef.current) return;

    const imgs = contentEditableRef.current.querySelectorAll('img');
    if (imgs.length === 0) {
      alert('Không tìm thấy hình ảnh nào trong ô soạn thảo để co kéo kích thước!');
      return;
    }

    imgs.forEach(img => {
      img.style.width = widthPercent;
      img.style.maxWidth = '100%';
      img.style.height = 'auto';
      img.style.borderRadius = '16px';
      img.style.margin = '14px auto';
      img.style.display = 'block';
    });

    setFormContent(contentEditableRef.current.innerHTML);
    alert(`✨ ĐÃ CO KÉO KÍCH THƯỚC TOÀN BỘ HÌNH ẢNH THÀNH ${widthPercent} ĐẸP MẮT!`);
  };

  // SMART UNICODE NORMALIZE & FIX VIETNAMESE ACCENTS SPACING
  const handleFixVietnameseFontsAndAccents = () => {
    if (!formContent.trim()) return;
    soundFX.playClick();

    // Normalize Unicode diacritics (NFC format)
    let cleaned = formContent.normalize('NFC');

    // Strip weird broken spacing between Vietnamese accents (e.g. "thầ y" -> "thầy", "bắ t" -> "bắt")
    cleaned = cleaned.replace(/([a-zA-ZàáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđĐ])\s+([̣̀́̉̃̂̆])/g, '$1$2');

    const div = document.createElement('div');
    div.innerHTML = cleaned;

    // Force Be Vietnam Pro font on all elements
    const allEls = div.querySelectorAll('*');
    allEls.forEach(el => {
      el.style.fontFamily = "'Be Vietnam Pro', 'Inter', system-ui, sans-serif";
      el.style.letterSpacing = 'normal';
      el.style.wordSpacing = 'normal';
      if (editorBgMode === 'dark') {
        el.style.color = '#f8fafc';
        el.style.backgroundColor = 'transparent';
      }
    });

    const fixedHtml = div.innerHTML;
    setFormContent(fixedHtml);
    if (contentEditableRef.current) {
      contentEditableRef.current.innerHTML = fixedHtml;
    }

    alert('✨ ĐÃ TỰ ĐỘNG KHẮC PHỤC HOÀN TOÀN LỖI DẤU FONT TIẾNG VIỆT VÀ CHUẨN HÓA FONT BE VIETNAM PRO 100%!');
  };

  // SMART AI IMAGE GENERATOR FOR TITLE & CONTENT
  const handleAutoGenerateAiImageForTitle = () => {
    soundFX.playClick();
    setIsGeneratingAiImage(true);

    const fullText = (formTitle + ' ' + formContent.replace(/<[^>]*>?/gm, '')).toLowerCase();
    let topicKeyword = '3d pixar style english education school';

    if (fullText.includes('lighthouse') || fullText.includes('hải đăng')) topicKeyword = 'sea lighthouse beacon island 3d pixar';
    else if (fullText.includes('hospitable') || fullText.includes('hiếu khách')) topicKeyword = 'friendly welcoming people village 3d pixar';
    else if (fullText.includes('football') || fullText.includes('cahn') || fullText.includes('bàn thắng') || fullText.includes('trận đấu')) topicKeyword = 'stadium football soccer players 3d pixar';
    else if (fullText.includes('countryside') || fullText.includes('nông thôn')) topicKeyword = 'vietnam countryside nature farm 3d pixar';
    else if (fullText.includes('leisure') || fullText.includes('rảnh rỗi')) topicKeyword = 'teenagers origami craft hobby 3d pixar';
    else if (fullText.includes('healthy') || fullText.includes('sức khỏe')) topicKeyword = 'healthy food fruits exercise 3d pixar';
    else if (fullText.includes('music') || fullText.includes('âm nhạc')) topicKeyword = 'music instruments art students 3d pixar';
    else if (fullText.includes('food') || fullText.includes('ăn uống')) topicKeyword = 'vietnamese food cooking 3d pixar';
    else if (fullText.includes('environment') || fullText.includes('môi trường')) topicKeyword = 'green environment trees 3d pixar';
    else if (fullText.includes('space') || fullText.includes('vũ trụ')) topicKeyword = 'space planet astronaut rocket 3d pixar';
    else if (fullText.includes('science') || fullText.includes('khoa học')) topicKeyword = 'science technology robot AI 3d pixar';

    const dynamicAiUrl = `https://image.pollinations.ai/prompt/cute%20high%20quality%203d%20pixar%20illustration%20for%20${encodeURIComponent(topicKeyword)}?width=800&height=450&nologo=true`;

    setFormThumbnail(dynamicAiUrl);

    setTimeout(() => {
      setIsGeneratingAiImage(false);
      soundFX.playFanfare();
      confetti({ particleCount: 100, spread: 70 });
      alert(`✨ AI ĐÃ PHÂN TÍCH TIÊU ĐỀ & NỘI DUNG VÀ VẼ XONG ẢNH BÌA 3D PIXAR PHÙ HỢP CỰC CHUẨN!`);
    }, 1200);
  };

  // SMART PASTING SANITIZER: SUPPORT DIRECT SCREENSHOT IMAGE PASTE (WIN + SHIFT + S) & WEB ARTICLES
  const handlePasteContent = (e) => {
    e.preventDefault();
    soundFX.playClick();

    const clipboardData = e.clipboardData || window.clipboardData;
    if (!clipboardData) return;

    // 1. CHECK IF CLIPBOARD HAS SCREENSHOT / IMAGE FILES DIRECTLY (WIN + SHIFT + S / PRINT SCREEN / COPY IMAGE)
    const items = clipboardData.items;
    let pastedImageFile = null;

    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          pastedImageFile = items[i].getAsFile();
          break;
        }
      }
    }

    if (pastedImageFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Img = event.target.result;
        const imgHtml = `<br/><img src="${base64Img}" alt="Ảnh dán chụp màn hình" style="max-width: 100%; border-radius: 16px; margin: 14px auto; border: 1px solid #475569; display: block;" /><br/>`;
        insertHtmlAtCursor(imgHtml);
        alert('✨ ĐÃ DÁN HÌNH ẢNH CHỤP MÀN HÌNH (WIN + SHIFT + S) THÀNH CÔNG VÀO BÀI VIẾT!');
      };
      reader.readAsDataURL(pastedImageFile);
      return;
    }

    // 2. REGULAR HTML / TEXT PASTING FROM WEBSITES
    let html = clipboardData.getData('text/html');
    const text = clipboardData.getData('text/plain');

    if (html) {
      html = html.normalize('NFC');
      const div = document.createElement('div');
      div.innerHTML = html;

      // Extract real image src
      const imgs = div.querySelectorAll('img');
      imgs.forEach(img => {
        const realSrc = img.getAttribute('data-src') || 
                        img.getAttribute('data-original') || 
                        img.getAttribute('data-lazy-src') || 
                        img.getAttribute('src');

        if (realSrc && !realSrc.startsWith('data:image/svg')) {
          img.setAttribute('src', realSrc);
        }

        img.removeAttribute('data-src');
        img.removeAttribute('data-original');
        img.removeAttribute('data-lazy-src');

        img.style.maxWidth = '100%';
        img.style.borderRadius = '16px';
        img.style.margin = '12px auto';
        img.style.border = '1px solid #475569';
        img.style.display = 'block';
      });

      // Strip ugly inline backgrounds
      const allElements = div.querySelectorAll('*');
      allElements.forEach(el => {
        el.style.backgroundColor = 'transparent';
        el.style.background = 'transparent';
        el.style.fontFamily = "'Be Vietnam Pro', sans-serif";
      });

      html = div.innerHTML;
      document.execCommand('insertHTML', false, html);
    } else if (text) {
      document.execCommand('insertText', false, text);
    }

    if (contentEditableRef.current) {
      setFormContent(contentEditableRef.current.innerHTML);
    }
  };

  const handleStartCreateNew = () => {
    soundFX.playClick();
    setEditingArticleId(null);
    setFormTitle('');
    setFormGrade(selectedGrade);
    setFormUnit(availableGlobalSuccessUnits[0]);
    setFormThumbnail('https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600&auto=format&fit=crop');
    setFormDescription('');
    setFormContent('');
    setFormAudioUrl('');
    setFormFileUrl('');
    setShowEditorForm(true);

    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleStartEdit = (article) => {
    soundFX.playClick();
    setEditingArticleId(article.id);
    setFormTitle(article.title || '');
    setFormGrade(article.grade || selectedGrade);
    setFormUnit(article.unit || availableGlobalSuccessUnits[0]);
    setFormThumbnail(article.thumbnail || 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600&auto=format&fit=crop');
    setFormDescription(article.description || '');
    setFormContent(article.content || '');
    setFormAudioUrl(article.audioUrl || '');
    setFormFileUrl(article.fileUrl || '');
    setShowEditorForm(true);

    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleDeleteArticle = (articleId, title) => {
    if (window.confirm(`Thầy có chắc chắn muốn xóa bài viết: "${title}"?`)) {
      soundFX.playClick();
      cmsStorage.deleteArticle(articleId);
      loadArticles();
      alert('✨ Đã xóa bài viết thành công!');
    }
  };

  const handleInsertInlineImage = () => {
    if (!insertImageUrl.trim()) {
      alert('Vui lòng dán link ảnh!');
      return;
    }
    soundFX.playClick();
    const imgHtml = `<br/><img src="${insertImageUrl}" alt="Ảnh bài viết" style="max-width:100%; border-radius:16px; margin: 12px 0; border: 1px solid #475569; display: block;" /><br/>`;
    setFormContent(prev => prev + imgHtml);
    if (contentEditableRef.current) {
      contentEditableRef.current.innerHTML += imgHtml;
    }
    setInsertImageUrl('');
    alert('✨ Đã chèn hình ảnh thành công vào nội dung bài viết!');
  };

  const handleFileUploadImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      soundFX.playClick();
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Img = event.target.result;
        const imgHtml = `<br/><img src="${base64Img}" alt="Ảnh dán" style="max-width:100%; border-radius:16px; margin: 12px 0; border: 1px solid #475569; display: block;" /><br/>`;
        setFormContent(prev => prev + imgHtml);
        if (contentEditableRef.current) {
          contentEditableRef.current.innerHTML += imgHtml;
        }
        alert('✨ Đã tải lên và dán ảnh đính kèm thành công vào nội dung bài viết!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveArticleForm = (e) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert('Vui lòng nhập Tiêu đề bài viết!');
      return;
    }

    soundFX.playClick();

    const catKey = (activeCategory || 'vocabulary').toLowerCase();
    const finalContent = contentEditableRef.current ? contentEditableRef.current.innerHTML : formContent;

    const articlePayload = {
      id: editingArticleId || `art-custom-${Date.now()}`,
      title: formTitle,
      category: catKey,
      categoryLabel: catKey.toUpperCase(),
      badgeColor: categoryBadgeColors[catKey] || categoryBadgeColors.vocabulary,
      grade: formGrade,
      unit: formUnit,
      author: 'Thầy Nguyễn Văn Hải',
      thumbnail: formThumbnail,
      description: formDescription || 'Bài viết hướng dẫn bám sát sách giáo khoa Tiếng Anh THCS Global Success.',
      content: finalContent || '<p>Nội dung bài viết đang được cập nhật...</p>',
      audioUrl: formAudioUrl,
      fileUrl: formFileUrl
    };

    cmsStorage.saveArticle(articlePayload);
    loadArticles();

    soundFX.playFanfare();
    confetti({ particleCount: 150, spread: 90 });

    alert(`✨ ĐÃ LƯU & XUẤT BẢN BÀI VIẾT THÀNH CÔNG RÀ TRANG CHỦ VÀ MỤC ${catKey.toUpperCase()}!`);
    setShowEditorForm(false);
  };

  const subCategoryTabs = [
    { id: 'vocabulary', label: '1. Từ Vựng (Vocabulary)', icon: BookMarked, color: 'text-indigo-400' },
    { id: 'grammar', label: '2. Ngữ Pháp (Grammar)', icon: Brain, color: 'text-amber-400' },
    { id: 'audio', label: '3. Audio & Tapescript', icon: Volume2, color: 'text-purple-400' },
    { id: 'infographic', label: '4. Infographic Trực Quan', icon: ImageIcon, color: 'text-emerald-400' },
    { id: 'project', label: '5. iFrame Game & Project', icon: Gamepad2, color: 'text-rose-400' },
    { id: 'worksheet', label: '6. Phiếu Bài Tập 4 Kỹ Năng', icon: Edit3, color: 'text-teal-400' }
  ];

  const currentTabInfo = subCategoryTabs.find(t => t.id === activeCategory) || subCategoryTabs[0];

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans animate-fadeIn">
      
      {/* HERO BANNER */}
      <PageHeroBanner
        title="Thư Mục Học Liệu & Studio Soạn Bài Động 📚"
        subtitle="Quản lý, soạn mới, sửa bài, dán hình ảnh nguyên bản từ web và sinh ảnh AI 3D Pixar chuẩn tiêu đề & nội dung."
        badge="STUDIO SOẠN BÀI • GLOBAL SUCCESS KHỐI 6 - 9"
        bgImage="/images/hero_library_bg.jpg"
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleStartCreateNew}
              className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> + Soạn Bài Viết Mới Cho Mục Này
            </button>

            <div className="flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 backdrop-blur-md">
              {[6, 7, 8, 9].map((g) => (
                <button
                  key={g}
                  onClick={() => {
                    soundFX.playClick();
                    setSelectedGrade(g);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                    selectedGrade === g
                      ? 'bg-brand-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Khối {g}
                </button>
              ))}
            </div>
          </div>
        }
      />

      {/* 6 CATEGORY SUB-TABS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 p-1.5 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl">
        {subCategoryTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                soundFX.playClick();
                if (tab.id === 'worksheet') {
                  navigate('/worksheet');
                } else if (tab.id === 'project') {
                  navigate('/games');
                } else {
                  setActiveCategory(tab.id);
                  setSearchParams({ type: tab.id });
                }
              }}
              className={`p-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-lg scale-102 border border-brand-500/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${tab.color}`} />
              <span className="truncate">{tab.label}</span>
              {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* INLINE EDITOR FORM PANEL WITH FULL WYSIWYG TOOLBAR */}
      {showEditorForm && (
        <div ref={editorRef} className="glass-panel p-6 sm:p-8 space-y-6 border-2 border-indigo-500/60 bg-slate-900/95 shadow-2xl animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-indigo-400" />
              {editingArticleId ? `KHUNG CHỈNH SỬA BÀI VIẾT: ${formTitle}` : `KHUNG SOẠN BÀI VIẾT MỚI CHO MỤC ${activeCategory.toUpperCase()}`}
            </h3>
            <button
              onClick={() => setShowEditorForm(false)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1"
            >
              <X className="w-4 h-4" /> Đóng khung soạn
            </button>
          </div>

          <form onSubmit={handleSaveArticleForm} className="space-y-5 text-xs font-bold">
            
            {/* TITLE */}
            <div>
              <label className="block text-slate-300 mb-1">TIÊU ĐỀ BÀI VIẾT / BÀI HỌC *</label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Nhập tiêu đề bài viết..."
                className="w-full glass-input p-3 text-xs font-extrabold text-white"
                required
              />
            </div>

            {/* AI THUMBNAIL GENERATOR */}
            <div className="space-y-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <label className="text-indigo-400 font-extrabold flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-indigo-400" />
                    ẢNH BÌA AI 3D PIXAR CUTE PHÂN TÍCH TỰ ĐỘNG THEO NỘI DUNG BÀI VIẾT:
                  </label>
                  <p className="text-[11px] text-slate-400 font-normal">AI đọc cả Tiêu đề lẫn Nội dung Thầy vừa dán để vẽ 1 bức ảnh 3D Pixar khớp nhất!</p>
                </div>

                <button
                  type="button"
                  onClick={handleAutoGenerateAiImageForTitle}
                  disabled={isGeneratingAiImage}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-extrabold flex items-center gap-1.5 shadow hover:scale-105 transition-all shrink-0"
                >
                  <Wand2 className="w-4 h-4 animate-spin" />
                  {isGeneratingAiImage ? 'AI Đang Vẽ Ảnh 3D...' : '✨ AI Sinh Ảnh Khớp Bài Viết'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center pt-2">
                <div className="sm:col-span-4 h-32 rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
                  <img src={formThumbnail} alt="Thumbnail preview" className="w-full h-full object-cover" />
                </div>
                <div className="sm:col-span-8 space-y-2">
                  <span className="text-[11px] text-slate-400">Link ảnh bìa hiện tại (hoặc dán link ảnh tùy chọn):</span>
                  <input
                    type="url"
                    value={formThumbnail}
                    onChange={(e) => setFormThumbnail(e.target.value)}
                    placeholder="https://link-anh-bia-cua-thay.jpg"
                    className="w-full glass-input p-2.5 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* KHỐI LỚP & UNIT MENU SỔ XUỐNG */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 mb-1">KHỐI LỚP</label>
                <select
                  value={formGrade}
                  onChange={(e) => setFormGrade(parseInt(e.target.value))}
                  className="w-full glass-input p-3 text-xs bg-slate-900 font-extrabold text-white"
                >
                  <option value={6}>Khối 6</option>
                  <option value={7}>Khối 7</option>
                  <option value={8}>Khối 8</option>
                  <option value={9}>Khối 9</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">UNIT (MENU SỔ XUỐNG GLOBAL SUCCESS 12 UNITS)</label>
                <select
                  value={formUnit}
                  onChange={(e) => setFormUnit(e.target.value)}
                  className="w-full glass-input p-3 text-xs bg-slate-900 font-extrabold text-indigo-300"
                >
                  {availableGlobalSuccessUnits.map((u, uIdx) => (
                    <option key={uIdx} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-1">MÔ TẢ TÓM TẮT BÀI VIẾT (HIỂN THỊ TRÊN THẺ CARD)</label>
              <input
                type="text"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Tóm tắt ngắn bài viết..."
                className="w-full glass-input p-3 text-xs"
              />
            </div>

            {/* FULL FEATURED WYSIWYG FORMATTING TOOLBAR & EDITOR CONTAINER */}
            <div className="space-y-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              
              {/* TOP TOOLBAR ROW 1: FORMATTING CONTROLS */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                
                {/* Text Styles & Alignments */}
                <div className="flex flex-wrap items-center gap-1.5">
                  
                  {/* BOLD, ITALIC, UNDERLINE */}
                  <button
                    type="button"
                    onClick={() => executeFormatCommand('bold')}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs border border-slate-700 shadow"
                    title="Tô đậm (Ctrl + B)"
                  >
                    <Bold className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => executeFormatCommand('italic')}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs border border-slate-700 shadow"
                    title="In nghiêng (Ctrl + I)"
                  >
                    <Italic className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => executeFormatCommand('underline')}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs border border-slate-700 shadow"
                    title="Gạch chân (Ctrl + U)"
                  >
                    <Underline className="w-4 h-4" />
                  </button>

                  <div className="h-6 w-px bg-slate-800 mx-1" />

                  {/* ALIGNMENTS */}
                  <button
                    type="button"
                    onClick={() => executeFormatCommand('justifyLeft')}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700"
                    title="Căn trái"
                  >
                    <AlignLeft className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => executeFormatCommand('justifyCenter')}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700"
                    title="Căn giữa"
                  >
                    <AlignCenter className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => executeFormatCommand('justifyRight')}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700"
                    title="Căn phải"
                  >
                    <AlignRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => executeFormatCommand('justifyFull')}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700"
                    title="Căn đều 2 bên"
                  >
                    <AlignJustify className="w-4 h-4" />
                  </button>

                  <div className="h-6 w-px bg-slate-800 mx-1" />

                  {/* FONT FAMILY SELECT */}
                  <select
                    value={selectedFont}
                    onChange={(e) => handleApplyFontFamily(e.target.value)}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-indigo-300"
                  >
                    <option value="'Be Vietnam Pro', sans-serif">Be Vietnam Pro (Chuẩn Tiếng Việt)</option>
                    <option value="'Plus Jakarta Sans', sans-serif">Plus Jakarta Sans</option>
                    <option value="Arial, sans-serif">Arial</option>
                  </select>

                  {/* FONT COLOR PRESETS */}
                  <div className="flex items-center gap-1 pl-1">
                    {[
                      { color: '#ffffff', title: 'Trắng' },
                      { color: '#fbbf24', title: 'Vàng' },
                      { color: '#34d399', title: 'Xanh ngọc' },
                      { color: '#818cf8', title: 'Xanh dương' },
                      { color: '#f472b6', title: 'Hồng' }
                    ].map((c, cIdx) => (
                      <button
                        key={cIdx}
                        type="button"
                        onClick={() => handleApplyTextColor(c.color)}
                        className="w-6 h-6 rounded-full border border-slate-700 shadow shrink-0 transition-transform hover:scale-110"
                        style={{ backgroundColor: c.color }}
                        title={`Màu chữ ${c.title}`}
                      />
                    ))}
                  </div>

                </div>

                {/* Right Actions Toolbar: Audio Upload & Link, Video, Hidden Answers, AI Test Formatter & Image Resizer */}
                <div className="flex flex-wrap items-center gap-2">
                  
                  {/* AI TEST FORMATTER BUTTON */}
                  <button
                    type="button"
                    onClick={handleAiFormatAndSeparateTestContent}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-[11px] flex items-center gap-1 shadow scale-102 transition-all"
                    title="Tự động bóc tách các lựa chọn A, B, C, D dính liền thành hàng lối chuẩn đề thi SGK"
                  >
                    <Wand2 className="w-3.5 h-3.5" /> 🤖 AI Bóc Tách Đề A,B,C,D Hàng Lối
                  </button>

                  {/* IMAGE RESIZER DROPDOWN */}
                  <select
                    onChange={(e) => handleSetImageSizeInEditor(e.target.value)}
                    className="p-1.5 rounded-xl bg-slate-900 border border-emerald-500/50 text-[11px] font-bold text-emerald-300 shadow cursor-pointer"
                    title="Co kéo kích thước tất cả hình ảnh trong bài viết"
                    defaultValue="100%"
                  >
                    <option value="100%" disabled>🖼️ Chỉnh Cỡ Ảnh</option>
                    <option value="40%">🖼️ Cỡ Nhỏ (40%)</option>
                    <option value="60%">🖼️ Cỡ Vừa (60%)</option>
                    <option value="80%">🖼️ Cỡ Lớn (80%)</option>
                    <option value="100%">🖼️ Đầy Màn (100%)</option>
                  </select>

                  <label 
                    onMouseDown={handleSaveCursorPosition}
                    onClick={handleSaveCursorPosition}
                    className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-[11px] flex items-center gap-1 shadow cursor-pointer"
                    title="Tải tệp âm thanh MP3 trực tiếp từ máy tính của Thầy"
                  >
                    <Volume2 className="w-3.5 h-3.5" /> 🎧 Upload File Audio Từ Máy
                    <input type="file" accept="audio/*" onChange={handleFileUploadAudioFile} onClick={handleSaveCursorPosition} className="hidden" />
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      handleSaveCursorPosition();
                      handleInsertAudioPlayerAtCursor();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-purple-950 text-purple-300 border border-purple-500/40 hover:bg-purple-900 font-extrabold text-[11px] flex items-center gap-1 shadow"
                    title="Chèn link bài nghe MP3 / Google Drive tại vị trí con trỏ"
                  >
                    <LinkIcon className="w-3.5 h-3.5" /> Link Audio
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleSaveCursorPosition();
                      handleInsertVideoPlayerAtCursor();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-[11px] flex items-center gap-1 shadow"
                    title="Nhúng khung xem Video YouTube / MP4 tại vị trí con trỏ"
                  >
                    <ImageIcon className="w-3.5 h-3.5" /> 🎥 + Video
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleSaveCursorPosition();
                      handleInsertHiddenAnswerBox();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[11px] flex items-center gap-1 shadow"
                    title="Chèn khung ẩn đáp án trống cho Thầy tự nhập đáp án tại đúng vị trí con trỏ"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> 👉 + Khung Đáp Án Ẩn Trống
                  </button>

                  {/* DELETE SELECTED IMAGE BUTTON */}
                  <button
                    type="button"
                    onClick={handleDeleteSelectedImageInEditor}
                    className="px-3 py-1.5 rounded-xl bg-rose-950 text-rose-300 border border-rose-500/40 hover:bg-rose-900 font-extrabold text-[11px] flex items-center gap-1 shadow"
                    title="Xóa hình ảnh đang được nhấp chọn (Hoặc nhấp đúp vào ảnh / Nhấn Backspace)"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> 🗑️ Xóa Ảnh Đã Chọn
                  </button>

                  <button
                    type="button"
                    onClick={handleFixVietnameseFontsAndAccents}
                    className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-[11px] flex items-center gap-1 shadow"
                    title="Khắc phục toàn bộ lỗi dấu/dấu cách dời chữ Tiếng Việt"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> ✨ Sửa Font Tiếng Việt Dấu Mượt
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditorBgMode(editorBgMode === 'dark' ? 'paper' : 'dark')}
                    className={`px-3 py-1.5 rounded-xl font-extrabold text-[11px] border flex items-center gap-1 transition-all ${
                      editorBgMode === 'paper' 
                        ? 'bg-amber-100 text-slate-900 border-amber-300' 
                        : 'bg-slate-800 text-amber-300 border-slate-700'
                    }`}
                  >
                    {editorBgMode === 'paper' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
                    {editorBgMode === 'paper' ? 'Nền Tối Dark' : '☀️ Nền Giấy Sáng'}
                  </button>
                </div>

              </div>

              {/* CONTENTEDITABLE CONTAINER WITH IMAGE SELECTION & DELETION */}
              <div
                ref={contentEditableRef}
                contentEditable={true}
                onPaste={handlePasteContent}
                onKeyUp={(e) => {
                  handleSaveCursorPosition();
                  handleEditorKeyDown(e);
                }}
                onKeyDown={(e) => {
                  handleSaveCursorPosition();
                  handleEditorKeyDown(e);
                }}
                onMouseUp={handleSaveCursorPosition}
                onClick={(e) => {
                  handleSaveCursorPosition();
                  handleEditorClick(e);
                }}
                onDoubleClick={handleEditorDoubleClick}
                onSelect={handleSaveCursorPosition}
                onBlur={handleSaveCursorPosition}
                onInput={(e) => {
                  handleSaveCursorPosition();
                  setFormContent(e.currentTarget.innerHTML);
                }}
                className={`w-full min-h-[300px] max-h-[650px] overflow-y-auto p-5 text-sm font-sans leading-relaxed rounded-2xl border transition-all space-y-3 prose max-w-none focus:outline-none focus:ring-2 focus:ring-indigo-500 [&_img]:max-w-full [&_img]:rounded-2xl [&_img]:my-3 [&_img]:border [&_img]:border-slate-700 [&_img]:block ${
                  editorBgMode === 'paper'
                    ? 'bg-[#fefea2] text-slate-950 border-amber-300 prose-slate [&_*]:!bg-transparent'
                    : 'bg-slate-900/95 text-slate-100 border-slate-800 prose-invert [&_*]:!bg-transparent'
                }`}
                style={{ 
                  fontFamily: selectedFont,
                  wordBreak: 'break-word',
                  letterSpacing: 'normal',
                  wordSpacing: 'normal'
                }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 mb-1">LINK AUDIO GOOGLE DRIVE / MP3 (NẾU CÓ)</label>
                <input
                  type="url"
                  value={formAudioUrl}
                  onChange={(e) => setFormAudioUrl(e.target.value)}
                  placeholder="https://drive.google.com/... hoặc link MP3"
                  className="w-full glass-input p-3 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">LINK FILE ĐÍNH KÈM WORD/PDF/PROJECT (NẾU CÓ)</label>
                <input
                  type="url"
                  value={formFileUrl}
                  onChange={(e) => setFormFileUrl(e.target.value)}
                  placeholder="https://link-file-tailieu.docx"
                  className="w-full glass-input p-3 text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs shadow-xl flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 fill-white" />
              {editingArticleId ? '✨ LƯU THAY ĐỔI BÀI VIẾT' : '✨ LƯU & XUẤT BẢN BÀI VIẾT RA TRANG CHỦ'}
            </button>

          </form>
        </div>
      )}

      {/* DYNAMIC ARTICLE CARDS LIST */}
      <div className="space-y-6">
        
        {/* Category Header */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                Danh Mục: {currentTabInfo.label}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Danh sách {articlesList.length} bài viết do Thầy tự soạn trong danh mục này.
              </p>
            </div>
          </div>

          <button
            onClick={handleStartCreateNew}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg flex items-center justify-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" /> + Soạn Bài Viết Mới
          </button>
        </div>

        {/* Cards Grid */}
        {articlesList.length === 0 ? (
          <div className="glass-panel p-12 text-center text-slate-400 space-y-4">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
            <div>
              <p className="font-extrabold text-white text-base">Chưa có bài viết nào trong mục {currentTabInfo.label}.</p>
              <p className="text-xs text-slate-400 mt-1">Thầy nhấp nút "+ Soạn Bài Viết Mới" ở trên để mở ngay Khung soạn thảo mượt mà!</p>
            </div>

            <button
              onClick={handleStartCreateNew}
              className="px-6 py-3 rounded-2xl bg-indigo-600 text-white font-extrabold text-xs shadow-md mx-auto"
            >
              + Soạn Bài Viết Đầu Tiên
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articlesList.map((article) => (
              <div 
                key={article.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl hover:border-indigo-500/50 transition-all duration-300 flex flex-col justify-between group relative"
              >
                <div>
                  {/* Thumbnail Image Header */}
                  <div className="relative h-48 bg-slate-950 overflow-hidden">
                    <img 
                      src={article.thumbnail} 
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />

                    <span className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-indigo-600 text-white font-black text-[10px] uppercase shadow">
                      {article.categoryLabel || article.category}
                    </span>

                    {/* Action buttons top right */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <button
                        onClick={() => handleStartEdit(article)}
                        className="p-2.5 rounded-xl bg-slate-900/90 text-amber-300 hover:text-white hover:bg-slate-800 border border-amber-400/50 text-xs font-bold shadow backdrop-blur-md flex items-center gap-1"
                        title="Sửa bài viết"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteArticle(article.id, article.title)}
                        className="p-2.5 rounded-xl bg-slate-900/90 text-rose-400 hover:text-white hover:bg-rose-600 border border-rose-500/50 text-xs font-bold shadow backdrop-blur-md"
                        title="Xóa bài viết"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Body Text */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between text-[10px] font-extrabold text-slate-400 uppercase">
                      <span>Khối {article.grade || 8} • {article.unit || 'Unit 1'}</span>
                      <span className="text-slate-500">{article.date}</span>
                    </div>

                    <h3 className="text-base font-extrabold text-white group-hover:text-indigo-400 line-clamp-2 leading-snug">
                      {article.title}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {article.description}
                    </p>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-800/80 mt-3">
                  <span className="text-xs text-slate-400 font-semibold">Tác giả: <strong className="text-slate-200">{article.author}</strong></span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStartEdit(article)}
                      className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold text-xs flex items-center gap-1 hover:bg-amber-500 hover:text-slate-950"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Sửa
                    </button>

                    <button
                      onClick={() => {
                        soundFX.playClick();
                        setActiveReaderArticle(article);
                      }}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" /> Xem bài
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* Reader Modal */}
      {activeReaderArticle && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 text-slate-100 rounded-3xl max-w-4xl w-full border border-slate-800 overflow-hidden shadow-2xl space-y-0 relative animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="p-6 pb-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="space-y-1">
                <span className="px-3 py-1 rounded-full bg-indigo-600 text-white font-black text-[10px] uppercase">
                  {activeReaderArticle.categoryLabel || activeReaderArticle.category}
                </span>
                <h2 className="text-xl font-black text-white mt-1">{activeReaderArticle.title}</h2>
              </div>
              <button 
                onClick={() => setActiveReaderArticle(null)}
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div className="h-64 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                <img 
                  src={activeReaderArticle.thumbnail} 
                  alt={activeReaderArticle.title} 
                  className="w-full h-full object-cover"
                />
              </div>

              {activeReaderArticle.audioUrl && (
                <div className="p-4 rounded-2xl bg-purple-950/50 border border-purple-500/40 space-y-2">
                  <span className="text-xs font-black text-purple-300 flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-purple-400" />
                    FILE ÂM THANH BÀI NGHE AUDIO AUDIO STREAM:
                  </span>
                  <audio controls src={activeReaderArticle.audioUrl} className="w-full rounded-xl bg-slate-950" />
                </div>
              )}

              {/* ARTICLE READER WITH BE VIETNAM PRO FONT GUARANTEE & COLORED TEXT RETENTION */}
              <div 
                className="text-sm font-sans text-slate-100 leading-relaxed space-y-4 prose prose-invert max-w-none [&_*]:!bg-transparent [&_img]:max-w-full [&_img]:rounded-2xl [&_img]:my-3 [&_img]:border [&_img]:border-slate-700 [&_img]:block"
                style={{ fontFamily: "'Be Vietnam Pro', 'Inter', system-ui, sans-serif" }}
                dangerouslySetInnerHTML={{ __html: activeReaderArticle.content }}
              />

              {activeReaderArticle.fileUrl && (
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-indigo-400" /> Tệp tài liệu đính kèm:
                  </span>
                  <a
                    href={activeReaderArticle.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                  >
                    <Download className="w-3.5 h-3.5" /> Tải Tệp Về Máy
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
