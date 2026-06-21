from services.llm_service import llm

from prompts.router_prompt import (
    ROUTER_PROMPT
)

def router_agent(query):

    query_lower = query.lower()

    # Food Queries

    if any(
        word in query_lower
        for word in [

            "food",
            "foods",
            "eat",
            "restaurant",
            "cuisine"
        ]
    ):
        return "recommendation"

    # Weather Queries

    if any(
        word in query_lower
        for word in [

            "weather",
            "climate",
            "temperature",
            "humidity",
            "forecast"
        ]
    ):
        return "weather"

    prompt = ROUTER_PROMPT.format(
        query=query
    )

    response = llm.invoke(
        prompt
    )

    route_text = (
        response.content
        .strip()
        .upper()
    )

    print("=" * 50)
    print("ROUTER QUERY")
    print(query)

    print("=" * 50)
    print("ROUTER RESPONSE")
    print(route_text)

    if "PLANNER" in route_text:
        return "planner"

    if "WEATHER" in route_text:
        return "weather"

    if "ANALYTICS" in route_text:
        return "analytics"

    if "RECOMMENDATION" in route_text:
        return "recommendation"

    if "HYBRID" in route_text:
        return "hybrid"

    return "rag"