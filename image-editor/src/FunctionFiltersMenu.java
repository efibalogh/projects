import javax.swing.*;
import java.awt.Toolkit;
import java.awt.event.KeyEvent;
import java.awt.image.BufferedImage;
import java.util.function.IntUnaryOperator;

public class FunctionFiltersMenu extends JMenu {
    public FunctionFiltersMenu(ImagePanel imagePanel, ImagePanel filteredPanel) {
        super("Function Filters");

        JMenuItem inversion = new JMenuItem("Inversion");
        inversion.addActionListener(e -> {
            if (imagePanel.getImage() == null && filteredPanel.getImage() == null) {
                AppFrame.showErrorMessage("No image loaded!");
                return;
            }

            BufferedImage image = filteredPanel.getImage();
            invertImage(image);
            System.err.println("f: applying inversion");
            filteredPanel.setImage(image);
            filteredPanel.refreshPanel();
        });
        add(inversion);
        inversion.setMnemonic(KeyEvent.VK_I);
        inversion.setAccelerator(KeyStroke.getKeyStroke(KeyEvent.VK_I, Toolkit.getDefaultToolkit().getMenuShortcutKeyMaskEx()));

        JMenuItem increaseBrightness = new JMenuItem("Increase Brightness");
        increaseBrightness.addActionListener(e -> {
            if (imagePanel.getImage() == null && filteredPanel.getImage() == null) {
                AppFrame.showErrorMessage("No image loaded!");
                return;
            }

            BufferedImage image = filteredPanel.getImage();
            int value = 25;
            brightnessCorrection(image, value);
            System.err.println("f: increasing brightness by " + value);
            filteredPanel.setImage(image);
            filteredPanel.refreshPanel();
        });
        add(increaseBrightness);
        increaseBrightness.setMnemonic(KeyEvent.VK_B);
        increaseBrightness.setAccelerator(KeyStroke.getKeyStroke(KeyEvent.VK_B, Toolkit.getDefaultToolkit().getMenuShortcutKeyMaskEx()));

        JMenuItem decreaseBrightness = new JMenuItem("Decrease Brightness");
        decreaseBrightness.addActionListener(e -> {
            if (imagePanel.getImage() == null && filteredPanel.getImage() == null) {
                AppFrame.showErrorMessage("No image loaded!");
                return;
            }

            BufferedImage image = filteredPanel.getImage();
            int value = -25;
            brightnessCorrection(image, value);
            System.err.println("f: decreasing brightness by " + -value);
            filteredPanel.setImage(image);
            filteredPanel.refreshPanel();
        });
        add(decreaseBrightness);
        decreaseBrightness.setMnemonic(KeyEvent.VK_B);
        decreaseBrightness.setAccelerator(KeyStroke.getKeyStroke(KeyEvent.VK_B, Toolkit.getDefaultToolkit().getMenuShortcutKeyMaskEx() | KeyEvent.SHIFT_DOWN_MASK));

        JMenuItem increaseContrast = new JMenuItem("Increase Contrast");
        increaseContrast.addActionListener(e -> {
            if (imagePanel.getImage() == null && filteredPanel.getImage() == null) {
                AppFrame.showErrorMessage("No image loaded!");
                return;
            }

            BufferedImage image = filteredPanel.getImage();
            int value = 35;
            contrastEnhancement(image, value);
            System.err.println("f: increasing contrast by " + value);
            filteredPanel.setImage(image);
            filteredPanel.refreshPanel();
            

        });
        add(increaseContrast);
        increaseContrast.setMnemonic(KeyEvent.VK_C);
        increaseContrast.setAccelerator(KeyStroke.getKeyStroke(KeyEvent.VK_C, Toolkit.getDefaultToolkit().getMenuShortcutKeyMaskEx()));

        JMenuItem decreaseContrast = new JMenuItem("Decrease Contrast");
        decreaseContrast.addActionListener(e -> {
            if (imagePanel.getImage() == null && filteredPanel.getImage() == null) {
                AppFrame.showErrorMessage("No image loaded!");
                return;
            }

            BufferedImage image = filteredPanel.getImage();
            int value = -35;
            contrastEnhancement(image, value);
            System.err.println("f: decreasing contrast by " + -value);
            filteredPanel.setImage(image);
            filteredPanel.refreshPanel();
        });
        add(decreaseContrast);
        decreaseContrast.setMnemonic(KeyEvent.VK_C);
        decreaseContrast.setAccelerator(KeyStroke.getKeyStroke(KeyEvent.VK_C, Toolkit.getDefaultToolkit().getMenuShortcutKeyMaskEx() | KeyEvent.SHIFT_DOWN_MASK));

        JMenuItem increaseGammaCorrection = new JMenuItem("Increase Gamma Correction");
        increaseGammaCorrection.addActionListener(e -> {
            if (imagePanel.getImage() == null && filteredPanel.getImage() == null) {
                AppFrame.showErrorMessage("No image loaded!");
                return;
            }

            BufferedImage image = filteredPanel.getImage();
            int value = 50;
            gammaCorrection(image, value);
            System.err.println("f: increasing gamma correction by " + value);
            filteredPanel.setImage(image);
            filteredPanel.refreshPanel();
        });
        add(increaseGammaCorrection);
        increaseGammaCorrection.setMnemonic(KeyEvent.VK_G);
        increaseGammaCorrection.setAccelerator(KeyStroke.getKeyStroke(KeyEvent.VK_G, Toolkit.getDefaultToolkit().getMenuShortcutKeyMaskEx()));

        JMenuItem decreaseGammaCorrection = new JMenuItem("Decrease Gamma Correction");
        decreaseGammaCorrection.addActionListener(e -> {
            if (imagePanel.getImage() == null && filteredPanel.getImage() == null) {
                AppFrame.showErrorMessage("No image loaded!");
                return;
            }

            BufferedImage image = filteredPanel.getImage();
            int value = -50;
            gammaCorrection(image, value);
            System.err.println("f: decreasing gamma correction by " + -value);
            filteredPanel.setImage(image);
            filteredPanel.refreshPanel();
        });
        add(decreaseGammaCorrection);
        decreaseGammaCorrection.setMnemonic(KeyEvent.VK_G);
        decreaseGammaCorrection.setAccelerator(KeyStroke.getKeyStroke(KeyEvent.VK_G, Toolkit.getDefaultToolkit().getMenuShortcutKeyMaskEx() | KeyEvent.SHIFT_DOWN_MASK));

        JMenuItem editor = new JMenuItem("Open Editor");
        editor.addActionListener(e -> {
            if (imagePanel.getImage() == null && filteredPanel.getImage() == null) {
                AppFrame.showErrorMessage("No image loaded!");
                return;
            }

            new FunctionFiltersEditor();
        });
        add(editor);
        editor.setMnemonic(KeyEvent.VK_E);
        editor.setAccelerator(KeyStroke.getKeyStroke(KeyEvent.VK_E, Toolkit.getDefaultToolkit().getMenuShortcutKeyMaskEx() | KeyEvent.SHIFT_DOWN_MASK));
    }

