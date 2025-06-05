import javax.swing.*;

public class FlappyBird {
    public static void main(String[] args) {
        JFrame flappyFrame = new JFrame("FlappyBird");
        flappyFrame.setResizable(false);
        flappyFrame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        flappyFrame.add(new GamePanel());
        flappyFrame.pack();
        flappyFrame.setLocationRelativeTo(null);
        flappyFrame.setVisible(true);
    }
}
