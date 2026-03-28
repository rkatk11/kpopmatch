<template>
  <CelebrityMatcher />
</template>

<script setup>
import CelebrityMatcher from './components/CelebrityMatcher.vue';
</script>
<style>

.share-buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 25px;
  flex-wrap: wrap; /* 화면이 작아지면 자동으로 줄바꿈 */
}

.share-buttons button {
  /* 버튼 기본 구조 */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  border: none;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* 호버 효과: 살짝 커지면서 그림자 강화 */
.share-buttons button:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
}

/* 클릭 효과: 눌리는 느낌 */
.share-buttons button:active {
  transform: translateY(0);
}

/* 각 플랫폼 브랜드 컬러 (그라데이션으로 세련되게) */

/* Instagram: 인스타 특유의 퍼플-핑크-오렌지 그라데이션 */
.btn-insta {
  background: linear-gradient(45deg, #405DE6, #5851DB, #833AB4, #C13584, #E1306C, #FD1D1D);
}

/* TikTok: 블랙 베이스에 네온 핑크/사이안 포인트 느낌 */
.btn-tiktok {
  background: #010101;
  border: 1px solid rgba(255, 255, 255, 0.2);
  /* 틱톡 로고의 입체감 있는 섀도우 효과 */
  text-shadow: 1px 1px #ff0050, -1px -1px #00f2ea;
}

/* X (Twitter): 깔끔한 블랙 혹은 다크 그레이 */
.btn-x {
  background: #000000;
  border: 1px solid #333;
}

/* 모바일 대응: 버튼이 너무 작아지지 않게 조절 */
@media (max-width: 480px) {
  .share-buttons {
    gap: 8px;
  }
  .share-buttons button {
    flex: 1 1 calc(33.333% - 10px); /* 3열 정렬 */
    padding: 12px 8px;
    font-size: 11px;
  }
}

body {
  margin: 0;
  background-color: #f0f2f5;
}
.ad-container {
  display: flex;
  justify-content: center;
  margin: 20px 0;
  min-height: 50px;
}

.coupang-section {
  flex: 1;
  padding: 0 10px;
}
.ad-notice { font-size: 10px; color: #bbb; text-align: right; margin-bottom: 5px; }

.product-card {
  background: #fff;
  height: 50px;
  width: 100%;
  border: 1px solid #ffeaa7;
  border-radius: 15px;
  padding: 15px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}
.product-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0,0,0,0.1);
  border-color: #fab1a0;
}
.card-content { display: flex; align-items: center; gap: 15px; }
.animal-emoji { font-size: 2rem; }
.text-group { text-align: left; flex: 1; }
.text-group h4 { margin: 0; color: #333; font-size: 1rem; }
.text-group p { margin: 4px 0 0; color: #666; font-size: 0.85rem; }
.text-group strong { color: #e67e22; }
.arrow { color: #e67e22; font-weight: bold; }
</style>