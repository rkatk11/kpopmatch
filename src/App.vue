<template>
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
</style>