# build_vectordb.py

import os
import json
import shutil

from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter

from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

JSON_FOLDER = "data/json_data"
VECTOR_DB_PATH = "data/new_vdb"

if os.path.exists(VECTOR_DB_PATH):
    shutil.rmtree(VECTOR_DB_PATH)

documents = []

for file in os.listdir(JSON_FOLDER):

    if file.endswith(".json"):

        with open(
            os.path.join(JSON_FOLDER, file),
            "r",
            encoding="utf-8"
        ) as f:

            data = json.load(f)

            documents.append(
                Document(
                    page_content=json.dumps(
                        data,
                        ensure_ascii=False,
                        indent=2
                    ),
                    metadata={
                        "source": file
                    }
                )
            )

print("Documents:", len(documents))

splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200
)

chunks = splitter.split_documents(documents)

print("Chunks:", len(chunks))

embeddings = HuggingFaceEmbeddings(
    model_name="BAAI/bge-base-en-v1.5"
)

vectordb = Chroma.from_documents(
    documents=chunks,
    embedding=embeddings,
    persist_directory=VECTOR_DB_PATH
)

print(
    "Stored:",
    vectordb._collection.count()
)