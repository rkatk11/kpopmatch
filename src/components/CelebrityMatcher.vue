<template>
  <div class="container">
    <div class="ad-container top-ad">
      <div class="coupang-section">
        <a href="https://link.coupang.com/a/edatVM" target="_blank" referrerpolicy="unsafe-url"><img src="https://ads-partners.coupang.com/banners/976102?subId=&traceId=V0-301-879dd1202e5c73b2-I976102&w=728&h=90" alt=""></a>
      </div>
      <div class="coupang-section">
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-client="ca-pub-2562447876905458"
             data-ad-slot="1234567890"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
        <p class="ad-label">ADVERTISEMENT</p>
      </div>
    </div>

    <div class="lang-selector">
      Language:
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
      <p class="subtitle-notice">{{ $t('subtitle2') }}</p>
<!--      <button class="analyze-btn copy-main-btn" @click="copyLink2">
        {{ $t('button1') }}
      </button>-->
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
            <div class="ad-box-mini">
              <p>AI 분석 결과를 기다리는 중...</p>
            </div>
          </div>
        </transition>

        <transition name="slide-up">
          <div v-if="topResults.length > 0 && !isAnalyzing" class="match-result-container">
            <div class="result-header">
              <span class="celebrity-icon">✨</span>
              <h3>{{ $t('resultTitle') }}</h3>
              <h4>{{ $t('resultTitle2') }}</h4>
            </div>

            <div class="results-wrapper">
              <div @mouseup.stop="clickAnimalImageProfile(topResults[0])" class="result-card rank-1">
                <div class="rank-badge">1st</div>
                <div class="celebrity-image-container">
                  <img
                      :src="topResults[0].profileSrc"
                      class="celebrity-image"
                      @error="handleImageError"
                  />
                </div>
                <p class="celebrity-name">{{ topResults[0].className }}</p>
                <p class="celebrity-probability">
                  {{ (topResults[0].probability * 100).toFixed(1) }}%
                </p>
              </div>

              <div class="v-divider" v-if="topResults[1]"></div>

              <div  @mouseup.stop="clickAnimalImageProfile(topResults[1])" v-if="topResults[1]" class="result-card rank-2">
                <div class="rank-badge secondary">2nd</div>
                <div class="celebrity-image-container">
                  <img
                      :src="topResults[1].profileSrc"
                      class="celebrity-image"
                      @error="handleImageError"
                  />
                </div>
                <p class="celebrity-name">{{ topResults[1].className }}</p>
                <p class="celebrity-probability">
                  {{ (topResults[1].probability * 100).toFixed(1) }}%
                </p>
              </div>

              <div  @mouseup.stop.prevent="clickAnimalImageProfile(topResults[2])" v-if="topResults[2]" class="result-card rank-2">
                <div class="rank-badge secondary">3nd</div>
                <div class="celebrity-image-container">
                  <img
                      :src="topResults[2].profileSrc"
                      class="celebrity-image"
                      @error="handleImageError"
                  />
                </div>
                <p class="celebrity-name">{{ topResults[2].className }}</p>
                <p class="celebrity-probability">
                  {{ (topResults[2].probability * 100).toFixed(1) }}%
                </p>
              </div>
            </div>

            <div class="secondary-list">
              <div class="celebrity-image-container image-border-none" v-for="(v, k) in animalImageSecond.arr" :key="k">
                <img
                    :src="v"
                    class="celebrity-image"
                    @error="handleImageError"
                    @click="openModal(v)"
                />
              </div>
              <div class="celebrity-image-container image-border-none">
                <ins class="adsbygoogle"
                     style="display:inline-block;width:inherit;height:inherit;"
                     data-ad-client="ca-pub-2562447876905458"
                     data-ad-slot="0987654321"></ins>
                <p class="ad-label">AD</p>
              </div>
            </div>
            <div class="share-section">
              <p class="share-title">{{ $t('shareResult') || '결과 공유하기' }}</p>
              <div class="share-buttons">
<!--                <button @click="shareToKakao" class="share-btn kakao" title="카카오톡 공유">
                  <span class="icon">💬</span>
                </button>-->
                <button @click="shareToX" class="share-btn x-twitter" title="X 공유">
                  <span class="icon">𝕏</span>
                </button>
                <button @click="shareToInstagram" class="share-btn instagram" title="인스타그램 공유">
                  <span class="icon">📸</span>
                </button>
                <button @click="copyLink" class="share-btn link" title="링크 복사">
                  <span class="icon">🔗</span>
                </button>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </main>

    <transition name="fade">
      <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
          <button class="close-btn" @click="closeModal">×</button>
          <img :src="modalImage" class="modal-image" alt="Enlarged profile" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import {ref, onMounted, nextTick, watch, reactive} from 'vue';
