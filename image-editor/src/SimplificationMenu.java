import javax.swing.*;
import java.awt.*;
import java.awt.event.KeyEvent;
import java.awt.image.BufferedImage;

public class SimplificationMenu extends JMenu {
    private static final int[][] DITHER_MATRIX_2X2 = {
            {1, 3},
            {4, 2}
    };

    private static final int[][] DITHER_MATRIX_3X3 = {
            {3, 7, 4},
            {6, 1, 9},
            {2, 8, 5}
    };

    private static final int[][] DITHER_MATRIX_4X4 = {
            { 1, 13,  4, 16},
            { 9,  5, 12,  8},
            { 3, 15,  2, 14},
            {11,  7, 10,  6}
    };

    private static final int[][] DITHER_MATRIX_6X6 = {
            { 1, 25,  7, 31,  9, 27},
            {21, 13, 29, 19, 15, 23},
            { 5, 33,  3, 27, 11, 35},
            {17,  7, 23, 15, 19,  9},
            { 3, 29, 11, 35,  5, 31},
            {25, 15, 27, 17, 21, 13}
    };

    public SimplificationMenu(ImagePanel imagePanel, ImagePanel filteredPanel) {
        super("Simplify");

        JMenuItem convertToGrayscale = new JMenuItem("Grayscale");
        convertToGrayscale.addActionListener(e -> {
            if (imagePanel.getImage() == null && filteredPanel.getImage() == null) {
                AppFrame.showErrorMessage("No image loaded!");
                return;
            }

            BufferedImage image = filteredPanel.getImage();
            convertToGrayscale(image);
            System.err.println("s: converting image to grayscale");
            filteredPanel.setImage(image);
            filteredPanel.refreshPanel();
        });
        add(convertToGrayscale);
        convertToGrayscale.setMnemonic(KeyEvent.VK_G);
        convertToGrayscale.setAccelerator(KeyStroke.getKeyStroke(KeyEvent.VK_G, KeyEvent.SHIFT_DOWN_MASK));

        JMenuItem orderedDithering = new JMenuItem("Ordered Dithering");
        orderedDithering.addActionListener(e -> {
            if (imagePanel.getImage() == null && filteredPanel.getImage() == null) {
                AppFrame.showErrorMessage("No image loaded!");
                return;
            }

            BufferedImage image = filteredPanel.getImage();
            orderedDither(image);
            filteredPanel.setImage(image);
            filteredPanel.refreshPanel();
        });
        add(orderedDithering);
        orderedDithering.setMnemonic(KeyEvent.VK_D);
        orderedDithering.setAccelerator(KeyStroke.getKeyStroke(KeyEvent.VK_D, KeyEvent.SHIFT_DOWN_MASK));

        JMenuItem uniformQuantization = new JMenuItem("Uniform Quantization");
        uniformQuantization.addActionListener(e -> {
            if (imagePanel.getImage() == null && filteredPanel.getImage() == null) {
                AppFrame.showErrorMessage("No image loaded!");
                return;
            }

            BufferedImage image = filteredPanel.getImage();
            uniformQuantize(image);
            filteredPanel.setImage(image);
            filteredPanel.refreshPanel();
        });
        add(uniformQuantization);
        uniformQuantization.setMnemonic(KeyEvent.VK_Q);
        uniformQuantization.setAccelerator(KeyStroke.getKeyStroke(KeyEvent.VK_Q, KeyEvent.SHIFT_DOWN_MASK));
    }

    private boolean isGrayscale(BufferedImage image) {
        for (int y = 0; y < image.getHeight(); y++) {
            for (int x = 0; x < image.getWidth(); x++) {
                Color color = new Color(image.getRGB(x, y));
                if (color.getRed() != color.getGreen() || color.getGreen() != color.getBlue()) {
                    return false;
                }
            }
        }

        return true;
    }

    private void convertToGrayscale(BufferedImage image) {
        for (int y = 0; y < image.getHeight(); y++) {
            for (int x = 0; x < image.getWidth(); x++) {
                int rgb = image.getRGB(x, y);
                int r = (rgb >> 16) & 0xff;
                int g = (rgb >> 8) & 0xff;
                int b = rgb & 0xff;
                int gray = (r + g + b) / 3;
                int grayValue = (gray << 16) + (gray << 8) + gray;
                image.setRGB(x, y, grayValue);
            }
        }
    }

