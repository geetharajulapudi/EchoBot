import os
import requests
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "../.env"))

def search_web(query: str) -> str:
    url = "https://api.tavily.com/search"

    payload = {
        "api_key": os.getenv("TAVILY_API_KEY"),
        "query": query,
        "search_depth": "basic",
        "max_results": 3
    }

    try:
        response = requests.post(url, json=payload)
        data = response.json()

        results = data.get("results", [])

        if not results:
            return ""

        context = "\n\n".join([
            f"{r['title']}\n{r['content'][:300]}"
            for r in results
        ])

        return context[:1000]

    except Exception as e:
        return f"Search Error: {str(e)}"