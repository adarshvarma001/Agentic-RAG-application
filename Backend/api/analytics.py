from flask import Blueprint
from flask import jsonify
from flask import request

from agents.analytics_agent import analytics_agent

analytics_bp = Blueprint(
    "analytics_bp",
    __name__
)


@analytics_bp.route(
    "/analytics/trend",
    methods=["POST"]
)
def analytics_trend():

    data = request.get_json()

    query = data["query"]

    result = analytics_agent(query)

    return jsonify(result)