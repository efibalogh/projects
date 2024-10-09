import sys
import os

from PyQt6.QtCore import Qt
from PyQt6.QtGui import QPixmap, QGuiApplication
from PyQt6.QtWidgets import (
    QApplication, QMainWindow, QWidget, QLabel, QPushButton,
    QGridLayout, QFileDialog, QListWidget, QListWidgetItem
)
from PIL import Image, ImageQt

import recognise


class MainWindow(QMainWindow):
    imagesDirectory = "./dataset/Test"
    loadedImages = []
    
    def __init__(self):
        super().__init__()
        self.initUI()


    def initUI(self):
        self.setWindowTitle("Road Sign Recognition")
        self.setGeometry(100, 100, 600, 400)
        
        self.centralWidget = QWidget()
        self.setCentralWidget(self.centralWidget)
        
        self.loadedImagesLabel = QLabel("Image history:")
        self.loadedImagesLabel.setFixedHeight(20)
        self.loadedImagesLabel.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.loadedImagesLabel.setStyleSheet("font-size: 14px;")
        
        self.originalLabel = QLabel("Original image:")
        self.originalLabel.setFixedHeight(20)
        self.originalLabel.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.originalLabel.setStyleSheet("font-size: 14px;")
        
     
        # list of loaded images   
        self.sidebarList = QListWidget()
        self.sidebarList.setFixedWidth(200)
        self.sidebarList.setSelectionMode(QListWidget.SelectionMode.SingleSelection)
        self.sidebarList.setStyleSheet("""
            QListWidget::item:selected {
                background-color: #4b7bec;
                color: white;
            }
            QListWidget::item {
                padding: 5px;
            }
            font-size: 14px;
        """)
        self.sidebarList.itemClicked.connect(self.loadImageFromSidebar)
        
        # button for file dialog
        self.openButton = QPushButton("Browse")
        self.openButton.clicked.connect(self.browseImage)
        self.openButton.setFixedHeight(50)
        self.openButton.setStyleSheet("""
            QPushButton::hover {
                background-color: #0640c7
            };
            border-radius: 10px;
            background-color: #4b7bec;
            font-size: 14px;
        """)
        
        # button for sign recognition
        self.recogniseButton = QPushButton("Recognise")
        self.recogniseButton.clicked.connect(self.recogniseImage)
        self.recogniseButton.setFixedHeight(50)
        self.recogniseButton.setStyleSheet("""
            QPushButton::hover {
                background-color: #0640c7
            };
            border-radius: 10px;
            background-color: #4b7bec;
            font-size: 14px;
        """)
        
        # label for displaying the image
        self.imageLabel = QLabel()
        self.imageLabel.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.imageLabel.setStyleSheet("background-color: black;")
        self.imageLabel.setFixedSize(400, 400)
        
        self.recognisedLabel = QLabel("Recognised sign: ")
        self.recognisedLabel.setFixedWidth(400)
        self.recognisedLabel.setStyleSheet("""
            padding-left: 10px;
            background-color: #171717;
            border-radius: 10px;
            font-size: 14px;
        """)
        
        # arranging the widgets
        layout = QGridLayout()
        layout.addWidget(self.loadedImagesLabel, 0, 0, 1, 1)
        layout.addWidget(self.originalLabel, 0, 1, 1, 2)
        layout.addWidget(self.sidebarList, 1, 0, 1, 1)
        layout.addWidget(self.openButton, 2, 0, 1, 1)
        layout.addWidget(self.recogniseButton, 3, 0, 1, 1)
        layout.addWidget(self.imageLabel, 1, 1, 1, 2)
        layout.addWidget(self.recognisedLabel, 2, 1, 2, 1)
        
        self.centralWidget.setLayout(layout)
        self.center()
        
        
    def center(self):
        screen = QGuiApplication.primaryScreen().availableGeometry().center()
        window = self.frameGeometry().center()
        self.move(int(screen.x() - window.x()), int(screen.y() - window.y()))

    
    # browse the image from the file dialog, display it and add it to the list
    def browseImage(self):
        fileDialog = QFileDialog(self)
        filePath, _ = fileDialog.getOpenFileName(directory=self.imagesDirectory, filter="Images (*.png *.jpg *.jpeg *.bmp *.gif)")

        if filePath:
            image = Image.open(filePath)
            self.displayImage(image)
            
            if image not in self.loadedImages:
                self.loadedImages.append(image)
                self.sidebarList.addItem(QListWidgetItem(os.path.basename(filePath)))
            else:
                index = self.loadedImages.index(image)
                self.loadedImages.pop(index)
                self.loadedImages.append(image)
                self.sidebarList.takeItem(index)
                self.sidebarList.addItem(QListWidgetItem(os.path.basename(filePath)))

            self.sidebarList.setCurrentRow(self.sidebarList.count() - 1)
            
    
    # reload the image from the list
    def loadImageFromSidebar(self, item):
        image = self.loadedImages[self.sidebarList.row(item)]
        self.displayImage(image)
        self.recognisedLabel.setText("Recognised sign: ")

    
    # display the image on the label
    def displayImage(self, image):        
        qtImage = self.pil2pixmap(image)
        qtImage = qtImage.scaled(self.imageLabel.size(), Qt.AspectRatioMode.KeepAspectRatio)
        self.imageLabel.setPixmap(qtImage)
        self.recognisedLabel.setText("Recognised sign: ")
        
        
    # recognise the image using the model
    def recogniseImage(self):
        if not self.loadedImages:
            return
        
        imagePath = self.imagesDirectory + "/" + self.sidebarList.currentItem().text()
        signName = recognise.recognise_image(imagePath)
        
        if signName:
            self.recognisedLabel.setText(f"Recognised sign: {signName}")
        else:
            self.recognisedLabel.setText("Error during recognition")

    
    # convert PIL image to QPixmap
    def pil2pixmap(self, image):
        qtImage = ImageQt.ImageQt(image)
        qpixmap = QPixmap.fromImage(qtImage)
        return qpixmap


def main():
    app = QApplication(sys.argv)
    mainWindow = MainWindow()
    mainWindow.show()
    sys.exit(app.exec())


if __name__ == "__main__":
    main()
