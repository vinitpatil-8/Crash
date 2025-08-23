import random

quotes = ["'True friendship ought never to conceal what it thinks.' — Jerome", "'Believe deep down in your heart that you're destined to do great things.' — Joe Paterno", "'Do what you can. Want what you have. Be who you are.' — Forrest Church", "'No one has ever become poor by giving.' — Anne Frank", "'Technology is a word that describes something that doesn't work yet.' — Douglas Adams", "'If you cannot do great things, do small things in a great way.' — Napoleon Hill"]
fun_facts = ["1e+140 is the Asaṃkhyeya, a Buddhist name for the number 10^(140).", "It has NEVER rained in Calama, a town in the Atacama Desert of Chile.", "3.457e+181 is the number of ways to arrange the tiles in English Scrabble on a standard 15-by-15 Scrabble board.", "The phrase 'rule of thumb' is derived from an old English law, which stated that you couldn`t beat your wife with anything wider than your thumb.", "During a severe windstorm or rainstorm the Empire State Building sways several feet to either side.", "The citrus soda 7-UP was created in 1929; `7` was selected after the original 7-ounce containers and `UP` for the direction of the bubbles."]


joke_selection_list = ["1", "1.", "one", "joke", "jk", "jok", "tell a joke", "tell me a joke"]
quote_selection_list = ["2", "two", "quote", "motivate", "motivation", "2.", "motiv", "motive", "motivation quote", "motivational quote"]
fact_selection_list = ["3", "3.", "three", "fun", "fact", "fun fact", "fun-fact"]

joke_api1 = "https://official-joke-api.appspot.com/jokes/random"
joke_api2 = "https://v2.jokeapi.dev/joke/Any"
quote_api = "http://api.quotable.io/random"
fact_api1 = "http://numbersapi.com/random"
fact_api2 = "https://uselessfacts.jsph.pl/api/v2/facts/random?language=en"

fallbacks = [quotes, fun_facts]
selection_list = [joke_selection_list, quote_selection_list, fact_selection_list]
apis = [joke_api1, joke_api2, quote_api, fact_api1, fact_api2]

def rarecase(sentence, rarity):
    ran_list = []
    ps = random.choice(["PS: (type 'special command' to see some new commands)", "PS: (wanna try something else ? type 'special commands')"])
    for i in range(rarity):
        ran_list.append(i)
    ran_choice = random.choice(ran_list)
    if ran_choice == (rarity - 1):
        return sentence + "\n\n" + ps
    else:
        return sentence
