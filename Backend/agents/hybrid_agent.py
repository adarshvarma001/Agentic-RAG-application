from tools.retriever_tool import (
    retrieve_documents
)

from services.weather_service import (
    get_weather
)

from services.llm_service import (
    llm
)

from services.redis_service import (
    cache_get,
    cache_set
)

from prompts.hybrid_prompt import (
    HYBRID_PROMPT
)

from tools.memory_extractor import (
    store_memory_from_text
)

from services.memory_service import (
    get_all_memory
)

from tools.query_enricher import (
    enrich_query
)

def hybrid_agent(
    query,
    location,
    chat_id
):
    
    cache_key = (
        f"hybrid_{chat_id}_{query.lower()}"
    )

    cached = cache_get(
        cache_key
    )

    if cached:

        print(
            "HYBRID CACHE HIT"
        )

        return cached
        
    memory = get_all_memory(
        chat_id
    )

    query = enrich_query(
        query,
        memory
    )

    print("=" * 50)
    print("ENRICHED QUERY")
    print("=" * 50)
    print(query)


    docs = retrieve_documents(
        query,
        k=5
    )

    if docs:

        print("=" * 50)
        print("METADATA")
        print("=" * 50)
        print(docs[0].metadata)

    tourism_context = "\n\n".join(

        [
            doc.page_content
            for doc in docs
        ]

    )

    weather = get_weather(
        location
    )

    if weather is None:

        return "Weather data unavailable."

    prompt = HYBRID_PROMPT.format(

        tourism_context=tourism_context,

        location=weather["location"],

        temperature=weather["temperature"],

        humidity=weather["humidity"],

        wind_speed=weather["wind_speed"],

        condition=weather["condition"],

        query=query

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