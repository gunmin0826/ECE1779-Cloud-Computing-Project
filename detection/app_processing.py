import cv2
import torch
from ultralytics import YOLO
import numpy as np

class yoloProcess():
    def __init__(self):
        print(torch.cuda.is_available())
        self.model = YOLO("yolov8n.pt")

    def processFrame(self,frame):
        results_gen = self.model(frame, stream=True)
        results=next(results_gen)
        annotated_frame = results.plot()
        return annotated_frame
        
    def processInput(self,content):
        nparr = np.frombuffer(content, np.uint8)
        # Decode the image
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        annoed_frame = self.processFrame(frame)
        
        # Encode the processed image back to a bytes object
        _, img_encoded = cv2.imencode('.jpg', annoed_frame)
        processed_data = img_encoded.tobytes()
        
        return processed_data