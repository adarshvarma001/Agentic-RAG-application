from services.vector_service import vectordb

def retrieve_documents(query: str, k: int = 2):

    return vectordb.similarity_search(
        query=query,
        k=k
    )