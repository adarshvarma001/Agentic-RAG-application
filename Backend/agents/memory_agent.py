from services.memory_service import (
    save_memory,
    get_memory
)

def remember(user_id, key, value):

    save_memory(
        user_id,
        key,
        value
    )

def recall(user_id, key):

    return get_memory(
        user_id,
        key
    )

def get_destination(user_id):

    destinations = get_memory(
        user_id,
        "destination"
    )

    if not destinations:

        return None

    return destinations[-1]