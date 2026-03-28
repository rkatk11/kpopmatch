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
      <p class="info-text">{{ $t('info1') }}</p>
      <a href="https://www.instagram.com/webdev__yun" target="_blank" class="insta-link">
        <span class="insta-icon">@</span>webdev__yun
      </a>
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
              <h3 class="main-title">{{ $t('resultTitle', { name: topResults[0].className }) }}</h3>
              <div class="info-container">
                <p class="tag features">{{ $t('resultTitle3', { name: animalData[topResults[0].className][`features_${$i18n.locale}`] }) }}</p>
                <p class="tag personality">{{ $t('resultTitle4', { name: animalData[topResults[0].className][`personality_${$i18n.locale}`] }) }}</p>
                <p class="tag representative">{{ $t('resultTitle5', { name: animalData[topResults[0].className][`representative`] }) }}</p>
                <p class="tag mbti">{{ $t('resultTitle6', { name: animalData[topResults[0].className].mbti }) }}</p>
              </div>
              <h4 class="sub-title">{{ $t('resultTitle2') }}</h4>
            </div>

            <div class="results-wrapper">
              <div @mouseup.stop="clickAnimalImageProfile(topResults[0])" class="result-card rank-1 gold-prisma-card">
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

              <div  @mouseup.stop="clickAnimalImageProfile(topResults[1])" v-if="topResults[1]" class="silver-prisma-card result-card rank-2">
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
              <div class="celebrity-image-container image-border-none">
                <img
                    :src="animalImageSecond.arr[0]"
                    class="celebrity-image"
                    @error="handleImageError"
                    @click="openModal(animalImageSecond.arr[0])"
                />
              </div>
              <div class="celebrity-image-container image-border-none">
                <ins class="adsbygoogle"
                     style="display:inline-block;width:inherit;height:inherit;"
                     data-ad-client="ca-pub-2562447876905458"
                     data-ad-slot="0987654321"></ins>
                <p class="ad-label">AD</p>
              </div>
              <div class="celebrity-image-container image-border-none">
                <img
                    :src="animalImageSecond.arr[1]"
                    class="celebrity-image"
                    @error="handleImageError"
                    @click="openModal(animalImageSecond.arr[1])"
                />
              </div>
              <div class="celebrity-image-container image-border-none">
                <ins class="kakao_ad_area" style="display:none;"
                     data-ad-unit = "DAN-csVZOfNQ8JqIuTsl"
                     data-ad-width = "300"
                     data-ad-height = "250"></ins>
              </div>
            </div>
            <div class="share-section">
              <p class="share-title">{{ $t('shareResult') || '결과 공유하기' }}</p>
              <div class="share-buttons">
                <button @click="shareToSNS('instagram')" class="btn-insta">Instagram</button>
                <button @click="shareToSNS('tiktok')" class="btn-tiktok">TikTok</button>
                <button @click="shareToSNS('x')" class="btn-x">X (Twitter)</button>
                <button @click="copySiteUrl" class="btn-x">
                  <span class="icon">🔗</span> URL
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
import {ref, onMounted, nextTick, watch, reactive, computed} from 'vue';
import * as tmImage from '@teachablemachine/image';
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();

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

