import { createI18n } from 'vue-i18n';

const messages = {
    ko: {
        title: '동물상 매칭 AI',
        subtitle: '나는 고양이 얼굴? 강아지 얼굴? 닮은 꼴을 찾아보고, 친구들에게 공유하세요!',
        subtitle2: '업로드하신 사진은 서버에 저장되지 않으니 안심하셔도 됩니다.',
        button1: '사이트 링크 복사',
        loading: 'AI 모델을 불러오는 중입니다...',
        placeholder: '클릭하여 사진을 업로드',
        analyze: '닮은 동물 찾기',
        analyzing: '분석 중...',
        resultTitle: '가장 닮은 동물은 ?',
        resultTitle2: '초상화 영역을 클릭 하면, 다양한 사진을 확인할 수 있어요!',
        matchRate: '일치',
        shareResult: '결과 공유하기',
        clickAnalyzeRequest: '닮은 동물 찾기 버튼을 눌러주세요',
        // 추가된 알림 및 공유 텍스트
        copySuccess: '링크가 복사되었습니다!',
        instaGuide: "링크가 복사되었습니다! 인스타그램 스토리에서 '링크 스티커'로 공유해보세요. ✨",
        kakaoTitle: '나의 연예인 닮은꼴 찾기 ✨',
        kakaoBtn: '나도 테스트해보기',
        xText: '나의 연예인 닮은꼴 결과는 {name}! 여러분도 확인해보세요. ✨'
    },
    en: {
        title: 'Animal Face Match AI',
        subtitle: 'Cat face? Dog face? Find your look-alike and share it with your friends!',
        subtitle2: 'Your photos are processed locally and never stored on our server.',
        button1: 'Copy Site Link',
        loading: 'Loading AI model...',
        placeholder: 'Click to upload your photo',
        analyze: 'Find My Animal Match',
        analyzing: 'Analyzing...',
        resultTitle: 'Your animal match is',
        resultTitle2: 'Click on the portrait area to see more photos!',
        matchRate: 'Match',
        shareResult: 'Share Result',
        clickAnalyzeRequest: 'Please click the "Find My Animal Match" button',
        copySuccess: 'Link copied to clipboard!',
        instaGuide: "Link copied! Share it using the 'Link Sticker' on Instagram Stories. ✨",
        kakaoTitle: 'Find My Celebrity Look-alike ✨',
        kakaoBtn: 'Try it myself',
        xText: 'My celebrity look-alike is {name}! Check yours now. ✨'
    },
    ja: {
        title: '動物顔診断 AI',
        subtitle: '私はネコ顔？イヌ顔？似ている動物를 진단해, 友達에 쉐어합시다!',
        subtitle2: '업로드된 사진은 서버에 저장되지 않으므로 안심하십시오.',
        button1: '사이트 링크 복사',
        loading: 'AI 모델을 로딩 중...',
        placeholder: '클릭하여 사진 업로드',
        analyze: '닮은 동물 찾기',
        analyzing: '분석 중...',
        resultTitle: '당신에게 가장 닮은 동물은',
        resultTitle2: '초상화 영역을 클릭하면 다양한 사진을 확인할 수 있습니다!',
        matchRate: '일치',
        shareResult: '결과 공유하기',
        clickAnalyzeRequest: '「닮은 동물 찾기」 버튼을 눌러주세요',
        copySuccess: '링크가 복사되었습니다!',
        instaGuide: "링크가 복사되었습니다! 인스타그램 스토리의 '링크 스티커'로 공유해보세요. ✨",
        kakaoTitle: '나의 닮은꼴 찾기 ✨',
        kakaoBtn: '나도 해보기',
        xText: '내 닮은꼴 결과는 {name}! 여러분도 확인해보세요. ✨'
    },
    zh: {
        title: '动物相匹配 AI',
        subtitle: '我是猫系脸？还是犬系脸？快来寻找你的匹配动物并分享给朋友吧！',
        subtitle2: '上传的照片不会保存在服务器上，请放心使用。',
        button1: '复制网站链接',
        loading: 'AI 模型加载中...',
        placeholder: '点击上传照片',
        analyze: '寻找相似动物',
        analyzing: '分析中...',
        resultTitle: '最像您的动物是',
        resultTitle2: '点击头像区域即可查看更多照片！',
        matchRate: '匹配度',
        shareResult: '分享结果',
        clickAnalyzeRequest: '请点击“寻找相似动物”按钮',
        copySuccess: '链接已复制！',
        instaGuide: "链接已复制！请在 Instagram Story 中使用“链接贴纸”分享。✨",
        kakaoTitle: '寻找我的明星脸 ✨',
        kakaoBtn: '我也要去测试',
        xText: '我最像的明星是 {name}！快来测试你的吧。 ✨'
    }
};

const i18n = createI18n({
    legacy: false,
    locale: 'ko',
    fallbackLocale: 'en',
    messages,
});

export default i18n;