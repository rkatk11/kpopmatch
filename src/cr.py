from icrawler.builtin import GoogleImageCrawler, BingImageCrawler # Bing 추가
import os

def download_images(keyword, count=100):
    save_dir = f'./{keyword}'
    if not os.path.exists(save_dir):
        os.makedirs(save_dir)

    # 구글에서 먼저 시도
    print(f"--- {keyword} 구글 수집 시작 ---")
    google_crawler = GoogleImageCrawler(storage={'root_dir': save_dir})
    google_crawler.crawl(keyword=keyword, max_num=count // 2)

    # Bing에서 추가 수집 (더 안정적일 때가 많음)
    print(f"--- {keyword} Bing 수집 시작 ---")
    bing_crawler = BingImageCrawler(storage={'root_dir': save_dir})
    bing_crawler.crawl(keyword=keyword, max_num=count // 2)

if __name__ == "__main__":
    # 실제 수집하고 싶은 연예인 이름을 넣으세요!
    download_images("BTS 지민 얼굴사진", count=200)