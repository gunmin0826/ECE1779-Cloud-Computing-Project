import time
# import redis
from flask import Flask, request, send_file
import socket
import os
import sys
import base64
import cv2 as cv
import io
import numpy as np


app = Flask(__name__)

global img
global base64_string
@app.route('/stream', methods=['GET','POST'])
def receive_photo():
    if request.method == 'POST':
        request_data = request.get_json()
        # Fname = request_data['Fname']
        # Lname = request_data['Lname']
        print(request_data['width'])
        print(request_data['height'])
        
        base64_string = request_data['base64']

        nparr = np.fromstring(base64.b64decode(base64_string), np.uint8)
        img = cv.imdecode(nparr, cv.IMREAD_ANYCOLOR)
        # print('img.shape:', img.shape)
        # print('img.dtype:', img.dtype)
        # print()
        cv.imwrite('img.jpg', img)


        # cv.imshow('from client1', img)
        # cv.waitKey(1)
        return 'received the data'

    if request.method == 'GET':
        return 'this is get method'


@app.route('/view_browser', methods=['GET'])
def show_photo_browser():
    if request.method == 'GET':
        return send_file('img.jpg', mimetype='image/jpg')




@app.route('/view_app', methods=['GET'])
def show_photo_app():
    if request.method == 'GET':
        return base64_string    




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
    