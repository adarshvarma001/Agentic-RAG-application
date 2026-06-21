import pandas as pd

from services.db_service import engine

def execute_sql(sql_query):

    return pd.read_sql(
        sql_query,
        engine
    )