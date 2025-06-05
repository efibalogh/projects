import javax.swing.*;
import java.awt.*;
import java.awt.event.InputEvent;
import java.awt.event.KeyEvent;

public class AppFrame extends JFrame {
    private final DrawPanel drawPanel;
    private final JCheckBoxMenuItem line;
    private final JCheckBoxMenuItem circle;
    private final JCheckBoxMenuItem rectangle;
    private final JCheckBoxMenuItem polygon;

    public AppFrame() {
        setTitle("Vector Graphics Editor");
        setSize(new Dimension(800, 600));
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        drawPanel = new DrawPanel();
        add(drawPanel, BorderLayout.CENTER);

        JMenuBar menuBar = new JMenuBar();
        setJMenuBar(menuBar);

        JMenu fileMenu = new JMenu("File");
        menuBar.add(fileMenu);

        JMenuItem load = new JMenuItem("Load");
        load.addActionListener(e -> drawPanel.loadDrawingFromFile());
        load.setMnemonic('1');
        load.setAccelerator(KeyStroke.getKeyStroke('1', Toolkit.getDefaultToolkit().getMenuShortcutKeyMaskEx()));
        fileMenu.add(load);

        JMenuItem save = new JMenuItem("Save");
        save.addActionListener(e -> drawPanel.saveDrawingToFile());
        fileMenu.add(save);
        save.setMnemonic('S');
        save.setAccelerator(KeyStroke.getKeyStroke('S', Toolkit.getDefaultToolkit().getMenuShortcutKeyMaskEx()));

        JMenu drawMenu = new JMenu("Draw");
        menuBar.add(drawMenu);

        line = new JCheckBoxMenuItem("Line");
        line.addActionListener(e -> {
            drawPanel.setDrawMode(DrawMode.LINE);
            updateMenuItems();
        });
        line.setMnemonic('L');
        line.setAccelerator(KeyStroke.getKeyStroke('L', Toolkit.getDefaultToolkit().getMenuShortcutKeyMaskEx()));
        drawMenu.add(line);

        circle = new JCheckBoxMenuItem("Circle");
        circle.addActionListener(e -> {
            drawPanel.setDrawMode(DrawMode.CIRCLE);
            updateMenuItems();
        });
        circle.setMnemonic('O');
        circle.setAccelerator(KeyStroke.getKeyStroke('O', Toolkit.getDefaultToolkit().getMenuShortcutKeyMaskEx()));
        drawMenu.add(circle);

        rectangle = new JCheckBoxMenuItem("Rectangle");
        rectangle.addActionListener(e -> {
            drawPanel.setDrawMode(DrawMode.RECTANGLE);
            updateMenuItems();
        });
        rectangle.setMnemonic('R');
        rectangle.setAccelerator(KeyStroke.getKeyStroke('R', Toolkit.getDefaultToolkit().getMenuShortcutKeyMaskEx()));
        drawMenu.add(rectangle);

        polygon = new JCheckBoxMenuItem("Polygon");
        polygon.addActionListener(e -> {
            drawPanel.setDrawMode(DrawMode.POLYGON);
            updateMenuItems();
        });
        polygon.setMnemonic('P');
        polygon.setAccelerator(KeyStroke.getKeyStroke('P', Toolkit.getDefaultToolkit().getMenuShortcutKeyMaskEx()));
        drawMenu.add(polygon);

        JMenu colourMenu = new JMenu("Colour");
        menuBar.add(colourMenu);

        JMenuItem drawingColour = new JMenuItem("Change Drawing Colour");
        drawingColour.addActionListener(e -> {
            Color newColour = JColorChooser.showDialog(null, "Choose a colour", drawPanel.getInitialColour());
            drawPanel.setInitialColour(newColour);
        });
        drawingColour.setMnemonic('C');
        drawingColour.setAccelerator(KeyStroke.getKeyStroke('C', Toolkit.getDefaultToolkit().getMenuShortcutKeyMaskEx()));
        colourMenu.add(drawingColour);

        JMenuItem selectedColour = new JMenuItem("Change Colour of Selected Shape");
        selectedColour.addActionListener(e -> {
            Color newColour = JColorChooser.showDialog(null, "Choose a colour", drawPanel.getInitialColour());
            drawPanel.changeSelectionColour(newColour);
        });
        selectedColour.setMnemonic('C');
        selectedColour.setAccelerator(KeyStroke.getKeyStroke(KeyEvent.VK_C, InputEvent.ALT_DOWN_MASK));
        colourMenu.add(selectedColour);

        JMenuItem changeAllColours = new JMenuItem("Change Colour of All Shapes");
        changeAllColours.addActionListener(e -> {
            Color newColour = JColorChooser.showDialog(null, "Choose a colour", drawPanel.getInitialColour());
            drawPanel.changeAllColours(newColour);
        });
        changeAllColours.setMnemonic('C');
        changeAllColours.setAccelerator(KeyStroke.getKeyStroke(KeyEvent.VK_C, InputEvent.CTRL_DOWN_MASK));
        colourMenu.add(changeAllColours);

        JMenuItem fillColour = new JMenuItem("Set Fill Colour");
        fillColour.addActionListener(e -> {
            Color newColour = JColorChooser.showDialog(null, "Choose a colour", drawPanel.getInitialColour());
            drawPanel.setFillColour(newColour);
        });
        fillColour.setMnemonic('F');
        fillColour.setAccelerator(KeyStroke.getKeyStroke('F', Toolkit.getDefaultToolkit().getMenuShortcutKeyMaskEx()));
        colourMenu.add(fillColour);

        JMenuItem fillImage = new JMenuItem("Fill with Image");
        fillImage.addActionListener(e -> drawPanel.fillWithImage());
        fillImage.setMnemonic('I');
        fillImage.setAccelerator(KeyStroke.getKeyStroke('I', Toolkit.getDefaultToolkit().getMenuShortcutKeyMaskEx()));
        colourMenu.add(fillImage);

        JMenuItem fillPolygon = new JMenuItem("Fill Selected Polygon");
        fillPolygon.addActionListener(e -> drawPanel.fillSelection(true));
        fillPolygon.setMnemonic('F');
        fillPolygon.setAccelerator(KeyStroke.getKeyStroke(KeyEvent.VK_F, InputEvent.ALT_DOWN_MASK));
        colourMenu.add(fillPolygon);

        JMenuItem removeFill = new JMenuItem("Remove Fill");
        removeFill.addActionListener(e -> drawPanel.fillSelection(false));
        removeFill.setMnemonic('F');
        removeFill.setAccelerator(KeyStroke.getKeyStroke(KeyEvent.VK_F, InputEvent.CTRL_DOWN_MASK));
        colourMenu.add(removeFill);

        JMenu shapeSettingsMenu = new JMenu("Shape Settings");
        menuBar.add(shapeSettingsMenu);

        JMenuItem thickness = new JMenuItem("Thickness");
        thickness.addActionListener(e -> {
            int thicknessValue;
            do {
                thicknessValue = Integer.parseInt(JOptionPane.showInputDialog("Enter thickness:"));

                if (thicknessValue % 2 == 1) {
                    drawPanel.setThickness(thicknessValue);
                } else {
                    JOptionPane.showMessageDialog(null, "Thickness must be an odd number.");
                }
            } while (thicknessValue % 2 == 0);
        });
        thickness.setMnemonic('T');
        thickness.setAccelerator(KeyStroke.getKeyStroke('T', Toolkit.getDefaultToolkit().getMenuShortcutKeyMaskEx()));
        shapeSettingsMenu.add(thickness);

        JMenuItem clipPolygon = new JMenuItem("Clip Polygon");
        clipPolygon.addActionListener(e -> drawPanel.clipShape());
        clipPolygon.setMnemonic('X');
        clipPolygon.setAccelerator(KeyStroke.getKeyStroke('X', Toolkit.getDefaultToolkit().getMenuShortcutKeyMaskEx()));
        shapeSettingsMenu.add(clipPolygon);

        JMenuItem deleteSelection = new JMenuItem("Delete Selection");
        deleteSelection.addActionListener(e -> drawPanel.deleteSelection());
        deleteSelection.setMnemonic('D');
        deleteSelection.setAccelerator(KeyStroke.getKeyStroke('D', Toolkit.getDefaultToolkit().getMenuShortcutKeyMaskEx()));
        shapeSettingsMenu.add(deleteSelection);

        JMenu canvasMenu = new JMenu("Canvas");
        menuBar.add(canvasMenu);
        JMenuItem clear = new JMenuItem("Clear");
        clear.addActionListener(e -> drawPanel.clearPanel());
        clear.setMnemonic('\b');
        clear.setAccelerator(KeyStroke.getKeyStroke(KeyEvent.VK_BACK_SPACE, Toolkit.getDefaultToolkit().getMenuShortcutKeyMaskEx()));
        canvasMenu.add(clear);

        setLocationRelativeTo(null);
        setVisible(true);
    }

    private void updateMenuItems() {
        line.setSelected(drawPanel.getDrawMode() == DrawMode.LINE);
        circle.setSelected(drawPanel.getDrawMode() == DrawMode.CIRCLE);
        rectangle.setSelected(drawPanel.getDrawMode() == DrawMode.RECTANGLE);
        polygon.setSelected(drawPanel.getDrawMode() == DrawMode.POLYGON);
    }
}
