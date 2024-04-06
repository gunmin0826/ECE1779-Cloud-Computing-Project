from http.server import HTTPServer, BaseHTTPRequestHandler
from app_processing import yoloProcess	#888888

import logging
import numpy as np
import cv2
import os
import json	######
import base64	


# Configure logging
logging.basicConfig(level=logging.INFO)

#os.makedirs("temp", exist_ok=True)

#host = ('172.20.10.10', 8888)
host = ('localhost', 8888)
#yoloModel = yoloProcess()	#666666


class RequestHandler(BaseHTTPRequestHandler):
    def __init__(self,a,b,c):
        print('ZZZZZZZZZZZ1')
        self.yoloModel = yoloProcess()
        print('ZZZZZZZZZZZ2')
        self.pFrame = False
        print('ZZZZZZZZZZZ3')
        super().__init__(a,b,c)
        print('ZZZZZZZZZZZ4')

    def do_GET(self):
        '''
        if self.pFrame:
            #print('222222a')
            self.wfile.write(self.pFrame)
        else:
            #print('222222b')
            self.wfile.write(b"No image has been processed yet.")
	'''
        #filename = "."+self.path
        print('Receive GET request')
        filename = 'stream'					
        try:
            with open(filename, 'rb') as f:
                print(filename, ' exists')
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                rdata = f.read()
                #rdata = base64.b64encode(rdata)		#2024.04.05
                self.wfile.write(rdata)
                return "Hello World"
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
        if hasattr(self, 'yoloModel'):							
            self.yoloModel = yoloProcess()
            #print('zzzzzzz')
        print('Receive POST request')				
        content_type = self.headers['Content-Type']
        content_length = int(self.headers['Content-Length'])
        print('POST content type=',content_type,'content_length=',content_length)	
        #print('33333=',self.rfile)

        contentraw = self.rfile.read(content_length) 		
        print('555555 content len=',len(contentraw))		
        content = json.loads(contentraw)				
        print('666666 content len=',len(contentraw))		
        if 'width'  in content and 'height'  in content and 'base64'  in content:
            image_content = content['base64']			
            print('Image width=',content['width'],'height=',content['height'],' len=',len(image_content))
            contentb64 = content['base64'].encode('utf-8')
            #processedFrame = contentb64					#-999999
            processedFrame = self.yoloModel.processInput(contentb64)	#9999999
            self.send_response(200)
            self.end_headers()
            self.wfile.write(processedFrame)						
            #self.wfile.write(b'success post file\n')					
            self.pFrame = processedFrame						

            #save image into tempfile of current directory
            filename = 'stream'						
            with open(filename, 'w') as f:					
                #processedFrame = base64.b64decode(processedFrame)		#2024.04.05
                f.write(processedFrame.decode('utf-8'))		
                #f.write(image_content )					

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
        '''
            else:
                self.send_response(400)
                self.end_headers()
                self.wfile.write(b'No image provided in the request!')
        
        elif content_type in ('image/jpeg', 'image/png'):
            # Handling raw image data
            content = self.rfile.read(content_length)
            processedFrame = self.yoloModel.processInput(content)
            self.send_response(200)
            self.end_headers()
            self.wfile.write(processedFrame)
            self.pFrame = processedFrame

        else:
            self.send_response(400)
            self.end_headers()
            self.wfile.write(b'Unsupported content type!')
        '''

if __name__ == '__main__':
    server = HTTPServer(host, RequestHandler)
    print("Starting server, listen at: %s:%s" % host)
    server.serve_forever()
