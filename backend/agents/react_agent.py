


# #──────── New Updated version 2.0────────────────────────────────────────────────────────────────────

# import os
# from langchain_groq import ChatGroq
# from langchain.schema import HumanMessage
# from tools.search_tool import web_search
# from tools.sql_tool import query_sql


# def run_agent(query: str, context_docs: list, use_web: bool = False):
#     llm = ChatGroq(
#         model="llama-3.3-70b-versatile",
#         api_key=os.getenv("GROQ_API_KEY"),
#         temperature=0.2,
#         max_tokens=1500,
#     )

#     # Clean source names — strip temp path, keep filename only
#     for doc in context_docs:
#         doc["source"] = os.path.basename(doc["source"])

#     context_text = "\n\n".join(
#         [f"[Source: {d['source']} | Page {d['page'] + 1}]\n{d['content']}"
#          for d in context_docs]
#     ) or "No document context available."

#     sources = [
#         {
#             "source": d["source"],
#             "page": d["page"],
#             "snippet": d["content"][:200],
#         }
#         for d in context_docs
#     ]

#     web_results = []

#     # Fetch web results if enabled
#     if use_web:
#         try:
#             web_results = web_search(query)
#             web_context = "\n".join(
#                 [f"- {r['title']}: {r['snippet']}" for r in web_results]
#             )
#         except Exception:
#             web_context = ""
#     else:
#         web_context = ""

#     # Build prompt
#     web_section = f"\n\nWeb Search Results:\n{web_context}" if web_context else ""

#     prompt = f"""You are an intelligent research assistant. Answer the question based on the document context provided.

# Document Context:
# {context_text}
# {web_section}

# Question: {query}

# Instructions:
# - Answer clearly and thoroughly based on the context above
# - Reference specific sources where relevant (e.g. "According to [filename] page X...")
# - If the context doesn't contain enough information, say so honestly
# - Structure your answer with clear paragraphs

# Answer:"""

#     try:
#         response = llm.invoke([HumanMessage(content=prompt)])
#         answer = response.content
#     except Exception as e:
#         answer = f"Error generating answer: {str(e)}"

#     return answer, sources, web_results
























# ──────── New Updated version 2.0────────────────────────────────────────────────────────────────────



#──────── New Updated version 2.0────────────────────────────────────────────────────────────────────

# import os
# from langchain_groq import ChatGroq
# from langchain.schema import HumanMessage
# from tools.search_tool import web_search
# from tools.sql_tool import query_sql


# def run_agent(query: str, context_docs: list, use_web: bool = False):
#     llm = ChatGroq(
#         model="llama-3.3-70b-versatile",
#         api_key=os.getenv("GROQ_API_KEY"),
#         temperature=0.2,
#         max_tokens=1500,
#     )

#     # Clean source names — strip temp path, keep filename only
#     for doc in context_docs:
#         doc["source"] = os.path.basename(doc["source"])

#     context_text = "\n\n".join(
#         [f"[Source: {d['source']} | Page {d['page'] + 1}]\n{d['content'][:500]}"
#          for d in context_docs]
#     ) or "No document context available."

#     sources = [
#         {
#             "source": d["source"],
#             "page": d["page"],
#             "snippet": d["content"][:200],
#         }
#         for d in context_docs
#     ]

#     web_results = []

#     # Fetch web results if enabled
#     if use_web:
#         try:
#             web_results = web_search(query)
#             web_context = "\n".join(
#                 [f"- {r['title']}: {r['snippet']}" for r in web_results]
#             )
#         except Exception:
#             web_context = ""
#     else:
#         web_context = ""

#     # Build prompt
#     web_section = f"\n\nWeb Search Results:\n{web_context}" if web_context else ""

#     prompt = f"""You are a concise AI assistant.

# Answer clearly and directly using the provided context.

# Keep responses short unless the user asks for detailed explanations.

# Avoid excessive markdown formatting.

# Do not repeat the same information.

# Use minimal and clean source references.

# Summarize related points naturally.

# If information is not available in the provided context,
# say so briefly and honestly.

# Base answers only on the provided context.

# Document Context:
# {context_text}

# {web_section}

# Question:
# {query}

# Answer:
# """

#     try:
#         response = llm.invoke([HumanMessage(content=prompt)])
#         answer = response.content
#     except Exception as e:
#         answer = f"Error generating answer: {str(e)}"

#     return answer, sources, web_results























































#  update 3
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



    # LIMIT CONTEXT DOCS
    # =====================================================

    context_docs = context_docs[:5]
    context_text = "\n\n".join(
        [f"[Source: {d['source']} | Page {d['page'] + 1}]\n{d['content'][:500]}"
         for d in context_docs]
        
    ) or "No document context available."



    # DEDUPLICATE SOURCES
    # =====================================================

    unique_sources = {}
    for d in context_docs:

        source = d["source"]
        page = d["page"] + 1

        if source not in unique_sources:
            unique_sources[source] = set()

        unique_sources[source].add(page)
        
    sources = [
        {
            "source": source,
            "page": sorted(list(pages))
            # "snippet": d["content"][:200],
        }
        # for d in context_docs
        for source, pages in unique_sources.items()
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

#     prompt = f"""You are a concise AI assistant.

# Answer clearly and directly using the provided context.

# Keep responses short unless the user asks for detailed explanations.

# Avoid excessive markdown formatting.

# Do not repeat the same information.

# Use minimal and clean source references.

# Summarize related points naturally.

# If information is not available in the provided context,
# say so briefly and honestly.

# Base answers only on the provided context.

# Document Context:
# {context_text}

# {web_section}

# Question:
# {query}

# Answer:
# """


    prompt = f"""
    You are an intelligent research assistant. Answer the question based on the document context provided.

# Document Context:
# {context_text}
# {web_section}

# Question: {query}

# Instructions:
# - Answer clearly and thoroughly based on the context above
# - If the context doesn't contain enough information, say so honestly
# - Structure your answer with clear paragraphs

# Answer:"""

    try:
        response = llm.invoke([HumanMessage(content=prompt)])
        answer = response.content
    except Exception as e:
        answer = f"Error generating answer: {str(e)}"

    return answer, sources, web_results