    private int[] getRGBValues(BufferedImage image, int x, int y) {
        int[] rgbValues = new int[3];
        int p = image.getRGB(x, y);
        rgbValues[0] = (p >> 16) & 0xff;
        rgbValues[1] = (p >> 8) & 0xff;
        rgbValues[2] = p & 0xff;

        return rgbValues;
    }

    private void applyModification(BufferedImage image, IntUnaryOperator modification) {
        for (int y = 0; y < image.getHeight(); y++) {
            for (int x = 0; x < image.getWidth(); x++) {
                int[] rgbValues = getRGBValues(image, x, y);

                for (int i = 0; i < 3; i++) {
                    rgbValues[i] = modification.applyAsInt(rgbValues[i]);
                    rgbValues[i] = Math.min(Math.max(rgbValues[i], 0), 255);
                }

                image.setRGB(x, y, (rgbValues[0] << 16) | (rgbValues[1] << 8) | rgbValues[2]);
            }
        }
    }

    private void invertImage(BufferedImage image) {
        applyModification(image, value -> 255 - value);
    }

    private void brightnessCorrection(BufferedImage image, int value) {
        applyModification(image, v -> v + value);
    }

    private void contrastEnhancement(BufferedImage image, int value) {
        applyModification(image, v -> (int) (128 + (v - 128) * (1 + value / 100.0)));
    }

    private void gammaCorrection(BufferedImage image, int value) {
        applyModification(image, v -> (int) (255 * Math.pow(v / 255.0, 1 / (1 + value / 100.0))));
    }
}
