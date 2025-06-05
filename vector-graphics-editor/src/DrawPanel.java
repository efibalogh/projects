import javax.imageio.ImageIO;
import javax.swing.*;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;

class DrawPanel extends JPanel {
    private final ArrayList <Line> lines;
    private Line selectedLine;
    private final ArrayList <Circle> circles;
    private Circle selectedCircle;
    private final ArrayList <Rectangle> rectangles;
    private Rectangle selectedRectangle;
    private final ArrayList <Polygon> polygons;
    private Polygon selectedPolygon;
    private final ArrayList <Line> polygonEdges;
    private Polygon clippingPolygon;

    private int lineThickness;
    private Color initialColour;
    private Color fillColour;

    private DrawMode drawMode = DrawMode.NONE;

    private Point startPoint;
    private Point currentPoint;
    private Point endPoint;

    private boolean draggingFirstPoint;

    public DrawPanel() {
        lines = new ArrayList<>();
        selectedLine = null;
        circles = new ArrayList<>();
        selectedCircle = null;
        rectangles = new ArrayList<>();
        selectedRectangle = null;
        polygons = new ArrayList<>();
        selectedPolygon = null;
        polygonEdges = new ArrayList<>();
        clippingPolygon = null;
        lineThickness = 1;
        initialColour = Color.BLACK;
        fillColour = Color.BLACK;

        setPreferredSize(new Dimension(800, 600));
        setBackground(Color.WHITE);
        addMouseListener(new MouseAdapter() {
            @Override
            public void mousePressed(MouseEvent e) {
                if (SwingUtilities.isRightMouseButton(e)) {
                    selectLine(e.getX(), e.getY());
                    selectCircle(e.getX(), e.getY());
                    selectRectangle(e.getX(), e.getY());
                    selectPolygon(e.getX(), e.getY(), e);
                } else {
                    switch (drawMode) {
                        case LINE -> {
                            if (startPoint == null) {
                                startPoint = e.getPoint();
                            } else {
                                endPoint = e.getPoint();
                                lines.add(new Line(startPoint.x, startPoint.y, endPoint.x, endPoint.y, lineThickness, initialColour));
                                startPoint = null;
                                endPoint = null;
                                repaint();
                                System.err.println(
                                        "new line: (" +
                                        lines.getLast().getX1() + ", " +
                                        lines.getLast().getY1() + "), (" +
                                        lines.getLast().getX2() + ", " +
                                        lines.getLast().getY2() + ")"
                                );
                            }
                        }
                        case CIRCLE -> {
                            if (startPoint == null) {
                                startPoint = e.getPoint();
                            } else {
                                endPoint = e.getPoint();
                                int radius = (int) Math.sqrt(Math.pow(endPoint.x - startPoint.x, 2) + Math.pow(endPoint.y - startPoint.y, 2));
                                circles.add(new Circle(startPoint.x, startPoint.y, radius, lineThickness + 2, initialColour));
                                startPoint = null;
                                endPoint = null;
                                repaint();
                                System.err.println(
                                        "new circle: ((" +
                                        circles.getLast().getCenterX() + ", " +
                                        circles.getLast().getCenterY() + "), " +
                                        circles.getLast().getRadius() + ")"
                                );
                            }
                        }
                        case RECTANGLE -> {
                            if (startPoint == null) {
                                startPoint = e.getPoint();
                            } else {
                                endPoint = e.getPoint();
                                rectangles.add(new Rectangle(startPoint.x, startPoint.y, endPoint.x, endPoint.y, lineThickness, initialColour));
                                startPoint = null;
                                endPoint = null;
                                repaint();
                                System.err.println(
                                        "new rectangle: (" +
                                        rectangles.getLast().getX1() + ", " +
                                        rectangles.getLast().getY1() + "), (" +
                                        rectangles.getLast().getX2() + ", " +
                                        rectangles.getLast().getY2() + ")"
                                );
                            }
                        }
                        case POLYGON -> {
                            if (startPoint == null) {
                                startPoint = e.getPoint();
                                currentPoint = e.getPoint();
                            } else {
                                endPoint = e.getPoint();

                                if (endPoint.distance(startPoint) < 10) {
                                    polygonEdges.add(new Line(currentPoint.x, currentPoint.y, startPoint.x, startPoint.y, lineThickness, initialColour));
                                    polygons.add(new Polygon(new ArrayList<>(polygonEdges), lineThickness, initialColour, fillColour));
                                    polygonEdges.clear();
                                    startPoint = null;
                                    currentPoint = null;
                                    System.err.println("new polygon");
                                } else {
                                    polygonEdges.add(new Line(currentPoint.x, currentPoint.y, endPoint.x, endPoint.y, lineThickness, initialColour));
                                    currentPoint = endPoint;
                                    System.err.println(
                                            "new edge: (" +
                                            polygonEdges.getLast().getX1() + ", " +
                                            polygonEdges.getLast().getY1() + "), (" +
                                            polygonEdges.getLast().getX2() + ", " +
                                            polygonEdges.getLast().getY2() + ")"
                                    );
                                }
                            }

                            repaint();
                        }
                    }
                }
            }
        });

        addMouseMotionListener(new MouseAdapter() {
            @Override
            public void mouseDragged(MouseEvent e) {
                if (selectedLine != null && e.isShiftDown()) {
                    if (draggingFirstPoint) {
                        selectedLine.setX1(e.getX());
                        selectedLine.setY1(e.getY());
                    } else {
                        selectedLine.setX2(e.getX());
                        selectedLine.setY2(e.getY());
                    }

                    repaint();
                }

                if (selectedCircle != null && e.isShiftDown()) {
                    selectedCircle.setCenterX(e.getX());
                    selectedCircle.setCenterY(e.getY());
                    repaint();
                }

                if (selectedRectangle != null && e.isShiftDown()) {
                    resizeRectangle(e.getX(), e.getY());
                    repaint();
                }

                if (selectedRectangle != null && e.isAltDown()) {
                    moveRectangle(e.getX(), e.getY());
                    repaint();
                }

                if (selectedPolygon != null && e.isShiftDown() && !e.isControlDown()) {
                    movePolygonVertex(e.getX(), e.getY());
                    repaint();
                }

                if (selectedPolygon != null && e.isControlDown() && e.isShiftDown()) {
                    movePolygonEdge(e.getX(), e.getY());
                    repaint();
                }

                if (selectedPolygon != null && e.isAltDown()) {
                    movePolygon(e.getX(), e.getY());
                    repaint();
                }
            }
        });

        addMouseWheelListener(e -> {
            if (selectedCircle != null) {
                int notches = e.getWheelRotation();
                int newRadius = selectedCircle.getRadius() - (3 * notches / 2);
                if (newRadius > 0) {
                    selectedCircle.setRadius(newRadius);
                    repaint();
                }
            }
        });
    }

