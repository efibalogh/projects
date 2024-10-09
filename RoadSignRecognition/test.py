import cv2
import numpy as np
import pandas as pd
import tensorflow as tf
from PIL import Image
from sklearn.metrics import accuracy_score
import matplotlib.pyplot as plt
import random

model = tf.keras.models.load_model("./model.h5", compile=False)
model.compile(optimizer="Adam", loss="categorical_crossentropy", metrics=["accuracy"])

test = pd.read_csv("./dataset/Test.csv")
labels = test["ClassId"].values
imgs = test["Path"].values

data = []

for img in imgs:
    try:
        image = cv2.imread("./dataset/" + img)
        image_fromarray = Image.fromarray(image, "RGB")
        resize_image = image_fromarray.resize((30, 30))
        data.append(np.array(resize_image))
    except:
        print("Error in " + img)
    
x_test = np.array(data)
x_test = x_test / 255

pred = np.argmax(model.predict(x_test), axis=-1)

print("Test Data accuracy: ", accuracy_score(labels, pred) * 100)

# choose 24 random signs to showcase the accuracy
plt.figure(figsize=(25, 25))
start = random.randint(0, len(labels) - 24)

for i in range(24):
    plt.subplot(4, 6, i + 1)
    plt.axis("off")
    image = (x_test[start + i] * 255).astype(np.uint8)
    plt.imshow(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
    plt.text(0, -3, f"Actual: {labels[start + i]}\nPredicted: {pred[start + i]}", backgroundcolor="white")
    
plt.show()