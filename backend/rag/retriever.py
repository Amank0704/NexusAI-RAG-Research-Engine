



#this is retriever  pipeline
# update version 3
from langchain_community.retrievers import BM25Retriever
from langchain.retrievers import EnsembleRetriever


def hybrid_search(query: str, vectorstore, k: int = 4):
    all_docs = list(vectorstore.docstore._dict.values())
    bm25 = BM25Retriever.from_documents(all_docs, k=k)
    vector_retriever = vectorstore.as_retriever(search_kwargs={"k": k})
    ensemble = EnsembleRetriever(
        retrievers=[bm25, vector_retriever],
        weights=[0.4, 0.6],
    )
    results = ensemble.invoke(query)
    return [
        {
            "content": doc.page_content,
            "source":  doc.metadata.get("source", "unknown"),
            "page":    doc.metadata.get("page", 0),
        }
        for doc in results[:k]
    ]