    private int[][] selectThresholdMatrix(int size) {
        return switch (size) {
            case 2 -> DITHER_MATRIX_2X2;
            case 3 -> DITHER_MATRIX_3X3;
            case 4 -> DITHER_MATRIX_4X4;
            case 6 -> DITHER_MATRIX_6X6;
            default -> null;
        };
    }

    private int applyDither(int originalIntensity, int[][] thresholdMatrix, int thresholdValue, int x, int y) {
        double scaledIntensity = (double) originalIntensity / 255.0;
        int colorLevel = (int) Math.floor((thresholdValue - 1) * scaledIntensity);
        double remainder = (thresholdValue - 1) * scaledIntensity - colorLevel;
        double threshold = (double) thresholdMatrix[x % thresholdValue][y % thresholdValue] / (thresholdValue * thresholdValue + 1);

        if (remainder >= threshold) {
            colorLevel++;
        }

        return (int) ((double) colorLevel * 255.0 / (thresholdValue - 1));
    }

    private void grayscaleDither(BufferedImage image, int[][] thresholdMatrix, int thresholdValue) {
        for (int y = 0; y < image.getHeight(); y++) {
            for (int x = 0; x < image.getWidth(); x++) {
                int originalIntensity = (image.getRGB(x, y) >> 16) & 0xff;
                int ditheredIntensity = applyDither(originalIntensity, thresholdMatrix, thresholdValue, x, y);
                image.setRGB(x, y, (ditheredIntensity << 16) | (ditheredIntensity << 8) | ditheredIntensity);
            }
        }
    }

    private void colorDither(BufferedImage image, int[][] thresholdMatrix, int thresholdValue) {
        for (int y = 0; y < image.getHeight(); y++) {
            for (int x = 0; x < image.getWidth(); x++) {
                int rgb = image.getRGB(x, y);
                int originalR = (rgb >> 16) & 0xff;
                int originalG = (rgb >> 8) & 0xff;
                int originalB = rgb & 0xff;
                int ditheredR = applyDither(originalR, thresholdMatrix, thresholdValue, x, y);
                int ditheredG = applyDither(originalG, thresholdMatrix, thresholdValue, x, y);
                int ditheredB = applyDither(originalB, thresholdMatrix, thresholdValue, x, y);
                image.setRGB(x, y, (ditheredR << 16) | (ditheredG << 8) | ditheredB);
            }
        }
    }

    private void orderedDither(BufferedImage image) {
        int thresholdValue = AppFrame.showSelectThresholdMessage();

        if (thresholdValue == -1) {
            return;
        }

        int[][] thresholdMatrix = selectThresholdMatrix(thresholdValue);

        System.err.print("s: applying ordered dithering");

        if (isGrayscale(image)) {
            grayscaleDither(image, thresholdMatrix, thresholdValue);
            System.err.println(" to grayscale image with the threshold value of " + thresholdValue);
        } else {
            colorDither(image, thresholdMatrix, thresholdValue);
            System.err.println(" to color image with the threshold value of " + thresholdValue);
        }
    }

    private void uniformQuantize(BufferedImage image) {
        int[] steps = AppFrame.showSelectNumberOfDivisions();

        if (steps == null) {
            return;
        } else {
            System.err.println("s: applying uniform quantization");
        }

        int stepR = 256 / steps[0];
        int stepG = 256 / steps[1];
        int stepB = 256 / steps[2];

        for (int y = 0; y < image.getHeight(); y++) {
            for (int x = 0; x < image.getWidth(); x++) {
                int rgb = image.getRGB(x, y);
                int r = (rgb >> 16) & 0xff;
                int g = (rgb >> 8) & 0xff;
                int b = rgb & 0xff;
                int quantizedR = (r / stepR) * stepR;
                int quantizedG = (g / stepG) * stepG;
                int quantizedB = (b / stepB) * stepB;
                image.setRGB(x, y, (quantizedR << 16) | (quantizedG << 8) | quantizedB);
            }
        }
    }
}
