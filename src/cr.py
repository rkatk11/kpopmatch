from icrawler.builtin import GoogleImageCrawler, BingImageCrawler
import os

def download_images_from_file(file_path, count_per_person=100):
    # 1. 텍스트 파일 존재 확인 및 읽기
    if not os.path.exists(file_path):
        print(f"❌ 에러: {file_path} 파일이 없습니다. 파일명을 확인해주세요.")
        return

    with open(file_path, 'r', encoding='utf-8') as f:
        # 각 줄의 공백을 제거하고 리스트로 저장
        idol_list = [line.strip() for line in f if line.strip()]

    print(f"✅ 총 {len(idol_list)}명의 수집을 시작합니다.")

    # 2. 인물별 반복 크롤링
    for keyword in idol_list:
        # 저장 폴더명 (공백은 언더바로 변경하여 폴더 생성 시 오류 방지)
        folder_name = keyword.replace(" ", "_")
        save_dir = f'./dataset/{folder_name}'

        if not os.path.exists(save_dir):
            os.makedirs(save_dir)

        search_query = f"{keyword} 강아지 얼굴" # 검색 정확도를 위해 '얼굴 사진' 추가
        print(f"\n🚀 [{keyword}] 수집 중... (저장위치: {save_dir})")

        # Bing 크롤러 (나머지 절반 수집)
        bing_crawler = BingImageCrawler(storage={'root_dir': save_dir})
        bing_crawler.crawl(keyword=search_query, max_num=count_per_person // 2)

    print("\n✨ 모든 인물의 이미지 수집이 완료되었습니다!")

if __name__ == "__main__":
    # 파일명과 인당 수집 개수를 설정하세요.
    # 500명이면 시간이 꽤 걸리므로 처음엔 count를 20~40 정도로 테스트해보세요.
    download_images_from_file('idol_list.txt', count_per_person=50)