const resultTxt = reactive({ data: {}})
const animalData = {
  // --- 고양이상 (Cat Faces) ---
  "Persian(페르시안)": {
    "representative": "배우 고소영, 배우 수지, Angelina Jolie, Adriana Lima",
    "mbti": "ISFP",
    "features_ko": "우아하고 화려한 분위기, 부드러운 얼굴 곡선과 기품 있는 눈매",
    "features_en": "Elegant and glamorous aura, with soft facial curves and graceful eyes.",
    "features_ja": "優雅で華やかな雰囲気、柔らかい顔の曲線と気品のある目元",
    "features_zh": "优雅华丽的气质，柔화的脸部轮廓和高贵的眼神",
    "personality_ko": "조용하고 온화하며 품격 있는 생활을 즐기는 타입",
    "personality_en": "Quiet, gentle, and enjoys a life of dignity and class.",
    "personality_ja": "静かで穏やか、品格のある生活を楽しむタイプ",
    "personality_zh": "安静温和，追求有品质生活的类型"
  },
  "Siamese(샴)": {
    "representative": "애프터스쿨 나나, 블랙핑크 제니, Bella Hadid, Alexa Demie",
    "mbti": "ENFP",
    "features_ko": "이국적이고 톡톡 튀는 미모, 날렵한 얼굴선과 매혹적인 눈빛",
    "features_en": "Exotic and trendy beauty with sharp facial lines and captivating eyes.",
    "features_ja": "異国情緒あふれる弾ける美貌、シャープなフェイスラインと魅혹的な眼差し",
    "features_zh": "异国风情且亮丽的容貌，锐利的脸部线条和迷人的眼神",
    "personality_ko": "사교적이고 영리하며 애정 표현이 확실하고 주목받길 좋아하는 성격",
    "personality_en": "Sociable, clever, expressive with affection, and loves to be in the spotlight.",
    "personality_ja": "社交的で賢く、愛情表現がはっきりしていて注目されるのが好きな性格",
    "personality_zh": "善于交际且聪明，感情表达直接，享受成为焦点"
  },
  "MaineCoon(메인쿤)": {
    "representative": "배우 이민호, 배우 한소희, Jason Momoa, Megan Fox",
    "mbti": "ENTJ",
    "features_ko": "뚜렷하고 시원시원한 이목구비, 대형 고양이 특유의 카리스마와 압도적인 포스",
    "features_en": "Distinct and bold features with the charismatic presence of a giant cat.",
    "features_ja": "はっきりとした涼しげな目鼻立ち、大型猫特有のカリスマ性と圧倒的な存在感",
    "features_zh": "立体感十足的五官，具有大型猫科动物特有的魅力和压倒性的气场",
    "personality_ko": "거대한 외모와 달리 다정하고 영리하며 '신사적'인 성격",
    "personality_en": "Despite a grand appearance, they are gentle, smart, and 'gentlemanly'.",
    "personality_ja": "大きな外見とは裏腹に、優しくて賢い「紳士的」な性格",
    "personality_zh": "与庞大的外表不同，性格温柔聪明且极具“绅士风度”"
  },
  "Ragdoll(랙돌)": {
    "representative": "아이브 장원영, 트와이스 사나, Elle Fanning, Anya Taylor-Joy",
    "mbti": "INFP",
    "features_ko": "인형 같은 미모, 몽환적이고 부드러운 이미지, 맑고 큰 눈방울",
    "features_en": "Doll-like beauty, a dreamy and soft image, and clear, large eyes.",
    "features_ja": "人形のような美貌、幻想的で柔らかなイメージ、澄んだ大きな瞳",
    "features_zh": "洋娃娃般的容貌，梦幻且柔和的形象，清澈明亮的大眼睛",
    "personality_ko": "여유롭고 차분하며 사람들에게 힐링을 주는 순한 성격",
    "personality_en": "Relaxed and calm, with a gentle nature that brings healing to others.",
    "personality_ja": "余裕があり落ち着いていて、人々に癒やしを与える穏やかな性格",
    "personality_zh": "从容冷静，拥有能给人带来治愈感的温顺性格"
  },
  "Bengal(뱅갈)": {
    "representative": "가수 이효리, 블락비 지코, Rihanna, Michael B. Jordan",
    "mbti": "ESTP",
    "features_ko": "야성미 넘치는 강렬한 눈매, 건강미와 에너지가 느껴지는 골격",
    "features_en": "Intense eyes full of wild beauty and a bone structure that exudes energy.",
    "features_ja": "野性味あふれる強烈な目元、健康美とエネルギーが感じられる骨格",
    "features_zh": "充满野性的强烈眼神，散发健康美与能量的骨骼轮廓",
    "personality_ko": "활동적이고 호기심이 많으며 도전을 즐기는 자신감 넘치는 타입",
    "personality_en": "Active, curious, and a confident type who enjoys taking on challenges.",
    "personality_ja": "活動的で好奇心が強く、挑戦を楽しむ自信に満ちたタイプ",
    "personality_zh": "充满活力且好奇心强，乐于迎接挑战并自信满满"
  },
  "BritishShorthair(브리티시 쇼트헤어)": {
    "representative": "배우 박보영, BTS 정국, Florence Pugh, Benedict Cumberbatch",
    "mbti": "ISTJ",
    "features_ko": "동글동글하고 친근한 얼굴형, 탄탄하고 단단해 보이는 안정감 있는 인상",
    "features_en": "Round and friendly face with a solid, stable, and reliable impression.",
    "features_ja": "丸くて親しみやすい顔立ち、がっしりとしていて安定感のある印象",
    "features_zh": "圆润亲切的脸型，给人结实沉稳、具有安定感的印象",
    "personality_ko": "인내심이 강하고 신중하며 독립적이면서도 다정한 성격",
    "personality_en": "Patient and cautious, highly independent yet affectionate.",
    "personality_ja": "忍耐強く慎重で、独立的でありながら優しい性格",
    "personality_zh": "耐心且谨慎，既独立又待人温柔"
  },
  "Abyssinian(아비시니안)": {
    "representative": "배우 김태리, 배우 신민아, Zoe Kravitz, Halle Berry",
    "mbti": "INTJ",
    "features_ko": "세련되고 지적인 느낌, 날렵하고 탄탄한 고전적인 고양이 상",
    "features_en": "Sophisticated and intellectual feel, with a sleek and athletic classic cat face.",
    "features_ja": "洗練された知的な雰囲気、シャープで引き締まった古典的な猫顔",
    "features_zh": "干练且知性的感觉，敏捷而结实的古典猫系相",
    "personality_ko": "민첩하고 똑똑하며 주변 상황을 빠르게 파악하는 재치 있는 타입",
    "personality_en": "Agile and smart, a witty type who quickly grasps their surroundings.",
    "personality_ja": "機敏で賢く、周囲の状況を素早く把握するウィットに富んだタイプ",
    "personality_zh": "机敏聪明，能快速洞察周围情况并极具智慧的类型"
  },
  "Sphynx(스핑크스)": {
    "representative": "배우 이주영, 모델 황지향, Tilda Swinton, Doja Cat",
    "mbti": "INFJ",
    "features_ko": "베일 듯 날카로운 턱선과 큰 귀, 신비롭고 이국적인 독보적 아우라",
    "features_en": "Razor-sharp jawline, large ears, and a mysterious, unique aura.",
    "features_ja": "剃刀のように鋭いあごのラインと大きな耳、神秘的でエキゾチックな独歩的オーラ",
    "features_zh": "锋利的下颌线和大耳朵，充满神秘感与异国情调的独特气场",
    "personality_ko": "겉모습과 달리 매우 다정하고 사람을 좋아하며 감수성이 풍부함",
    "personality_en": "Contrary to their appearance, they are very affectionate and highly sensitive.",
    "personality_ja": "外見とは裏腹に、とても優しくて人が好きで感受性が豊か",
    "personality_zh": "与外冷内热，非常温柔亲切，且感性丰富"
  },
  "ScottishFold(스코티시 폴드)": {
    "representative": "아이즈원 조유리, 에스엠 백현, Amanda Seyfried, G-Dragon",
    "mbti": "ESFJ",
    "features_ko": "동그랗고 커다란 눈, 부드러운 인상에서 오는 극강의 귀여움",
    "features_en": "Round large eyes and extreme cuteness coming from a soft impression.",
    "features_ja": "丸くて大きな目、柔らかな印象からくる究極の可愛さ",
    "features_zh": "圆圆的大眼睛，从柔和气质中散发出的极致可爱感",
    "personality_ko": "애교가 많고 온순하며 누구와도 잘 어울리는 평화주의자",
    "personality_en": "Charming and gentle, a pacifist who gets along with everyone.",
    "personality_ja": "愛嬌があり温厚で、誰とでもうまく付き合える平和主義者",
    "personality_zh": "爱撒娇且温顺，能与任何人相处融洽的和平主义者"
  },
  "RussianBlue(러시안 블루)": {
    "representative": "배우 원빈, 배우 안재현, Robert Pattinson, Eva Green",
    "mbti": "ISTP",
    "features_ko": "도회적이고 시크한 분위기, 신비로운 은빛 느낌의 깔끔한 마스크",
    "features_en": "Urban and chic atmosphere with a clean, mysterious silvery-toned face.",
    "features_ja": "都会的でシックな雰囲気、神秘的な銀色の清らかな顔立ち",
    "features_zh": "都市化的冷酷氛围，充满神秘银色感的干练面容",
    "personality_ko": "내성적이고 조용하지만 친해지면 깊은 신뢰를 주는 타입",
    "personality_en": "Introverted and quiet, but builds deep trust once close.",
    "personality_ja": "内性的で静かだが、仲良くなると深い信頼を寄せるタイプ",
    "personality_zh": "性格内向安静，但一旦亲近就会给予深厚的信任"
  },
  "NorwegianForest(노르웨이 숲)": {
    "representative": "배우 공유, 소녀시대 태연, Kit Harington, Sophie Turner",
    "mbti": "ENFJ",
    "features_ko": "풍성하고 화려한 분위기, 자연스러운 기품과 신비로운 눈빛",
    "features_en": "Voluminous and glamorous aura, with natural grace and mysterious eyes.",
    "features_ja": "豊かで華やかな雰囲気、自然な気品と神秘的な眼差し",
    "features_zh": "蓬松华丽的气质，自然的高贵感与神秘的眼神",
    "personality_ko": "겁이 없고 대범하며 야외 활동을 즐기는 강인한 성격",
    "personality_en": "Fearless and bold, with a strong personality that enjoys the outdoors.",
    "personality_ja": "物怖じせず大胆で、屋外活動を楽しむ強い性格",
    "personality_zh": "勇敢大胆，热爱户外活动，性格坚韧"
  },
  "Munchkin(먼치킨)": {
    "representative": "박나래, 하이라이트 양요섭, Maisie Williams, Bruno Mars",
    "mbti": "ESFP",
    "features_ko": "작고 소중한 느낌, 보고만 있어도 웃음이 나는 귀여운 동안",
    "features_en": "Small and precious feel, with a cute youthful face that brings smiles.",
    "features_ja": "小さくて大切な感じ、見ているだけで笑顔になる可愛い童顔",
    "features_zh": "娇小玲珑的感觉，看着就能让人露出微笑的可爱童颜",
    "personality_ko": "낙천적이고 장난기가 많으며 에너지가 넘치는 분위기 메이커",
    "personality_en": "Optimistic and playful, an energetic mood maker.",
    "personality_ja": "楽天的でいたずら好き、エネルギーあふれるムードメーカー",
    "personality_zh": "乐观且爱开玩笑，精力充沛的氛围制造者"
  },
  "AmericanShorthair(아메리칸 쇼트헤어)": {
    "representative": "워너원 강다니엘, 배우 류준열, Chris Pratt, Jennifer Lawrence",
    "mbti": "ESTJ",
    "features_ko": "건강하고 단단한 인상, 친근하면서도 질리지 않는 담백한 미모",
    "features_en": "Healthy and solid impression, with a friendly and timeless clean beauty.",
    "features_ja": "健康でがっしりとした印象、親しみやすく飽きのこない素朴な美しさ",
    "features_zh": "健康稳重的印象，亲切且百看不厌的清纯美貌",
    "personality_ko": "독립심이 강하고 적응력이 뛰어나며 명랑한 성격",
    "personality_en": "Highly independent, adaptable, and possesses a cheerful nature.",
    "personality_ja": "独立心が強く適応力に優れ、朗らかな性格",
    "personality_zh": "独立性强，适应能力极佳，性格开朗"
  },
  "TurkishAngora(터키시 앙고라)": {
    "representative": "배우 한효주, 배우 임시완, Nicole Kidman, Cate Blanchett",
    "mbti": "ISFJ",
    "features_ko": "우아하고 깨끗한 백치미, 가녀린 듯 기품 있는 선",
    "features_en": "Elegant and clean pure beauty, with delicate yet graceful lines.",
    "features_ja": "優雅で清潔感のある純粋な美しさ、か弱そうで気品のあるライン",
    "features_zh": "优雅纯净的洁白美感，纤细而不失高贵的轮廓",
    "personality_ko": "영리하고 눈치가 빠르며 가끔은 고집 있는 우아한 타입",
    "personality_en": "Smart and quick-witted, an elegant type that can be stubborn at times.",
    "personality_ja": "賢くて察しが良く、時にはこだわりを持つ優雅なタイプ",
    "personality_zh": "聪明且善于观察，有时也会带点小固执的优雅类型"
  },
  "Savannah(사바나캣)": {
    "representative": "가수 비, 가수 제시, Naomi Campbell, Will Smith",
    "mbti": "ENTP",
    "features_ko": "길쭉길쭉한 몸매와 날렵한 두상, 야생의 표범을 연상시키는 포스",
    "features_en": "Long, lean body and a sleek head, with a presence like a wild leopard.",
    "features_ja": "すらりとしたスタイルとシャープな頭部、野生のヒョウを思わせる存在感",
    "features_zh": "修长的身材和锐利的头部，让人联想到野生豹的霸气",
    "personality_ko": "모험심이 강하고 매우 똑똑하며 주인과 깊은 유대감을 형성함",
    "personality_en": "Adventurous and very intelligent, forming deep bonds with loved ones.",
    "personality_ja": "冒険心が強く非常に頭が良く、飼い主と深い絆を築く",
    "personality_zh": "冒险心强且非常聪明，能与主人建立深厚的情感联系"
  },
  "Burmese(버미즈)": {
    "representative": "마마무 화사, EXO 카이, Idris Elba, Beyoncé",
    "mbti": "ENFP",
    "features_ko": "그윽하고 깊은 눈매, 고급스럽고 매끄러운 이미지가 공존",
    "features_en": "Deep, soulful eyes with a luxurious and smooth image.",
    "features_ja": "奥深く深い目元、高級感と滑らかなイメージが共存",
    "features_zh": "深邃的双眸，高贵且圆滑的形象并存",
    "personality_ko": "다정하고 애교가 넘치며 사람의 목소리에 반응을 잘하는 타입",
    "personality_en": "Affectionate and charming, very responsive to human voices.",
    "personality_ja": "優しくて愛嬌があり、人の声によく反応するタイプ",
    "personality_zh": "待人温柔爱撒娇，对人的声音反应灵敏的类型"
  },
  "Chartreux(샤르트뢰)": {
    "representative": "배우 마동석, 배우 조진웅, Gerard Butler, Marion Cotillard",
    "mbti": "ISTJ",
    "features_ko": "단단한 골격과 미소를 머금은 듯한 입매, 듬직한 카리스마",
    "features_en": "Solid bone structure and a smile-like mouth, with reliable charisma.",
    "features_ja": "がっしりとした骨格と微笑んでいるような口元、頼もしいカリスマ性",
    "features_zh": "坚实的骨骼和仿佛带着微笑的唇形，可靠的魅力",
    "personality_ko": "헌신적이고 조용하며 영리하게 상황을 주도하는 리더 타입",
    "personality_en": "Devoted and quiet, a leader type who intelligently leads the situation.",
    "personality_ja": "献身的で静か、賢く状況をリードするリーダータイプ",
    "personality_zh": "忠诚且安静，能聪明地主导局面的领导者类型"
  },
  "Exotic(엑조틱 쇼트헤어)": {
    "representative": "하하, 김숙, Jack Black, Bill Murray",
    "mbti": "INTP",
    "features_ko": "눌린 듯한 매력의 코와 큰 눈, 보고만 있어도 편안해지는 개성파",
    "features_en": "Unique features with a flat nose and large eyes, a personality that makes others comfortable.",
    "features_ja": "潰れたような魅力の鼻と大きな目、見ているだけでリラックスできる個性派",
    "features_zh": "具有扁塌魅力的鼻子和大眼睛，看着就能让人感到舒适的个性派",
    "personality_ko": "느긋하고 게으른 듯 보이지만 주변을 편하게 만드는 능력자",
    "personality_en": "Appears laid-back and lazy, but is a pro at making people feel at ease.",
    "personality_ja": "のんびりして怠けているように見えるが、周囲を楽にさせる能力者",
    "personality_zh": "虽然看起来悠闲懒散，但却拥有让周围人感到放松的能力"
  },
  "Himalayan(히말라얀)": {
    "representative": "배우 이하늬, 배우 송혜교, Kim Kardashian, Priyanka Chopra",
    "mbti": "ISFJ",
    "features_ko": "페르시안의 우아함과 샴의 포인트가 합쳐진 화려함의 극치",
    "features_en": "The height of glamour, combining Persian elegance with Siamese points.",
    "features_ja": "ペルシャの優雅さとシャムのポイントが合わさった華やかさの極致",
    "features_zh": "结合了波斯猫的优雅与暹罗猫的重点色，华丽的极致",
    "personality_ko": "차분하고 정적인 것을 좋아하며 세심한 배려를 아끼지 않음",
    "personality_en": "Likes calm and quiet, and never stints on thoughtful consideration.",
    "personality_ja": "落ち着いていて静かなことを好み、細やかな配慮を惜しまない",
    "personality_zh": "喜欢沉稳静谧的事物，给予他人细致入微的体贴"
  },
  "Korat(코랏)": {
    "representative": "배우 이도현, 배우 김고은, Dev Patel, Awkwafina",
    "mbti": "INFJ",
    "features_ko": "하트 모양의 얼굴형과 맑은 눈, 행운을 가져다줄 것 같은 인상",
    "features_en": "Heart-shaped face and clear eyes, an impression that seems to bring good luck.",
    "features_ja": "ハート型の顔立ちと澄んだ目、幸運をもたらしてくれそうな印象",
    "features_zh": "心形脸型和清澈的眼神，给人一种会带来好运的印象",
    "personality_ko": "지각 능력이 뛰어나고 주변 사람들에게 긍정적인 영향을 줌",
    "personality_en": "Possesses excellent perception and has a positive influence on those around them.",
    "personality_ja": "知覚能力に優れ、周囲の人々にポジティブな影響を与える",
    "personality_zh": "洞察力强，能给周围人带来积极的影响"
  },
  "Ocicat(오시캣)": {
    "representative": "갓세븐 잭슨, 가수 현아, Jason Derulo, Miley Cyrus",
    "mbti": "ESTP",
    "features_ko": "거친 야성미와 화려한 눈매, 탄탄한 근육질 마스크",
    "features_en": "Wild beauty and flashy eyes, with a solid athletic mask.",
    "features_ja": "荒々しい野性味と華やかな目元、がっしりとした筋肉質な顔立ち",
    "features_zh": "狂野美与华丽眼神，结实的肌肉感面容",
    "personality_ko": "훈련이 가능할 정도로 영리하며 사교적인 성향이 매우 강함",
    "personality_en": "Smart enough to be trained and possesses a very strong social nature.",
    "personality_ja": "訓練ができるほど賢く、社交的な傾向が非常に強い",
    "personality_zh": "聪明到可以接受训练，且拥有极强的社交性"
  },
  "SelkirkRex(셀커크 렉스)": {
    "representative": "가수 이승윤, 장항준 감독, Seth Rogen, Helena Bonham Carter",
    "mbti": "INTP",
    "features_ko": "부스스한 듯 매력적인 분위기, 독특하고 자유분방한 인상",
    "features_en": "A charmingly disheveled atmosphere with a unique and free-spirited impression.",
    "features_ja": "無造作で魅力的な雰囲気、独特で自由奔放な印象",
    "features_zh": "略显蓬乱却充满魅力的氛围，独特且自由不羁的印象",
    "personality_ko": "참을성이 많고 너그러우며 독특한 유머 감각을 가짐",
    "personality_en": "Patient and generous, with a very unique sense of humor.",
    "personality_ja": "忍耐強く寛大で、独特のユーモアセンスを持っている",
    "personality_zh": "耐心且大方，拥有独特的幽默感"
  },
  "Siberian(시베리안)": {
    "representative": "배우 현빈, 배우 김태희, Leonardo DiCaprio, Scarlett Johansson",
    "mbti": "ISTJ",
    "features_ko": "추위에 강해 보이는 강인한 인상, 속이 깊어 보이는 단단한 눈매",
    "features_en": "A strong impression that looks cold-resistant, with solid and deep eyes.",
    "features_ja": "寒さに強そうな強靭な印象、思慮深そうな力強い目元",
    "features_zh": "看起来不畏严寒的强韧印象，深邃而坚定的眼神",
    "personality_ko": "가족에 대한 사랑이 깊고 인내심이 강하며 대범한 타입",
    "personality_en": "Deep love for family, patient, and possesses a bold personality.",
    "personality_ja": "家族への愛が深く、忍耐強く、大胆なタイプ",
    "personality_zh": "对家人充满爱心，耐心十足且性格大方"
  },
  "Somali(소말리)": {
    "representative": "샤이니 태민, 오마이걸 유아, Ezra Miller, FKA Twigs",
    "mbti": "ENFP",
    "features_ko": "여우를 닮은 화려한 꼬리와 이목구비, 민첩해 보이는 선",
    "features_en": "Flashy fox-like features and tail, with lines that appear very agile.",
    "features_ja": "キツネに似た華やかな尻尾と顔立ち、機敏そうなライン",
    "features_zh": "像狐狸一样华丽的尾巴和五官，看起来很敏捷的线条",
    "personality_ko": "호기심이 매우 많고 활발하며 주변과 소통하는 것을 좋아함",
    "personality_en": "Extremely curious and active, loves communicating with those around them.",
    "personality_ja": "好奇心が非常に強く活発で、周囲とコミュニケーションをとるのが好き",
    "personality_zh": "好奇心极强且活泼，喜欢与周围的人沟通"
  },
  "Toyger(토이거)": {
    "representative": "배우 주지훈, 가수 엄정화, Natalie Portman, Tom Hardy",
    "mbti": "ENTJ",
    "features_ko": "작은 호랑이를 보는 듯한 강렬한 마스크, 섹시하고 파워풀한 이미지",
    "features_en": "Intense mask like a small tiger, with a sexy and powerful image.",
    "features_ja": "小さなトラを見ているような強烈な顔立ち、セクシーでパワフルなイメージ",
    "features_zh": "仿佛看到小老虎般的强烈面容，性感且充满力量感的形象",
    "personality_ko": "자신감이 넘치고 카리스마가 있으며 상황 대처가 빠름",
    "personality_en": "Full of confidence and charisma, with quick situation-handling skills.",
    "personality_ja": "自信にあふれカリスマ性があり、状況への対処が早い",
    "personality_zh": "自信满满，极具魅力，且应对突发情况能力强"
  },

  // --- 강아지상 (Dog Faces) ---
  "Retriever(리트리버)": {
    "representative": "박보검, 워너원 강다니엘, Chris Evans, Tom Holland",
    "mbti": "ENFJ",
    "features_ko": "선하고 부드러운 눈매, 대형견 특유의 듬직함, 보는 사람을 무장해제시키는 멍뭉미",
    "features_en": "Kind and soft eyes, reliable presence like a large dog, and a disarming charm.",
    "features_ja": "善良で柔らかな目元、大型犬特有の頼もしさ、見る人を武装解除させる愛らしさ",
    "features_zh": "善良柔和的眼神，大型犬特有的可靠感，让人卸下防备的软萌魅力",
    "personality_ko": "친절하고 사교적이며 누구에게나 사랑받는 타입",
    "personality_en": "Friendly, sociable, and naturally beloved by everyone.",
    "personality_ja": "親切で社交的、誰からも愛されるタイプ",
    "personality_zh": "亲切友善，深受大家喜爱的类型"
  },
  "Poodle(푸들)": {
    "representative": "엔플라잉 김재현, 홍진경, Timothée Chalamet, Justin Bieber",
    "mbti": "ESFP",
    "features_ko": "똑똑해 보이는 눈빛, 작고 입체적인 이목구비, 통통 튀는 발랄한 이미지",
    "features_en": "Intelligent gaze, small defined features, and a bubbly image.",
    "features_ja": "賢そうな眼差し、小さく立体的な目鼻立ち、弾けるようにハツラツとしたイメージ",
    "features_zh": "看起来很聪明的眼神，精致立体的五官，活泼跳脱的形象",
    "personality_ko": "지능이 높고 눈치가 빠르며 애교가 많은 타입",
    "personality_en": "Highly intelligent, quick-witted, and full of adorable charm.",
    "personality_ja": "知能が高く察しが良く、愛嬌が多いタイプ",
    "personality_zh": "智商高且善于察言观色，非常爱撒娇的类型"
  },
  "Bulldog(불독)": {
    "representative": "마동석, 김준현, Jack Black, Seth Rogen",
    "mbti": "ISFJ",
    "features_ko": "무게감 있는 하관, 개성 넘치는 이목구비, 무서워 보이지만 귀여운 반전 매력",
    "features_en": "Strong jawline and unique features with an unexpectedly cute charm.",
    "features_ja": "重量感のある下顎、個性あふれる目鼻立ち、怖そうに見えて可愛いギャップ萌え",
    "features_zh": "有分量的下颌，个性十足的五官，看起来凶悍却可爱的反差萌",
    "personality_ko": "겉은 강해 보이지만 속은 누구보다 따뜻하고 우직함",
    "personality_en": "Looks tough outside but is incredibly warm-hearted and steadfast inside.",
    "personality_ja": "外見は強そうだが、内面は誰よりも温かくて愚直",
    "personality_zh": "外表看起来强硬，内心却比任何人都温暖憨厚"
  },
  "Beagle(비글)": {
    "representative": "EXO 백현, 이달의 소녀 츄, Ryan Reynolds, Katy Perry",
    "mbti": "ENFP",
    "features_ko": "장난기 가득한 처진 눈매, 에너지가 느껴지는 밝은 미소",
    "features_en": "Playful drooping eyes and a bright, high-energy smile.",
    "features_ja": "いたずらっ子のような垂れ目、エネルギーを感じる明るい笑顔",
    "features_zh": "充满淘气感的下垂眼，散发能量的灿烂微笑",
    "personality_ko": "넘치는 활력으로 주변 사람들을 즐겁게 만드는 분위기 메이커",
    "personality_en": "A mood maker who brightens the room with overflowing vitality.",
    "personality_ja": "あふれる活力で周囲の人々を楽しませるムードメーカー",
    "personality_zh": "凭借旺盛的精力让周围人感到快乐的氛围制造者"
  },
  "Chihuahua(치와와)": {
    "representative": "2NE1 산다라박, 배우 신민아, Ariana Grande, Reese Witherspoon",
    "mbti": "ISTP",
    "features_ko": "얼굴에서 차지하는 비중이 큰 맑은 눈, 작고 소중한 느낌의 동안 외모",
    "features_en": "Large clear eyes and a small, precious youthful look.",
    "features_ja": "顔の中で大きな割合を占める澄んだ目、小さくて大切な感じの童顔",
    "features_zh": "在脸上占比很大的清澈眼睛，娇小可爱的童颜外貌",
    "personality_ko": "작지만 당차고 독립심이 강하며 표현이 확실함",
    "personality_en": "Small but confident, highly independent, and clear in expression.",
    "personality_ja": "小さいがしっかりしていて独立心が強く、表現がはっきりしている",
    "personality_zh": "虽小但精干，独立性强且表达直接"
  },
  "Dachshund(닥스훈트)": {
    "representative": "이광수, 유재석, Benedict Cumberbatch, Eddie Redmayne",
    "mbti": "ENTP",
    "features_ko": "길쭉길쭉하고 시원한 이목구비, 친근하고 유머러스한 마스크",
    "features_en": "Long and cool features with a friendly and humorous mask.",
    "features_ja": "すらりとして涼しげな目鼻立ち、親しみやすくユーモラスな顔立ち",
    "features_zh": "修长舒展的五官，亲切且幽默的面容",
    "personality_ko": "끈기가 있고 명랑하며 한 번 정을 주면 깊게 주는 타입",
    "personality_en": "Persistent and cheerful, the type to give deep affection once bonded.",
    "personality_ja": "粘り強く明朗で、一度情を移すと深く注ぐタイプ",
    "personality_zh": "有毅力且开朗，一旦建立感情就会非常深厚"
  },
  "Pomeranian(포메라니안)": {
    "representative": "BTS 뷔, 레드벨벳 아이린, Selena Gomez, Taylor Swift",
    "mbti": "ESFJ",
    "features_ko": "화려하고 인형 같은 이목구비, 작고 화사한 분위기",
    "features_en": "Flashy doll-like features with a small and radiant aura.",
    "features_ja": "華やかで人形のような目鼻立ち、小さく華やかな雰囲気",
    "features_zh": "华丽如洋娃娃般的五官，娇小亮丽的气氛",
    "personality_ko": "호기심이 많고 자존감이 높으며 주목받는 것을 즐김",
    "personality_en": "Curious with high self-esteem, enjoying being the center of attention.",
    "personality_ja": "好奇心旺盛で自尊心が高く、注目されるのを好む",
    "personality_zh": "好奇心强且自尊心高，享受受人瞩目的感觉"
  },
  "Shiba(시바견)": {
    "representative": "위너 김진우, 배우 정유미, Ryan Gosling, Emma Stone",
    "mbti": "INTJ",
    "features_ko": "볼살이 매력적인 귀염상, 단정하고 깨끗한 이미지",
    "features_en": "Charming cheeks and a neat, clean image.",
    "features_ja": "頬の肉が魅力的な可愛い顔、端正で清潔なイメージ",
    "features_zh": "脸颊肉很有魅力的可爱相，端正清爽的形象",
    "personality_ko": "독립적이고 깔끔하며 충성심이 강한 성격",
    "personality_en": "Independent, neat, and possesses strong loyalty.",
    "personality_ja": "独立的で清潔好き、忠誠心が強い性格",
    "personality_zh": "独立干净，且忠诚度高的性格"
  },
  "Corgi(웰시코기)": {
    "representative": "박나래, 에릭남, Zac Efron, Lucy Liu",
    "mbti": "ESTP",
    "features_ko": "짧지만 다부진 느낌, 귀엽고 야무진 인상",
    "features_en": "Short but sturdy feel with a cute and smart impression.",
    "features_ja": "短いががっしりとした感じ、可愛くてしっかりした印象",
    "features_zh": "虽然短小但感觉很结实，可爱且利落的印象",
    "personality_ko": "낙천적이고 영리하며 어디서든 잘 적응하는 성격",
    "personality_en": "Optimistic and clever, adapts well anywhere.",
    "personality_ja": "楽天的で賢く、どこでもうまく適応する性格",
    "personality_zh": "乐观聪明，在任何地方都能很好适应的性格"
  },
  "Husky(허스키)": {
    "representative": "슈퍼주니어 김희철, 안재현, Cillian Murphy, Ian Somerhalder",
    "mbti": "ESTJ",
    "features_ko": "차갑고 날카로운 눈매, 도회적이고 세련된 티존(T존)",
    "features_en": "Cold, sharp eyes with a sophisticated urban T-zone.",
    "features_ja": "冷たく鋭い目元、都会的で洗練されたTゾーン",
    "features_zh": "冷峻锐利的眼神，都市化且干练的T区",
    "personality_ko": "냉미남/냉미녀 같지만 알면 알수록 엉뚱하고 재미있는 성격",
    "personality_en": "Appears chic, but is surprisingly quirky and fun.",
    "personality_ja": "クールに見えるが、知れば知るほど突拍子もなくて面白い性格",
    "personality_zh": "看起来是冷美人，但越了解越觉得古灵精怪、有趣"
  },
  "Dalmatian(달마시안)": {
    "representative": "배우 정우성, 배우 장기용, Josh Duhamel, Adam Levine",
    "mbti": "ISTP",
    "features_ko": "모델 같은 슬림하고 탄탄한 느낌, 뚜렷하고 고급스러운 이목구비",
    "features_en": "Model-like slim and sturdy feel with distinct luxurious features.",
    "features_ja": "モデルのようなスリムでがっしりとした感じ、はっきりとした高級感のある目鼻立ち",
    "features_zh": "模特般纤细结实的感觉，清晰且高贵的五官",
    "personality_ko": "활발하고 지치지 않는 에너지를 가졌으며 기억력이 좋음",
    "personality_en": "Active with tireless energy and a good memory.",
    "personality_ja": "活発で疲れ知らずのエネルギーを持ち、記憶力が良い",
    "personality_zh": "充满活力，拥有不竭的能量且记忆力好"
  },
  "Maltese(말티즈)": {
    "representative": "배우 수지, 배우 한효주, Amanda Seyfried, Elle Fanning",
    "mbti": "ISFP",
    "features_ko": "깨끗하고 하얀 도자기 같은 피부, 순수하고 맑은 눈망울",
    "features_en": "Clean white porcelain-like skin and pure, clear eyes.",
    "features_ja": "清潔感のある白い陶器のような肌、純粋で澄んだ瞳",
    "features_zh": "干净白皙如瓷器般的皮肤，纯真清澈的眼眸",
    "personality_ko": "다정다감하고 사람을 좋아하며 평화를 사랑하는 타입",
    "personality_en": "Affectionate, loves people, and is a peace-loving type.",
    "personality_ja": "多情多感で人が好き、平和を愛するタイプ",
    "personality_zh": "感情丰富且亲近人，热爱和平的类型"
  },
  "Yorkshire(요크셔테리어)": {
    "representative": "소녀시대 태연, 레드벨벳 조이, Mila Kunis, Natalie Portman",
    "mbti": "ENTP",
    "features_ko": "작고 화려한 이목구비, 고급스럽고 영롱한 분위기",
    "features_en": "Small flashy features with a luxurious and brilliant atmosphere.",
    "features_ja": "小さく華やかな目鼻立ち、高級感のあるきらびやかな雰囲気",
    "features_zh": "娇小华丽的五官，高贵且透亮的气氛",
    "personality_ko": "자신감이 넘치고 총명하며 가끔은 까칠한 매력이 있음",
    "personality_en": "Confident and brilliant, with an occasional prickly charm.",
    "personality_ja": "自信にあふれ聡明で、時にはツンとした魅力がある",
    "personality_zh": "自信且聪明，有时带点高冷魅力"
  },
  "Schnauzer(슈나우저)": {
    "representative": "김병만, 배우 박성웅, Robert Downey Jr., Charlie Chaplin",
    "mbti": "ISTJ",
    "features_ko": "진한 눈썹과 선이 굵은 얼굴, 카리스마 있는 눈빛",
    "features_en": "Dark eyebrows and bold facial lines with charismatic eyes.",
    "features_ja": "濃い眉毛と線の太い顔立ち、カリスマ性のある眼差し",
    "features_zh": "浓密的眉毛和棱角分明的脸型，充满魅力的眼神",
    "personality_ko": "신중하고 용감하며 맡은 바 책임을 다하는 성격",
    "personality_en": "Cautious and brave, fulfilling responsibilities faithfully.",
    "personality_ja": "慎重で勇敢、任された責任を果たす性格",
    "personality_zh": "谨慎勇敢，且能尽职尽责的性格"
  },
  "Bichon(비숑 프리제)": {
    "representative": "아이브 안유진, 하성운, Anne Hathaway, Dove Cameron",
    "mbti": "ENFP",
    "features_ko": "동글동글하고 선한 인상, 복슬복슬한 느낌의 부드러운 미소",
    "features_en": "Round and kind impression with a fluffy soft smile.",
    "features_ja": "丸くて善良な印象、ふわふわした感じの柔らかな笑顔",
    "features_zh": "圆润善良的印象，毛茸茸般柔软的微笑",
    "personality_ko": "밝고 긍정적이며 주변 사람들과 조화롭게 지내는 성격",
    "personality_en": "Bright and positive, living in harmony with those around them.",
    "personality_ja": "明るく前向きで、周囲の人々と調和して過ごす性格",
    "personality_zh": "开朗积极，能与周围人和谐共处的性格"
  },
  "Pug(퍼그)": {
    "representative": "윤문식, 박휘순, Danny DeVito, Jonah Hill",
    "mbti": "INTP",
    "features_ko": "억울해 보이지만 정이 가는 눈매, 개성 있고 친근한 매력",
    "features_en": "Eyes that look pitiful yet lovable, with a unique friendly charm.",
    "features_ja": "悔しそうに見えるが情が湧く目元、個性的で親しみやすい魅力",
    "features_zh": "看起来很委屈但却讨人喜欢的眼神，充满个性且亲切的魅力",
    "personality_ko": "느긋하고 인내심이 강하며 유머러스한 성격",
    "personality_en": "Easy-going and patient with a humorous personality.",
    "personality_ja": "のんびりしていて忍耐強く、ユーモラスな性格",
    "personality_zh": "悠闲且耐心，非常有幽默感的性格"
  },
  "BorderCollie(보더콜리)": {
    "representative": "BTS RM, 이승기, Andrew Garfield, Mark Zuckerberg",
    "mbti": "INTJ",
    "features_ko": "지적인 아우라가 느껴지는 눈빛, 민첩하고 스마트한 이미지",
    "features_en": "An intellectual aura in the eyes, with an agile and smart image.",
    "features_ja": "知的なオーラが感じられる眼差し、機敏でスマートなイメージ",
    "features_zh": "散发知性气息的眼神，敏捷且聪明的形象",
    "personality_ko": "학습 능력이 뛰어나고 전략적이며 목표 지향적인 성격",
    "personality_en": "Excellent learning ability, strategic, and goal-oriented.",
    "personality_ja": "学習能力が高く戦略的で、目標志向の性格",
    "personality_zh": "学习能力极佳，具有战略性且目标导向的性格"
  },
  "Samoyed(사모예드)": {
    "representative": "워너원 강다니엘, 에스파 윈터, Gigi Hadid, Chris Hemsworth",
    "mbti": "ENFJ",
    "features_ko": "웃고 있는 듯한 입매(사모예드 스마일), 포근하고 환한 이미지",
    "features_en": "A mouth that seems to smile and a warm, bright image.",
    "features_ja": "笑っているような口元（サモエドスマイル）、温かくて明るいイメージ",
    "features_zh": "仿佛在微笑的唇形（萨摩耶式微笑），温暖灿烂的形象",
    "personality_ko": "웃음이 많고 친절하며 타인에게 긍정적인 에너지를 줌",
    "personality_en": "Full of smiles and kindness, giving positive energy to others.",
    "personality_ja": "笑顔が多く親切で、他人にポジティブなエネルギーを与える",
    "personality_zh": "爱笑且亲切，能给他人带来积极能量"
  },
  "Spitz(스피츠)": {
    "representative": "트와이스 나연, 엑소 시우민, Saoirse Ronan, Troye Sivan",
    "mbti": "INFJ",
    "features_ko": "뾰족하고 날렵한 콧날, 깨끗하고 날카로운 고양이+강아지 믹스상",
    "features_en": "Pointy sleek nose, a clean mix of cat and dog features.",
    "features_ja": "ツンと尖った鋭い鼻筋、清らかでシャープな猫＋犬のミックス顔",
    "features_zh": "尖而挺直的鼻梁，清爽锐利的猫狗系混血相",
    "personality_ko": "예민한 감수성을 가졌지만 활발하고 총명함",
    "personality_en": "Sensitive but active and brilliant.",
    "personality_ja": "鋭い感受性を持っているが、活発で聡明",
    "personality_zh": "虽然感性敏锐，但性格活泼且聪明"
  },
  "FrenchBulldog(프렌치 불독)": {
    "representative": "표창원, 박명수, Tom Hardy, Florence Pugh",
    "mbti": "ISTP",
    "features_ko": "크고 쫑긋한 귀 이미지, 단단하고 개성 있는 골격",
    "features_en": "Big upright ears and a solid, unique bone structure.",
    "features_ja": "大きくてピンと立った耳のイメージ、がっしりとした個性的な骨格",
    "features_zh": "大而竖起的耳朵形象，结实且有个性的骨骼轮廓",
    "personality_ko": "용감하고 고집이 있지만 친해지면 매우 다정함",
    "personality_en": "Brave and stubborn, but very affectionate once close.",
    "personality_ja": "勇敢でこだわりがあるが、仲良くなると非常に優しい",
    "personality_zh": "勇敢且固执，但一旦亲近就会非常温柔"
  },
  "CockerSpaniel(코카스파니엘)": {
    "representative": "소녀시대 티파니 영, 제시카, Lily Collins, Jennifer Lawrence",
    "mbti": "ESFJ",
    "features_ko": "처진 눈매가 주는 우아함, 화려하고 풍성한 분위기",
    "features_en": "Elegance from drooping eyes with a glamorous atmosphere.",
    "features_ja": "垂れ目が醸し出す優雅さ、華やかで豊かな雰囲気",
    "features_zh": "下垂眼带来的优雅感，华丽且蓬松的气质",
    "personality_ko": "순종적이기보다 본인의 색깔이 뚜렷하고 열정적임",
    "personality_en": "Has a distinct color and passion rather than being submissive.",
    "personality_ja": "従順であるよりは、自分のカラーがはっきりしていて情熱的",
    "personality_zh": "比起顺从，更具个人色彩且富有激情"
  },
  "ShihTzu(시츄)": {
    "representative": "배우 공효진, 배우 라미란, Awkwafina, Helena Bonham Carter",
    "mbti": "ISFJ",
    "features_ko": "큰 눈과 평온해 보이는 인상, 독특하고 편안한 매력",
    "features_en": "Large eyes and a peaceful impression with unique comfort.",
    "features_ja": "大きな目と穏やかそうな印象、独特で心地よい魅力",
    "features_zh": "大眼睛和看起来平和的印象，独特而舒适的魅力",
    "personality_ko": "자존심이 강하지만 공격적이지 않고 여유로운 성격",
    "personality_en": "Strong self-esteem but not aggressive, very relaxed.",
    "personality_ja": "プライドが高いが攻撃的ではなく、余裕のある性格",
    "personality_zh": "自尊心强但没有攻击性，非常从容的性格"
  },
  "Greyhound(그레이하운드)": {
    "representative": "배우 이수혁, 배우 주지훈, Timothée Chalamet, Tilda Swinton",
    "mbti": "INFJ",
    "features_ko": "길고 가느다란 목선과 얼굴형, 세련되고 날렵한 모델상",
    "features_en": "Long slender neck and face, a sophisticated sleek model look.",
    "features_ja": "長くて細い首筋と顔立ち、洗練されたシャープなモデル顔",
    "features_zh": "细长的颈部线条和脸型，干练敏捷的模特相",
    "personality_ko": "차분하고 내성적이지만 목표를 정하면 매우 빠름",
    "personality_en": "Calm and introverted, but very fast once a goal is set.",
    "personality_ja": "落ち着いていて内性的だが、目標を定めると非常に早い",
    "personality_zh": "沉稳内向，但一旦设定目标就会行动迅速"
  },
  "Papillon(파피용)": {
    "representative": "선미, 블랙핑크 리사, Gal Gadot, Zendaya",
    "mbti": "ENTP",
    "features_ko": "크고 화려한 이목구비, 나비처럼 화사하고 우아한 선",
    "features_en": "Large flashy features with elegant butterfly-like lines.",
    "features_ja": "大きく華やかな目鼻立ち、蝶のように華やかで優雅なライン",
    "features_zh": "大而华丽的五官，如蝴蝶般亮丽优雅的线条",
    "personality_ko": "기민하고 우아하며 사교적인 활동을 즐김",
    "personality_en": "Alert and elegant, enjoying social activities.",
    "personality_ja": "機敏で優雅、社交的な活動を楽しむ",
    "personality_zh": "机警优雅，喜欢社交活动"
  },
  "Jindo(진돗개)": {
    "representative": "배우 공유, 배우 김태리, Keanu Reeves, Emma Watson",
    "mbti": "ISTJ",
    "features_ko": "단정하고 깨끗한 얼굴 선, 신뢰감을 주는 깊은 눈빛",
    "features_en": "Neat and clean facial lines with deep trustworthy eyes.",
    "features_ja": "端正で清潔な顔立ち、信頼感を与える深い眼差し",
    "features_zh": "端正干净的脸部线条，给人信任感的深邃眼神",
    "personality_ko": "충성심이 매우 높고 영리하며 담백한 성격",
    "personality_en": "Extremely loyal and smart with a clean-cut personality.",
    "personality_ja": "忠誠心が非常に高く賢い、さっぱりとした性格",
    "personality_zh": "忠诚度极高且聪明，性格爽朗"
  }
};

