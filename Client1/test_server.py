import time
# import redis
from flask import Flask, request
import socket
import os
import sys


app = Flask(__name__)


@app.route('/stream', methods=['GET','POST'])
def receive_photo():
    if request.method == 'POST':
        request_data = request.get_json()
        # Fname = request_data['Fname']
        # Lname = request_data['Lname']
        print(request_data['width'])
        print(request_data['height'])
        return 'received the data'
    if request.method == 'GET':
        return 'this is get method'


@app.route('/connect')
def connect():
    return 'Hello client!'

@app.route('/')
def hello():
    # count = get_hit_count()
    return 'Hello World!'




# use argument1 and argument2 for IP and port the server would run on 
if __name__ == '__main__':
    if len(sys.argv) == 1:
        app.run(debug=True,
            host='172.20.10.2', 
            port=12345)
    else:
        host = sys.argv[1]
        port = sys.argv[2]
        app.run(debug=True,
            host = host,
            port = port)    
    