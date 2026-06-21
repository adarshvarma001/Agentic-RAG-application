from flask import Blueprint
from flask import request
from flask import jsonify
from agents.planner_agent import (
    planner_agent
)
from agents.hybrid_agent import hybrid_agent
from agents.router_agent import router_agent
from agents.rag_agent import rag_agent
from agents.analytics_agent import analytics_agent
from agents.weather_agent import weather_agent
from agents.recommendation_agent import (
    recommendation_agent
)
from tools.location_extractor import (
    extract_location
)
from agents.memory_agent import (
    get_destination
)

from services.memory_service import (
    get_all_memory
)

from services.memory_service import (
    save_message
)

from services.memory_service import (
    get_chat_history
)

from services.memory_service import (
    get_all_chats
)

from services.memory_service import (
    get_chat_history
)

import uuid

chat_bp = Blueprint(
    "chat_bp",
    __name__
)

@chat_bp.route(
    "/new-chat",
    methods=["POST"]
)
def new_chat():

    chat_id = str(
        uuid.uuid4()
    )

    return jsonify({

        "chat_id": chat_id

    })

@chat_bp.route(
    "/all-chats",
    methods=["GET"]
)
def all_chats():

    data = get_all_chats()

    return jsonify(data)

@chat_bp.route(
    "/history/<chat_id>",
    methods=["GET"]
)
def history(chat_id):

    data = get_chat_history(
        chat_id
    )

    return jsonify(data)

@chat_bp.route(
    "/memory",
    methods=["GET"]
)
def memory():

    chat_id = request.args.get(
        "chat_id",
        "default_chat"
    )

    data = get_all_memory(
        chat_id
    )

    return jsonify(data)

@chat_bp.route(
    "/chat-history",
    methods=["GET"]
)

def chat_history():

    chat_id = request.args.get(
        "chat_id"
    )

    data = get_chat_history(
        chat_id
    )

    return jsonify(data)

@chat_bp.route(
    "/chat",
    methods=["POST"]
)
def chat():

    data = request.get_json()

    query = data.get(
        "query",
        ""
    ).strip()

    if not query:

        return jsonify({

            "source": "validation",

            "answer": "Query cannot be empty."

        }), 400

    chat_id = data.get(
        "chat_id",
        "default_chat"
    )

    from services.memory_service import (
        save_conversation
    )

    save_conversation(
    chat_id,
    query
    )

    save_message(
        chat_id,
        "user",
        query
    )

    route = router_agent(query)

    print("ROUTE =", route)

    if route == "rag":

        answer = rag_agent(
            query,
            chat_id
        )

        save_message(
            chat_id,
            "assistant",
            answer
        )

        return jsonify({
            "source": "rag",
            "answer": answer
        })

    elif route == "analytics":

        answer = analytics_agent(query)

        save_message(
            chat_id,
            "assistant",
            answer
        )

        return jsonify({
            "source": "analytics",
            "answer": answer
        })

    elif route == "planner":

        location = extract_location(
            query
        )

        if not location:

            memory_location = get_destination(
                chat_id
            )

            if memory_location:

                location = memory_location

            else:

                return jsonify({

                    "source": "planner",

                    "answer":
                    "Please specify a destination."

                })

        answer = planner_agent(
            query,
            location,
            chat_id
        )

        save_message(
            chat_id,
            "assistant",
            answer
        )

        return jsonify({
            "source": "planner",
            "answer": answer
        })

    elif route == "weather":


        from services.memory_service import (
            get_all_memory
        )

        from tools.query_enricher import (
            enrich_query
        )

        memory = get_all_memory(
            chat_id
        )

        query = enrich_query(
            query,
            memory
        )

        location = extract_location(
            query
        )

        if not location:

            location = get_destination(
                chat_id
            )

        print(
            "EXTRACTED LOCATION =",
            location
        )

        if not location:

            memory_location = get_destination(
                chat_id
            )

            if memory_location:

                location = memory_location

            else:

                return jsonify({

                    "source": "weather",

                    "answer":
                    "Please specify a location."

                })

        answer = weather_agent(
            location
        )

        if isinstance(answer, dict):

            save_message(
                chat_id,
                "assistant",
                answer["recommendation"]
            )

        else:

            save_message(
                chat_id,
                "assistant",
                answer
            )

        return jsonify({

            "source": "weather",

            "answer": answer

        })
    elif route == "hybrid":

        location = extract_location(
            query
        )

        if not location:

            memory_location = get_destination(
                chat_id
            )

            if memory_location:

                location = memory_location

            else:

                return jsonify({

                    "source": "hybrid",

                    "answer":
                    "Please specify a destination."

                })

        answer = hybrid_agent(
            query,
            location,
            chat_id
        )

        save_message(
            chat_id,
            "assistant",
            answer
        )

        return jsonify({
            "source": "hybrid",
            "answer": answer
        })

    elif route == "recommendation":

        answer = recommendation_agent(
            query,
            chat_id
        )

        return jsonify({

            "source": "recommendation",

            "answer": answer

        })

    return jsonify({

        "source": "unknown",

        "answer": "Route not found."

    })