// 동물 데이터 및 결과값 가정 (상황에 맞게 조정하세요)
const topAnimal = computed(() => animalData[topResults.value[0].className]);

const copySiteUrl = () => {
  const siteUrl = "https://zuzume.netlify.app/";

  // 기존에 만들어둔 copyToClipboard 함수 재사용
  copyToClipboard(siteUrl, () => {
    // 사용자 피드백 (alert 또는 커스텀 토스트)
    alert("사이트 주소가 복사되었습니다! 친구들에게 공유해보세요. 🐾");
  });
};

const combinedResultText = computed(() => {
  const name = topResults.value[0].className;
  const data = topAnimal.value;
  const loc = locale.value;




  return [
    `✨ ${t('resultTitle', { name })} ✨`,
    `━━━━━━━━━━━━━━`,
    `📍 1) ${data[`features_${loc}`]}`,
    `🐾 2) ${data[`personality_${loc}`]}`,
    `🌟 3) ${data[`representative`]}`,
    `💎 MBTI: ${data.mbti}`,
    `💎 URL: https://zuzume.netlify.app/`,
    `━━━━━━━━━━━━━━`
  ].join('\n'); // 각 행마다 개행 추가
});

const shareToSNS = (platform) => {
  // 1. 공통 텍스트 및 URL 준비 (웹/모바일 동일)
  const text = combinedResultText.value;
  const url = window.location.href;
  const fullMessage = `${text}\n\n결과 확인하기: ${url}`;
  const encodedText = encodeURIComponent(fullMessage);

  // 2. 환경 체크 (User Agent)
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // 3. 플랫폼별 분기 처리
  switch (platform) {
    case 'x':
      // X(Twitter)는 웹/모바일 모두 URL 파라미터로 텍스트 전달이 가장 확실함
      window.open(`https://twitter.com/intent/tweet?text=${encodedText}`, '_blank');
      break;

    case 'instagram':
      // 인스타는 텍스트 직접 전달 API가 없으므로 무조건 클립보드 복사 우선
      copyToClipboard(fullMessage, () => {
        alert("결과가 복사되었습니다! 인스타그램에 공유해보세요. ✨");
        if (isMobile) {
          window.location.href = "instagram://camera"; // 모바일은 앱 실행
        } else {
          window.open('https://www.instagram.com/', '_blank'); // 웹은 새창
        }
      });
      break;

    case 'tiktok':
      // 틱톡도 클립보드 복사 후 이동
      copyToClipboard(fullMessage, () => {
        alert("결과가 복사되었습니다! 틱톡에 공유해보세요. ✨");
        if (isMobile) {
          window.location.href = "snssdk1233://"; // 모바일은 앱 실행
        } else {
          window.open('https://www.tiktok.com/upload', '_blank'); // 웹은 업로드 페이지
        }
      });
      break;
  }
};

