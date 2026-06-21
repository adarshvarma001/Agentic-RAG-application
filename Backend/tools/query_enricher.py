def enrich_query(
    query,
    memory
):

    query_lower = query.lower()

    destinations = memory.get(
        "destination",
        []
    )

    temples = memory.get(
        "temple",
        []
    )

    foods = memory.get(
        "food",
        []
    )

    festivals = memory.get(
        "festival",
        []
    )

    # Latest memories

    latest_destination = (
        destinations[-1]
        if destinations
        else None
    )

    latest_temple = (
        temples[-1]
        if temples
        else None
    )

    latest_food = (
        foods[-1]
        if foods
        else None
    )

    latest_festival = (
        festivals[-1]
        if festivals
        else None
    )

    # Destination references

    if latest_destination:

        query = query.replace(
            "there",
            latest_destination
        )

        query = query.replace(
            "that place",
            latest_destination
        )

        query = query.replace(
            "that destination",
            latest_destination
        )

        nearby_keywords = [

            "nearby",
            "near me",
            "around",
            "close by",
            "within",
            "places to visit",
            "locations to visit"

        ]

        if any(
            keyword in query_lower
            for keyword in nearby_keywords
        ):

            query = (
                f"{query} near {latest_destination}"
            )
    # Temple references

    if latest_temple:

        query = query.replace(
            "that temple",
            latest_temple
        )

    # Food references

    if latest_food:

        query = query.replace(
            "that food",
            latest_food
        )

    # Festival references

    if latest_festival:

        query = query.replace(
            "that festival",
            latest_festival
        )

    print("=" * 50)
    print("ENRICHED QUERY")
    print("=" * 50)
    print(query)

    return query