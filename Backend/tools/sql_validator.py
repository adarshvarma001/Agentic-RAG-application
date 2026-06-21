FORBIDDEN = [

    "DROP",
    "DELETE",
    "UPDATE",
    "INSERT",
    "ALTER",
    "TRUNCATE"

]

VISUALIZATION_KEYWORDS = [

    "trend",
    "growth",
    "chart",
    "graph",
    "visualize",
    "yearly",
    "monthly"

]


def validate_sql(sql):

    sql_upper = sql.upper()

    for word in FORBIDDEN:

        if word in sql_upper:

            raise Exception(
                f"Forbidden SQL detected: {word}"
            )

    return True


def is_visualization_query(query):

    query = query.lower()

    return any(
        keyword in query
        for keyword in VISUALIZATION_KEYWORDS
    )