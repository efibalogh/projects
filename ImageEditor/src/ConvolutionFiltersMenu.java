import javax.swing.*;
import java.awt.Toolkit;
import java.awt.event.KeyEvent;
import java.awt.image.BufferedImage;

public class ConvolutionFiltersMenu extends JMenu {
    public ConvolutionFiltersMenu(ImagePanel imagePanel, ImagePanel filteredPanel) {
        super("Convolution Filters");

        JMenuItem blur = new JMenuItem("Blur");
        blur.addActionListener(e -> {
            if (imagePanel.getImage() == null && filteredPanel.getImage() == null) {
                AppFrame.showErrorMessage("No image loaded!");
                return;
            }

            BufferedImage image = filteredPanel.getImage();
            blurImage(image);
            System.err.println("c: applying blur");
            filteredPanel.setImage(image);
            filteredPanel.refreshPanel();
        });
        add(blur);
        blur.setMnemonic(KeyEvent.VK_B);
        blur.setAccelerator(KeyStroke.getKeyStroke(KeyEvent.VK_B, Toolkit.getDefaultToolkit().getMenuShortcutKeyMaskEx() | KeyEvent.ALT_DOWN_MASK));

        JMenuItem gaussianBlur = new JMenuItem("Gaussian Blur");
        gaussianBlur.addActionListener(e -> {
            if (imagePanel.getImage() == null && filteredPanel.getImage() == null) {
                AppFrame.showErrorMessage("No image loaded!");
                return;
            }

            BufferedImage image = filteredPanel.getImage();
            gaussianBlurImage(image);
            System.err.println("c: applying Gaussian blur");
            filteredPanel.setImage(image);
            filteredPanel.refreshPanel();
        });
        add(gaussianBlur);
        gaussianBlur.setMnemonic(KeyEvent.VK_G);
        gaussianBlur.setAccelerator(KeyStroke.getKeyStroke(KeyEvent.VK_G, Toolkit.getDefaultToolkit().getMenuShortcutKeyMaskEx() | KeyEvent.ALT_DOWN_MASK));

        JMenuItem sharpening = new JMenuItem("Sharpening");
        sharpening.addActionListener(e -> {
            if (imagePanel.getImage() == null && filteredPanel.getImage() == null) {
                AppFrame.showErrorMessage("No image loaded!");
                return;
            }

            BufferedImage image = filteredPanel.getImage();
            sharpenImage(image);
            System.err.println("c: sharpening image");
            filteredPanel.setImage(image);
            filteredPanel.refreshPanel();
        });
        add(sharpening);
        sharpening.setMnemonic(KeyEvent.VK_S);
        sharpening.setAccelerator(KeyStroke.getKeyStroke(KeyEvent.VK_S, Toolkit.getDefaultToolkit().getMenuShortcutKeyMaskEx() | KeyEvent.ALT_DOWN_MASK));

        JMenuItem edgeDetection = new JMenuItem("Edge Detection");
        edgeDetection.addActionListener(e -> {
            if (imagePanel.getImage() == null && filteredPanel.getImage() == null) {
                AppFrame.showErrorMessage("No image loaded!");
                return;
            }

            BufferedImage image = filteredPanel.getImage();
            detectEdges(image);
            System.err.println("c: applying diagonal edge detection");
            filteredPanel.setImage(image);
            filteredPanel.refreshPanel();
        });
        add(edgeDetection);
        edgeDetection.setMnemonic(KeyEvent.VK_D);
        edgeDetection.setAccelerator(KeyStroke.getKeyStroke(KeyEvent.VK_D, Toolkit.getDefaultToolkit().getMenuShortcutKeyMaskEx() | KeyEvent.ALT_DOWN_MASK));

        JMenuItem emboss = new JMenuItem("Emboss");
        emboss.addActionListener(e -> {
            if (imagePanel.getImage() == null && filteredPanel.getImage() == null) {
                AppFrame.showErrorMessage("No image loaded!");
                return;
            }

            BufferedImage image = filteredPanel.getImage();
            embossImage(image);
            System.err.println("c: embossing image");
            filteredPanel.setImage(image);
            filteredPanel.refreshPanel();
        });
        add(emboss);
        emboss.setMnemonic(KeyEvent.VK_E);
        emboss.setAccelerator(KeyStroke.getKeyStroke(KeyEvent.VK_E, Toolkit.getDefaultToolkit().getMenuShortcutKeyMaskEx() | KeyEvent.ALT_DOWN_MASK));
    }

