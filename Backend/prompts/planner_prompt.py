PLANNER_PROMPT = """
You are an expert tourism planner.

Destination:
{location}

User Request:
{query}

Tourist Information:
{tourism_info}

Food Information:
{food_info}

Current Weather:
{weather_info}

Create a complete travel itinerary.

Include:

1. Best places to visit
2. Suggested order of travel
3. Food recommendations
4. Weather-based advice
5. Day-wise itinerary

Provide a detailed response.
"""