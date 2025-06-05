import javax.swing.*;
import java.awt.*;

public class AppFrame extends JFrame {
    public AppFrame() {
        setLayout(new GridLayout(1, 2));
        setTitle("Image Editor");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(new Dimension(600, 480));
        setLocationRelativeTo(null);

        ImagePanel imagePanel = new ImagePanel(this);
        add(imagePanel);
        ImagePanel filteredPanel = new ImagePanel(this);
        add(filteredPanel);

        JMenuBar menuBar = new JMenuBar();

        FileMenu fileMenu = new FileMenu(imagePanel, filteredPanel);
        menuBar.add(fileMenu);
        SimplificationMenu simplificationMenu = new SimplificationMenu(imagePanel, filteredPanel);
        menuBar.add(simplificationMenu);
        FunctionFiltersMenu functionFiltersMenu = new FunctionFiltersMenu(imagePanel, filteredPanel);
        menuBar.add(functionFiltersMenu);
        ConvolutionFiltersMenu convolutionFiltersMenu = new ConvolutionFiltersMenu(imagePanel, filteredPanel);
        menuBar.add(convolutionFiltersMenu);

        setJMenuBar(menuBar);

        setLocationRelativeTo(null);
        setVisible(true);
    }

    public static int showDiscardChangesMessage() {
        return JOptionPane.showConfirmDialog(
                null,
                "Do you want to discard the changes?",
                "Discard changes",
                JOptionPane.YES_NO_OPTION
        );
    }
    public static void showErrorMessage(String message) {
        JOptionPane.showMessageDialog(
                null,
                message,
                "Error",
                JOptionPane.ERROR_MESSAGE
        );
    }

    public static int showSelectThresholdMessage() {
        Object[] options = {"2", "3", "4", "6"};
        String selectedValue = (String) JOptionPane.showInputDialog(
                null,
                "Select the threshold value:",
                "",
                JOptionPane.QUESTION_MESSAGE,
                null,
                options,
                "2"
        );

        if (selectedValue != null) {
            return Integer.parseInt(selectedValue);
        } else {
            return -1;
        }
    }

    public static int[] showSelectNumberOfDivisions() {
        JTextField redField = new JTextField();
        JTextField greenField = new JTextField();
        JTextField blueField = new JTextField();

        JPanel panel = new JPanel(new GridLayout(3, 1));
        panel.add(new JLabel("Red axis:"));
        panel.add(redField);
        panel.add(new JLabel("Green axis:"));
        panel.add(greenField);
        panel.add(new JLabel("Blue axis:"));
        panel.add(blueField);

        int result = JOptionPane.showConfirmDialog(
                null,
                panel,
                "Select Number of Divisions",
                JOptionPane.OK_CANCEL_OPTION
        );

        if (result == JOptionPane.OK_OPTION) {
            try {
                int redDivisions = Integer.parseInt(redField.getText());
                int greenDivisions = Integer.parseInt(greenField.getText());
                int blueDivisions = Integer.parseInt(blueField.getText());

                if (redDivisions < 1 || greenDivisions < 1 || blueDivisions < 1 ||
                    redDivisions > 256 || greenDivisions > 256 || blueDivisions > 256) {
                    JOptionPane.showMessageDialog(null, "Invalid input!", "Error", JOptionPane.ERROR_MESSAGE);
                    return null;
                }

                return new int[]{redDivisions, greenDivisions, blueDivisions};
            } catch (NumberFormatException e) {
                JOptionPane.showMessageDialog(null, "Invalid input!", "Error", JOptionPane.ERROR_MESSAGE);
            }
        }

        return null;
    }
}
