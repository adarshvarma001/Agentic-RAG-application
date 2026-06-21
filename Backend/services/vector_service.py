from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

from config.settings import settings

embeddings = HuggingFaceEmbeddings(
    model_name="BAAI/bge-base-en-v1.5"
)

vectordb = Chroma(
    persist_directory=settings.VECTOR_DB_PATH,
    embedding_function=embeddings
)