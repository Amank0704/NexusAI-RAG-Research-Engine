


#──────── New Updated version 2.0────────────────────────────────────────────────────────────────────

import os
from langchain_groq import ChatGroq
from langchain.schema import HumanMessage
from tools.search_tool import web_search
from tools.sql_tool import query_sql


def run_agent(query: str, context_docs: list, use_web: bool = False):
    llm = ChatGroq(
        model="llama-3.3-70b-versatile",
        api_key=os.getenv("GROQ_API_KEY"),
        temperature=0.2,
        max_tokens=1500,
    )

    # Clean source names — strip temp path, keep filename only
    for doc in context_docs:
        doc["source"] = os.path.basename(doc["source"])

    context_text = "\n\n".join(
        [f"[Source: {d['source']} | Page {d['page'] + 1}]\n{d['content']}"
         for d in context_docs]
    ) or "No document context available."

    sources = [
        {
            "source": d["source"],
            "page": d["page"],
            "snippet": d["content"][:200],
        }
        for d in context_docs
    ]

    web_results = []

    # Fetch web results if enabled
    if use_web:
        try:
            web_results = web_search(query)
            web_context = "\n".join(
                [f"- {r['title']}: {r['snippet']}" for r in web_results]
            )
        except Exception:
            web_context = ""
    else:
        web_context = ""

    # Build prompt
    web_section = f"\n\nWeb Search Results:\n{web_context}" if web_context else ""

    prompt = f"""You are an intelligent research assistant. Answer the question based on the document context provided.

Document Context:
{context_text}
{web_section}

Question: {query}

Instructions:
- Answer clearly and thoroughly based on the context above
- Reference specific sources where relevant (e.g. "According to [filename] page X...")
- If the context doesn't contain enough information, say so honestly
- Structure your answer with clear paragraphs

Answer:"""

    try:
        response = llm.invoke([HumanMessage(content=prompt)])
        answer = response.content
    except Exception as e:
        answer = f"Error generating answer: {str(e)}"

    return answer, sources, web_results