from tools.retriever_tool import retrieve_documents

from services.llm_service import llm

from prompts.rag_prompt import RAG_PROMPT

from services.redis_service import (
    cache_get,
    cache_set
)

from services.memory_service import (
    get_all_memory
)

from tools.query_enricher import (
    enrich_query
)

from tools.memory_extractor import (
        store_memory_from_text
    )

def rag_agent(
    query,
    chat_id
):
    cache_key = (
        f"rag_{chat_id}_{query.lower()}"
    )

    cached = cache_get(
        cache_key
    )

    if cached:

        print(
            "RAG CACHE HIT"
        )

        store_memory_from_text(
            query,
            chat_id
        )

        return cached

    memory = get_all_memory(
        chat_id
    )

    print("=" * 50)
    print("MEMORY")
    print("=" * 50)
    print(memory)

    query = enrich_query(
        query,
        memory
    )

    print("=" * 50)
    print("ENRICHED QUERY")
    print("=" * 50)
    print(query)


    docs = retrieve_documents(
        query=query,
        k=2
    )

    if not docs:

        return "No information found."

    

    print("=" * 50)
    print("METADATA")
    print("=" * 50)
    print(docs[0].metadata)


    context = "\n\n".join(
        [
            doc.page_content[:1000]
            for doc in docs
        ]
    )

    prompt = RAG_PROMPT.format(
        context=context,
        question=query
    )

    response = llm.invoke(
        prompt
    )

    answer = response.content

    store_memory_from_text(
        query,
        chat_id
    )

    cache_set(
        cache_key,
        answer,
        expiry=3600
    )

    return answer
