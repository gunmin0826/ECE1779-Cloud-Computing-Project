import cv2
import torch
from ultralytics import YOLO  # This is assuming you're using YOLOv8 from Ultralytics

# Initialize YOLOv8 model
print(torch.cuda.is_available())
model = YOLO("yolov8n.pt") 

# Open the video file or stream
video_path = 'test_video.mp4'
cap = cv2.VideoCapture(video_path)

# Check if video opened successfully
if not cap.isOpened():
    print("Error: Could not open video.")
    exit()

# Process video frame by frame
while cap.isOpened():
    success, frame = cap.read()
    if success:
        # Perform detection
        results_gen = model(frame, stream=True)
        try:
            results=next(results_gen)
            # Extract data
            #labels, cords = results.names, results.xyxy[0]
            annotated_frame = results.plot()

            # Display the resulting frame
            cv2.imshow('Yolov8 Inference', annotated_frame)
        except StopIteration:
            break

        # Press Q on keyboard to exit
        if cv2.waitKey(25) & 0xFF == ord('q'):
            break
    else:
        break

# When everything done, release the video capture object
cap.release()
# Closes all the frames
cv2.destroyAllWindows()