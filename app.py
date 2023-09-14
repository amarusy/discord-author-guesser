import pandas as pd
import random
from termcolor import colored
import eel

# Initialize eel
eel.init('web')

# Load data
df = pd.read_csv('output/messages.csv')

# Define infrequent authors as those with < 2500 messages
infrequent_authors = df['author'].value_counts()[df['author'].value_counts() < 2500].index.tolist()
infrequent_authors = [author.lower() for author in infrequent_authors]

# Set parameters
num_messages = random.randint(6, 14)
max_authors = 5

@eel.expose
def generate_text(df=df, infrequent_authors=infrequent_authors, num_messages=num_messages, max_authors=max_authors):
    global true_authors

    # False until a sequence of specified length and max authors is found with at least 2 messages per author
    while True:
        random_number = random.randint(0, len(df) - num_messages)
        messages = df.iloc[random_number:random_number + num_messages]
        messages['author'] = messages['author'].str.lower()
        authors = messages['author'].unique()

        # Check if conditions are met
        if len(authors) <= max_authors and all(messages['author'].value_counts() >= 2):
            break

    # Save true authors as lowercase
    true_authors = list(authors)

    # Replace frequent unique authors with A, B, C, etc.
    for i in range(len(authors)):
        if authors[i] not in infrequent_authors:
            messages.loc[messages['author'] == authors[i], 'author'] = chr(ord('A') + i)
            authors[i] = chr(ord('A') + i)

    # # Debugging
    # print("authors: ", authors)
    # print("true_authors: ", true_authors)

    # Define a dictionary to map author labels to colors
    author_colors = {'A': '#E06C75', 'B': '#61AFEF', 'C': '#98C379', 'D': '#E5C07B', 'E': '#C678DD'}  # Add more colors as needed

    # Generate HTML with inline CSS to style each message with its author's color
    output = ''
    for index, row in messages.iterrows():
        author = row['author']
        color = author_colors.get(author, 'white')  # Default to white if author color is not defined
        message = row['content']
        message_html = f'<span style="color: {color};">{author}: {message}</span><br>'
        output += message_html

    # Generate input fields for each author
    input_fields = ''
    for author in authors:
        input_fields += f'<div class="answer-div" autocomplete="off"> <input type="text" class="author-answer" placeholder="Author {author}"/> <label class="author-yellowLabel"></label> <label class="author-redLabel"></label> </div><br>'

    return output + input_fields


# Define true authors as a variable for javascript to access
@eel.expose
def get_correct_answers():
    return true_authors

@eel.expose
def get_all_authors():
    df = pd.read_csv('output/messages.csv')
    authors = df['author'].unique()
    return list(authors)


eel.start('index.html', size=(800, 800))