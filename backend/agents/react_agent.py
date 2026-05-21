# import os 
# from langchain_google_genai import ChatGoogleGenerativeAI
# from langchain.agents import AgentExecutor, create_react_agent
# from langchain.prompts import PromptTemplate
# from langchain.tools import Tool
# from tools.search_tool import web_search 
# from tools.sql_tool import query_sql


# def run_agent(query: str, context_docs: list, use_web: bool = False):
    
#     llm =  ChatGoogleGenerativeAI(
#         model="gemini-1.5-flash",
#         google_api_key = os.getenv("GOOGLE_API_KEY"),
#         temperature = 0.2
#     )
    
#     context_text = "\n\n".join(
#         [f"[Source: {d['source']} | Page {d['page']}]\n{d['content']}" for d in context_docs]
#     )
    
#     #formating source
#     sources = [
#         {"source": d["source"], "page": d["page"], "snippet": d["content"][:200]}
#         for d in context_docs
#     ]
    
#     web_results = []
    
#     #building tools 
#     tools = [
#         Tool(
#             name="DocumentSearch",
#             func =lambda q: context_text,
#             description="Search through uploaded documents for  relevant information.",
#         ),
#         Tool(
#             name="SQLQuery",
#             func=query_sql,
#             description="Run SQL queries on a  local SQLite database for structured data .",
#         ),
#     ]
    
#     if use_web:
#         def web_fn(q):
#             nonlocal web_results
#             results = web_search(q)
#             web_results = results
#             return "\n".join([r["snippet"] for r in results])
        
#         tools.append(
#             Tool(
#                 name = "WebSearch",
#                 func = web_fn,
#                 description="Search the web for live, up-to-date information.",
#             )
#         )
        
#     prompt = PromptTemplate.from_template(
#             """
#             You are an intelligent research assistance.Use the tools to answer the question thoroughly.
#             Available tools:
#             {tools}
            
#             Tool name:
#             {tool_name}
            
#             Question:
#             {input}
            
#             Context from documents:
#             {context}
            
#             {agent_scratchpad}
            
#             Provide a clear, structures answer with key insights.
#             If using document sources, reference them
#             """.replace("{context}", context_text)     
#     )
    
#     agent = create_react_agent(llm, tools, prompt)
#     executor = AgentExecutor(
#         agent=agent,
#         tools = tools,
#         verbose = False,
#         handle_parsing_errors=True,
#         max_iterations = 4,
#     )
    
    
#     try:
#         result = executor.invoke({"input": query})
#         answer = result.get("output", "Could not generate answer.")
#     except Exception as e:
        
#         #fallback direct llm calls with context
#         prompt_text = f"""Based on the following document context, answer the question clearly.

#             Context:
#             {context_text}

#             Question: {query}

#             Answer:"""
        
#         response = llm.invoke(prompt_text)
#         answer = response.content
    
#     return answer, sources, web_results




















#──────── Updated version 2 ────────────────────────────────────────────────────────────────────

# import os 
# from langchain_groq import ChatGroq
# # from langchain_google_genai import ChatGoogleGenerativeAI
# from langchain.agents import AgentExecutor, create_react_agent
# from langchain.prompts import PromptTemplate
# from langchain.tools import Tool
# from tools.search_tool import web_search 
# from tools.sql_tool import query_sql




# # def run_agent(query: str, context_docs: list, use_web: bool = False):
# #     llm = ChatGoogleGenerativeAI(
# #         model="models/gemini-1.5-flash",
# #         # model="models/gemini-1.5-flash-latest",
# #         # model="models/gemini-2.0-flash",
# #         google_api_key=os.getenv("GOOGLE_API_KEY"),
# #         temperature=0.2,
# #         convert_system_message_to_human=True
# #     )

# def run_agent(query: str, context_docs: list, use_web: bool = False):
#     llm = ChatGroq(
#         model="llama-3.3-70b-versatile",
#         api_key=os.getenv("GROQ_API_KEY"),
#         temperature=0.2,
#         max_tokens=1024,
#     )

#     context_text = "\n\n".join(
#         [f"[Source: {d['source']} | Page {d['page']}]\n{d['content']}" for d in context_docs]
#     )

#     sources = [
#         {"source": d["source"], "page": d["page"], "snippet": d["content"][:200]}
#         for d in context_docs
#     ]

#     web_results = []

#     tools = [
#         Tool(
#             name="DocumentSearch",
#             func=lambda q: context_text,
#             description="Search through uploaded documents for relevant information.",
#         ),
#         Tool(
#             name="SQLQuery",
#             func=query_sql,
#             description="Run SQL queries on the database for structured data.",
#         ),
#     ]

#     if use_web:
#         def web_fn(q):
#             nonlocal web_results
#             web_results = web_search(q)
#             return "\n".join([r["snippet"] for r in web_results])

#         tools.append(Tool(
#             name="WebSearch",
#             func=web_fn,
#             description="Search the web for live, up-to-date information.",
#         ))

#     prompt = PromptTemplate.from_template(
#         """You are an intelligent research assistant. Use the tools to answer the question.

#         Available tools: {tools}
#         Tool names: {tool_names}

#         Question: {input}

#         Document context:
#         """
#             + context_text
#             + """

#         {agent_scratchpad}

#         Provide a clear, structured answer referencing sources where relevant."""
#     )

#     agent = create_react_agent(llm, tools, prompt)
#     executor = AgentExecutor(
#         agent=agent, tools=tools,
#         verbose=False, handle_parsing_errors=True, max_iterations=4,
#     )

#     try:
#         result = executor.invoke({"input": query})
#         answer = result.get("output", "Could not generate answer.")
#     except Exception:
#         response = llm.invoke(
#             f"Based on this context:\n{context_text}\n\nAnswer: {query}"
#         )
#         answer = response.content

#     return answer, sources, web_results














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