# new version 3
#added summarizing tool 
import os
from langchain_groq import ChatGroq
from langchain.schema import HumanMessage


def summarize_document(chunks: list) -> str:
    if not chunks:
        return "No content available to summarize."
    try:
        llm = ChatGroq(
            model="llama-3.3-70b-versatile",
            api_key=os.getenv("GROQ_API_KEY"),
            temperature=0.1,
            max_tokens=300,
        )
        text = "\n\n".join([c.page_content for c in chunks[:6]])
        prompt = f"""Summarize this document in 3-4 sentences. Be concise and factual.
Focus on: what the document is about, key topics, and main purpose.

Document content:
{text[:3000]}

Summary:"""
        response = llm.invoke([HumanMessage(content=prompt)])
        return response.content.strip()
    except Exception as e:
        return f"Summary unavailable: {str(e)}"