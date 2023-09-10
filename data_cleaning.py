import os
import json
import pandas as pd

# Define lists to store data
author = []
content = []

# Loop over all files in the data folder
files = os.listdir('data')
for file_name in files:
    data = json.load(open('data/' + file_name, 'r', encoding='utf-8'))

    # Loop over all messages in the file
    for message in data['messages']:

        # Select author and content of messages without embeds or attachments
        if message['embeds'] == [] and message['attachments'] == []:
            author.append(message['author']['nickname'])
            content.append(message['content'])

# Write data to txt file as "nickname: content"
with open('output/messages.txt', 'w', encoding='utf-8-sig') as f:
    for i in range(len(author)):
        f.write(author[i] + ': ' + content[i] + '\n')

# Make a csv with author and content
df = pd.DataFrame({'author': author, 'content': content})
df.to_csv('output/messages.csv', index=False, encoding='utf-8-sig')

