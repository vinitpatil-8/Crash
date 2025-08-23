# Crash

## Crash can tell u jokes , motivational quotes and fun facts !
## It has fully functional Auth System (Worked lot harder on it than i was supposed to be haha..)
<br>
<br>

## Setup :-
- Set up a virtual env (or not, ur choice just download the modules in requirements.txt)
- Create an .env file copy the contents from .env.example file
- run this command in your python console to create a db file
```
from flask_app import create_app, db
app = create_app()
with app.app_context():
    db.drop_all()
    db.create_all()
```
- Create an instance folder in BackEnd and move this file into it
<br><br><br>

### At first it was supposed to be an AI assistant project but due to PC limitations I had to switch to this.
### Contributions are really appreciated !
### I will regularly keep looking for any pull requests.
### Thanks for reading 😊