// 클립보드 복사 유틸리티
const copyToClipboard = (text, callback) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(callback);
  } else {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    callback();
  }
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
  resultTxt.data = animalData[obj.className];
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
    resultTxt.data = animalData[topResults.value[0].className];

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
.top-ad { min-height: 90px; width: 100%; display: flex;
  flex-direction: row; }
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

/* 부모 컨테이너 */
/* 설명 문구 (더 연한 회색) */
.info-text {
  font-size: 12px;
  color: #adb5bd; /* 부드러운 파스텔 그레이 */
  margin-bottom: 8px;
}

/* 인스타그램 링크 기본 스타일 */
.insta-link {
  font-size: 14px;
  color: #868e96; /* 메인 파스텔 회색 */
  text-decoration: none !important; /* 밑줄 제거 */
  outline: none; /* 클릭 시 테두리 제거 */
  transition: color 0.3s ease; /* 부드러운 색상 변화 */
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

/* 마우스 올렸을 때 (살짝 더 진한 회색으로 변하게) */
.insta-link:hover {
  color: #495057;
  text-decoration: none;
}

/* 클릭하는 순간 효과 제거 */
.insta-link:active,
.insta-link:focus {
  background: none;
  color: #495057;
}

/* 아이콘 부분 포인트 */
.insta-icon {
  font-weight: bold;
  opacity: 0.7;
}

 .result-header {
   text-align: center;
   padding: 20px;
 }

.main-title {
  font-size: 22px;
  margin-bottom: 15px;
  font-weight: 800;
}

.info-container {
  display: flex;
  flex-direction: column;
  gap: 8px; /* 태그 사이 간격 */
  margin-bottom: 20px;
}

.tag {
  /* 요청 사항: 폰트 사이즈 12px, 살짝 굵게 */
  font-size: 12px;
  font-weight: 600;

  /* 디자인 요소: 파스텔톤 배경 및 둥근 테두리 */
  padding: 8px 12px;
  border-radius: 10px;
  margin: 0;
  line-height: 1.4;
  word-break: keep-all; /* 한글 단어 끊김 방지 */
}

/* 각 항목별 파스텔톤 색상 선정 */
.features {
  background-color: #E3F2FD; /* 연한 블루 */
  color: #1976D2;
}

.personality {
  background-color: #F3E5F5; /* 연한 퍼플 */
  color: #7B1FA2;
}

.representative {
  background-color: #E8F5E9; /* 연한 그린 */
  color: #388E3C;
}

.mbti {
  background-color: #FFF3E0; /* 연한 오렌지 */
  color: #F57C00;
}

.sub-title {
  font-size: 16px;
  color: #666;
  margin-top: 10px;
}

.gold-prisma-card {
  /* 바탕색: 깊이감 있는 샴페인 골드 베이스 */
  background: linear-gradient(135deg, #fff3e0 0%, #ffe4b5 50%, #fff3e0 100%);

  /* 디자인 요소: 테두리 효과 (border-image 대신 box-shadow로 둥근 모서리 강조) */
  border: 1px solid #f57c00;
  border-radius: 20px;

  /* 그림자: 입체감을 주는 선명한 황금색 광채 */
  box-shadow: 0 10px 30px rgba(245, 124, 0, 0.25);

  position: relative;
  overflow: hidden;
  padding: 25px;
}

/* 하이엔드 골드 고광택 & 홀로그램 효과 */
.gold-prisma-card::before {
  content: "";
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;

  /* 하이라이트와 7색 홀로그램을 믹스한 화려한 스펙트럼 */
  background: linear-gradient(
      110deg,
      transparent 0%,
      rgba(255, 255, 255, 0) 30%,
      rgba(255, 255, 255, 0.9) 45%, /* 강렬한 화이트 골드 광원 */
      rgba(255, 215, 0, 0.4) 50%,    /* 리얼 골드 반사광 */
      rgba(173, 216, 230, 0.3) 55%,  /* 프리즘 블루 포인트 */
      rgba(255, 182, 193, 0.3) 60%,  /* 프리즘 핑크 포인트 */
      rgba(255, 255, 255, 0) 75%,
      transparent 100%
  );

  background-size: 250% 100%;

  /* 애니메이션 속도 조절: 12s -> 4s로 단축하여 화려한 속도감 부여 */
  animation: fastGoldShine 4s cubic-bezier(0.4, 0, 0.2, 1) infinite;

  /* 마스크: 빛이 중앙에서 바깥으로 뻗어나가는 듯한 입체감 */
  -webkit-mask-image: linear-gradient(to right, rgba(0,0,0,0.1), black 50%, rgba(0,0,0,0.1));
  mask-image: linear-gradient(to right, rgba(0,0,0,0.1), black 50%, rgba(0,0,0,0.1));

  z-index: 1;
}

/* 텍스트 가시성 확보 및 고급스러운 섀도우 */
.main-title, .info-container, .sub-title {
  position: relative;
  z-index: 2;
  color: #5d4037; /* 가독성을 위한 짙은 브라운 골드 */
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
}

/* 애니메이션: 카드를 휙 훑고 지나가는 럭셔리한 광택 */
@keyframes fastGoldShine {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.silver-prisma-card {
  /* 바탕색: 명암 대비를 높인 실버 그라데이션 */
  background: linear-gradient(135deg, #ffffff 0%, #dcdcdc 50%, #f0f0f0 100%);

  /* 테두리: 금속 절삭면 같은 느낌을 주는 실버 보더 */
  border: 1px solid #c0c0c0;
  border-radius: 20px;

  /* 그림자: 강한 광택에 어울리는 선명한 그림자 */
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);

  position: relative;
  overflow: hidden;
  padding: 25px;
}

/* 실버 프리즈마 고광택 효과 */
.silver-prisma-card::before {
  content: "";
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;

  /* 광원의 폭을 좁히고 대비를 높여 더 날카로운 빛 연출 */
  background: linear-gradient(
      110deg,
      transparent 0%,
      rgba(255, 255, 255, 0) 35%,
      rgba(255, 255, 255, 0.8) 45%, /* 매우 밝은 하이라이트 */
      rgba(200, 220, 255, 0.4) 50%, /* 푸른빛 반사광 */
      rgba(255, 255, 255, 0.8) 55%, /* 다시 하이라이트 */
      rgba(255, 255, 255, 0) 65%,
      transparent 100%
  );

  background-size: 200% 100%;

  /* 애니메이션 속도 조절: 10s -> 3s로 단축하여 빠르게 지나가도록 설정 */
  animation: fastSilverShine 3s linear infinite;

  /* 마스크 영역을 넓혀 빛이 카드 전체를 훑고 지나가게 설정 */
  -webkit-mask-image: linear-gradient(to right, rgba(0,0,0,0.2), black, rgba(0,0,0,0.2));
  mask-image: linear-gradient(to right, rgba(0,0,0,0.2), black, rgba(0,0,0,0.2));

  z-index: 1;
}

.main-title, .info-container, .sub-title {
  position: relative;
  z-index: 2;
  color: #2c3e50;
  text-shadow: 0 1px 1px rgba(255, 255, 255, 0.5); /* 텍스트 가독성 향상 */
}

/* 애니메이션: 휙 지나가는 듯한 속도감 있는 광택 */
@keyframes fastSilverShine {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* 텍스트 가독성 확보 */
.main-title, .info-container, .sub-title {
  position: relative;
  z-index: 2;
  color: #333; /* 실버 배경에 잘 보이는 진한 그레이 */
}

/* 애니메이션: 좌우로 흐르는 듯한 금속 광택 연출 */
@keyframes silverShine {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* 텍스트가 홀로그램 빛에 묻히지 않도록 z-index 조정 */
.main-title, .info-container, .sub-title {
  position: relative;
  z-index: 2;
}

/* 애니메이션: 배경과 스펙트럼을 동시에 움직여 극강의 입체감 연출 */
@keyframes prismaShine {
  0% {
    background-position: 0% 50%;
    -webkit-mask-position: -50% -50%;
  }
  50% {
    background-position: 100% 50%;
    -webkit-mask-position: 150% 150%;
  }
  100% {
    background-position: 0% 50%;
    -webkit-mask-position: -50% -50%;
  }
}

/* 성능 이슈를 방지하기 위해 background-position만 부드럽게 이동 */
@keyframes goldGradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}


</style>