    protected void loadDrawingFromFile() {
        FileManager fileManager = new FileManager();
        ArrayList <Shape> shapes = fileManager.load();

        if (shapes == null) {
            return;
        } else {
            lines.clear();
            circles.clear();
            rectangles.clear();
            polygons.clear();
        }

        for (Shape shape : shapes) {
            if (shape instanceof Line) {
                lines.add((Line) shape);
            } else if (shape instanceof Circle) {
                circles.add((Circle) shape);
            } else if (shape instanceof Rectangle) {
                rectangles.add((Rectangle) shape);
            } else if (shape instanceof Polygon) {
                polygons.add((Polygon) shape);
            }
        }

        repaint();
    }

    protected void saveDrawingToFile() {
        if (selectedLine != null) {
            selectedLine.setThickness(selectedLine.getThickness() - 2);
            selectedLine = null;
        }

        if (selectedCircle != null) {
            selectedCircle.setThickness(selectedCircle.getThickness() - 2);
            selectedCircle = null;
        }

        if (selectedRectangle != null) {
            selectedRectangle.setThickness(selectedRectangle.getThickness() - 2);
            selectedRectangle = null;
        }

        if (selectedPolygon != null) {
            selectedPolygon.setThickness(selectedPolygon.getThickness() - 2);
            selectedPolygon = null;
        }

        if (clippingPolygon != null) {
            clippingPolygon.setThickness(clippingPolygon.getThickness() - 2);
            clippingPolygon = null;
        }

        ArrayList <Shape> shapes = new ArrayList<>();
        shapes.addAll(lines);
        shapes.addAll(circles);
        shapes.addAll(rectangles);
        shapes.addAll(polygons);
        FileManager fileManager = new FileManager(shapes);
        fileManager.save();
    }

