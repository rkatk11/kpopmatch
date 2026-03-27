<template>
  <div class="container">
    <div class="lang-selector">
      <select v-model="$i18n.locale">
        <option value="ko">한국어</option>
        <option value="en">English</option>
        <option value="ja">日本語</option>
        <option value="zh">简体中文</option>
      </select>
    </div>

    <header class="header">
      <h1>{{ $t('title') }}</h1>
      <p>{{ $t('subtitle') }}</p>
    </header>

    <div v-if="!modelLoaded" class="loading-overlay app-init-loading">
      <div class="spinner"></div>
      <p>{{ $t('loading') }}</p>
    </div>

    <main v-else class="main-content">
      <div class="upload-pane">
        <section class="upload-section">
          <div
              class="image-preview-wrapper"
              :class="{ 'has-image': imageUrl }"
              @click="triggerFileInput"
          >
            <img v-if="imageUrl" :src="imageUrl" ref="uploadedImage" class="preview-image" alt="User upload" />
            <div v-else class="upload-placeholder">
              <span class="icon">📷</span>
              <p>{{ $t('placeholder') }}</p>
            </div>
          </div>
          <input
              type="file"
              ref="fileInput"
              @change="handleFileChange"
              accept="image/*"
              style="display: none"
          />
        </section>

        <section v-if="imageUrl" class="action-section">
          <button
              @click="predict"
              class="analyze-btn"
              :disabled="isAnalyzing"
          >
            {{ isAnalyzing ? $t('analyzing') : $t('analyze') }}
          </button>
        </section>
      </div>

      <div class="result-pane">
        <div v-if="imageUrl && !isAnalyzing && topResults.length === 0" class="result-placeholder">
          <p>👉 {{ $t('clickAnalyzeRequest') || '닮은꼴 찾기 버튼을 눌러주세요' }}</p>
        </div>

        <transition name="fade">
          <div v-if="isAnalyzing" class="loading-overlay analysis-loading">
            <div class="spinner"></div>
            <p>{{ $t('analyzing') }}...</p>
          </div>
        </transition>

        <transition name="slide-up">
          <div v-if="topResults.length > 0 && !isAnalyzing" class="match-result-container">
            <div class="result-header">
              <span class="celebrity-icon">✨</span>
              <h2>{{ $t('resultTitle') }}</h2>
            </div>

            <div class="result-card rank-1">
              <div class="rank-badge">1st Priority</div>
              <div class="celebrity-image-container">
                <img
                    :src="getCelebrityImageUrl(topResults[0].className)"
                    class="celebrity-image"
                    @error="handleImageError"
                />
              </div>
              <p class="celebrity-name">{{ topResults[0].className }}</p>
              <p class="celebrity-probability">
                {{ (topResults[0].probability * 100).toFixed(1) }}% {{ $t('matchRate') }}
              </p>
            </div>

            <hr class="result-divider" v-if="topResults[1]" />

            <div v-if="topResults[1]" class="result-card rank-2">
              <div class="rank-badge small">2nd</div>
              <div class="celebrity-image-container small">
                <img
                    :src="getCelebrityImageUrl(topResults[1].className)"
                    class="celebrity-image"
                    @error="handleImageError"
                />
              </div>
              <div class="text-group">
                <p class="celebrity-name small">{{ topResults[1].className }}</p>
                <p class="celebrity-probability small">
                  {{ (topResults[1].probability * 100).toFixed(1) }}%
                </p>
              </div>
            </div>

            <div class="share-section">
              <p class="share-title">{{ $t('shareResult') || '결과 공유하기' }}</p>
              <div class="share-buttons">
                <button @click="shareToKakao" class="share-btn kakao">💬</button>
                <button @click="shareToSNS('facebook')" class="share-btn facebook">f</button>
                <button @click="shareToSNS('twitter')" class="share-btn twitter">𝕏</button>
                <button @click="copyLink" class="share-btn link">🔗</button>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import * as tmImage from '@teachablemachine/image';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// 경로 설정 (public 폴더 기준)
const MODEL_PATH = '/model/';
const CELEB_IMG_BASE_PATH = '/images/celebrities/';

// 상태 관리
const modelLoaded = ref(false);
const isAnalyzing = ref(false);
const imageUrl = ref(null);
const topResults = ref([]); // 상위 2개 결과 저장

// DOM 참조
const fileInput = ref(null);
const uploadedImage = ref(null);

let model;

// 모델 로드
const loadModel = async () => {
  try {
    const modelURL = MODEL_PATH + 'model.json';
    const metadataURL = MODEL_PATH + 'metadata.json';
    model = await tmImage.load(modelURL, metadataURL);
    modelLoaded.value = true;
  } catch (error) {
    console.error('모델 로딩 실패:', error);
    alert(t('loadingError') || '모델 로드 실패');
  }
};

onMounted(() => {
  loadModel();
  // 카카오 초기화 (본인의 JavaScript 키로 교체하세요)
  if (window.Kakao && !window.Kakao.isInitialized()) {
    window.Kakao.init('YOUR_KAKAO_JS_KEY');
  }
});

