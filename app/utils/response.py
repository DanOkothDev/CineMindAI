from flask import jsonify


def success_response(data=None, status_code: int = 200):
    response = {
        "status": "success",
        "data": data,
        "error": None
    }
    return jsonify(response), status_code


def error_response(message: str, status_code: int = 400, data=None):
    response = {
        "status": "error",
        "data": data,
        "error": message
    }
    return jsonify(response), status_code
