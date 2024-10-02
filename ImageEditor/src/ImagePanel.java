import javax.swing.*;
import java.awt.*;
import java.awt.image.BufferedImage;

public class ImagePanel extends JPanel {
    private final JFrame parentFrame;
    private BufferedImage image;

    public ImagePanel(JFrame parentFrame) {
        this.parentFrame = parentFrame;
    }

    public void refreshPanel() {
        revalidate();
        repaint();
    }

    public void clearPanel() {
        image = null;
        refreshPanel();
    }

    public void resizeParentFrame() {
        if (image != null) {
            parentFrame.setSize(new Dimension(image.getWidth() * 2, image.getHeight() + 100));
            parentFrame.setLocationRelativeTo(null);
        }
    }

    public void setImage(BufferedImage image) {
        if (image == null) {
            return;
        }

        this.image = image;
        setPreferredSize(new Dimension(image.getWidth(), image.getHeight()));
    }

    public BufferedImage getImage() {
        return image;
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);

        if (image != null) {
            int x = (getWidth() - image.getWidth()) / 2;
            int y = (getHeight() - image.getHeight()) / 2;
            g.drawImage(image, x, y, this);
        }
    }
}
