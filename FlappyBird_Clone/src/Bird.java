import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.util.Random;

public class Bird {
    private static final String BIRDS_PATH = "/Users/efi/Documents/GitHub/egyetem/III/java/Projekt/FlappyBird/assets/pictures/birds/";
    private static final String[] BIRD_COLORS = {"bluebird", "redbird", "yellowbird"};
    private static final String[] FLAP_STATES = {"-downflap.png", "-midflap.png", "-upflap.png"};
    private static final float GRAVITY = 0.45f;
    private float velocity = 0;

    private int flapState = 0;
    private BufferedImage bird;
    private final BufferedImage[] flyingAnimation = new BufferedImage[3];
    private Rectangle birdBox;
    private Direction direction;

    public Bird() {
        try {
            int colorIndex = new Random().nextInt(3);

            for (int i = 0; i < 3; i++) {
                flyingAnimation[i] = ImageIO.read(new File(BIRDS_PATH + BIRD_COLORS[colorIndex] + FLAP_STATES[i]));
            }

            startingPosition();
        } catch (Exception e) {
            System.out.println("Error loading bird images");
        }
    }

    public Rectangle getHitBox() {
        return birdBox;
    }

    public Direction getDirection() {
        return direction;
    }

    public void setDirection(Direction direction) {
        this.direction = direction;
    }

    protected void startingPosition() {
        direction = Direction.None;
        flapState = 0;
        bird = flyingAnimation[0];
        birdBox = new Rectangle(
                150,
                230,
                flyingAnimation[0].getWidth(),
                flyingAnimation[0].getHeight()
        );
    }

    public boolean isColliding(Rectangle hitBox) {
        return hitBox.intersects(birdBox);
    }

    protected void fly() {
        flapState = flapState == 1 ? -1 : flapState + 1;
        bird = flyingAnimation[flapState + 1];
    }

    protected void jump() {
        velocity = -4.5f;
        birdBox.y += (int) velocity;
    }

    protected void fall() {
        velocity += GRAVITY;
        birdBox.y += (int) velocity;
    }

    public void draw(BufferedImage view, boolean gameOver) {
        if (!gameOver) {
            Graphics2D g2d = (Graphics2D) view.getGraphics();
            g2d.drawImage(
                    bird,
                    birdBox.x,
                    birdBox.y,
                    birdBox.width,
                    birdBox.height,
                    null
            );
            g2d.dispose();
        }

    }
}