import * as tmImage from '@teachablemachine/image';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const MODEL_PATH = '/model/';
const CELEB_IMG_BASE_PATH = '';
const MAIN_URL = 'https://zuzume.netlify.app/';

const modelLoaded = ref(false);
const isAnalyzing = ref(false);
const imageUrl = ref(null);
const topResults = ref([]);

const selectedIdx = ref(0);

const fileInput = ref(null);
const uploadedImage = ref(null);

// 모달 상태 변수
const isModalOpen = ref(false);
const modalImage = ref('');

let model;

// ... 기존 import 하단
const KAKAO_API_KEY = 'YOUR_KAKAO_JS_KEY'; // [중요] 본인의 카카오 JS 키를 입력하세요

onMounted(() => {
  loadModel();
  // 카카오 SDK 초기화
  if (window.Kakao && !window.Kakao.isInitialized()) {
    window.Kakao.init(KAKAO_API_KEY);
  }
  // ... 기존 광고 로직
});

// 1. 링크 복사 알림
const copyLink2 = () => {
  navigator.clipboard.writeText(MAIN_URL).then(() => {
    alert(t('copySuccess')); // "링크가 복사되었습니다!" (언어별 자동변경)
  });
};

// [주의] 실제 발급받은 JS 키를 입력하세요. (예: 'abc123456...')
const KAKAO_JS_KEY = 'YOUR_KAKAO_JAVASCRIPT_KEY';

onMounted(() => {
  loadModel();
  // 카카오 SDK 초기화 (중복 방지 체크)
  if (window.Kakao && !window.Kakao.isInitialized()) {
    window.Kakao.init(KAKAO_JS_KEY);
    console.log('Kakao SDK Initialized:', window.Kakao.isInitialized());
  }
});

const shareToKakao = () => {
  // 결과 데이터가 없으면 실행 안 함
  if (!topResults.value.length) {
    alert(t('clickAnalyzeRequest'));
    return;
  }

  const top = topResults.value[0];
  // 결과 메시지 구성: "나의 연예인 닮은꼴 1위는 강아지! (98.5% 일치)"
  const resultMessage = `${t('resultTitle')} ${top.className}! (${(top.probability * 100).toFixed(1)}% ${t('matchRate')})`;

  // 카카오톡 공유 실행
  window.Kakao.Share.sendDefault({
    objectType: 'feed',
    content: {
      title: t('kakaoTitle'), // "나의 연예인 닮은꼴 찾기 ✨"
      description: resultMessage,
      // 공유 시 보여줄 대표 이미지 (본인 서비스의 OG 이미지를 넣으세요)
      imageUrl: 'https://zuzume.netlify.app/og-image.jpg',
      link: {
        mobileWebUrl: MAIN_URL,
        webUrl: MAIN_URL,
      },
    },
    buttons: [
      {
        title: t('kakaoBtn'), // "나도 테스트해보기"
        link: {
          mobileWebUrl: MAIN_URL,
          webUrl: MAIN_URL,
        },
      },
    ],
  });
};

