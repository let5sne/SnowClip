import requests
from bs4 import BeautifulSoup
import json

url = "https://developers.weixin.qq.com/miniprogram/dev/framework/search/seo.html"

headers = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/121.0.0.0 Safari/537.36"
    )
}


def fetch_html(url):
    resp = requests.get(url, headers=headers, timeout=10)
    resp.raise_for_status()
    resp.encoding = resp.apparent_encoding
    return resp.text


def extract_structured_content(html):
    soup = BeautifulSoup(html, "html.parser")

    # 可能的正文容器
    main = soup.select_one("#docContent, .content, #page-content, .page-content")
    if not main:
        main = soup.body  # 最后兜底

    data = []

    for el in main.descendants:
        if el.name in ["h1", "h2", "h3", "h4"]:
            data.append({
                "type": "heading",
                "level": int(el.name[-1]),
                "content": el.get_text(strip=True)
            })

        elif el.name == "p":
            txt = el.get_text(" ", strip=True)
            if txt:
                data.append({
                    "type": "paragraph",
                    "content": txt
                })

        elif el.name == "pre":
            code = el.get_text("\n", strip=False)
            if code:
                data.append({
                    "type": "code",
                    "lang": el.get("lang") or el.get("data-lang") or "text",
                    "content": code
                })

        elif el.name == "table":
            rows = []
            for tr in el.select("tr"):
                cols = [td.get_text(" ", strip=True) for td in tr.select("th,td")]
                rows.append(cols)

            data.append({
                "type": "table",
                "rows": rows
            })

        elif el.name in ["ul", "ol"]:
            items = [
                li.get_text(" ", strip=True)
                for li in el.select("li")
            ]
            if items:
                data.append({
                    "type": "list",
                    "ordered": el.name == "ol",
                    "items": items
                })

    return data


if __name__ == "__main__":
    html = fetch_html(url)
    structured = extract_structured_content(html)

    with open("wechat_dev_seo_structured.json", "w", encoding="utf-8") as f:
        json.dump(structured, f, ensure_ascii=False, indent=2)

    print("结构化内容已写入 wechat_dev_seo_structured.json")
