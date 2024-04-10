from http.server import HTTPServer, BaseHTTPRequestHandler

import socket
import logging
import numpy as np
import cv2
import os
from ultralytics import YOLO
import json	######
import base64
from io import BytesIO
from PIL import Image


# Configure logging
logging.basicConfig(level=logging.INFO)

#os.makedirs("temp", exist_ok=True)
#hostip = os.getenv('SERVER_HOST', '0.0.0.0')
#port = int(os.getenv('SERVER_PORT', '5000'))
#host = (hostip, port)
host = ('172.20.10.2', 12345)
#yoloModel = yoloProcess()	#666666


class RequestHandler(BaseHTTPRequestHandler):
    def __init__(self,request,client_address,server):
        super().__init__(request,client_address,server)
        self.pFrame = False
        self.model = YOLO("yolov8n.pt")

    def do_GET(self):
        #filename = "."+self.path
        print('Receive GET request')
        try:
            if os.path.exists("temp.png"):
                self.send_response(200)
                self.send_header('Content-type', 'image/png')
                self.send_header('Cache-Control', 'private, no-store, must-revalidate,max-age=0')
                self.send_header('Pragma', 'no-cache')
                self.send_header('Expires','0')
                with open("temp.png","rb") as file:
                    self.wfile.write(file.read())
                os.remove("temp.png")
                print(os.path.exists("temp.png"))
        except FileNotFoundError:
            '''
            self.send_response(404)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(b"No image has been processed yet.")
            '''
            print(filename, 'does not exist')
            self.send_error(404)



    def do_POST(self):
        self.model = YOLO("yolov8n.pt")
        print('Receive POST request')
        content_type = self.headers['Content-Type']
        content_length = int(self.headers['Content-Length'])
        print(f'POST content type={content_type} content_length={content_length}')
        

        contentraw = self.rfile.read(content_length)
        content = json.loads(contentraw)
        if 'width' in content and 'height' in content and 'base64' in content:
            image_content = content['base64']			
            #print('Image width=',content['width'],'height=',content['height'],' len=',len(image_content))
            contentb64 = base64.b64decode(content['base64'])
            image = Image.open(BytesIO(contentb64))
            image_np = np.array(image, dtype='uint8')
            #print(image_np.shape)
            #processedFrame = contentb64					#-999999
            frame = self.model(image_np)
            processedFrame = frame[-1].plot()	#ßß9999999
            self.send_response(200)
            self.end_headers()
            self.wfile.write(processedFrame)						
            #self.wfile.write(b'success post file\n')					
            self.pFrame = processedFrame
            im = Image.fromarray(self.pFrame)
            im = im.rotate(270)
            im.save("temp.png")
				

        elif 'width'  not in content :
            self.send_response(400)
            self.end_headers()
            self.wfile.write(b'width not in POST request!')
        elif 'height'  not in content :
            self.send_response(400)
            self.end_headers()
            self.wfile.write(b'height not in POST request!')
        elif 'base64'  not in content :
            self.send_response(400)
            self.end_headers()
            self.wfile.write(b'base64 not in POST request!')


if __name__ == '__main__':
    server = HTTPServer(host, RequestHandler)
    print("Starting server, listen at: %s:%s" % host)
    server.serve_forever()
