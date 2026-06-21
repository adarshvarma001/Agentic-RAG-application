import requests

from services.weather_codes import (
    WEATHER_CODES
)


def get_coordinates(location):

    url = (

        "https://geocoding-api.open-meteo.com/v1/search"
        f"?name={location}"
        "&count=1"
        "&language=en"
        "&format=json"
    )

    response = requests.get(url)

    data = response.json()

    if "results" not in data:

        return None

    place = data["results"][0]

    return (

        place["latitude"],
        place["longitude"]
    )


def get_weather(location):

    coordinates = get_coordinates(
        location
    )

    if not coordinates:

        return None

    lat, lon = coordinates

    url = (

        f"https://api.open-meteo.com/v1/forecast"
        f"?latitude={lat}"
        f"&longitude={lon}"
        f"&current="
        f"temperature_2m,"
        f"relative_humidity_2m,"
        f"wind_speed_10m,"
        f"weather_code"
    )

    response = requests.get(url)

    data = response.json()

    current = data["current"]

    return {

        "location": location.title(),

        "temperature":
        current["temperature_2m"],

        "humidity":
        current["relative_humidity_2m"],

        "wind_speed":
        current["wind_speed_10m"],

        "condition":
        WEATHER_CODES.get(

            current["weather_code"],

            "Unknown"
        )
    }