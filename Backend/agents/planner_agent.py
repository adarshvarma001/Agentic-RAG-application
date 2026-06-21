from agents.rag_agent import rag_agent
from agents.weather_agent import weather_agent
from agents.recommendation_agent import recommendation_agent

from services.llm_service import llm

from prompts.planner_prompt import (
    PLANNER_PROMPT
)

from tools.memory_extractor import (
    store_memory_from_text
)

from services.redis_service import (
    cache_get,
    cache_set
)

def planner_agent(
    query,
    location,
    chat_id
):
    
    cache_key = (
        f"planner_{chat_id}_{query.lower()}"
    )

    cached = cache_get(
        cache_key
    )

    if cached:

        print(
            "PLANNER CACHE HIT"
        )

        return cached

    tourism_info = rag_agent(
        f"tourist places in {location}",
        chat_id
    )

    temple_info = rag_agent(
        f"temples in {location}",
        chat_id
    )

    food_info = recommendation_agent(
        f"foods in {location}",
        chat_id
    )

    festival_info = rag_agent(
        f"festivals in {location}",
        chat_id
    )

    weather_info = weather_agent(
        location
    )

    if isinstance(
        weather_info,
        str
    ):

        weather_text = weather_info

    else:

        weather_text = weather_info.get(
            "recommendation",
            ""
        )

    prompt = PLANNER_PROMPT.format(

        location=location,

        query=query,

        tourism_info=tourism_info,

        temple_info=temple_info,

        festival_info=festival_info,

        food_info=food_info,

        weather_info=weather_text
    )

    response = llm.invoke(
        prompt
    )

    store_memory_from_text(
        query,
        chat_id
    )

    answer = response.content

    cache_set(
        cache_key,
        answer,
        expiry=3600
    )

    return answer