from http.server import HTTPServer, BaseHTTPRequestHandler
from app_processing import yoloProcess
import logging
import numpy as np
import cv2

# Configure logging
logging.basicConfig(level=logging.INFO)

os.makedirs("temp", exist_ok=True)

host = ('localhost', 8888)

class RequestHandler(BaseHTTPRequestHandler):
    def __init__(self):
        self.yoloModel = yoloProcess()
        self.pFrame = False
        
    def do_GET(self):
        #print("111111:",self.address_string, self.client_address,self.request,"\n\n\n:",self.path)
        self.send_response(200)
        self.send_header('Content-type', 'image/jpeg')
        self.end_headers()
        if self.pFrame:
            self.wfile.write(self.pFrame)
        else:
            self.wfile.write(b"No image has been processed yet.")


    def do_POST(self):
        content_type = self.headers['Content-Type']
        content_length = int(self.headers['Content-Length'])

        if content_type.startswith('multipart/form-data'):
            form = cgi.FieldStorage(
                fp=self.rfile,
                headers=self.headers,
                environ={'REQUEST_METHOD': 'POST',
                         'CONTENT_TYPE': content_type,
                         }
            )

            if 'image' in form:
                uploaded_file = form['image']
                if uploaded_file.filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
                    filename = 'temp/' + uploaded_file.filename
                    content = uploaded_file.file.read()
                    processedFrame = self.yoloModel.processInput(content)
                    self.send_response(200)
                    self.end_headers()
                    self.wfile.write(processedFrame)
                    self.pFrame = processedFrame
                else:
                    self.send_response(400)
                    self.end_headers()
                    self.wfile.write(b'File is not a supported image type!')
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


if __name__ == '__main__':
    server = RequestHandler(host, Resquest)
    print("Starting server, listen at: %s:%s" % host)
    server.serve_forever()