    private int[] getRGBValues(BufferedImage image, int x, int y) {
        int[] rgbValues = new int[3];
        int p = image.getRGB(x, y);
        rgbValues[0] = (p >> 16) & 0xff;
        rgbValues[1] = (p >> 8) & 0xff;
        rgbValues[2] = p & 0xff;

        return rgbValues;
    }

    private void applyKernel(BufferedImage image, BufferedImage helperImage, double[][] kernel, int offset) {
        for (int y = 0; y < image.getHeight(); y++) {
            for (int x = 0; x < image.getWidth(); x++) {
                double reds = 0;
                double greens = 0;
                double blues = 0;

                for (int j = -1; j <= 1; j++) {
                    for (int i = -1; i <= 1; i++) {
                        int newX = x + i;
                        int newY = y + j;

                        if (checkBounds(image, newX, newY)) {
                            int[] rgbValues = getRGBValues(image, newX, newY);
                            reds += rgbValues[0] * kernel[j + 1][i + 1];
                            greens += rgbValues[1] * kernel[j + 1][i + 1];
                            blues += rgbValues[2] * kernel[j + 1][i + 1];
                        }
                    }
                }

                reds += offset;
                greens += offset;
                blues += offset;

                reds = Math.min(Math.max(reds, 0), 255);
                greens = Math.min(Math.max(greens, 0), 255);
                blues = Math.min(Math.max(blues, 0), 255);

                helperImage.setRGB(x, y, ((int) reds << 16) | ((int) greens << 8) | (int) blues);
            }
        }
    }

    private void copyModifications(BufferedImage source, BufferedImage destination) {
        for (int y = 0; y < source.getHeight(); y++) {
            for (int x = 0; x < source.getWidth(); x++) {
                destination.setRGB(x, y, source.getRGB(x, y));
            }
        }
    }

    private boolean checkBounds(BufferedImage image, int x, int y) {
        return x >= 0 && x < image.getWidth() && y >= 0 && y < image.getHeight();
    }

    private void blurImage(BufferedImage image) {
        BufferedImage helperImage = new BufferedImage(image.getWidth(), image.getHeight(), BufferedImage.TYPE_INT_RGB);
        double[][] kernel = {
            {1.0 / 9, 1.0 / 9, 1.0 / 9},
            {1.0 / 9, 1.0 / 9, 1.0 / 9},
            {1.0 / 9, 1.0 / 9, 1.0 / 9}
        };
        applyKernel(image, helperImage, kernel, 0);
        copyModifications(helperImage, image);
    }

    private void gaussianBlurImage(BufferedImage image) {
        BufferedImage helperImage = new BufferedImage(image.getWidth(), image.getHeight(), BufferedImage.TYPE_INT_RGB);
        double[][] kernel = {
            {1.0 / 16, 2.0 / 16, 1.0 / 16},
            {2.0 / 16, 4.0 / 16, 2.0 / 16},
            {1.0 / 16, 2.0 / 16, 1.0 / 16}
        };
        applyKernel(image, helperImage, kernel, 0);
        copyModifications(helperImage, image);
    }

    private void sharpenImage(BufferedImage image) {
        BufferedImage helperImage = new BufferedImage(image.getWidth(), image.getHeight(), BufferedImage.TYPE_INT_RGB);
        double[][] kernel = {
            {-1, -1, -1},
            {-1,  9, -1},
            {-1, -1, -1}
        };
        applyKernel(image, helperImage, kernel, 0);
        copyModifications(helperImage, image);
    }

    private void detectEdges(BufferedImage image) {
        BufferedImage helperImage = new BufferedImage(image.getWidth(), image.getHeight(), BufferedImage.TYPE_INT_RGB);
        double[][] kernel = {
            {-1, 0, 0},
            { 0, 1, 0},
            { 0, 0, 0}
        };
        applyKernel(image, helperImage, kernel, 27);
        copyModifications(helperImage, image);
    }

    private void embossImage(BufferedImage image) {
        BufferedImage helperImage = new BufferedImage(image.getWidth(), image.getHeight(), BufferedImage.TYPE_INT_RGB);
        double[][] kernel = {
            {-1, -1, -1},
            { 0,  1,  0},
            { 1,  1,  1}
        };
        applyKernel(image, helperImage, kernel, 0);
        copyModifications(helperImage, image);
    }
}
