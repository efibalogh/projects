import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.util.Random;

public class Pipe {
    private static final int DISTANCE = 105;
    private int x;
    private final int width;
    private final int height;
    private final Rectangle topPipe;
    private final Rectangle bottomPipe;
    private boolean passed;

    private static BufferedImage topPipeImage;
    private static BufferedImage bottomPipeImage;

    public Pipe(int x, int y, int width, int height) {
        this.x = x;
        this.width = width;
        this.height = height;

        topPipe = new Rectangle(x, y, width, height);
        bottomPipe = new Rectangle(x, height + DISTANCE, width, height);
        passed = false;
    }

    static {
        try {
            topPipeImage = ImageIO.read(new File("/Users/efi/Documents/GitHub/egyetem/III/java/Projekt/FlappyBird/assets/pictures/map/pipe-top.png"));
            bottomPipeImage = ImageIO.read(new File("/Users/efi/Documents/GitHub/egyetem/III/java/Projekt/FlappyBird/assets/pictures/map/pipe-bottom.png"));
        } catch (Exception e) {
            System.out.println("Error loading pipe images");
        }
    }

    public int getX() {
        return x;
    }

    public int getWidth() {
        return width;
    }

    public static BufferedImage getPipeImage() {
        return topPipeImage;
    }

    protected void setNewPosition(int newX) {
        topPipe.x = newX;
        bottomPipe.x = newX;
        x = newX;
        topPipe.y = -(new Random().nextInt(140) + 100);
        bottomPipe.y = topPipe.y + height + DISTANCE;
        passed = false;
    }

    public boolean isColliding(Rectangle bird) {
        return bird.intersects(topPipe) || bird.intersects(bottomPipe);
    }

    protected boolean isPassed(Rectangle bird) {
        return bird.x > x && !passed;
    }

    public void setPassed(boolean passed) {
        this.passed = passed;
    }

    protected void move() {
        x -= 2;
        topPipe.x -= 2;
        bottomPipe.x -= 2;
    }

    protected void draw(BufferedImage view) {
        Graphics2D g2d = (Graphics2D) view.getGraphics();
        g2d.drawImage(
                topPipeImage,
                topPipe.x,
                topPipe.y,
                topPipe.width,
                topPipe.height,
                null
        );
        g2d.drawImage(
                bottomPipeImage,
                bottomPipe.x,
                bottomPipe.y,
                bottomPipe.width,
                bottomPipe.height,
                null
        );
        g2d.dispose();
    }
}
