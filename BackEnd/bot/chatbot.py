import os
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
from peft import PeftModel

# Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"
ADAPTER_PATH = os.path.join(BASE_DIR, "llm_training", "tinyllama-lora")

# Load base model
base_model = AutoModelForCausalLM.from_pretrained(
    MODEL_PATH,
    device_map="auto",
    torch_dtype="auto"
)

# Load LoRA adapter
model = PeftModel.from_pretrained(base_model, ADAPTER_PATH)
model = model.merge_and_unload()
# Load tokenizer
tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
if tokenizer.pad_token is None:
    tokenizer.pad_token = tokenizer.eos_token

# Create pipeline
chatbot = pipeline(
    "text-generation",
    model=model,
    tokenizer=tokenizer,
    device_map="auto"
)

# Global conversation memory
conversation_history = []

def build_prompt(history, msg):
    intro = (
        "You are Crash, a funny, slightly sarcastic but helpful AI assistant who remembers the user's name "
        "and gives smart replies in a human tone. Never use cuss words or be disrespectful.\n\n"
    )

    chat = ""
    for pair in history[-3:]:
        chat += f"User: {pair.get('user', '')}\nCrash: {pair.get('bot', '')}\n"

    chat += f"User: {msg}\nCrash:"
    return intro + chat

def get_reply(msg):
    prompt = build_prompt(conversation_history, msg)
    response = chatbot(
        prompt,
        max_length=100,
        temperature=0.3,
        top_p=0.9,
        repetition_penalty=1.2,
        truncation=True,
        pad_token_id=tokenizer.pad_token_id,
        num_return_sequences=1
    )[0]['generated_text']

    reply = response.split("Crash:")[-1].strip()
    reply = reply.split("User:")[0].strip()

    conversation_history.append({"user": msg, "bot": reply})
    return reply
