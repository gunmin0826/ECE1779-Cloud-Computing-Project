from ultralytics import YOLO

def train_model():# Load a model
    model = YOLO('yolov8n.pt')  # load a pretrained model (recommended for training)

    results = model.train(data='coco128.yaml', epochs=100, imgsz=640)   
    return results


if __name__ == '__main__':
    # Train the model
    train_model()