// X (Twitter) 공유 - 웹에서 새창으로 포스팅 창 열기
const shareToX = () => {
  if (!topResults.value.length) return;

  const top = topResults.value[0];
  // i18n에 설정한 xText를 가져오며 {name} 변수 치환
  const text = t('xText', { name: top.className });
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(MAIN_URL)}`;

  // 새창으로 띄우기
  window.open(url, '_blank', 'noopener,noreferrer');
};

// 인스타그램 가이드 - 웹에서는 공식 사이트 이동, 모바일은 앱 실행 시도
const shareToInstagram = () => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  navigator.clipboard.writeText(MAIN_URL).then(() => {
    // 다국어 알림창 띄우기
    alert(t('instaGuide'));

    if (isMobile) {
      // 모바일 환경이면 앱 실행 시도
      window.location.href = "instagram://";
      // 앱이 없으면 웹으로 이동 (약간의 딜레이 후 실행)
      setTimeout(() => {
        window.open("https://www.instagram.com/", "_blank");
      }, 500);
    } else {
      // PC 웹 환경이면 인스타그램 홈페이지 새창 열기
      window.open("https://www.instagram.com/", "_blank", 'noopener,noreferrer');
    }
  });
};


const loadModel = async () => {
  try {
    const modelURL = MODEL_PATH + 'model.json';
    const metadataURL = MODEL_PATH + 'metadata.json';
    model = await tmImage.load(modelURL, metadataURL);
    modelLoaded.value = true;
  } catch (error) {
    console.error('모델 로딩 실패:', error);
  }
};

onMounted(() => {
  loadModel();
  if (window.Kakao && !window.Kakao.isInitialized()) {
    window.Kakao.init('YOUR_KAKAO_JS_KEY');
  }
  try {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  } catch (e) {}
});

watch(() => topResults.value, async (newVal) => {
  if (newVal.length > 0) {
    await nextTick();
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {}
  }
});

const animalImageSecond = reactive({ arr: [] });

const clickAnimalImageProfile = (obj) => {
  const arr = [];
  for (let i = 0; i < 2; i++) {
    arr.push(getCelebrityImageUrl(obj.className));
  }
  animalImageSecond.arr = arr;
}

// 모달 제어 함수
const openModal = (imgSrc) => {
  modalImage.value = imgSrc;
  isModalOpen.value = true;
  // 스크롤 방지 (선택 사항)
  document.body.style.overflow = 'hidden';
};

const closeModal = () => {
  isModalOpen.value = false;
  document.body.style.overflow = 'auto';
};

const triggerFileInput = () => { if (!isAnalyzing.value) fileInput.value.click(); };

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

const predict = async () => {
  if (!model || !uploadedImage.value) return;
  topResults.value = [];
  isAnalyzing.value = true;
  await new Promise(resolve => setTimeout(resolve, 800));
  try {
    const prediction = await model.predict(uploadedImage.value);
    const sorted = prediction.sort((a, b) => b.probability - a.probability).slice(0, 3);

    topResults.value = sorted.map(v => {
      return {
        ...v,
        profileSrc: getCelebrityImageUrl(v.className)
      }
    });

    clickAnimalImageProfile(topResults.value[0]);

  } catch (error) {
    console.error(error);
  } finally {
    isAnalyzing.value = false;
  }
};

const getCelebrityImageUrl = (className) => {
  const randomNumber = Math.floor(Math.random() * 25) + 1;
  const imageId = String(randomNumber).padStart(6, '0');
  return `${CELEB_IMG_BASE_PATH}/${className}/${imageId}.jpg`;
};

const handleImageError = (e) => { e.target.src = ''; };

const copyLink = () => {
  navigator.clipboard.writeText(MAIN_URL).then(() => {
    alert(t('button1') + ' 완료!');
  }).catch(err => {
    console.error('복사 실패:', err);
  });
};
</script>

<style>
/* 기존 공통 스타일 유지 */
body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  font-family: sans-serif;
  background-color: #fdf6e3;
  background-attachment: fixed;
  overflow-x: hidden;
  position: relative;
  z-index: 0;
}

body::before {
  content: "";
  position: fixed;
  top: -150px;
  left: -150px;
  width: calc(100% + 150px);
  height: calc(100% + 150px);
  z-index: -1;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Ctext x='15' y='40' font-size='26' fill-opacity='0.12'%3E🐶%3C/text%3E%3Ctext x='75' y='40' font-size='26' fill-opacity='0.12'%3E🐱%3C/text%3E%3Ctext x='45' y='90' font-size='26' fill-opacity='0.12'%3E🐾%3C/text%3E%3C/svg%3E");
  background-size: 150px 150px;
  background-repeat: repeat;
  animation: emojiTransformSlide 25s linear infinite;
  will-change: transform;
}

@keyframes emojiTransformSlide {
  0% { transform: translate(0, 0); }
  100% { transform: translate(150px, 150px); }
}

/* 모달 스타일 추가 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
}

.modal-image {
  width: 100%;
  height: auto;
  max-height: 80vh;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  border: 5px solid white;
}

.close-btn {
  position: absolute;
  top: -40px;
  right: -10px;
  background: none;
  border: none;
  color: white;
  font-size: 40px;
  cursor: pointer;
  line-height: 1;
}
</style>

<style scoped>
/* 기존 scoped 스타일 유지 */
.image-border-none {
  border: none !important;
  border-radius: 0 !important;
}
.secondary-list {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-top: 25px;
}
img { object-fit: cover; width: 100%; height: 100%; cursor: pointer; }
.container { max-width: 1000px; margin: 0 auto; padding: 20px; text-align: center; position: relative; z-index: 1; }
.header h1, .header p { color: #333; margin-bottom: 10px; }
.subtitle-notice { font-size: 0.9rem; color: #666 !important; margin-bottom: 20px !important; }

.lang-selector { margin-bottom: 15px; color: #333; font-weight: bold; }
.lang-selector select { padding: 5px 10px; border-radius: 8px; border: 1px solid #ccc; background: rgba(255,255,255,0.8); }

.ad-container { margin: 15px 0; background-color: rgba(255, 255, 255, 0.95); border: 1px solid #eee; display: flex; flex-direction: column; align-items: center; justify-content: center; overflow: hidden; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
.ad-label { font-size: 10px; color: #aaa; margin-top: 4px; }
.top-ad { min-height: 90px; width: 100%; }
.middle-ad { min-height: 250px; width: 100%; max-width: 320px; margin: 25px auto; }

.results-wrapper { display: flex; align-items: center; justify-content: center; gap: 20px; margin-top: 20px; }
.result-card { flex: 1; display: flex; flex-direction: column; align-items: center; max-width: 200px; }
.celebrity-image-container { width: 140px; height: 140px; border-radius: 50%; overflow: hidden; border: 4px solid #f1c40f; margin-bottom: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); background: #eee; }
.rank-1 .celebrity-image-container { border-color: #f1c40f; }
.rank-2 .celebrity-image-container { border-color: #bdc3c7; width: 120px; height: 120px; }
.celebrity-name { font-size: 12px; font-weight: bold; margin: 5px 0; color: #333; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;}
.celebrity-probability { color: #666; font-weight: bold; }
.rank-badge { background: #f1c40f; color: #fff; padding: 3px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: bold; margin-bottom: 10px; }
.rank-badge.secondary { background: #bdc3c7; }
.v-divider { width: 1px; height: 150px; background-color: #eee; align-self: center; }

.main-content { display: flex; gap: 40px; margin-top: 20px; }
.upload-pane { flex: 1; display: flex; flex-direction: column; align-items: center; }
.image-preview-wrapper { width: 350px; max-width: 350px; aspect-ratio: 1/1; border: 3px dashed #ccc; border-radius: 20px; overflow: hidden; cursor: pointer; background: rgba(255, 255, 255, 0.9); display: flex; align-items: center; justify-content: center; transition: border-color 0.3s; }
.image-preview-wrapper:hover { border-color: #3498db; }

.analyze-btn { width: 100%; max-width: 350px; margin-top: 20px; padding: 15px; background: #3498db; color: white; border: none; border-radius: 12px; font-weight: bold; cursor: pointer; font-size: 1.1rem; transition: background 0.3s; box-shadow: 0 3px 6px rgba(0,0,0,0.1); }
.analyze-btn:hover { background: #2980b9; }

.result-pane { flex: 1; min-height: 450px; background: rgba(255, 255, 255, 0.95); border-radius: 20px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); display: flex; align-items: center; justify-content: center; position: relative; padding: 20px; border: 1px solid #eee; }

.spinner { border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin-bottom: 15px; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
.analysis-loading { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255, 255, 255, 0.95); z-index: 10; display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: 20px; }

@media (max-width: 768px) {
  .main-content { flex-direction: column; gap: 20px; }
  .results-wrapper { flex-direction: column; align-items: center; gap: 10px; }
  .v-divider { display: none; }
  .result-card { max-width: 100%; margin-bottom: 15px; }
  .analyze-btn, .image-preview-wrapper { max-width: 100%; }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-up-enter-active { transition: all 0.5s ease-out; }
.slide-up-enter-from { opacity: 0; transform: translateY(20px); }


.share-section {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px dashed #ddd;
}
.share-title {
  font-weight: bold;
  color: #555;
  margin-bottom: 15px;
}
.share-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
}
.share-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  transition: transform 0.2s;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
.share-btn:hover {
  transform: scale(1.1);
}
.share-btn.kakao { background: #fee500; }
.share-btn.x-twitter { background: #000; color: white; }
.share-btn.instagram {
  background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285aeb 90%);
  color: white;
}
.share-btn.link { background: #95a5a6; color: white; }

</style>