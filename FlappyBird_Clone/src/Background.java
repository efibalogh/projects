import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.time.LocalTime;

public class Background {
    private static final String START_PATH = "/Users/efi/Documents/GitHub/egyetem/III/java/Projekt/FlappyBird/assets/pictures/tap-to-start.png";
    private static final String GAME_OVER_PATH = "/Users/efi/Documents/GitHub/egyetem/III/java/Projekt/FlappyBird/assets/pictures/game-over.png";
    private static final String BASE_PATH = "/Users/efi/Documents/GitHub/egyetem/III/java/Projekt/FlappyBird/assets/pictures/map/base-long.png";
    private static final String BACKGROUND_PATH;
    static {
        if (LocalTime.now().getHour() >= 7 && LocalTime.now().getHour() < 19) {
            BACKGROUND_PATH = "/Users/efi/Documents/GitHub/egyetem/III/java/Projekt/FlappyBird/assets/pictures/map/background-day-long.png";
        } else {
            BACKGROUND_PATH = "/Users/efi/Documents/GitHub/egyetem/III/java/Projekt/FlappyBird/assets/pictures/map/background-night-long.png";
        }
    }
    private static final int SIZE = 512;
    private boolean showGameOver = false;
    private BufferedImage start, base, background, gameOver;
    private Rectangle startBox, baseBox, backgroundBox, gameOverBox;

    public Background() {
        try {
            start = ImageIO.read(new File(START_PATH));
            startBox = new Rectangle(
                    SIZE / 2 - start.getWidth() / 2,
                    SIZE / 2 - start.getHeight() / 2 - 83,
                    start.getWidth(),
                    start.getHeight()
            );
            base = ImageIO.read(new File(BASE_PATH));
            baseBox = new Rectangle(
                    0,
                    SIZE - base.getHeight(),
                    base.getWidth(),
                    base.getHeight()
            );
            background = ImageIO.read(new File(BACKGROUND_PATH));
            backgroundBox = new Rectangle(
                    0,
                    0,
                    background.getWidth(),
                    background.getHeight()
            );
            gameOver = ImageIO.read(new File(GAME_OVER_PATH));
            gameOverBox = new Rectangle(
                    SIZE / 2 - gameOver.getWidth() / 2,
                    SIZE / 2 - gameOver.getHeight() / 2 - 83,
                    gameOver.getWidth(),
                    gameOver.getHeight()
            );
        } catch (Exception e) {
            System.out.println("Error loading background images");
        }
    }

    public Rectangle getBaseHitBox() {
        return baseBox;
    }

    public void setGameOverValue(boolean showGameOver) {
        this.showGameOver = showGameOver;
    }

    public boolean getGameOverValue() {
        return showGameOver;
    }

    public void move() {
        if (backgroundBox.x + backgroundBox.width == 0) {
            backgroundBox.x = 0;
        }
        backgroundBox.x--;

        if (baseBox.x + baseBox.width == 0) {
            baseBox.x = 0;
        }
        baseBox.x -= 2;
    }

    public void draw(BufferedImage view, boolean gameStarted) {
        Graphics2D g2d = (Graphics2D) view.getGraphics();
        g2d.drawImage(
                background,
                backgroundBox.x,
                backgroundBox.y,
                backgroundBox.width,
                backgroundBox.height,
                null
        );
        g2d.drawImage(
                background,
                backgroundBox.x + backgroundBox.width,
                backgroundBox.y,
                backgroundBox.width,
                backgroundBox.height,
                null
        );
        if (!gameStarted && !showGameOver) {
            g2d.drawImage(
                    start,
                    startBox.x,
                    startBox.y,
                    startBox.width,
                    startBox.height,
                    null
            );
        }
        if (showGameOver && !gameStarted) {
            g2d.drawImage(
                    gameOver,
                    gameOverBox.x,
                    gameOverBox.y,
                    gameOverBox.width,
                    gameOverBox.height,
                    null
            );
        }
        g2d.dispose();
    }

    public void drawBase(BufferedImage view) {
        Graphics2D g2d = (Graphics2D) view.getGraphics();
        g2d.drawImage(
                base,
                baseBox.x,
                baseBox.y,
                baseBox.width,
                baseBox.height,
                null
        );
        g2d.drawImage(
                base,
                baseBox.x + baseBox.width,
                baseBox.y,
                baseBox.width,
                baseBox.height,
                null
        );
        g2d.dispose();
    }
}
