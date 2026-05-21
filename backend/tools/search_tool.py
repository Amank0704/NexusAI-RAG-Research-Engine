# import os
# import requests

# def web_search(query: str):
#     api_key = os.getenv("SERPER_API_KEY", "")
#     if not api_key:
#         return [{"title": "Web search disabled", "snippet": "Set SERPER_API_KEY to enable.", "url": ""}]

#     try:
#         resp = requests.post(
#             "https://google.serper.dev/search",
#             headers={"X-API-KEY": api_key, "Content-Type": "application/json"},
#             json={"q": query, "num": 4},
#             timeout=8,
#         )
#         data = resp.json()
#         results = []
#         for item in data.get("organic", [])[:4]:
#             results.append({
#                 "title": item.get("title", ""),
#                 "snippet": item.get("snippet", ""),
#                 "url": item.get("link", ""),
#             })
#         return results
#     except Exception as e:
#         return [{"title": "Error", "snippet": str(e), "url": ""}]











# ──────── Updated version 2 ────────────────────────────────────────────────────────────────────
import os, requests


def web_search(query: str):
    api_key = os.getenv("SERPER_API_KEY", "")
    if not api_key:
        return [{"title": "Web search disabled", "snippet": "Set SERPER_API_KEY to enable.", "url": ""}]
    try:
        resp = requests.post(
            "https://google.serper.dev/search",
            headers={"X-API-KEY": api_key, "Content-Type": "application/json"},
            json={"q": query, "num": 4},
            timeout=8,
        )
        return [
            {"title": r.get("title", ""), "snippet": r.get("snippet", ""), "url": r.get("link", "")}
            for r in resp.json().get("organic", [])[:4]
        ]
    except Exception as e:
        return [{"title": "Error", "snippet": str(e), "url": ""}]