<template>
  <div class="coupang-section">
    <iframe src="https://ads-partners.coupang.com/widgets.html?id=976102&template=banner&trackingCode=AF3080343&subId=&width=728&height=90" width="728" height="90" frameborder="0" scrolling="no" referrerpolicy="unsafe-url" browsingtopics></iframe>
  </div>
  <CelebrityMatcher />
  <div ref="adRef" class="ad-container">
    <ins class="kakao_ad_area" style="display:none;"
         data-ad-unit = "DAN-csVZOfNQ8JqIuTsl"
         data-ad-width = "300"
         data-ad-height = "250"></ins>
  </div>
</template>

<script setup>
import CelebrityMatcher from './components/CelebrityMatcher.vue';

import { onMounted, ref } from 'vue';
const adRef = ref(null);

// [주의] 본인의 쿠팡 파트너스 ID가 포함된 검색 URL을 사용하세요.
// 쿠팡 파트너스 대시보드 > 링크 생성 > 검색어 링크에서 생성 가능합니다.
const getCoupangLink = (animalName) => {
  // 쿠팡 파트너스에서 생성한 본인의 고유 ID가 포함된 기본 URL
  const baseSearchUrl = "https://link.coupang.com/a/AF3080343"; // 여기에 본인 링크 입력

  // 검색어(animalName)를 쿼리 파라미터로 붙여서 이동하도록 구성
  // (쿠팡 링크 생성기에서 '검색어'를 포함해 링크를 만들면 더 정확합니다)
  window.open(`${baseSearchUrl}&q=${encodeURIComponent('반려동물')}`, '_blank')
};


onMounted(() => {
  // 이미 로드된 스크립트가 있다면 광고를 렌더링하도록 유도
  try {
    if (window.adfit) {
      // 컴포넌트가 마운트될 때 수동으로 호출할 필요는 없으나
      // SPA 특성상 안 나올 경우를 대비해 설정 확인 가능
    }
  } catch (e) {
    console.error('AdFit Error:', e);
  }
});
</script>
<style>
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