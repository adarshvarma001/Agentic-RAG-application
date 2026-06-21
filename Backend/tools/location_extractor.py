from services.llm_service import llm

from prompts.location_prompt import (
    LOCATION_PROMPT
)

def extract_location(query):

    prompt = LOCATION_PROMPT.format(
        query=query
    )

    response = llm.invoke(
        prompt
    )

    location = response.content.strip()

    location = (
        location
        .replace('"', '')
        .replace("'", "")
        .replace("Location:", "")
        .strip()
    )

    if location.upper() == "NONE":

        return None

    print(
        "LOCATION EXTRACTED =",
        location
    )

    return location