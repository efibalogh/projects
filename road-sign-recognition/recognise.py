import numpy as np
import tensorflow as tf
import cv2
from PIL import Image

# loading and compiling the pre-trained model
model = tf.keras.models.load_model("./model.h5", compile=False)
model.compile(optimizer="Adam", loss="categorical_crossentropy", metrics=["accuracy"])


# recognising the given image
def recognise_image(image_path):
    try:
        # read and preprocess the image
        image = cv2.imread(image_path)
        image_from_array = Image.fromarray(image, "RGB")
        resize_image = image_from_array.resize((30, 30))
        data = np.array(resize_image)
        x_test = np.expand_dims(data, axis=0) / 255

        # predict the class of the image
        pred = model.predict(x_test)
        pred_class = np.argmax(pred, axis=1)

        return get_sign_name(pred_class[0])
    except Exception as e:
        print("Error in processing the image:", str(e))
        return None


# getting the sign name from the class id
def get_sign_name(class_id):
    sign_names = {
        0: "Speed limit (20km/h)",
        1: "Speed limit (30km/h)",
        2: "Speed limit (50km/h)",
        3: "Speed limit (60km/h)",
        4: "Speed limit (70km/h)",
        5: "Speed limit (80km/h)",
        6: "End of speed limit (80km/h)",
        7: "Speed limit (100km/h)",
        8: "Speed limit (120km/h)",
        9: "No passing",
        10: "No passing veh over 3.5 tons",
        11: "Right-of-way at intersection",
        12: "Priority road",
        13: "Yield",
        14: "Stop",
        15: "No vehicles",
        16: "Veh > 3.5 tons prohibited",
        17: "No entry",
        18: "General caution",
        19: "Dangerous curve left",
        20: "Dangerous curve right",
        21: "Double curve",
        22: "Bumpy road",
        23: "Slippery road",
        24: "Road narrows on the right",
        25: "Road work",
        26: "Traffic signals",
        27: "Pedestrians",
        28: "Children crossing",
        29: "Bicycles crossing",
        30: "Beware of ice/snow",
        31: "Wild animals crossing",
        32: "End speed + passing limits",
        33: "Turn right ahead",
        34: "Turn left ahead",
        35: "Ahead only",
        36: "Go straight or right",
        37: "Go straight or left",
        38: "Keep right",
        39: "Keep left",
        40: "Roundabout mandatory",
        41: "End of no passing",
        42: "End no passing veh > 3.5 tons"
    }
    
    return sign_names.get(class_id, "Unknown Sign")
