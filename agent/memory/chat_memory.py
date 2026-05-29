conversation_history = []


def save_message(role, text):

    conversation_history.append({

        "role": role,

        "text": text

    })


def get_history():

    return conversation_history