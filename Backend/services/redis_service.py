import redis
import json

redis_client = redis.Redis(
    host="localhost",
    port=6379,
    decode_responses=True
)

def cache_get(key):

    value = redis_client.get(key)

    if value:

        return json.loads(value)

    return None


def cache_set(
    key,
    value,
    expiry=3600
):

    redis_client.setex(
        key,
        expiry,
        json.dumps(value)
    )