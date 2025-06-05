import javax.swing.*;
import java.awt.*;

public class FunctionFiltersEditor extends JFrame {
    public FunctionFiltersEditor() {
        setTitle("Function Filter Editing");
        setSize(new Dimension(256, 256));
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        setResizable(false);

        JPanel panel = new JPanel(new BorderLayout());
        JLabel label = new JLabel("To be implemented...");
        label.setFont(new Font("Arial", Font.PLAIN, 16));
        label.setHorizontalAlignment(SwingConstants.CENTER);
        label.setVerticalAlignment(SwingConstants.CENTER);
        panel.add(label, BorderLayout.CENTER);
        add(panel);

        setLocationRelativeTo(null);
        setVisible(true);
    }
}
