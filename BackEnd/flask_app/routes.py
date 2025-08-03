from flask import Blueprint, request, jsonify
from bot.chatbot import get_reply  # function to generate bot response

main = Blueprint('main', __name__)

# Route For Displaying Bots Message 
@main.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    msg = data.get('message')
    reply = get_reply(msg)
    return jsonify({'reply': reply})