    protected DrawMode getDrawMode() {
        return drawMode;
    }

    protected void setDrawMode(DrawMode drawMode) {
        this.drawMode = drawMode;
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);

        for (Line line : lines) {
            g.setColor(line.getColour());
            line.draw(g);
        }

        for (Circle circle : circles) {
            g.setColor(circle.getColour());
            circle.draw(g);
        }

        for (Rectangle rectangle : rectangles) {
            g.setColor(rectangle.getColour());
            rectangle.draw(g);
        }

        if (!polygonEdges.isEmpty()) {
            for (Line edge : polygonEdges) {
                g.setColor(edge.getColour());
                edge.draw(g);
            }
        }

        for (Polygon polygon : polygons) {
            g.setColor(polygon.getColour());
            polygon.draw(g);
        }
    }

    protected Color getInitialColour() {
        return initialColour;
    }

    protected void setInitialColour(Color newColour) {
        initialColour = newColour;
    }

    protected void changeSelectionColour(Color colour) {
        if (selectedLine != null) {
            selectedLine.setColour(colour);
            selectedLine.setThickness(selectedLine.getThickness() - 2);
            selectedLine = null;
        }

        if (selectedCircle != null) {
            selectedCircle.setColour(colour);
            selectedCircle.setThickness(selectedCircle.getThickness() - 2);
            selectedCircle = null;
        }

        if (selectedRectangle != null) {
            selectedRectangle.setColour(colour);
            selectedRectangle.setThickness(selectedRectangle.getThickness() - 2);
            selectedRectangle = null;
        }

        if (selectedPolygon != null) {
            selectedPolygon.setColour(colour);
            selectedPolygon.setThickness(selectedPolygon.getThickness() - 2);
            selectedPolygon = null;
        }

        repaint();
    }

    protected void fillSelection(boolean fill) {
        if (selectedPolygon != null) {
            selectedPolygon.setFilled(fill);

            if (!fill) {
                selectedPolygon.setImageFill(false);
            }

            selectedPolygon.setThickness(selectedPolygon.getThickness() - 2);
            selectedPolygon = null;
            repaint();
        }
    }

    protected void fillWithImage() {
        if (selectedPolygon != null) {
            selectedPolygon.setImageFill(true);

            JFileChooser fileChooser = new JFileChooser("/Users/efi/Documents/GitHub/egyetem/IV/cg/ImageEditor/pics");
            int result = fileChooser.showOpenDialog(null);

            if (result == JFileChooser.APPROVE_OPTION) {
                File file = fileChooser.getSelectedFile();

                try {
                    BufferedImage image = ImageIO.read(file);
                    selectedPolygon.setFilled(true);
                    selectedPolygon.setImage(image, file.getAbsolutePath());
                } catch (IOException e) {
                    System.err.println("Error loading image: " + e.getMessage());
                }
            }

            selectedPolygon.setThickness(selectedPolygon.getThickness() - 2);
            selectedPolygon = null;
            repaint();
        }
    }

    protected void setFillColour(Color newColour) {
        fillColour = newColour;

        if (selectedPolygon != null) {
            selectedPolygon.setFillColour(newColour);
            repaint();
        }
    }

    protected void changeAllColours(Color colour) {
        for (Line line : lines) {
            line.setColour(colour);
        }

        for (Circle circle : circles) {
            circle.setColour(colour);
        }

        for (Rectangle rectangle : rectangles) {
            rectangle.setColour(colour);
        }

        for (Polygon polygon : polygons) {
            polygon.setColour(colour);
        }

        repaint();
    }

    private double pointToLineDistance(int x, int y, Line edge) {
        int x1 = edge.getX1();
        int y1 = edge.getY1();
        int x2 = edge.getX2();
        int y2 = edge.getY2();

        return Math.abs((y2 - y1) * x - (x2 - x1) * y + x2 * y1 - y2 * x1) /
                Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2));
    }

    private void selectLine(int x, int y) {
        for (Line line : lines) {
            if (line.nearPoint(x, y)) {
                if (selectedLine != null) {
                    selectedLine.setThickness(selectedLine.getThickness() - 2);
                    selectedLine = null;
                } else {
                    selectedLine = line;
                    selectedLine.setThickness(selectedLine.getThickness() + 2);
                }

                repaint();
            }

            double dist1 = Math.sqrt(Math.pow(x - line.getX1(), 2) + Math.pow(y - line.getY1(), 2));
            double dist2 = Math.sqrt(Math.pow(x - line.getX2(), 2) + Math.pow(y - line.getY2(), 2));
            if (dist1 < 10) {
                draggingFirstPoint = true;
            } else if (dist2 < 10) {
                draggingFirstPoint = false;
            }
        }
    }

    private void selectCircle(int x, int y) {
        for (Circle circle : circles) {
            if (circle.nearPoint(x, y)) {
                if (selectedCircle != null) {
                    selectedCircle.setThickness(selectedCircle.getThickness() - 2);
                    selectedCircle = null;
                } else {
                    selectedCircle = circle;
                    selectedCircle.setThickness(selectedCircle.getThickness() + 2);
                }

                repaint();
            }
        }
    }

    private void selectRectangle(int x, int y) {
        for (Rectangle rectangle : rectangles) {
            if (rectangle.nearPoint(x, y)) {
                if (selectedRectangle != null) {
                    selectedRectangle.setThickness(selectedRectangle.getThickness() - 2);
                    selectedRectangle = null;
                } else {
                    selectedRectangle = rectangle;
                    selectedRectangle.setThickness(selectedRectangle.getThickness() + 2);
                }

                repaint();
            }
        }
    }

    private void resizeRectangle(int x, int y) {
        if (selectedRectangle != null) {
            Point closestVertex = null;
            double minVertexDistance = Double.MAX_VALUE;

            for (Point vertex : selectedRectangle.getVertices()) {
                double dist = Math.sqrt(Math.pow(x - vertex.x, 2) + Math.pow(y - vertex.y, 2));
                if (dist < minVertexDistance) {
                    minVertexDistance = dist;
                    closestVertex = vertex;
                }
            }

            ArrayList <Point> vertices = selectedRectangle.getVertices();

            if (closestVertex == vertices.get(0)) {
                vertices.get(0).x = x;
                vertices.get(0).y = y;
                vertices.get(3).x = x;
                vertices.get(1).y = y;
            } else if (closestVertex == vertices.get(1)) {
                vertices.get(1).x = x;
                vertices.get(1).y = y;
                vertices.get(0).y = y;
                vertices.get(2).x = x;
            } else if (closestVertex == vertices.get(2)) {
                vertices.get(2).x = x;
                vertices.get(2).y = y;
                vertices.get(1).x = x;
                vertices.get(3).y = y;
            } else if (closestVertex == vertices.get(3)) {
                vertices.get(3).x = x;
                vertices.get(3).y = y;
                vertices.get(0).x = x;
                vertices.get(2).y = y;
            }

            selectedRectangle.updateEdges();

            repaint();
        }
    }

    private void moveRectangle(int x, int y) {
        if (selectedRectangle != null) {
            int deltaX = x - selectedRectangle.getVertices().getFirst().x;
            int deltaY = y - selectedRectangle.getVertices().getFirst().y;

            for (Point vertex : selectedRectangle.getVertices()) {
                vertex.x += deltaX;
                vertex.y += deltaY;
            }

            for (Line edge : selectedRectangle.getEdges()) {
                edge.setX1(edge.getX1() + deltaX);
                edge.setY1(edge.getY1() + deltaY);
                edge.setX2(edge.getX2() + deltaX);
                edge.setY2(edge.getY2() + deltaY);
            }
        }
    }

    private void selectPolygon(int x, int y, MouseEvent e) {
        for (Polygon polygon : polygons) {
            if (polygon.nearPoint(x, y)) {
                if (e.isControlDown()) {
                    if (clippingPolygon != null) {
                        clippingPolygon.setThickness(clippingPolygon.getThickness() - 2);
                        clippingPolygon = null;
                    } else {
                        clippingPolygon = polygon;
                        clippingPolygon.setThickness(clippingPolygon.getThickness() + 2);
                        System.err.println("clipping polygon selected: " + polygons.indexOf(clippingPolygon));
                    }
                } else {
                    if (selectedPolygon != null) {
                        selectedPolygon.setThickness(selectedPolygon.getThickness() - 2);
                        selectedPolygon = null;
                    } else {
                        selectedPolygon = polygon;
                        selectedPolygon.setThickness(selectedPolygon.getThickness() + 2);
                    }
                }

                repaint();
            }
        }
    }

    private void movePolygonVertex(int x, int y) {
        if (selectedPolygon != null) {
            Point closestVertex = null;
            double minDistance = Double.MAX_VALUE;

            for (Line edge : selectedPolygon.getEdges()) {
                double dist1 = Math.sqrt(Math.pow(x - edge.getX1(), 2) + Math.pow(y - edge.getY1(), 2));
                double dist2 = Math.sqrt(Math.pow(x - edge.getX2(), 2) + Math.pow(y - edge.getY2(), 2));

                if (dist1 < minDistance) {
                    minDistance = dist1;
                    closestVertex = new Point(edge.getX1(), edge.getY1());
                }

                if (dist2 < minDistance) {
                    minDistance = dist2;
                    closestVertex = new Point(edge.getX2(), edge.getY2());
                }
            }

            if (closestVertex != null) {
                for (Line edge : selectedPolygon.getEdges()) {
                    if (edge.getX1() == closestVertex.x && edge.getY1() == closestVertex.y) {
                        edge.setX1(x);
                        edge.setY1(y);
                    }

                    if (edge.getX2() == closestVertex.x && edge.getY2() == closestVertex.y) {
                        edge.setX2(x);
                        edge.setY2(y);
                    }
                }

                for (Point vertex : selectedPolygon.getVertices()) {
                    if (vertex.x == closestVertex.x && vertex.y == closestVertex.y) {
                        vertex.x = x;
                        vertex.y = y;
                    }
                }
            }
        }
    }

    private void movePolygonEdge(int x, int y) {
        if (selectedPolygon != null) {
            Line closestEdge = null;
            double minDistance = Double.MAX_VALUE;

            for (Line edge : selectedPolygon.getEdges()) {
                double dist = pointToLineDistance(x, y, edge);

                if (dist < minDistance) {
                    minDistance = dist;
                    closestEdge = edge;
                }
            }

            if (closestEdge != null) {
                int deltaX = x - closestEdge.getX1();
                int deltaY = y - closestEdge.getY1();

                closestEdge.setX1(closestEdge.getX1() + deltaX);
                closestEdge.setY1(closestEdge.getY1() + deltaY);
                closestEdge.setX2(closestEdge.getX2() + deltaX);
                closestEdge.setY2(closestEdge.getY2() + deltaY);
            }

            repaint();
        }
    }

    private void movePolygon(int x, int y) {
        if (selectedPolygon != null) {
            int deltaX = x - selectedPolygon.getEdges()[0].getX1();
            int deltaY = y - selectedPolygon.getEdges()[0].getY1();

            for (Line edge : selectedPolygon.getEdges()) {
                edge.setX1(edge.getX1() + deltaX);
                edge.setY1(edge.getY1() + deltaY);
                edge.setX2(edge.getX2() + deltaX);
                edge.setY2(edge.getY2() + deltaY);
            }

            for (Point vertex : selectedPolygon.getVertices()) {
                vertex.x += deltaX;
                vertex.y += deltaY;
            }
        }
    }

    protected void clipShape() {
        if (selectedPolygon != null && clippingPolygon != null) {
            if (!clippingPolygon.isConvex()) {
                JOptionPane.showMessageDialog(null, "Clipping polygon must be convex.");
                return;
            }

            clipPolygon();
            selectedPolygon.setThickness(selectedPolygon.getThickness() - 2);
            selectedPolygon = null;
            clippingPolygon.setThickness(clippingPolygon.getThickness() - 2);
            clippingPolygon = null;
            repaint();
        }
    }

    private void clipPolygon() {
        ArrayList<Point> vertices = new ArrayList<>(selectedPolygon.getVertices());
        ArrayList<Point> clipVertices = clippingPolygon.getVertices();

        for (int i = 0; i < clipVertices.size(); i++) {
            Point clipStart = clipVertices.get(i);
            Point clipEnd = clipVertices.get((i + 1) % clipVertices.size());
            ArrayList <Point> inputList = new ArrayList<>(vertices);

            if (inputList.isEmpty()) {
                break;
            }

            vertices.clear();
            Point s = inputList.getLast();

            for (Point p : inputList) {
                if (isInside(p, clipStart, clipEnd)) {
                    if (!isInside(s, clipStart, clipEnd)) {
                        Point intersection = getIntersection(s, p, clipStart, clipEnd);
                        if (intersection != null) {
                            vertices.add(intersection);
                        }
                    }
                    vertices.add(p);
                } else if (isInside(s, clipStart, clipEnd)) {
                    Point intersection = getIntersection(s, p, clipStart, clipEnd);
                    if (intersection != null) {
                        vertices.add(intersection);
                    }
                }
                s = p;
            }
        }

        selectedPolygon.setVertices(vertices);
        selectedPolygon.buildEdges();
    }

    private boolean isInside(Point p, Point clipStart, Point clipEnd) {
        return (clipEnd.x - clipStart.x) * (p.y - clipStart.y) <= (clipEnd.y - clipStart.y) * (p.x - clipStart.x);
    }

    private Point getIntersection(Point s, Point p, Point clipStart, Point clipEnd) {
        double a1 = p.y - s.y;
        double b1 = s.x - p.x;
        double c1 = a1 * s.x + b1 * s.y;

        double a2 = clipEnd.y - clipStart.y;
        double b2 = clipStart.x - clipEnd.x;
        double c2 = a2 * clipStart.x + b2 * clipStart.y;

        double det = a1 * b2 - a2 * b1;

        if (det == 0) {
            return null;
        } else {
            int x = (int) ((b2 * c1 - b1 * c2) / det);
            int y = (int) ((a1 * c2 - a2 * c1) / det);
            return new Point(x, y);
        }
    }

    protected void setThickness(int thickness) {
        lineThickness = thickness;

        if (selectedLine != null) {
            selectedLine.setThickness(lineThickness);
            selectedLine = null;
        }

        if (selectedCircle != null) {
            selectedCircle.setThickness(lineThickness);
            selectedCircle = null;
        }

        if (selectedRectangle != null) {
            selectedRectangle.setThickness(lineThickness);
            selectedRectangle = null;
        }

        if (selectedPolygon != null) {
            selectedPolygon.setThickness(lineThickness);
            selectedPolygon = null;
        }

        repaint();
    }

    protected void deleteSelection() {
        if (selectedLine != null) {
            System.err.println(
                    "deleting line: (" +
                    selectedLine.getX1() + ", " +
                    selectedLine.getY1() + "), (" +
                    selectedLine.getX2() + ", " +
                    selectedLine.getY2() + ")"
            );
            lines.remove(selectedLine);
            selectedLine = null;
        }

        if (selectedCircle != null) {
            System.err.println(
                    "deleting circle: ((" +
                    selectedCircle.getCenterX() + ", " +
                    selectedCircle.getCenterY() + "), " +
                    selectedCircle.getRadius() + ")"
            );
            circles.remove(selectedCircle);
            selectedCircle = null;
        }

        if (selectedRectangle != null) {
            System.err.println(
                    "deleting rectangle: (" +
                    selectedRectangle.getX1() + ", " +
                    selectedRectangle.getY1() + "), (" +
                    selectedRectangle.getX2() + ", " +
                    selectedRectangle.getY2() + ")"
            );
            rectangles.remove(selectedRectangle);
            selectedRectangle = null;
        }

        if (selectedPolygon != null) {
            System.err.println("deleting polygon " + polygons.indexOf(selectedPolygon));
            polygons.remove(selectedPolygon);
            selectedPolygon = null;
        }

        repaint();
    }

    protected void clearPanel() {
        lines.clear();
        circles.clear();
        rectangles.clear();
        polygons.clear();
        selectedLine = null;
        selectedCircle = null;
        selectedRectangle = null;
        selectedPolygon = null;
        repaint();
        System.err.println("panel cleared");
    }
}
