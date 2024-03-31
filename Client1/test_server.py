import time
# import redis
from flask import Flask, request
import socket
import os
import sys
# import urllib.request

# HOST = "127.0.0.1"
# PORT_num = 9001

app = Flask(__name__)
# cache = redis.Redis(host='redis', port=6379)

# def get_hit_count():
#     retries = 5
#     while True:
#         try:
#             return cache.incr('hits')
#         except redis.exceptions.ConnectionError as exc:
#             if retries == 0:
#                 raise exc
#             retries -= 1
#             time.sleep(0.5)


# def create_connection(HOST, PORT):
#     with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
#         s.bind((HOST, PORT))
#         s.listen()
#         conn, addr = s.accept()
#         with conn:
#             print(f"Connected by {addr}")
#             while True:
#                 data = conn.recv(1024)
#                 if not data:
#                     break
#                 print(data.decode("utf-8"))
#                 conn.sendall(data)

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
    