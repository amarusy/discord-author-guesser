import pandas as pd
import random
from termcolor import colored
import eel

eel.init('web')

# Define the global variable to store true authors
true_authors = []

@eel.expose
def generate_text():
    global true_authors

    # Define parameters
    num_messages = 10
    max_authors = 3

    # Load data
    df = pd.read_csv('output/messages.csv')

    # False until a sequence of specified length and max authors is found
    while True:
        random_number = random.randint(0, len(df) - num_messages)
        messages = df.iloc[random_number:random_number + num_messages]

        # Lowercase all authors
        messages['author'] = messages['author'].str.lower()
        authors = messages['author'].unique()
        # authors = [author.lower() for author in authors]
        # authors = messages['author'].unique()
        if len(authors) <= max_authors:
            break

    # Save true authors as lowercase
    true_authors = list(authors)

    # Replace unique authors with A, B, C, etc.
    for i in range(len(authors)):
        messages.loc[messages['author'] == authors[i], 'author'] = chr(ord('A') + i)
        authors[i] = chr(ord('A') + i) 

    print("authors: ", authors)
    print("true_authors: ", true_authors)

    # Define a dictionary to map author labels to colors
    author_colors = {'A': '#E06C75', 'B': '#61AFEF', 'C': '#98C379', 'D': '#E5C07B'}  # Add more colors as needed

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
        input_fields += f'<input type="text" class="author-answer" placeholder="Author {author}" /><br>'

    return output + input_fields


# Define true authors as a variable for javascript to access
@eel.expose
def get_correct_answers():
    return true_authors

eel.start('index.html', size=(800, 800))