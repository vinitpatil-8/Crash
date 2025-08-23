import requests
import random
from .datas import rarecase, fallbacks, selection_list, apis

def get_reply(msg):
    msg = msg.lower()
    if msg in selection_list[0] or 'joke' in msg:
        try:
            res1 = requests.get(apis[0])
            data1 = res1.json()
            
        except:
            res2 = requests.get(apis[1])
            data2 = res2.json()
            reply = rarecase(f"{data2['setup']} ... {data2['delivery']}", 4)
            return reply
        else:
            reply = rarecase(f"{data1['setup']} ... {data1['punchline']}", 4)
            return reply
    
    elif msg in selection_list[1] or 'quote' in msg:
        try:
            res3 = requests.get(apis[2], timeout=5)
            res3.raise_for_status()
            data3 = res3.json()
            content = data3.get("content", "No quote found.")
            author = data3.get("author", "Unknown")
            reply = rarecase(f'"{content}" — {author}', 4)
            return reply
        except:
            reply = rarecase(random.choice(fallbacks[0]), 4)
            return reply

    elif msg in selection_list[2] or 'fact' in msg or 'fun' in msg:
        try:
            res4 = requests.get(apis[3])
            headers = {"Accept": "application/json"}
            res5 = requests.get(apis[4], headers=headers)
            data4 = res5.json()
            fact_list = [res4.text, data4["text"]]
            print(fact_list)
            reply = rarecase(random.choice(fact_list), 4)
            return reply
        except:
            reply = rarecase(random.choice(fallbacks[1]), 4)
            return reply
        
    elif 'special' in msg:
        reply = "Here are some special commands\nType corresponding number or command:-\n4. What is your name ?\n5. Who made you ?\n6. How do i contribute ?"
        return reply
    
    elif 'name' in msg or '4' in msg:
        responses = ["Hey ! My Name is Crash !\nNice To Meet You !", "Howdy ! My Name is Crash !", "My Name is Crash ! Have a good Day !"]
        reply = random.choice(responses)
        return reply
    
    elif 'made' in msg or '5' in msg:
        responses_1 = ["I was made by Vinit, a student at Sinhagad University Pune.\nHead To About us page to know more !", "Vinit - a student at Sinhagad University Pune. He made me during the start of his fresher year.\nTo know more head to About us page !", "I like the curiosity ! I was made by Vinit during the start of his fresher year !\nHead to About page to know more !"]
        reply = random.choice(responses_1)
        return reply
    
    elif 'contribute' in msg or '6' in msg or 'how do' in msg:
        responses_2 = ["Our Code is open source ! Head to the link below or open it from about us page to Contribute !\nhttps://github.com/vinitpatil-8/Crash\n\nWe really appreciate your contributions !", "Contributions are much appreciated ! Head To The Link below or navigate to About us Page.\nhttps://github.com/vinitpatil-8/Crash"]
        reply = random.choice(responses_2)
        return reply
        

    else:
        reply = "Select a number corresponding to your preference !"
        return reply