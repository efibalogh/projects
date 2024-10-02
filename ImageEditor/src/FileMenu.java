import javax.imageio.ImageIO;
import javax.swing.*;
import java.awt.*;
import java.awt.event.KeyEvent;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

public class FileMenu extends JMenu {
    private final ImagePanel imagePanel;
    private final ImagePanel filteredPanel;

    public FileMenu(ImagePanel imagePanel, ImagePanel filteredPanel) {
        super("File");
        this.imagePanel = imagePanel;
        this.filteredPanel = filteredPanel;

        JMenuItem loadImage = new JMenuItem("Load Image");
        loadImage.addActionListener(e -> loadImage());
        add(loadImage);
        loadImage.setMnemonic(KeyEvent.VK_O);
        loadImage.setAccelerator(KeyStroke.getKeyStroke(KeyEvent.VK_O, Toolkit.getDefaultToolkit().getMenuShortcutKeyMaskEx()));

        JMenuItem saveImage = new JMenuItem("Save Image");
        saveImage.addActionListener(e -> saveImage());
        add(saveImage);
        saveImage.setMnemonic(KeyEvent.VK_S);
        saveImage.setAccelerator(KeyStroke.getKeyStroke(KeyEvent.VK_S, Toolkit.getDefaultToolkit().getMenuShortcutKeyMaskEx()));

        JMenuItem restoreOriginal = new JMenuItem("Restore Original Image");
        restoreOriginal.addActionListener(e -> restoreOriginal());
        add(restoreOriginal);
        restoreOriginal.setMnemonic(KeyEvent.VK_R);
        restoreOriginal.setAccelerator(KeyStroke.getKeyStroke(KeyEvent.VK_R, Toolkit.getDefaultToolkit().getMenuShortcutKeyMaskEx()));
    }

    private BufferedImage duplicateImage(BufferedImage image) {
        BufferedImage newImage = new BufferedImage(image.getWidth(), image.getHeight(), BufferedImage.TYPE_INT_RGB);
        Graphics2D g = newImage.createGraphics();
        g.drawImage(image, 0, 0, null);
        g.dispose();
        return newImage;
    }

    private void loadImage() {
        if (filteredPanel.getImage() != null && filteredPanel.getImage() != imagePanel.getImage()) {
            int choice = AppFrame.showDiscardChangesMessage();
            if (choice == JOptionPane.NO_OPTION) {
                return;
            } else {
                filteredPanel.clearPanel();
            }
        }

        JFileChooser fileChooser = new JFileChooser();
        fileChooser.setCurrentDirectory(new File("pics"));
        int result = fileChooser.showOpenDialog(null);

        if (result == JFileChooser.APPROVE_OPTION) {
            try {
                BufferedImage image = ImageIO.read(fileChooser.getSelectedFile());
                imagePanel.clearPanel();
                imagePanel.setImage(image);
                imagePanel.refreshPanel();
                imagePanel.resizeParentFrame();
                filteredPanel.clearPanel();
                filteredPanel.setImage(duplicateImage(image));
                filteredPanel.refreshPanel();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    private void saveImage() {
        if (imagePanel.getImage() == null) {
            AppFrame.showErrorMessage("No image loaded!");
            return;
        } else if (filteredPanel.getImage() == null) {
            AppFrame.showErrorMessage("No modifications to save!");
            return;
        }

        try {
            BufferedImage image = filteredPanel.getImage();
            JFileChooser fileChooser = new JFileChooser();
            fileChooser.setCurrentDirectory(new File("pics"));

            int result = fileChooser.showSaveDialog(null);
            if (result == JFileChooser.APPROVE_OPTION) {
                File file = new File(fileChooser.getSelectedFile() + ".jpg");
                ImageIO.write(image, "jpg", file);
                System.err.println("File saved: " + file.getAbsolutePath());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void restoreOriginal() {
        if (filteredPanel.getImage() == null)  {
            AppFrame.showErrorMessage("No modifications to clear!");
            return;
        }

        if (filteredPanel.getImage() != imagePanel.getImage()) {
            int choice = AppFrame.showDiscardChangesMessage();

            if (choice == JOptionPane.YES_OPTION) {
                filteredPanel.clearPanel();
                filteredPanel.setImage(duplicateImage(imagePanel.getImage()));
                filteredPanel.refreshPanel();
                System.err.println("original image restored");
            }
        }
    }
}
