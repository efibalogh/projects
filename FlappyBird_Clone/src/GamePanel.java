import javax.swing.*;
import java.awt.*;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.image.BufferedImage;
import java.util.concurrent.atomic.AtomicInteger;
import javax.sound.sampled.*;
import java.io.File;
import java.io.IOException;

public class GamePanel extends JPanel implements Runnable, KeyListener {
    private static final int PANEL_SIZE = 512;
    private BufferedImage view;
    private Background background;
    private Bird bird;
    private Pipe[] pipes;
    private int score = 0;
    private int highScore = 0;
    private boolean gameStarted = false;

    public GamePanel() {
        setLayout(null);
        setFocusable(true);
        setPreferredSize(new Dimension(PANEL_SIZE, PANEL_SIZE));
        addKeyListener(this);
    }

    public void initGamePanel() {
        view = new BufferedImage(PANEL_SIZE, PANEL_SIZE, BufferedImage.TYPE_INT_RGB);
        background = new Background();
        bird = new Bird();
        pipes = new Pipe[4];
        loadHighScore();
        startingPositionPipes();
    }

    private void startingPositionPipes() {
        for (int i = 0; i < 4; i++) {
            pipes[i] = new Pipe(0, 0, Pipe.getPipeImage().getWidth(), Pipe.getPipeImage().getHeight());
            pipes[i].setNewPosition(PANEL_SIZE + Pipe.getPipeImage().getWidth() + i * 170);
        }
    }

    private void drawGamePanel() {
        background.draw(view, gameStarted);
        for (Pipe pipe : pipes) {
            pipe.draw(view);
        }
        bird.draw(view, background.getGameOverValue());
        background.drawBase(view);
        view.getGraphics().drawString("Score: " + score, 10, 30);
        view.getGraphics().drawString("High score: " + highScore, 10, 60);
        getGraphics().drawImage(view, 0, 0, PANEL_SIZE, PANEL_SIZE, this);
    }

    private void loadHighScore() {
        try {
            File file = new File("/Users/efi/Documents/GitHub/egyetem/III/java/Projekt/FlappyBird/assets/score/highscore.txt");
            if (file.exists()) {
                String highScoreStr = new String(java.nio.file.Files.readAllBytes(file.toPath()));
                highScore = Integer.parseInt(highScoreStr.trim());
            }
        } catch (IOException | NumberFormatException e) {
            System.out.println("Error loading high score");
        }
    }

    private void saveHighScore() {
        try {
            File file = new File("/Users/efi/Documents/GitHub/egyetem/III/java/Projekt/FlappyBird/assets/score/highscore.txt");
            java.nio.file.Files.write(file.toPath(), String.valueOf(highScore).getBytes());
        } catch (IOException e) {
            System.out.println("Error saving high score");
        }
    }

    public void gameOver() {
        if (score > highScore) {
            highScore = score;
            saveHighScore();
            System.out.println("New high score: " + highScore);
        }
        gameStarted = false;
        background.setGameOverValue(true);
        playSound("hit");
        playSound("die");
        startingPositionPipes();
        bird.startingPosition();
        score = 0;
    }

    public void update(int flyAnimationIndex) {
        background.move();
        if (flyAnimationIndex % 6 == 0) {
            bird.fly();
        }

        if (gameStarted) {
            for (Pipe pipe : pipes) {
                pipe.move();

                if (pipe.getX() + pipe.getWidth() < 0) {
                    pipe.setNewPosition(PANEL_SIZE + pipe.getWidth() + 65);
                }

                if (pipe.isColliding(bird.getHitBox())) {
                    System.out.println("pipe hit, score is " + score);
                    gameOver();
                }

                if (pipe.isPassed(bird.getHitBox())) {
                    pipe.setPassed(true);
                    score++;
                    playSound("point");
                }
            }
        }

        if (bird.getDirection() == Direction.Up) {
            bird.jump();
        } else if (bird.getDirection() == Direction.Down) {
            bird.fall();
        }

        if (bird.isColliding(background.getBaseHitBox())) {
            System.out.println("floor hit, score is " + score);
            gameOver();
        }
    }

    private void playSound(String name) {
        try {
            AudioInputStream audioStream = AudioSystem.getAudioInputStream(new File("/Users/efi/Documents/GitHub/egyetem/III/java/Projekt/FlappyBird/assets/audio/" + name + ".wav"));
            Clip clip = AudioSystem.getClip();
            clip.open(audioStream);
            clip.start();
        } catch (UnsupportedAudioFileException | IOException | LineUnavailableException ex) {
            System.out.println("Error playing " + name + " sound");
        }
    }

    @Override
    public void run() {
        try {
            requestFocus();
            initGamePanel();
            System.out.println("Game started, high score is " + highScore);
            AtomicInteger flyAnimationIndex = new AtomicInteger(0);
            background.draw(view, true);
            new Timer(12, e -> {
                update(flyAnimationIndex.getAndIncrement());
                drawGamePanel();
            }).start();
        } catch (Exception e) {
            System.out.println("Error running game");
        }
    }
    
    @Override
    public void addNotify() {
        super.addNotify();
        new Thread(this).start();
    }

    @Override
    public void keyTyped(KeyEvent e) {

    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyCode() == KeyEvent.VK_SPACE) {
            background.setGameOverValue(false);
            bird.setDirection(Direction.Up);
            playSound("wing");
        }
    }

    @Override
    public void keyReleased(KeyEvent e) {
        if (e.getKeyCode() == KeyEvent.VK_SPACE) {
            gameStarted = true;
            bird.setDirection(Direction.Down);
        }
    }
}
