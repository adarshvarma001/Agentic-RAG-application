import json

from services.llm_service import llm

from prompts.memory_prompt import (
    MEMORY_PROMPT
)

from agents.memory_agent import (
    remember
)

def store_memory_from_text(
    text,
    chat_id
):

    prompt = MEMORY_PROMPT.format(
        text=text
    )

    response = llm.invoke(
        prompt
    )


    try:

        memory = json.loads(
            response.content
        )

    except Exception as e:

        print(
            "MEMORY EXTRACTION FAILED:",
            e
        )

        return

    print("=" * 50)
    print("EXTRACTED MEMORY")
    print("=" * 50)
    print(memory)

    valid_keys = [

    "destination",
    "temple",
    "food",
    "festival"

]

    for key, values in memory.items():

        if key not in valid_keys:

            continue

        for value in values:

            if not value:

                continue

            remember(
                chat_id,
                key,
                value
            )

            print(
                f"MEMORY STORED -> {key}: {value}"
            )

