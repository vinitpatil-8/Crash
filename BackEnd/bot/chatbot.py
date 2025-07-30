def get_reply(msg):
    msgs = msg.lower()
    if msgs == "hey":
        return "Hello"
    elif msgs == "how are you":
        return "I am great ! How Are You ?"
    else:
        return "Say Something That Makes Sense"