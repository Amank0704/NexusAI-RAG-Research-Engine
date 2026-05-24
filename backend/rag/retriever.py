



# #this is retriever  pipeline
# # update version 3
# from langchain_community.retrievers import BM25Retriever
# from langchain.retrievers import EnsembleRetriever


# def hybrid_search(query: str, vectorstore, k: int = 4):
#     all_docs = list(vectorstore.docstore._dict.values())
#     bm25 = BM25Retriever.from_documents(all_docs, k=k)
#     vector_retriever = vectorstore.as_retriever(search_kwargs={"k": k})
#     ensemble = EnsembleRetriever(
#         retrievers=[bm25, vector_retriever],
#         weights=[0.4, 0.6],
#     )
#     results = ensemble.invoke(query)
#     return [
#         {
#             "content": doc.page_content,
#             "source":  doc.metadata.get("source", "unknown"),
#             "page":    doc.metadata.get("page", 0),
#         }
#         for doc in results[:k]
#     ]














#this is retriever  pipeline
# increasing k 
# update version 4
#Max Marginal Relevance (MMR) used for retrievinf multi topic questions
# from langchain_community.retrievers import BM25Retriever
# from langchain.retrievers import EnsembleRetriever


# def hybrid_search(query: str, vectorstore, k: int = 15):
    
#     # Get all documents
#     all_docs = list(vectorstore.docstore._dict.values())
    
#     # BM25 Retriever
#     bm25 = BM25Retriever.from_documents(all_docs)
#     bm25.k = k
#     # vector_retriever = vectorstore.as_retriever(
#     #     search_kwargs={"k": k}
#     # )
    
    
#     # Vector Retriever with MMR
#     vector_retriever = vectorstore.as_retriever(
#         search_type="mmr",
#         search_kwargs={
#             "k": k,
#             "fetch_k": 20,
#             "lambda_mult": 0.7
#         }
#     )
    
#      # Hybrid Retriever
#     ensemble = EnsembleRetriever(
#         retrievers=[bm25, vector_retriever],
#         weights=[0.4, 0.6],
#     )
#     results = ensemble.invoke(query)
#     return [
#         {
#             "content": doc.page_content,
#             "source":  doc.metadata.get("source", "unknown"),
#             "page":    doc.metadata.get("page", 0),
#         }
#         # for doc in results[:k]
#         for doc in results
#     ]





# update 5 
# remopving duplicate results using set and list comprehension
from langchain_community.retrievers import BM25Retriever
from langchain.retrievers import EnsembleRetriever


def hybrid_search(query: str, vectorstore, k: int = 15):

    all_docs = list(vectorstore.docstore._dict.values())

    # BM25
    bm25 = BM25Retriever.from_documents(all_docs)
    bm25.k = k

    # Vector retriever with MMR
    vector_retriever = vectorstore.as_retriever(
        search_type="mmr",
        search_kwargs={
            "k": k,
            "fetch_k": 20,
            "lambda_mult": 0.7
        }
    )

    # Hybrid
    ensemble = EnsembleRetriever(
        retrievers=[bm25, vector_retriever],
        weights=[0.4, 0.6],
    )

    results = ensemble.invoke(query)

    
    # REMOVE DUPLICATE CHUNKS
    seen = set()
    unique_results = []

    for doc in results:

        source = doc.metadata.get("source", "")
        page = doc.metadata.get("page", 0)

        key = f"{source}-{page}"

        if key not in seen:

            seen.add(key)
            unique_results.append(doc)

    
    # LIMIT FINAL CONTEXT
    

    final_results = unique_results[:5]

    return [
        {
            "content": doc.page_content[:700],   # trim huge chunks
            "source": doc.metadata.get("source", "unknown"),
            "page": doc.metadata.get("page", 0),
        }
        for doc in final_results
    ]