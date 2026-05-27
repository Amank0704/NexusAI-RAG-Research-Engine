

import os
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from typing import List


def load_and_split_pdfs(paths: List[str], original_names: List[str] = None):
    all_docs = []
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=800, 
        chunk_overlap=100)

    for i, path in enumerate(paths):
        try:
            loader = PyPDFLoader(path)
            pages = loader.load()

            clean_name = (
                original_names[i]
                if original_names and i < len(original_names)
                else os.path.basename(path)
            )

            # Overwrite source metadata with clean filename
            for page in pages:
                page.metadata["source"] = clean_name

            chunks = splitter.split_documents(pages)
            print(f"✅ {clean_name} → {len(pages)} pages → {len(chunks)} chunks")
            all_docs.extend(chunks)

        except Exception as e:
            print(f"❌ Error loading {path}: {e}")
            continue

    print(f"📦 Total chunks: {len(all_docs)}")
    return all_docs