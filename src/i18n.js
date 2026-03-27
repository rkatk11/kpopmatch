import { createI18n } from 'vue-i18n';

const messages = {
    ko: {
        title: '스타 매칭 AI',
        subtitle: '당신의 사진을 업로드하여 닮은꼴 연예인을 찾아보세요!',
        loading: 'AI 모델을 불러오는 중입니다...',
        placeholder: '클릭하거나 사진을 드래그하여 업로드',
        analyze: '닮은꼴 찾기',
        analyzing: '분석 중...',
        resultTitle: '가장 닮은 연예인은',
        matchRate: '일치'
    },
    en: {
        title: 'Star Matching AI',
        subtitle: 'Upload your photo to find your celebrity look-alike!',
        loading: 'Loading AI model...',
        placeholder: 'Click or drag photo to upload',
        analyze: 'Find Match',
        analyzing: 'Analyzing...',
        resultTitle: 'Your best match is',
        matchRate: 'Match'
    },
    ja: {
        title: 'スターマッチングAI',
        subtitle: '写真をアップロードして、似ている芸能人を探しましょう！',
        loading: 'AIモデルを読み込んでいます...',
        placeholder: 'クリックまたはドラッグしてアップロード',
        analyze: '似てる人を探す',
        analyzing: '分析中...',
        resultTitle: '最も似ている芸能人は',
        matchRate: '一致'
    },
    zh: {
        title: '明星匹配 AI',
        subtitle: '上传您的照片，寻找与您相像的明星！',
        loading: 'AI 模型加载中...',
        placeholder: '点击或拖拽照片上传',
        analyze: '开始匹配',
        analyzing: '分析中...',
        resultTitle: '最像您的明星是',
        matchRate: '匹配'
    }
};

const i18n = createI18n({
    legacy: false, // Composition API 사용
    locale: 'ko',   // 기본 언어
    fallbackLocale: 'en',
    messages,
});

export default i18n;