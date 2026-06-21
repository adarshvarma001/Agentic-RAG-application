from services.weather_service import get_weather

from services.llm_service import llm

from prompts.weather_prompt import WEATHER_PROMPT

from agents.memory_agent import (
    remember
)

from services.redis_service import (
    cache_get,
    cache_set
)



def weather_agent(location):

    cache_key = f"weather_{location.lower()}"

    cached = cache_get(
        cache_key
    )

    if cached:

        print("WEATHER CACHE HIT")

        return cached


    weather = get_weather(location)

    if weather is None:

        return "Location not supported."

    prompt = WEATHER_PROMPT.format(
        location=weather["location"],
        temperature=weather["temperature"],
        humidity=weather["humidity"],
        wind_speed=weather["wind_speed"],
        condition=weather["condition"]
    )

    response = llm.invoke(prompt)

    result = {

    "location": weather["location"],

    "temperature": weather["temperature"],

    "humidity": weather["humidity"],

    "wind_speed": weather["wind_speed"],

    "condition": weather["condition"],

    "recommendation": response.content
    }

    cache_set(
        cache_key,
        result,
        expiry=1800
    )

    return result