// 파일 업로드 처리
const triggerFileInput = () => {
  if (!isAnalyzing.value) fileInput.value.click();
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imageUrl.value = e.target.result;
      topResults.value = [];
    };
    reader.readAsDataURL(file);
  }
};

// [핵심] 1, 2순위 예측 로직
const predict = async () => {
  if (!model || !uploadedImage.value) return;

  topResults.value = [];
  isAnalyzing.value = true;

  // 인위적 지연 (로딩 효과용)
  await new Promise(resolve => setTimeout(resolve, 800));

  try {
    const prediction = await model.predict(uploadedImage.value);
    console.log(prediction);
    // 확률순 정렬 후 상위 2개 추출
    const sorted = prediction
        .sort((a, b) => b.probability - a.probability)
        .slice(0, 2);

    topResults.value = sorted;
  } catch (error) {
    console.error('분석 오류:', error);
  } finally {
    isAnalyzing.value = false;
  }
};

// 유틸리티 함수
const getCelebrityImageUrl = (className) => `${CELEB_IMG_BASE_PATH}${className}.jpg`;
const handleImageError = (e) => { e.target.src = '';/*'/images/celebrities/default.png';*/ };

// 공유 기능
const shareToKakao = () => {
  if (!topResults.value.length) return;
  const top = topResults.value[0];
  window.Kakao.Share.sendDefault({
    objectType: 'feed',
    content: {
      title: '나의 연예인 닮은꼴은?',
      description: `나는 ${top.className}을(를) ${(top.probability * 100).toFixed(1)}% 닮았네요!`,
      imageUrl: window.location.origin + getCelebrityImageUrl(top.className),
      link: { mobileWebUrl: window.location.href, webUrl: window.location.href },
    },
  });
};

const shareToSNS = (platform) => {
  const url = encodeURIComponent(window.location.href);
  let path = platform === 'facebook'
      ? `https://www.facebook.com/sharer/sharer.php?u=${url}`
      : `https://twitter.com/intent/tweet?url=${url}`;
  window.open(path, '_blank');
};

const copyLink = () => {
  navigator.clipboard.writeText(window.location.href).then(() => alert('링크 복사 완료!'));
};
</script>

<style scoped>
/* 컨테이너 및 레이아웃 */
.container { max-width: 1000px; margin: 0 auto; padding: 20px; text-align: center; font-family: sans-serif; }
.main-content { display: flex; gap: 40px; margin-top: 20px; }

/* 업로드 영역 */
.upload-pane { flex: 1; display: flex; flex-direction: column; align-items: center; }
.image-preview-wrapper {
  width: 100%; max-width: 350px; aspect-ratio: 1/1;
  border: 3px dashed #ccc; border-radius: 20px; overflow: hidden; cursor: pointer;
}
.preview-image { width: 100%; height: 100%; object-fit: cover; }
.analyze-btn {
  width: 100%; max-width: 350px; margin-top: 20px; padding: 15px;
  background: #3498db; color: white; border: none; border-radius: 12px; font-weight: bold; cursor: pointer;
}

/* 결과 영역 */
.result-pane {
  flex: 1; min-height: 450px; background: #fff; border-radius: 20px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05); display: flex; align-items: center; justify-content: center; position: relative;
}
.match-result-container { width: 100%; padding: 20px; }

/* 1, 2순위 카드 스타일 */
.result-card { display: flex; flex-direction: column; align-items: center; }
.rank-badge { background: #f1c40f; color: #fff; padding: 2px 10px; border-radius: 10px; font-size: 0.8rem; margin-bottom: 10px; }
.celebrity-image-container { width: 160px; height: 160px; border-radius: 50%; overflow: hidden; border: 4px solid #f1c40f; margin-bottom: 10px; }
.celebrity-image { width: 100%; height: 100%; object-fit: cover; }
.celebrity-name { font-size: 1.8rem; font-weight: bold; margin: 5px 0; }

.result-divider { width: 80%; border: 0; border-top: 1px solid #eee; margin: 20px auto; }

.rank-2 { flex-direction: row; justify-content: center; gap: 15px; }
.rank-2 .celebrity-image-container.small { width: 70px; height: 70px; border-color: #bdc3c7; }
.rank-2 .rank-badge.small { background: #bdc3c7; margin: 0; }

/* 공유 버튼 */
.share-section { margin-top: 30px; border-top: 1px dashed #eee; padding-top: 20px; }
.share-buttons { display: flex; justify-content: center; gap: 10px; }
.share-btn { width: 40px; height: 40px; border-radius: 50%; border: none; cursor: pointer; color: white; }
.share-btn.kakao { background: #fee500; color: #3c1e1e; }
.share-btn.facebook { background: #1877f2; }
.share-btn.twitter { background: #000; }
.share-btn.link { background: #95a5a6; }

/* 로딩 스피너 */
.spinner { border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin-bottom: 15px; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
.analysis-loading { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255,255,255,0.8); z-index: 5; display: flex; flex-direction: column; align-items: center; justify-content: center; }

/* 반응형 */
@media (max-width: 768px) { .main-content { flex-direction: column; } }
</style>