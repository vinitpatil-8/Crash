from flask import Blueprint, request, jsonify
from bot.chatbot import get_reply  # function to generate bot response

main = Blueprint('main', __name__)

# Route For Displaying Bots Message 
@main.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        msg = data.get('message', '').strip()

        if not msg:
            return jsonify({"error":"Empty message"}), 400
        
        reply = get_reply(msg)
        return jsonify({'reply': reply})
    except Exception as e:
        return jsonify({"error":str(e)}), 500